import test from 'node:test';
import assert from 'node:assert/strict';

import { parseNodeTestTap, validateSuiteMetrics } from '../helpers/full-suite-metrics.js';

const TAP = `ok 1 - working case
ok 2 - server export remains explicit # TODO waiting for transport
1..2
# tests 2
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 1
# duration_ms 42.5`;

const BASELINE = {
  minimumTests: 2,
  minimumPass: 1,
  maximumSkipped: 0,
  maximumTodo: 1,
  maximumDurationMs: 100,
  allowedTodoTitles: ['server export remains explicit'],
};

test('full-suite metrics parse TAP totals and named todos', () => {
  assert.deepEqual(parseNodeTestTap(TAP), {
    tests: 2,
    pass: 1,
    fail: 0,
    cancelled: 0,
    skipped: 0,
    todo: 1,
    durationMs: 42.5,
    todoTitles: ['server export remains explicit'],
  });
});

test('full-suite metrics accept coverage growth and resolved todos', () => {
  const metrics = { ...parseNodeTestTap(TAP), tests: 3, pass: 3, todo: 0, todoTitles: [] };
  assert.deepEqual(validateSuiteMetrics(metrics, BASELINE), []);
});

test('full-suite metrics reject coverage shrinkage and unexplained todos', () => {
  const metrics = {
    ...parseNodeTestTap(TAP),
    tests: 1,
    todoTitles: ['a different todo'],
  };
  const errors = validateSuiteMetrics(metrics, BASELINE);
  assert.ok(errors.some((error) => error.includes('Test count shrank')));
  assert.ok(errors.some((error) => error.includes('Unexplained todo')));
});

test('full-suite metrics reject failures, skips, and duration overruns', () => {
  const metrics = { ...parseNodeTestTap(TAP), fail: 1, skipped: 1, durationMs: 101 };
  const errors = validateSuiteMetrics(metrics, BASELINE);
  assert.ok(errors.some((error) => error.includes('zero failures')));
  assert.ok(errors.some((error) => error.includes('Skipped count')));
  assert.ok(errors.some((error) => error.includes('Suite duration')));
});
