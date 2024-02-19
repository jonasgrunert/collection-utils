/**
 * ### Extended Map Class
 * Can be used in the same way as normal class with some convenience methods.
 *
 * All functions take a special understanding of undefined, which is treated as not being part of the map.
 * If you need to use a nullish value use `null`.
 * @template K Type of the key
 * @template V Type of the Value
 * @example
 * ```ts
 * import { CollectionMap } from "./mod.ts"
 * const m = new CollectionMap<string, number>();
 * ```
 */
export class CollectionMap<K, V> extends Map<K, V> {
  /**
   * A function which takes a key and a function to compute a new value for the provided key.
   *
   * The function takes two parameters; the key and the associated value or undefined if there is none.
   * The function should return the new value or undefined.
   *
   * If a value is returned it will get written as the new value to the key.
   * If undefined is returned the mapping will not be added or it will be deleted if it was present before.
   * @summary A function to compute a new value based on the old value or undefined if not present. Returns the new value associted with the key.
   * @param key Key of the entry.
   * @param mappingFunction A function called with the key, and value or undefined if key is not present and should return a new value.
   * @returns The new computed and stored value or undefined
   * @example
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number>([["key-2", 1]]);
   * for (const key of ["key-1", "key-2"]){
   *    m.compute(key, (_key, value) => value === undefined ? 0 : value + 1);
   * }
   * m.get("key-1") === 0;
   * m.get("key-2") === 2;
   * ```
   */
  compute(
    key: K,
    mappingFunction: (key: K, value: V | undefined) => V | undefined,
  ): V | undefined {
    const value = mappingFunction(key, this.get(key));
    if (value === undefined) {
      this.delete(key);
    } else {
      this.set(key, value);
    }
    return value;
  }

  /**
   * A function which takes a key and a function to compute a new value for the provided key if its not present in the map.
   *
   * The function takes one parameter; the key.
   * The function should return the new value or undefined.
   *
   * If a value is returned it will get written as the new value to the key.
   * If undefined is returned the mapping will not be added.
   * @summary A function to compute a new value based on the old value or undefined if not present. Returns the new value associted with the key.
   * @param key Key of the entry.
   * @param mappingFunction A function called with the key and should return a new value.
   * @returns The new computed and stored value or undefined
   * @example
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number>([["key-2", 1]]);
   * for (const key of ["key-1", "key-2"]){
   *    m.computeIfAbsent(key, (key) => Number.parseInt(key.at(-1)!));
   * }
   * m.get("key-1") === 1;
   * m.get("key-2") === 2;
   * ```
   */
  computeIfAbsent(
    key: K,
    mappingFunction: (key: K) => V | undefined,
  ): V | undefined {
    if (!this.has(key)) {
      const value = mappingFunction(key);
      if (value !== undefined) {
        this.set(key, value);
      }
      return value;
    }
    return this.get(key);
  }

  /**
   * A function which takes a key and a function to compute a new value for the provided key if the key is presnt.
   *
   * The function takes two parameters; the key and the associated value.
   * The function should return the new value or undefined.
   *
   * If a value is returned it will get written as the new value to the key.
   * If undefined is returned the mapping will be deleted.
   * @summary A function to compute a new value based on the old value or undefined if not present. Returns the new value associted with the key.
   * @param key Key of the entry.
   * @param mappingFunction A function called with the key and value. It should return a new value.
   * @returns The new computed and stored value or undefined
   * @example
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number>([["key-2", 1]]);
   * for (const key of ["key-1", "key-2"]){
   *    m.computeIfPresent(key, (_key, value) => value === undefined ? 0 : value + 1);
   * }
   * m.get("key-1") === 0;
   * m.get("key-2") === 2;
   * ```
   */
  computeIfPresent(
    key: K,
    remappingFunction: (key: K, value: V) => V | undefined,
  ): V | undefined {
    if (this.has(key)) {
      const value = remappingFunction(key, this.get(key)!);
      if (value === undefined) {
        this.delete(key);
      } else {
        this.set(key, value);
      }
      return value;
    }
    return undefined;
  }

