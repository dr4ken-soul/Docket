/**
 * Class name merge helper. Concatenates class strings, filtering falsy values.
 *
 * @param classes arbitrary class values
 * @returns the merged class string
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
