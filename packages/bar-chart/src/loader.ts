/**
 * Server-rendering-safe registration entry.
 *
 * Importing this module never evaluates the element classes, so it is safe in
 * Node, SSR, prerendering and tests without a DOM. Calling the loader in a
 * browser dynamically imports `./define.js`, which registers `<a11y-bar-chart>` and `<a11y-bar-chart-group>` using the
 * same constructors the package root exports. Outside a browser it resolves to
 * `false` and does nothing.
 */
let pending: Promise<boolean> | undefined;

export function loadA11yBarChart(): Promise<boolean> {
  if (typeof customElements === 'undefined' || typeof HTMLElement === 'undefined') {
    return Promise.resolve(false);
  }
  pending ??= import('./define.js').then(
    () => true,
    (error: unknown) => {
      pending = undefined;
      throw error;
    }
  );
  return pending;
}
