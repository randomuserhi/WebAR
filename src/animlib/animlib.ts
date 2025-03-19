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

export class Section {
    start: number;
    end: number;
    duration: number;
    body: (t: number) => void;

    constructor(start: number, end: number, body: (t: number) => void) {
        if (end <= start) throw new SyntaxError("Invalid start and end time.");
        this.start = start;
        this.end = end;
        this.duration = end - start;
        this.body = body;
    }
}

export class Anim {
    private sections: Section[];
    private duration: number;

    constructor(sections: Section[]) {
        this.sections = sections;
        if (this.sections.length == 0) return;
        
        this.sections.sort((a, b) => a.start - b.start);
        this.duration = this.sections[this.sections.length - 1].start + this.sections[this.sections.length - 1].duration;
    }

    public exec(time: number) {
        const t = time % this.duration;
        for (let i = 0; i < this.sections.length; ++i) {
            const section = this.sections[i];
            if (t >= section.start && t <= section.end) {
                section.body(Math.clamp01((t - section.start) / section.duration));
            }

            if (t < section.start) break;
        }
    }
}