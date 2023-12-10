import { PerformanceRecorder, PerformanceRenderer, renderExecutionTime, renderFramerate } from "@remvst/client-performance";

interface Rectangle {
    x: number;
    y: number;
    color: string;
    rotation: number;
}

const recorder = new PerformanceRecorder({
    recordCount: window.innerWidth / 2,
});
const renderer = new PerformanceRenderer(recorder, [
    {
        color: 'yellow',
        renderer: renderExecutionTime('updateRectangles'),
    },
    {
        color: 'blue',
        renderer: renderExecutionTime('render'),
    },
    {
        color: 'red',
        renderer: renderFramerate('frame'),
    },
], 2);

document.body.appendChild(renderer.view);

window.addEventListener('load', async () => {
    const canvas = document.querySelector('#test-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const rectangles: Rectangle[] = [];
    for (let i = 0 ; i < 2000 ; i++) {
        rectangles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
            rotation: Math.random(),
        });
    }

    function updateRectangles() {
        for (const rectangle of rectangles) {
            rectangle.rotation += Math.PI / 64;
        }
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const rectangle of rectangles) {
            ctx.fillStyle = rectangle.color;
            ctx.save();
            ctx.translate(rectangle.x, rectangle.y);
            ctx.rotate(rectangle.rotation);
            ctx.fillRect(-20, -20, 40, 40);
            ctx.restore();
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;

        const offset = Date.now() / 1000 * canvas.width;

        ctx.beginPath();
        for (let x = 0 ; x < canvas.width ; x += 2) {
            ctx.lineTo(x, canvas.height / 2 + Math.sin((x + offset) / 100) * canvas.height / 3);
        }
        ctx.stroke();
    }

    function frame() {
        recorder.wrap('frame', () => {
            recorder.wrap('updateRectangles', updateRectangles);
            recorder.wrap('render', render);
        });

        recorder.roll();

        renderer.update();

        requestAnimationFrame(frame);
    }

    frame();
});
