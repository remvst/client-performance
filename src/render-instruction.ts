import { FrameRecord } from "./frame-record";

export type PerformanceRecordRenderer = (
  current: FrameRecord,
  previous: FrameRecord,
) => number;

export interface RenderInstruction {
  color: string;
  renderer: PerformanceRecordRenderer;
}

export function renderFramerate(event: string): PerformanceRecordRenderer {
  return function (current: FrameRecord, previous: FrameRecord) {
    const interval =
      (current.onStartTimes.get(event) || 0) -
      (previous.onStartTimes.get(event) || 0);
    return 1000 / interval;
  };
}

export function renderExecutionTime(event: string): PerformanceRecordRenderer {
  return function (current: FrameRecord, previous: FrameRecord) {
    // console.log((current.onEndTimes.get(event) || 0) - (current.onStartTimes.get(event) || 0));
    return (
      (current.onEndTimes.get(event) || 0) -
      (current.onStartTimes.get(event) || 0)
    );
  };
}
