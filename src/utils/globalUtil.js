export function copyObjProperty(target, source) {
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
}
