export function drawImage(ctx: CanvasRenderingContext2D, image: ImageBitmap, x: number, y: number, rad: number, scale: number = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

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