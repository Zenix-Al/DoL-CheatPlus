function isCanonicalArrayIndex(key, length) {
  if (!/^\d+$/.test(key)) return false;
  const index = Number(key);
  return Number.isInteger(index) && index >= 0 && index < length && String(index) === key;
}

export function walkValueTree(rootValue, rootPath, visitor) {
  let stopped = false;

  const stop = () => {
    stopped = true;
  };

  function visit(value, path, parentIsArray = false, key = '') {
    if (stopped) return;
    visitor(value, path, { parentIsArray, key, stop });
    if (stopped) return;

    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        visit(value[index], `${path}[${index}]`, true, String(index));
        if (stopped) return;
      }

      const objectKeys = Object.keys(value);
      for (const objectKey of objectKeys) {
        if (isCanonicalArrayIndex(objectKey, value.length)) continue;
        visit(value[objectKey], `${path}[${objectKey}]`, true, objectKey);
        if (stopped) return;
      }
      return;
    }

    if (typeof value === 'object' && value !== null) {
      for (const childKey in value) {
        visit(value[childKey], `${path}.${childKey}`, false, childKey);
        if (stopped) return;
      }
    }
  }

  visit(rootValue, rootPath);
}
