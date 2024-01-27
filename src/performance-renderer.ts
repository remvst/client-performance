import { PerformanceRecorder } from "./performance-recorder";
import { RenderInstruction } from "./render-instruction";

export class PerformanceRenderer {
    private readonly canvas = document.createElement("canvas");
    private readonly ctx = this.canvas.getContext("2d")!;

    constructor(
        private readonly recorder: PerformanceRecorder,
        private readonly renderInstructions: RenderInstruction[],
        private readonly frameWidth: number = 3,
    ) {
        this.canvas.width = this.recorder.frames.length * this.frameWidth;
        this.canvas.height = 120;
    }

    get view(): HTMLElement {
        return this.canvas;
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.lineJoin = "bevel";

        this.ctx.fillRect(0, 0, this.canvas.width, 1);
        this.ctx.fillRect(0, this.canvas.height - 1, this.canvas.width, 1);
        // this.ctx.fillRect(0, 0, 1, this.canvas.height);
        // this.ctx.fillRect(this.canvas.width - 1, 0, 1, this.canvas.height);

        this.ctx.fillRect(0, this.canvas.height - 60, this.canvas.width, 1);
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 1);

        for (const tuple of this.renderInstructions) {
            this.ctx.strokeStyle = tuple.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            this.ctx.moveTo(0, this.canvas.height);
            for (let i = 1; i < this.recorder.frames.length; i++) {
                const index =
                    i + this.recorder.frameCount - this.recorder.frames.length;

                const y =
                    this.canvas.height -
                    tuple.renderer(
                        this.recorder.frame(index),
                        this.recorder.frame(index - 1),
                    );

                if (i === 0) {
                    this.ctx.moveTo(i * this.frameWidth, y);
                } else {
                    this.ctx.lineTo(i * this.frameWidth, y);
                }
            }
            this.ctx.stroke();
        }
    }
}
