// Several loaders ask for the same data while one page renders: the root loader
// and the page's own loader both want the same items and settings. This keeps the
// first answer for the length of that request, so the database is asked once.
// Keyed by the request itself, so nothing outlives it or leaks between visitors,
// and an edit saved in /admin shows on the very next page load.
const answers = new WeakMap<object, Map<string, Promise<unknown>>>();

export function rememberForRequest<T>(
  request: object,
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  let known = answers.get(request);
  if (!known) {
    known = new Map();
    answers.set(request, known);
  }
  if (!known.has(key)) known.set(key, load());
  return known.get(key) as Promise<T>;
}
