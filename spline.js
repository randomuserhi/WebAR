import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Vector3 } from "three";
export class DynamicSplineGeometry extends BufferGeometry {
    constructor(radius, radialSegments, heightSegments, closed) {
        super();
        this.radius = radius;
        this.radialSegments = radialSegments;
        this.heightSegments = heightSegments;
        this.closed = closed;
        const indices = [];
        const uvs = [];
        let index = 0;
        const indexArray = [];
        let groupStart = 0;
        let groupCount = 0;
        for (let y = 0; y <= heightSegments; y++) {
            const indexRow = [];
            const v = y / heightSegments;
            for (let x = 0; x <= radialSegments; x++) {
                uvs.push(x / radialSegments, 1 - v);
                indexRow.push(index++);
            }
            indexArray.push(indexRow);
        }
        let a, b, c, d;
        for (let i = 0; i < radialSegments; i++) {
            for (let j = 0; j < heightSegments; j++) {
                a = indexArray[j][i];
                b = indexArray[j + 1][i];
                c = indexArray[j + 1][i + 1];
                d = indexArray[j][i + 1];
                indices.push(a, b, d);
                indices.push(b, c, d);
                groupCount += 6;
            }
        }
        this.addGroup(groupStart, groupCount, 0);
        groupStart += groupCount;
        let verticesCount = (radialSegments + 1) * (heightSegments + 1);
        let centerIndexTop;
        let centerIndexBottom;
        if (closed) {
            let groupCount = 0;
            uvs.push(0.5, 0.5);
            centerIndexTop = index;
            const c = centerIndexTop;
            for (let x = 1; x <= radialSegments; x++) {
                const i = centerIndexTop + x;
                indices.push(i, i + 1, c);
                groupCount += 3;
                index++;
            }
            this.addGroup(groupStart, groupCount, 1);
            groupStart += groupCount;
            verticesCount += radialSegments + 2;
            for (let x = 0; x <= radialSegments; x++) {
                uvs.push(0.5 * (1 + Math.sin(x / radialSegments * Math.PI * 2)));
                uvs.push(1 - 0.5 * (1 + Math.cos(x / radialSegments * Math.PI * 2)));
            }
            index++;
        }
        if (closed) {
            let groupCount = 0;
            uvs.push(0.5, 0.5);
            centerIndexBottom = ++index;
            const c = centerIndexBottom;
            for (let x = 1; x <= radialSegments; x++) {
                const i = centerIndexBottom + x;
                indices.push(i + 1, i, c);
                groupCount += 3;
                index++;
            }
            this.addGroup(groupStart, groupCount, 2);
            groupStart += groupCount;
            verticesCount += radialSegments + 2;
            for (let x = 0; x <= radialSegments; x++) {
                uvs.push(1 - 0.5 * (1 + Math.sin(x / radialSegments * Math.PI * 2)));
                uvs.push(1 - 0.5 * (1 + Math.cos(x / radialSegments * Math.PI * 2)));
            }
        }
        this.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
        this.setAttribute('position', new BufferAttribute(new Float32Array(verticesCount * 3), 3));
        this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    }
    morph(points) {
        this.pts = new CatmullRomCurve3(points, false).getSpacedPoints(this.heightSegments);
        const v3a = new Vector3();
        const v3b = new Vector3();
        const tangent = new Vector3();
        const normal = new Vector3(0, 0, -1);
        const binormal = new Vector3();
        let idx = 0;
        for (let i = 0; i <= this.heightSegments; i++) {
            if (i === 0)
                tangent.subVectors(this.pts[1], this.pts[0]);
            if (i > 0 && i < this.heightSegments)
                tangent.subVectors(this.pts[i + 1], this.pts[i - 1]);
            if (i === this.heightSegments)
                tangent.subVectors(this.pts[i], this.pts[i - 1]);
            binormal.crossVectors(normal, tangent);
            normal.crossVectors(tangent, binormal);
            binormal.normalize();
            normal.normalize();
            for (let j = 0; j <= this.radialSegments; j++) {
                v3a.addVectors(binormal.clone().multiplyScalar(Math.sin(Math.PI * 2 * j / this.radialSegments)), normal.clone().multiplyScalar(Math.cos(Math.PI * 2 * j / this.radialSegments)));
                v3a.multiplyScalar(this.radius);
                v3b.addVectors(this.pts[i], v3a);
                this.attributes.position.setXYZ(idx++, v3b.x, v3b.y, v3b.z);
            }
        }
        idx--;
        const lastIndexTorso = idx;
        if (this.closed) {
            let x, y, z;
            this.attributes.position.setXYZ(++idx, this.pts[0].x, this.pts[0].y, this.pts[0].z);
            for (let j = 0; j <= this.radialSegments; j++) {
                x = this.attributes.position.getX(j);
                y = this.attributes.position.getY(j);
                z = this.attributes.position.getZ(j);
                this.attributes.position.setXYZ(++idx, x, y, z);
            }
        }
        if (this.closed) {
            let x, y, z;
            this.attributes.position.setXYZ(++idx, this.pts[this.heightSegments].x, this.pts[this.heightSegments].y, this.pts[this.heightSegments].z);
            const idxBtm = lastIndexTorso - this.radialSegments;
            for (let j = 0; j <= this.radialSegments; j++) {
                x = this.attributes.position.getX(idxBtm + j);
                y = this.attributes.position.getY(idxBtm + j);
                z = this.attributes.position.getZ(idxBtm + j);
                this.attributes.position.setXYZ(++idx, x, y, z);
            }
        }
        this.attributes.position.needsUpdate = true;
        this.computeVertexNormals();
        this.computeBoundingSphere();
    }
}
