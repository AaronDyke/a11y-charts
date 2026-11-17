/**
 * Writes a property value through to its attribute, which stays the single
 * source of truth. null or undefined removes the attribute so the element
 * falls back to its config or default.
 */
export function reflectAttribute(element: HTMLElement, name: string, value: string | number | null | undefined): void {
  if (value === null || value === undefined) element.removeAttribute(name);
  else element.setAttribute(name, String(value));
}
