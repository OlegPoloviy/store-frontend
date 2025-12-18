import * as htmlToImage from "html-to-image";

export type ImageFormat = "png" | "jpg" | "webp";

export interface ExportOptions {
  format: ImageFormat;
  quality?: number; // 0-1 для jpg/webp
  backgroundColor?: string;
  scale?: number;
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
    // Додаємо crossOrigin до всіх зображень перед експортом
    const images = element.querySelectorAll("img");
    const originalCrossOrigins: (string | null)[] = [];

    images.forEach((img, index) => {
      originalCrossOrigins[index] = img.getAttribute("crossOrigin");
      img.setAttribute("crossOrigin", "anonymous");
    });

    const pixelRatio = options.scale || 2;

    let dataUrl: string;

    const commonOptions = {
      backgroundColor: options.backgroundColor || "#ffffff",
      pixelRatio,
      skipAutoScale: false,
      cacheBust: false, // Вимикаємо для кращої сумісності з CORS
      fontEmbedCSS: "", // Вимикаємо вбудовування шрифтів
      // Фільтр для виключення елементів з експорту
      filter: (node: HTMLElement) => {
        // Виключаємо кнопку експорту
        if (node.classList?.contains("export-button-exclude")) {
          return false;
        }
        return true;
      },
    };

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

    // Відновлюємо оригінальні значення crossOrigin
    images.forEach((img, index) => {
      if (originalCrossOrigins[index] === null) {
        img.removeAttribute("crossOrigin");
      } else {
        img.setAttribute("crossOrigin", originalCrossOrigins[index]!);
      }
    });
  } catch (error) {
    console.error("Error exporting to image:", error);

    // Відновлюємо crossOrigin навіть у разі помилки
    const images = element.querySelectorAll("img");
    images.forEach((img) => {
      img.removeAttribute("crossOrigin");
    });

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
  const pixelRatio = options.scale || 2;

  const commonOptions = {
    backgroundColor: options.backgroundColor || "#ffffff",
    pixelRatio,
    skipAutoScale: false,
    cacheBust: true,
    fontEmbedCSS: "", // Вимикаємо вбудовування шрифтів
    filter: (node: HTMLElement) => {
      if (node.classList?.contains("export-button-exclude")) {
        return false;
      }
      return true;
    },
  };

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
