// Real OCR Service using native Tesseract v5.5 and Tesseract.js fallback
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const TESSERACT_EXE_PATH = 'D:\\tessract ocr\\tesseract.exe';

export async function extractTextFromImage(imageBufferOrBase64, mimeType = 'image/png') {
  let buffer;

  if (typeof imageBufferOrBase64 === 'string') {
    // If base64 string, strip header if present
    const cleanBase64 = imageBufferOrBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    buffer = Buffer.from(cleanBase64, 'base64');
  } else if (Buffer.isBuffer(imageBufferOrBase64)) {
    buffer = imageBufferOrBase64;
  } else {
    throw new Error('Invalid image data provided for OCR.');
  }

  // Create temporary image file
  const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? '.jpg' : '.png';
  const tempFilePath = path.join(os.tmpdir(), `verifirm_ocr_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);

  try {
    await fs.promises.writeFile(tempFilePath, buffer);

    // Check if native Tesseract binary exists
    if (fs.existsSync(TESSERACT_EXE_PATH)) {
      try {
        const { stdout } = await execFileAsync(TESSERACT_EXE_PATH, [tempFilePath, 'stdout', '-l', 'eng', '--psm', '3'], {
          timeout: 20000,
          maxBuffer: 10 * 1024 * 1024
        });

        const extractedText = stdout.trim();
        return {
          text: extractedText,
          engine: 'Tesseract v5.5 (Native High-Speed Engine)',
          charCount: extractedText.length,
          success: true
        };
      } catch (nativeErr) {
        console.warn('Native Tesseract execution failed, attempting fallback:', nativeErr.message);
      }
    }

    // Fallback: Tesseract.js
    const Tesseract = await import('tesseract.js');
    const { data: { text } } = await Tesseract.default.recognize(buffer, 'eng');
    return {
      text: text.trim(),
      engine: 'Tesseract.js (WebAssembly Fallback)',
      charCount: text.trim().length,
      success: true
    };
  } finally {
    // Clean up temporary image file
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (cleanupErr) {
      console.warn('Failed to clean up temp OCR file:', cleanupErr.message);
    }
  }
}
