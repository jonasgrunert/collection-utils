import { assert } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { CollectionSet } from "./mod.ts";

Deno.test("Set", async (t) => {
  await t.step("union", async (t) => {
    await t.step("No duplicate values ", () => {
      const s = new CollectionSet(["key-2"]);
      const newS = s.union(new CollectionSet(["key"]));
      assert(newS.has("key"));
      assert(newS.has("key-2"));
      assert(!s.has("key"));
    });
    await t.step("Duplicate values are present once", () => {
      const s = new CollectionSet(["key-2"]);
      const newS = s.union(new CollectionSet(["key-2"]));
      assert(newS.has("key-2"));
    });
  });
});
