import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { CollectionMap } from "./mod.ts";

Deno.test("Map", async (t) => {
  await t.step("Compute", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(
        m.compute("Key", (_key, value) => value === undefined ? 0 : value + 1),
        0,
      );
      assertEquals(m.get("Key"), 0);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap([["Key", 1]]);
      assertEquals(
        m.compute("Key", (_key, value) => value === undefined ? 0 : value + 1),
        2,
      );
      assertEquals(m.get("Key"), 2);
    });
    await t.step(
      "Key does exist before but is deleted due to undefined being returned",
      () => {
        const m = new CollectionMap([["Key", 1]]);
        assertEquals(
          m.compute(
            "Key",
            (_key, value) => value === undefined ? 0 : undefined,
          ),
          undefined,
        );
        assertEquals(m.get("Key"), undefined);
      },
    );
    await t.step("Key can be used in calculation", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(
        m.compute(
          "Key-1",
          (key, value) =>
            value !== undefined ? value : Number.parseInt(key.at(-1)!),
        ),
        1,
      );
      assertEquals(m.get("Key-1"), 1);
    });
  });
});
