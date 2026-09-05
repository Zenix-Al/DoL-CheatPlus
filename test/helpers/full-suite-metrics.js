function readSummaryNumber(output, name) {
  const match = output.match(new RegExp(`^# ${name} (\\d+(?:\\.\\d+)?)$`, 'm'));
  return match ? Number(match[1]) : null;
}

export function parseNodeTestTap(output) {
  const metrics = {
    tests: readSummaryNumber(output, 'tests'),
    pass: readSummaryNumber(output, 'pass'),
    fail: readSummaryNumber(output, 'fail'),
    cancelled: readSummaryNumber(output, 'cancelled'),
    skipped: readSummaryNumber(output, 'skipped'),
    todo: readSummaryNumber(output, 'todo'),
    durationMs: readSummaryNumber(output, 'duration_ms'),
    todoTitles: [],
  };

  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*ok \d+ - (.*?) # TODO(?:\s.*)?$/);
    if (match) metrics.todoTitles.push(match[1].trim());
  }
  return metrics;
}

export function validateSuiteMetrics(metrics, baseline) {
  const errors = [];
  const required = ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo', 'durationMs'];
  for (const field of required) {
    if (!Number.isFinite(metrics[field])) errors.push(`TAP summary is missing ${field}.`);
  }
  if (errors.length) return errors;

  if (metrics.fail !== 0) errors.push(`Expected zero failures, received ${metrics.fail}.`);
  if (metrics.cancelled !== 0)
    errors.push(`Expected zero cancellations, received ${metrics.cancelled}.`);
  if (metrics.tests < baseline.minimumTests) {
    errors.push(`Test count shrank from at least ${baseline.minimumTests} to ${metrics.tests}.`);
  }
  if (metrics.pass < baseline.minimumPass) {
    errors.push(`Passing count shrank from at least ${baseline.minimumPass} to ${metrics.pass}.`);
  }
  if (metrics.skipped > baseline.maximumSkipped) {
    errors.push(`Skipped count ${metrics.skipped} exceeds ${baseline.maximumSkipped}.`);
  }
  if (metrics.todo > baseline.maximumTodo) {
    errors.push(`Todo count ${metrics.todo} exceeds ${baseline.maximumTodo}.`);
  }
  if (metrics.durationMs > baseline.maximumDurationMs) {
    errors.push(
      `Suite duration ${metrics.durationMs.toFixed(1)}ms exceeds ${baseline.maximumDurationMs}ms.`
    );
  }

  const allowedTodos = new Set(baseline.allowedTodoTitles);
  for (const title of metrics.todoTitles) {
    if (!allowedTodos.has(title)) errors.push(`Unexplained todo: ${title}`);
  }
  if (metrics.todo !== metrics.todoTitles.length) {
    errors.push(
      `TAP reported ${metrics.todo} todos but ${metrics.todoTitles.length} todo titles were parsed.`
    );
  }
  return errors;
}
