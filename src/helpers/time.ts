export function unix(): number {
  return Math.round(Date.now() / 1000);
}
