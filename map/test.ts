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
  await t.step("delete", async (t) => {
    await t.step("Deletes successful without value checking", () => {
      const m = new CollectionMap<string, number>([["key", 25]]);
      assert(m.delete("key"));
    });
    await t.step("Delete fails without value checking", () => {
      const m = new CollectionMap<string, number>([["key", 25]]);
      assert(!m.delete("not"));
    });
    await t.step("Deletes successful with value checking", () => {
      const m = new CollectionMap<string, number>([["key", 25]]);
      assert(m.delete("key", 25));
    });
    await t.step("Delete fails with value checking", () => {
      const m = new CollectionMap<string, number>([["key", 25]]);
      assert(!m.delete("key", 10));
    });
    await t.step(
      "Dleete succesful even on undefined value",
      () => {
        const m = new CollectionMap([["Key", undefined]]);
        assertEquals(m.delete("Key", undefined), true);
        assert(!m.has("Key"));
      },
    );
  });
  await t.step("Deletes succesful with value checking for undefined", () => {
    const m = new CollectionMap<string, number | undefined>([[
      "key",
      undefined,
    ]]);
    assert(m.delete("key", undefined));
  });
  await t.step("empty", async (t) => {
    await t.step("Is empty", () => {
      const m = new CollectionMap<string, number>();
      assert(m.empty);
    });
    await t.step("Is not empty", () => {
      const m = new CollectionMap([["key", 25]]);
      assert(!m.empty);
    });
  });
  await t.step("get", async (t) => {
    await t.step("get without value and without default", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(m.get("1"), undefined);
    });
    await t.step("Get without value and with default", () => {
      const m = new CollectionMap([["key", 25]]);
      assertEquals(m.get("1", 10), 10);
    });
    await t.step("Get with value and without default", () => {
      const m = new CollectionMap([["key", 25]]);
      assertEquals(m.get("key"), 25);
    });
    await t.step("Get with value and with default", () => {
      const m = new CollectionMap([["key", 25]]);
      assertEquals(m.get("key", 10), 25);
    });
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
  await t.step("merge", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(
        m.merge("Key", 1, (old, curr) => old + curr),
        1,
      );
      assertEquals(m.get("Key"), 1);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap([["Key", 1]]);
      assertEquals(
        m.merge("Key", 1, (old, curr) => old + curr),
        2,
      );
      assertEquals(m.get("Key"), 2);
    });
    await t.step(
      "Key does exist before but is deleted due to undefined being returned",
      () => {
        const m = new CollectionMap([["Key", 1]]);
        assertEquals(
          m.merge(
            "Key",
            1,
            (old, curr) => old + curr > 0 ? undefined : old + curr,
          ),
          undefined,
        );
        assertEquals(m.get("Key"), undefined);
      },
    );
  });
  await t.step("replace", async (t) => {
    await t.step("Key does not exist", () => {
      const m = new CollectionMap<string, number>();
      assertEquals(m.replace("Key", 10), undefined);
      assertEquals(m.get("Key"), undefined);
    });
    await t.step("Key does exist", () => {
      const m = new CollectionMap([["Key", 1]]);
      assertEquals(m.replace("Key", 10), 10);
      assertEquals(m.get("Key"), 10);
    });
    await t.step(
      "Key does exist but value does not match",
      () => {
        const m = new CollectionMap([["Key", 1]]);
        assertEquals(m.replace("Key", 10, -1), 1);
        assertEquals(m.get("Key"), 1);
      },
    );
    await t.step(
      "Key does exist but and value does match",
      () => {
        const m = new CollectionMap([["Key", 1]]);
        assertEquals(m.replace("Key", 10, 1), 10);
        assertEquals(m.get("Key"), 10);
      },
    );
    await t.step(
      "Key is replaced even when undefined is used for matching",
      () => {
        const m = new CollectionMap<string, number | undefined>([[
          "Key",
          undefined,
        ]]);
        assertEquals(m.replace("Key", 1, undefined), 1);
        assertEquals(m.get("Key"), 1);
      },
    );
  });
  await t.step("replaceAll", async (t) => {
    await t.step(
      "All keys are replaced and undefined keys are discarded",
      () => {
        const m = new CollectionMap<string, number>([[
          "Key",
          10,
        ], ["Key-2", -1]]);
        m.replaceAll((k, v) => v < 0 ? undefined : v + k.length);
        assertEquals(m.get("Key"), 13);
        assert(!m.has("Key-2"));
      },
    );
  });
});
