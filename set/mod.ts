/**
 * ### Extended Set Class
 * Can be used in the same way as normal set with some convenience methods.
 * Thsse methods are not designed to be implemented as the specification is designed.
 * They follow in semantics, but are not a one-to-one replacement.
 *
 * @template V Type of the values int he set
 * @example
 * ```ts
 * import { CollectionSet } from "./mod.ts"
 * const s = new CollectionSet<string>();
 * ```
 */
export class CollectionSet<V> extends Set<V> {
  /**
   * Returns an entirely new set combined from this and the other set.
   * @param other The other set to comine with.
   * @returns the new set
   * @example
   * ```ts
   * import { CollectionSet } from "./mod.ts"
   * const s = new CollectionSet<string>(["key-2"]);
   * const newS = s.union(new Set(["key"]));
   * newS.has("key") === true;
   * newS.has("key-2") === true;
   * ```
   */
  union<oV>(other: Set<oV>): CollectionSet<V | oV> {
    const newSet = new CollectionSet<oV | V>(this);
    for (const value of other.keys()) {
      newSet.add(value);
    }
    return newSet;
  }
}
