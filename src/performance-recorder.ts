import { FrameRecord } from "./frame-record";
import { modulo } from "./math";

export class PerformanceRecorder {
  frames: FrameRecord[] = [];
  frameCount = 0;

  constructor(opts: { recordCount: number }) {
    for (let i = 0; i < opts.recordCount; i++) {
      this.frames.push({
        onStartTimes: new Map(),
        onEndTimes: new Map(),
      });
    }
  }

  frame(index: number): FrameRecord {
    return this.frames[modulo(index, this.frames.length)];
  }

  get current(): FrameRecord {
    return this.frame(this.frameCount);
  }

  onStart(event: string) {
    this.current.onStartTimes.set(event, performance.now());
  }

  onEnd(event: string) {
    this.current.onEndTimes.set(event, performance.now());
  }

  wrap(event: string, action: () => void) {
    this.onStart(event);
    action();
    this.onEnd(event);
  }

  roll() {
    this.frameCount++;
    this.current.onStartTimes.clear();
    this.current.onEndTimes.clear();
  }
}
