function zeros(count) {
    const arr = new Array(count);
    for (let i = 0; i < count; ++i) {
        arr[i] = 0;
    }
    return arr;
}
function matrixmul(arows, acols, a, brows, bcols, b, crows, ccols, c) {
    if (acols !== brows)
        throw new SyntaxError("Invalid a * b matrixmul operation.");
    if (ccols !== bcols || arows !== crows)
        throw new SyntaxError("Invalid c matrix size.");
    for (let i = 0; i < crows; ++i) {
        for (let k = 0; k < acols; ++k) {
            for (let j = 0; j < ccols; ++j) {
                c[i * ccols + j] += a[i * acols + k] * b[k * bcols + j];
            }
        }
    }
}
function matrixmulTransposedBMat(arows, acols, a, brows, bcols, b, crows, ccols, c) {
    if (acols !== bcols)
        throw new SyntaxError("Invalid a * b matrixmul operation.");
    if (ccols !== brows || arows !== crows)
        throw new SyntaxError("Invalid c matrix size.");
    for (let i = 0; i < crows; ++i) {
        for (let j = 0; j < ccols; ++j) {
            c[i * ccols + j] = 0;
            for (let k = 0; k < acols; ++k) {
                c[i * ccols + j] += a[i * acols + k] * b[j * bcols + k];
            }
        }
    }
}
export function meanSquaredError(nn, expected, result) {
    if (expected.length !== nn.numOutputs || result.error.length !== nn.numOutputs || result.derivations.length !== nn.numOutputs)
        throw new SyntaxError("Size of output does not match expected, or pre-allocated result buffers.");
    const error = result.error;
    const derivations = result.derivations;
    const output = nn.outputs;
    for (let i = 0; i < expected.length; ++i) {
        const val = expected[i] - output[i];
        derivations[i] = val;
        error[i] = val * val * 0.5;
    }
    return result;
}
export function cross(a, b, c, cross) {
    for (let i = 0; i < a.weights.length; ++i) {
        const aweight = a.weights[i];
        const bweight = b.weights[i];
        const cweight = c.weights[i];
        for (let j = 0; j < aweight.length; ++j) {
            cweight[j] = cross(aweight[j], bweight[j]);
        }
        const abias = a.bias[i];
        const bbias = b.bias[i];
        const cbias = c.bias[i];
        for (let j = 0; j < abias.length; ++j) {
            cbias[j] = cross(abias[j], bbias[j]);
        }
    }
}
export function mutate(a, b, mutate) {
    for (let i = 0; i < a.weights.length; ++i) {
        const aweight = a.weights[i];
        const bweight = b.weights[i];
        for (let j = 0; j < aweight.length; ++j) {
            bweight[j] = mutate(aweight[j]);
        }
        const abias = a.bias[i];
        const bbias = b.bias[i];
        for (let j = 0; j < abias.length; ++j) {
            bbias[j] = mutate(abias[j]);
        }
    }
}
export function similarity(a, b) {
    let diff = 0;
    for (let i = 0; i < a.weights.length; ++i) {
        const aweight = a.weights[i];
        const bweight = b.weights[i];
        for (let j = 0; j < aweight.length; ++j) {
            const val = aweight[j] - bweight[j];
            diff += val * val;
        }
        const abias = a.bias[i];
        const bbias = b.bias[i];
        for (let j = 0; j < abias.length; ++j) {
            const val = abias[j] - bbias[j];
            diff += val * val;
        }
    }
    return diff;
}
export class NeuralNetwork {
    constructor(layers) {
        if (layers.length < 2) {
            throw new SyntaxError("Not enough layers specified.");
        }
        this.numInputs = layers[0];
        this.numOutputs = layers[layers.length - 1];
        this.nodes = new Array(layers.length);
        this.bias = [];
        this.weights = [];
        this.preNodes = [];
        this.gamma = [];
        this.layerDeltas = [];
        for (let i = 0; i < layers.length; ++i) {
            const count = layers[i];
            this.nodes[i] = zeros(count);
            if (i > 0) {
                this.bias.push(zeros(count));
                const prev = layers[i - 1];
                this.weights.push(zeros(prev * count));
                this.preNodes.push(zeros(count));
                this.gamma.push(zeros(count));
                this.layerDeltas.push(zeros(prev));
            }
        }
    }
    randAll(rand) {
        this.randWeights(rand);
        this.randBias(rand);
    }
    randWeights(rand) {
        for (const weight of this.weights) {
            for (let i = 0; i < weight.length; ++i) {
                weight[i] = rand();
            }
        }
    }
    randBias(rand) {
        for (const bias of this.bias) {
            for (let i = 0; i < bias.length; ++i) {
                bias[i] = rand();
            }
        }
    }
    get inputs() {
        return this.nodes[0];
    }
    set inputs(value) {
        if (value.length !== this.numInputs)
            throw new SyntaxError("Number of values is incorrect.");
        const inputs = this.nodes[0];
        for (let i = 0; i < this.numInputs; ++i) {
            inputs[i] = value[i];
        }
    }
    get outputs() {
        return this.nodes[this.nodes.length - 1];
    }
    feedforward() {
        let i = 1;
        for (; i < this.nodes.length; ++i) {
            const a = this.nodes[i - 1];
            const b = this.weights[i - 1];
            const c = this.preNodes[i - 1];
            const bias = this.bias[i - 1];
            for (let j = 0; j < c.length; ++j) {
                c[j] = bias[j];
            }
            matrixmul(1, a.length, a, a.length, c.length, b, 1, c.length, c);
            const nodes = this.nodes[i];
            for (let j = 0; j < c.length; ++j) {
                nodes[j] = Math.max(c[j] * 0.01, c[j]);
            }
        }
        return this.nodes[i - 1];
    }
    createBackpropEval() {
        const db = new Array(this.weights.length);
        const dw = new Array(this.weights.length);
        for (let i = 0; i < this.weights.length; ++i) {
            dw[i] = zeros(this.weights[i].length);
            db[i] = zeros(this.bias[i].length);
        }
        return { db, dw };
    }
    backprop(costDerivatives, backpropEval) {
        if (costDerivatives.length !== this.numOutputs)
            throw new SyntaxError("Size of error derivatives does not match.");
        if (backpropEval === undefined)
            backpropEval = this.createBackpropEval();
        let layerDeltas = costDerivatives;
        for (let i = this.preNodes.length - 1; i >= 0; --i) {
            const db = backpropEval.db[i];
            const dw = backpropEval.dw[i];
            const pre = this.preNodes[i];
            const gamma = this.gamma[i];
            for (let j = 0; j < gamma.length; ++j) {
                gamma[j] = layerDeltas[j] * (pre[j] > 0 ? 1 : 0.01);
                db[j] += gamma[j];
            }
            const input = this.nodes[i];
            for (let j = 0; j < pre.length; j++) {
                for (let k = 0; k < input.length; ++k) {
                    dw[j * input.length + k] += gamma[j] * input[k];
                }
            }
            layerDeltas = this.layerDeltas[i];
            matrixmulTransposedBMat(1, gamma.length, gamma, layerDeltas.length, gamma.length, this.weights[i], 1, layerDeltas.length, layerDeltas);
        }
        return backpropEval;
    }
    fit(backpropEval, lr) {
        for (let i = 0; i < this.weights.length; ++i) {
            const db = backpropEval.db[i];
            const dw = backpropEval.dw[i];
            const weights = this.weights[i];
            for (let j = 0; j < weights.length; ++j) {
                weights[j] += dw[j] * lr;
            }
            const bias = this.bias[i];
            for (let j = 0; j < bias.length; ++j) {
                bias[j] += db[j] * lr;
            }
        }
    }
    export() {
        return undefined;
    }
    load(data) {
    }
}
