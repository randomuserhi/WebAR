export function drawImage(ctx, image, x, y, rad = 0, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}
export function loadImage(src) {
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
export class Section {
    constructor(start, end, body, init) {
        if (end <= start)
            throw new SyntaxError("Invalid start and end time.");
        this.start = start;
        this.end = end;
        this.duration = end - start;
        this.body = body;
        this.init = init !== undefined ? init() : undefined;
    }
}
export class Anim {
    constructor(sections) {
        this.sections = sections;
        if (this.sections.length == 0)
            return;
        this.sections.sort((a, b) => a.end - b.end);
        this.duration = this.sections[this.sections.length - 1].end;
        this.sections.sort((a, b) => a.start - b.start);
    }
    exec(time, data) {
        const t = time % this.duration;
        for (let i = 0; i < this.sections.length; ++i) {
            const section = this.sections[i];
            if (t >= section.start && t <= section.end) {
                section.body(Math.clamp01((t - section.start) / section.duration), data, section.init);
            }
            if (t < section.start)
                break;
        }
    }
}
