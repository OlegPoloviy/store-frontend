// U²-Net-p runs in the user's browser. The model and WASM assets are served
// locally, so product and uploaded images are not sent to an AI service.
import type * as Ort from "onnxruntime-web/wasm";

let sessionPromise: Promise<Ort.InferenceSession> | null = null;

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const ort = await import("onnxruntime-web/wasm");
      ort.env.wasm.wasmPaths = "/models/";
      ort.env.wasm.numThreads = 1;
      return ort.InferenceSession.create("/models/u2netp.onnx", { executionProviders: ["wasm"] });
    })().catch((error) => {
      sessionPromise = null;
      throw error;
    });
  }
  return sessionPromise;
}

export async function removeImageBackground(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Could not load this product image");
  const bitmap = await createImageBitmap(await response.blob());
  try {
    const size = 320;
    const inputCanvas = document.createElement("canvas");
    inputCanvas.width = size;
    inputCanvas.height = size;
    const inputContext = inputCanvas.getContext("2d", { willReadFrequently: true });
    if (!inputContext) throw new Error("Canvas is unavailable");
    inputContext.drawImage(bitmap, 0, 0, size, size);
    const pixels = inputContext.getImageData(0, 0, size, size).data;
    const input = new Float32Array(3 * size * size);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    for (let index = 0; index < size * size; index++) {
      for (let channel = 0; channel < 3; channel++) {
        input[channel * size * size + index] = (pixels[index * 4 + channel] / 255 - mean[channel]) / std[channel];
      }
    }

    const session = await getSession();
    const ort = await import("onnxruntime-web/wasm");
    const results = await session.run({ "input.1": new ort.Tensor("float32", input, [1, 3, size, size]) });
    const mask = results[session.outputNames[0]].data as Float32Array;
    let min = Infinity;
    let max = -Infinity;
    for (const value of mask) { if (value < min) min = value; if (value > max) max = value; }
    if (!Number.isFinite(min) || max - min < 0.0001) throw new Error("Could not identify a foreground object");

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = size;
    maskCanvas.height = size;
    const maskContext = maskCanvas.getContext("2d");
    if (!maskContext) throw new Error("Canvas is unavailable");
    const maskPixels = maskContext.createImageData(size, size);
    for (let index = 0; index < size * size; index++) {
      const alpha = Math.min(1, Math.max(0, ((mask[index] - min) / (max - min) - 0.06) / 0.88));
      maskPixels.data[index * 4] = 255;
      maskPixels.data[index * 4 + 1] = 255;
      maskPixels.data[index * 4 + 2] = 255;
      maskPixels.data[index * 4 + 3] = Math.round(alpha * 255);
    }
    maskContext.putImageData(maskPixels, 0, 0);

    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(bitmap.width * scale));
    output.height = Math.max(1, Math.round(bitmap.height * scale));
    const outputContext = output.getContext("2d");
    if (!outputContext) throw new Error("Canvas is unavailable");
    outputContext.drawImage(bitmap, 0, 0, output.width, output.height);
    outputContext.globalCompositeOperation = "destination-in";
    outputContext.drawImage(maskCanvas, 0, 0, output.width, output.height);
    const alpha = outputContext.getImageData(0, 0, output.width, output.height).data;
    let left = output.width;
    let top = output.height;
    let right = -1;
    let bottom = -1;
    for (let y = 0; y < output.height; y++) {
      for (let x = 0; x < output.width; x++) {
        if (alpha[(y * output.width + x) * 4 + 3] < 64) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    let result = output;
    if (right >= left && bottom >= top) {
      const padding = Math.round(Math.max(right - left, bottom - top) * 0.04);
      left = Math.max(0, left - padding);
      top = Math.max(0, top - padding);
      right = Math.min(output.width - 1, right + padding);
      bottom = Math.min(output.height - 1, bottom + padding);
      const cropped = document.createElement("canvas");
      cropped.width = right - left + 1;
      cropped.height = bottom - top + 1;
      const croppedContext = cropped.getContext("2d");
      if (!croppedContext) throw new Error("Canvas is unavailable");
      croppedContext.drawImage(output, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
      result = cropped;
    }
    const webp = result.toDataURL("image/webp", 0.9);
    return webp.startsWith("data:image/webp") ? webp : result.toDataURL("image/png");
  } finally {
    bitmap.close();
  }
}
