/**
 * Re-applies properties that were set on an element before its custom element
 * definition loaded. Before upgrade, `element.data = …` creates an own property
 * that shadows the class setter, so the chart would never see the value. This
 * moves each such value through the class's setter. Safe to call repeatedly.
 */
export function upgradeOwnProperties(element: HTMLElement): void {
  const seen = new Set<string>();
  for (
    let proto: object | null = Object.getPrototypeOf(element);
    proto && proto !== HTMLElement.prototype;
    proto = Object.getPrototypeOf(proto)
  ) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (seen.has(key)) continue;
      seen.add(key);
      if (!Object.getOwnPropertyDescriptor(proto, key)?.set) continue;
      if (!Object.prototype.hasOwnProperty.call(element, key)) continue;
      const record = element as unknown as Record<string, unknown>;
      const value = record[key];
      delete record[key];
      record[key] = value;
    }
  }
}
