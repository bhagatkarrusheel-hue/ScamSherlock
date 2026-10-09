import { createWorker } from "tesseract.js";

export async function extractTextFromImage(imageDataUrl: string): Promise<string> {
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(imageDataUrl);
    await worker.terminate();
    return ret.data.text || "";
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    return "";
  }
}
