/** Resize to max 2000px wide and re-encode as WebP (~85%). Falls back to the original file. */
export async function compressImage(file: File, maxW = 2000): Promise<{ blob: Blob; ext: string; type: string }> {
  try {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") throw 0;
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxW / bmp.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    if (!blob || blob.size >= file.size) throw 0;
    return { blob, ext: "webp", type: "image/webp" };
  } catch {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    return { blob: file, ext, type: file.type || "application/octet-stream" };
  }
}
