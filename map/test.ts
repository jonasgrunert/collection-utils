import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.216.0/assert/mod.ts";
import { CollectionMap } from "./mod.ts";

Deno.test("Map", async (t) => {
  await t.step("compute", async (t) => {
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
  await t.step("computeIfAbsent", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(
        m.computeIfAbsent("Key-1", (key) => Number.parseInt(key.at(-1)!)),
        1,
      );
      assertEquals(m.get("Key-1"), 1);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap([["Key", 1]]);
      assertEquals(
        m.computeIfAbsent("Key", (_key) => 1),
        1,
      );
      assertEquals(m.get("Key"), 1);
    });
    await t.step(
      "Key does not exist before but is not added due to undefined being returned",
      () => {
        const m = new CollectionMap<string, number>();
        assertEquals(
          m.computeIfAbsent(
            "Key",
            (_key) => undefined,
          ),
          undefined,
        );
        assertEquals(m.get("Key"), undefined);
      },
    );
  });
  await t.step("computeIfPresent", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(
        m.computeIfPresent("Key-1", () => 1),
        undefined,
      );
      assertEquals(m.get("Key-1"), undefined);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap([["Key", 1]]);
      assertEquals(
        m.computeIfPresent("Key", (_key, value) => value + 1),
        2,
      );
      assertEquals(m.get("Key"), 2);
    });
    await t.step(
      "Key does exist before but is removed due to undefined being returned",
      () => {
        const m = new CollectionMap([["Key", 1]]);
        assertEquals(
          m.computeIfPresent(
            "Key",
            (_key, value) => value === 1 ? undefined : value,
          ),
          undefined,
        );
        assertEquals(m.get("Key"), undefined);
      },
    );
  });
  await t.step("computeIf", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number | undefined>();
      assertEquals(
        m.computeIf("Key-1", {
          present: (_key, value) => value === undefined ? value : value + 1,
          absent: (key) => Number.parseInt(key.at(-1)!),
        }),
        1,
      );
      assertEquals(m.get("Key-1"), 1);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap<string, number>([["Key-1", 1]]);
      assertEquals(
        m.computeIf("Key-1", {
          present: (_key, value) => value === undefined ? value : value + 1,
          absent: (key) => Number.parseInt(key.at(-1)!),
        }),
        2,
      );
      assertEquals(m.get("Key-1"), 2);
    });
    await t.step(
      "Key does exist before but is removed due to undefined being returned",
      () => {
        const m = new CollectionMap<string, number>([["Key-1", 1]]);
        assertEquals(
          m.computeIf("Key-1", {
            present: () => undefined,
            absent: (key) => Number.parseInt(key.at(-1)!),
          }),
          undefined,
        );
        assertEquals(m.get("Key-1"), undefined);
      },
    );
    await t.step(
      "Key does not exist before but is not added due to undefined being returned",
      () => {
        const m = new CollectionMap<string, number>();
        assertEquals(
          m.computeIf("Key-1", {
            present: (_key, value) => value === undefined ? value : value + 1,
            absent: (_key) => undefined,
          }),
          undefined,
        );
        assertEquals(m.get("Key-1"), undefined);
      },
    );
    await t.step(
      "Key does exists as undefined and is tehrefore changed",
      () => {
        const m = new CollectionMap<string, number | undefined>([[
          "Key-1",
          undefined,
        ]]);
        assertEquals(
          m.computeIf("Key-1", {
            present: (_key, value) => value === undefined ? 10 : value + 1,
            absent: (key) => Number.parseInt(key.at(-1)!),
          }),
          10,
        );
        assertEquals(m.get("Key-1"), 10);
      },
    );
  });
  await t.step("hasValue", async (t) => {
    await t.step("Value exists", () => {
      const m = new CollectionMap([["key", 25]]);
      assert(m.hasValue(25));
    });
    await t.step("Value does not exist", () => {
      const m = new CollectionMap([["key", 25]]);
      assert(!m.hasValue(0));
    });
  });
});
