import * as THREE from "three";
window.THREE = THREE;
function loadScript(url) {
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
export const ready = true;