  /**
   * A function which takes a key and an object conatining two functions to compute a new value for the provided key.
   * The main differenc to [compute]{@link CollectionMap.compute} is that the functions are called based on has, while the compute function might have a mapping with value undefined.
   *
   * The present function takes two parameters; the key and the associated value or undefined if there is none.
   * The absent function should return the new value or undefined.
   *
   * If a value is returned it will get written as the new value to the key.
   * If undefined is returned the mapping will not be added or it will be deleted if it was present before.
   * @summary A function to compute a new value based on the old value or undefined if not present. Returns the new value associted with the key.
   * @param key Key of the entry.
   * @param functions An object conatining an absent and present function.
   * @returns The new computed and stored value or undefined
   * @example
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number|undefined>([["key-2", 1], ["key-3", undefined]]);
   * for (const key of ["key-1", "key-2", "key-3"]){
   *    m.computeIf(key, {
   *        present: (_key, value) => value === undefined ? value : value + 1,
   *        absent: (key) => Number.parseInt(key.at(-1)!)
   *    });
   * }
   * m.get("key-1") === 1;
   * m.get("key-2") === 2;
   * m.get("key-3") === undefined;
   * ```
   */
  computeIf(
    key: K,
    functions: {
      present: (key: K, value: V | undefined) => V | undefined;
      absent: (key: K) => V | undefined;
    },
  ): V | undefined {
    let value = null;
    if (this.has(key)) {
      value = functions.present(key, this.get(key));
    } else {
      value = functions.absent(key);
    }
    if (value === undefined) {
      this.delete(key);
    } else {
      this.set(key, value);
    }
    return value;
  }

  /**
   * A function to check wether the map has the specfied value. It uses Object.is equality and performs with O(n) at worst case.
   * @param value: Value to search for in the values of the map
   * @returns wether the value is present or not
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number>([["key-2", 1]]);
   * m.hasValue(1) === true;
   * m.hasValue(2) === false;
   * ```
   */
  hasValue(value: V): boolean {
    for (const v of this.values()) {
      if (Object.is(value, v)) {
        return true;
      }
    }
    return false;
  }

  /**
   * A function used to compute a new value based on an existing one or add the default given to this function.
   *
   * If the key already has a value the mapping will be invoked otherwise the default will set to the key and retruned.
   * If the value to be added after domputation or the default is undeifned the mapping will not be applied and deleted if the key existed before.
   * The function tajes two parameters the first one being the old value and the second one being the new one.
   * Presence of a key will be cheked using get(key) !== undefined.
   *
   * @param key Key of the entry.
   * @param value The default value to be inserted if the key has no associated value
   * @param mappingFunction A function called with the oldValue and the new Value to be added., if the key already has a mapping It should return a new value or undefined-
   * @returns The new value of undefined is it got deleted
   * @example
   * ```ts
   * import { CollectionMap } from "./mod.ts"
   * const m = new CollectionMap<string, number|undefined>([["key-2", 1], ["key-3", undefined]]);
   * for (const key of ["key-1", "key-2", "key-3"]){
   *    m.merge(key, 1, (prev, curr) => prev + curr);
   * }
   * m.get("key-1") === 1;
   * m.get("key-2") === 2;
   * m.get("key-3") === 1;
   * ```
   */
  merge(
    key: K,
    value: Exclude<V, undefined>,
    mappingFunction: (
      oldValue: Exclude<V, undefined>,
      value: Exclude<V, undefined>,
    ) => V | undefined,
  ): V | undefined {
    const prev = this.get(key);
    const v = prev === undefined
      ? value
      // I do not like the casting here but oitherwise it would not be possible
      : mappingFunction(prev as Exclude<V, undefined>, value);
    if (v !== undefined) {
      this.set(key, v);
    } else {
      this.delete(key);
    }
    return v;
  }
}
