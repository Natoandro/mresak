export default function ensureNumber(n: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new TypeError('Expected number');
  }
}
