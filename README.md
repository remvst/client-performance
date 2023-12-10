# performance-recorder

## Usage

```typescript
const recorder = new PerformanceRecorder({
    recordCount: window.innerWidth / 2,
});

const renderer = new PerformanceRenderer(recorder, [
    { color: 'yellow', renderer: renderExecutionTime('gameUpdate') },
    { color: 'blue', renderer: renderExecutionTime('render') },
    { color: 'red', renderer: renderFramerate('frame') },
], 2);

function onFrame() {
    recorder.wrap('frame', () => {
        recorder.wrap('gameUpdate', gameUpdate);
        recorder.wrap('render', render);
    });

    recorder.roll();
    renderer.update();
}
```