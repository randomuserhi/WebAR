import * as THREE from "three";

window.THREE = THREE;

function loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        document.head.append(script);
        script.src = url;

        script.addEventListener("load", () => resolve());
        script.addEventListener("error", (e) => reject(e));
    });
}

await loadScript("./js3party/jsartoolkit5/artoolkit.min.js");
await loadScript("./js3party/jsartoolkit5/artoolkit.api.js");
await loadScript("./js3party/threex/threex-artoolkitsource.js");
await loadScript("./js3party/threex/threex-artoolkitcontext.js");
await loadScript("./js3party/threex/threex-arbasecontrols.js");
await loadScript("./js3party/threex/threex-armarkercontrols.js");

declare global {
    interface Math {
        clamp(value: number, min: number, max: number): number;
        clamp01(value: number): number;
        repeat(t: number, length: number): number;
        deltaAngle(current: number, target: number): number;
        deg2rad: number;
        rad2deg: number;
    }
}

Math.deg2rad = Math.PI / 180.0;
Math.rad2deg = 180.0 / Math.PI;

Math.clamp = function (value, min, max) {
    return Math.min(max, Math.max(value, min));
};
Math.clamp01 = function (value) {
    return Math.clamp(value, 0, 1);
};

export const ready = true;