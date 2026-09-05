export function createMemoryToggleStore(initial = {}) {
  const values = new Map(Object.entries(initial));
  const operations = [];

  return {
    read(id) {
      operations.push(Object.freeze({ operation: 'read', id }));
      return values.get(id);
    },
    write(id, value) {
      operations.push(Object.freeze({ operation: 'write', id, value }));
      values.set(id, value);
      return value;
    },
    remove(id) {
      operations.push(Object.freeze({ operation: 'remove', id }));
      return values.delete(id);
    },
    has(id) {
      operations.push(Object.freeze({ operation: 'has', id }));
      return values.has(id);
    },
    snapshot() {
      return Object.fromEntries(values);
    },
    getOperations() {
      return [...operations];
    },
    clearOperations() {
      operations.splice(0, operations.length);
    },
  };
}
