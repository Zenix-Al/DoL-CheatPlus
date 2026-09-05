const STATUSES = new Set(['pass', 'warning', 'fail', 'blocked']);

function safeMessage(value, fallback = '') {
  return typeof value === 'string' ? value.slice(0, 240) : fallback;
}

async function withTimeout(probe, context) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => probe.run(context)),
      new Promise((resolve) => {
        timer = setTimeout(
          () => resolve({ status: 'fail', message: 'Probe timed out.' }),
          probe.timeoutMs
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function formatDiagnosticReport(report) {
  const lines = [
    `CheatPlus diagnostics: ${report.pass} pass, ${report.warning} warning, ${report.fail} fail, ${report.blocked} blocked`,
  ];
  for (const result of report.results)
    lines.push(`${result.status.toUpperCase()} ${result.id}${result.message ? ` — ${result.message}` : ''}`);
  return lines.join('\n');
}

export function createDiagnosticRunner({ probes, context = () => ({}) }) {
  if (!Array.isArray(probes)) throw new TypeError('Diagnostic runner requires probes.');
  const ids = new Set();
  for (const probe of probes) {
    if (ids.has(probe.id)) throw new Error(`Duplicate diagnostic probe "${probe.id}".`);
    ids.add(probe.id);
  }

  async function runAll() {
    const results = [];
    const shared = context();
    for (const probe of probes) {
      let result;
      try {
        if (probe.applicable && !(await probe.applicable(shared))) {
          result = { status: 'blocked', message: 'Not applicable.' };
        } else result = await withTimeout(probe, shared);
      } catch (_) {
        result = { status: 'fail', message: 'Probe failed.' };
      }
      const status = STATUSES.has(result?.status) ? result.status : 'fail';
      results.push(
        Object.freeze({
          id: probe.id,
          label: probe.label,
          scope: probe.scope,
          status,
          message: safeMessage(result?.message, status === 'fail' ? 'Invalid probe result.' : ''),
        })
      );
    }
    const counts = Object.fromEntries([...STATUSES].map((status) => [status, results.filter((r) => r.status === status).length]));
    return Object.freeze({ total: results.length, ...counts, results: Object.freeze(results) });
  }

  return Object.freeze({ runAll, formatReport: formatDiagnosticReport, list: () => [...probes] });
}
