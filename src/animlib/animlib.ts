export function loadImage(src: string): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.addEventListener("load", async () => {
            resolve(await createImageBitmap(img));
        });
        img.addEventListener("error", (e) => {
            reject(e);
        });
        img.src = src;
    });
}