/*
// Example usage:

function meanSquaredError(nn, expected) {
    if (expected.length !== nn.numOutputs) 
        throw new SyntaxError("Size of output does not match expected.");

    const error = new Array(nn.numOutputs);
    const derivations = new Array(nn.numOutputs);

    const output = nn.outputs;

    for (let i = 0; i < expected.length; ++i) {
        const val = expected[i] - output[i];
        derivations[i] = val;
        error[i] = val * val * 0.5;
    }

    return { error, derivations };
}

nn.randWeights(() => Math.random() * 2 - 1);
nn.randBias(() => Math.random());
nn.feedforward();
for (let i = 0; i < 100; ++i) {
    nn.feedforward()
    cost = meanSquaredError(nn, [0.8]);
    deltas = nn.backprop(cost.derivations);
    nn.fit(deltas, 0.1);
}
nn.feedforward();
*/

function zeros(count: number): number[] {
    const arr = new Array(count);
    for (let i = 0; i < count; ++i) {
        arr[i] = 0;
    }
    return arr;
}

// matrixmul but does not reset values in c to 0
function matrixmul(arows: number, acols: number, a: number[], brows: number, bcols: number, b: number[], crows: number, ccols: number, c: number[]) {
    if (acols !== brows) throw new SyntaxError("Invalid a * b matrixmul operation.");
    if (ccols !== bcols || arows !== crows) throw new SyntaxError("Invalid c matrix size.");

    for (let i = 0; i < crows; ++i) {
        for (let k = 0; k < acols; ++k) {
            for (let j = 0; j < ccols; ++j) {
                c[i * ccols + j] += a[i * acols + k] * b[k * bcols + j];
            }
        }
    }
}

// matrixmul, but transposes b before multiplying with a and resets c to 0
function matrixmulTransposedBMat(arows: number, acols: number, a: number[], brows: number, bcols: number, b: number[], crows: number, ccols: number, c: number[]) {
    if (acols !== bcols) throw new SyntaxError("Invalid a * b matrixmul operation.");
    if (ccols !== brows || arows !== crows) throw new SyntaxError("Invalid c matrix size.");

    for (let i = 0; i < crows; ++i) {
        for (let j = 0; j < ccols; ++j) {
            c[i * ccols + j] = 0;
            for (let k = 0; k < acols; ++k) {
                c[i * ccols + j] += a[i * acols + k] * b[j * bcols + k];
            }
        }
    }
}

export function meanSquaredError(nn: NeuralNetwork, expected: number[], result: { error: number[], derivations: number[] }) {
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

export function cross(a: NeuralNetwork, b: NeuralNetwork, c: NeuralNetwork, cross: (a: number, b: number) => number) {
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

export function mutate(a: NeuralNetwork, b: NeuralNetwork, mutate: (a: number) => number) {
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

export function similarity(a: NeuralNetwork, b: NeuralNetwork): number {
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

// TODO(randomuserhi): 
// - genetic evolution, mutation + cross breeding + species differentiation
// - backpropagation through time
// - reinforcement learning

// NOTE(randomuserhi): uses leaky relu activation function
export class NeuralNetwork {
    readonly numInputs: number;
    readonly numOutputs: number;

    readonly weights: number[][];
    readonly bias: number[][];
    readonly nodes: number[][];
    
    private readonly preNodes: number[][]; // pre-activation function node values for backprop
    private readonly gamma: number[][]; // gamma or prime values for backprop
    private readonly layerDeltas: number[][]; // deltas for backprop 

    constructor(layers: number[]) {
        if (layers.length < 2) {
            throw new SyntaxError("Not enough layers specified.");
        }

        this.numInputs = layers[0];
        this.numOutputs = layers[layers.length - 1];
    
        // Preallocate memory
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
                
                const prev = layers[i-1];
                this.weights.push(zeros(prev * count));

                // backprop
                this.preNodes.push(zeros(count));
                this.gamma.push(zeros(count));
                this.layerDeltas.push(zeros(prev));
            }
        }
    }

    public randAll(rand: () => number) {
        this.randWeights(rand);
        this.randBias(rand);
    }

    public randWeights(rand: () => number) {
        for (const weight of this.weights) {
            for (let i = 0; i < weight.length; ++i) {
                weight[i] = rand();
            }
        }
    }

    public randBias(rand: () => number) {
        for (const bias of this.bias) {
            for (let i = 0; i < bias.length; ++i) {
                bias[i] = rand();
            }
        }
    }

    get inputs() {
        return this.nodes[0];
    }

    set inputs(value: number[]) {
        if (value.length !== this.numInputs) throw new SyntaxError("Number of values is incorrect.");
        const inputs = this.nodes[0];
        for (let i = 0; i < this.numInputs; ++i) {
            inputs[i] = value[i];
        }
    }

    get outputs() {
        return this.nodes[this.nodes.length - 1];
    }

    public feedforward() {
        let i = 1;
        for (; i < this.nodes.length; ++i) {
            const a = this.nodes[i-1];
            const b = this.weights[i-1];
            const c = this.preNodes[i-1];

            const bias = this.bias[i-1];
            for (let j = 0; j < c.length; ++j) {
                c[j] = bias[j];
            }

            matrixmul(1, a.length, a, a.length, c.length, b, 1, c.length, c);
        
            const nodes = this.nodes[i];
            for (let j = 0; j < c.length; ++j) {
                nodes[j] = Math.max(c[j] * 0.01, c[j]);
            }
        }

        return this.nodes[i-1];
    }

    public createBackpropEval() {
        const db: number[][] = new Array(this.weights.length);
        const dw: number[][] = new Array(this.weights.length);

        for (let i = 0; i < this.weights.length; ++i) {
            dw[i] = zeros(this.weights[i].length);
            db[i] = zeros(this.bias[i].length);
        }

        return { db, dw };
    }

    public backprop(costDerivatives: number[], backpropEval?: { db: number[][], dw: number[][] }) {
        if (costDerivatives.length !== this.numOutputs) throw new SyntaxError("Size of error derivatives does not match.");
        
        if (backpropEval === undefined) backpropEval = this.createBackpropEval();

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

    public fit(backpropEval: { db: number[][], dw: number[][] }, lr: number) {
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

    public export(): string {
        // TODO(randomuserhi): ...
        return undefined!;
    }

    public load(data: string) {
        // TODO(randomuserhi): ...
    }
}