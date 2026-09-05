export function createManualFrameDriver() {
  let nextId = 1;
  let now = 0;
  const queue = new Map();

  function requestAnimationFrame(callback) {
    const id = nextId;
    nextId += 1;
    queue.set(id, callback);
    return id;
  }

  function cancelAnimationFrame(id) {
    queue.delete(id);
  }

  function step(timestamp = now + 16) {
    now = Number(timestamp);
    const pending = [...queue.entries()];
    queue.clear();
    pending.forEach(([, callback]) => callback(now));
    return pending.length;
  }

  function flush({ maxFrames = 100 } = {}) {
    let frames = 0;
    let callbacks = 0;
    while (queue.size > 0) {
      if (frames >= maxFrames) {
        throw new Error(`Manual frame driver exceeded ${maxFrames} frames.`);
      }
      callbacks += step();
      frames += 1;
    }
    return { frames, callbacks, timestamp: now };
  }

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    step,
    flush,
    get pendingCount() {
      return queue.size;
    },
    get timestamp() {
      return now;
    },
  };
}
