import * as htmlToImage from "html-to-image";

export type ImageFormat = "png" | "jpg" | "webp";

export interface ExportOptions {
  format: ImageFormat;
  quality?: number; // 0-1 для jpg/webp
  backgroundColor?: string;
  scale?: number;
}

const TRANSPARENT_IMAGE_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function createCommonOptions(options: ExportOptions) {
  return {
    backgroundColor: options.backgroundColor || "#ffffff",
    pixelRatio: options.scale || 2,
    skipAutoScale: false,
    cacheBust: true,
    includeQueryParams: true,
    imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
    fontEmbedCSS: "", // Вимикаємо вбудовування шрифтів
    onImageErrorHandler: () => TRANSPARENT_IMAGE_PLACEHOLDER,
    // Фільтр для виключення елементів з експорту
    filter: (node: HTMLElement) => {
      // Виключаємо кнопку експорту
      if (node.classList?.contains("export-button-exclude")) {
        return false;
      }
      return true;
    },
  };
}

/**
 * Конвертує HTML елемент в зображення та завантажує його
 * @param element - HTML елемент для конвертації
 * @param options - Налаштування експорту
 * @param filename - Назва файлу для завантаження
 */
export async function exportToImage(
  element: HTMLElement,
  options: ExportOptions,
  filename: string = "moodboard"
): Promise<void> {
  try {
    let dataUrl: string;
    const commonOptions = createCommonOptions(options);

    // Генеруємо зображення залежно від формату
    if (options.format === "png") {
      dataUrl = await htmlToImage.toPng(element, commonOptions);
    } else if (options.format === "jpg") {
      dataUrl = await htmlToImage.toJpeg(element, {
        ...commonOptions,
        quality: options.quality || 0.9,
      });
    } else {
      // webp format
      dataUrl = await htmlToImage.toPng(element, commonOptions);
    }

    // Конвертуємо data URL в blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Створюємо URL для завантаження
    const url = URL.createObjectURL(blob);

    // Створюємо тимчасове посилання та тригеримо завантаження
    const link = document.createElement("a");
    link.download = `${filename}.${options.format}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Очищаємо URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to image:", error);
    throw error;
  }
}

/**
 * Отримує зображення як data URL
 * @param element - HTML елемент для конвертації
 * @param options - Налаштування експорту
 */
export async function getImageDataUrl(
  element: HTMLElement,
  options: ExportOptions
): Promise<string> {
  const commonOptions = createCommonOptions(options);

  if (options.format === "png") {
    return await htmlToImage.toPng(element, commonOptions);
  } else if (options.format === "jpg") {
    return await htmlToImage.toJpeg(element, {
      ...commonOptions,
      quality: options.quality || 0.9,
    });
  } else {
    // webp - використовуємо png як fallback
    return await htmlToImage.toPng(element, commonOptions);
  }
}
