export enum PipelineStatus {
    PASSED = 'SUCCEEDED',
    FAILED = 'TERMINAL',
    BLOCKED = 'BLOCKED',
    CANCELLED = 'CANCELED',
    RUNNING = 'RUNNING'
  }

export enum StageStatus{
    PASSED = 'SUCCEEDED',
    FAILED = 'FAILED_CONTINUE',
    SKIPPED = 'SKIPPED'
}