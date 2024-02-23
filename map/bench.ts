import { CollectionMap } from "./mod.ts";

Deno.bench("Map - compute", { group: "Map - compute" }, () => {
  const m = new CollectionMap<string, number>();
  m.compute(
    "Key",
    (_key, value) => value === undefined ? 0 : value + 1,
  );
  m.compute(
    "Key",
    (_key, value) => value === undefined ? 0 : value + 1,
  );
  m.compute(
    "Key",
    (_key, value) => value !== 1 ? 0 : undefined,
  );
});

Deno.bench(
  "Map - compute - Baseline",
  { group: "Map - compute", baseline: true },
  () => {
    const m = new Map<string, number>();
    if (!m.has("Key")) {
      m.set("Key", 0);
    }
    m.get("Key");
    const v0 = m.get("Key");
    if (v0 !== undefined) {
      m.set("Key", v0 + 1);
    }
    m.get("Key");
    if (m.has("Key")) {
      m.delete("Key");
    }
    m.get("Key");
  },
);

Deno.bench("Map - computeIfAbsent", { group: "Map - computeIfAbsent" }, () => {
  const m = new CollectionMap<string, number>();
  m.computeIfAbsent(
    "Key",
    (_key) => 1,
  );
  m.computeIfAbsent(
    "Key",
    (_key) => 1,
  );
  m.computeIfAbsent(
    "Key1",
    (_key) => undefined,
  );
});

Deno.bench(
  "Map - computeIfAbsent - Baseline",
  { group: "Map - computeIfAbsent", baseline: true },
  () => {
    const m = new Map<string, number>();
    if (!m.has("Key")) {
      m.set("Key", 0);
    }
    m.get("Key");
    if (!m.has("Key")) {
      m.set("Key", 0);
    }
    m.get("Key");
    // deno-lint-ignore no-empty
    if (!m.has("Key1")) {
    }
    m.get("Key1");
  },
);

Deno.bench(
  "Map - computeIfPresent",
  { group: "Map - computeIfPresent" },
  () => {
    const m = new CollectionMap([["Key", 1]]);
    m.computeIfPresent(
      "Key",
      (_key, value) => value + 1,
    );
    m.computeIfPresent(
      "Key",
      (_key, value) => value === 2 ? undefined : value,
    );
    m.computeIfPresent(
      "Key1",
      (_key) => 1,
    );
  },
);

Deno.bench(
  "Map - computeIfPresent - Baseline",
  { group: "Map - computeIfPresent", baseline: true },
  () => {
    const m = new Map([["Key", 1]]);
    if (m.has("Key")) {
      m.set("Key", m.get("Key")! + 1);
    }
    m.get("Key");
    if (m.has("Key")) {
      if (m.get("Key") === 2) {
        m.delete("Key");
      }
    }
    m.get("Key");
    // deno-lint-ignore no-empty
    if (m.has("Key1")) {
    }
    m.get("Key");
  },
);

Deno.bench("Map - computeIf", { group: "Map - computeIf" }, () => {
  const m = new CollectionMap([["Key", 1]]);
  m.computeIf("Key", {
    present: (_key, value) => value === undefined ? value : value + 1,
    absent: (_key) => undefined,
  });
  m.computeIf("Key-1", {
    present: (_key, value) => value === undefined ? value : value + 1,
    absent: (_key) => 1,
  });
  m.computeIf(
    "Key",
    {
      present: (_key, value) => value === 2 ? undefined : value,
      absent: (_key) => undefined,
    },
  );
  m.computeIf(
    "Key-2",
    {
      present: (_key, value) => value === 2 ? undefined : value,
      absent: (_key) => undefined,
    },
  );
});

Deno.bench(
  "Map - computeIf - Baseline",
  { group: "Map - computeIf", baseline: true },
  () => {
    const m = new Map([["Key", 1]]);
    if (m.has("Key")) {
      m.set("Key", m.get("Key")! + 1);
    }
    m.get("Key");
    if (!m.has("Key-1")) {
      m.set("Key-1", 1);
    }
    m.get("Key-1");
    if (m.has("Key")) {
      if (m.get("Key") === 2) {
        m.delete("Key");
      }
    }
    m.get("Key");
    // deno-lint-ignore no-empty
    if (m.has("Key-2")) {
    }
    m.get("Key-2");
  },
);

Deno.bench("Map - hasValue", { group: "Map - hasValue" }, () => {
  const m = new CollectionMap(
    Array.from({ length: 10_000 }, (i) => [`key-${i}`, i]),
  );
  m.hasValue(9_999);
  m.hasValue(10_0001);
});

Deno.bench("Map - empty", { group: "Map - empty" }, () => {
  const m = new CollectionMap<string, number>();
  m.empty === true;
  m.set("key", 1);
  m.empty === false;
});

Deno.bench(
  "Map - empty - Baseline",
  { group: "Map - empty", baseline: true },
  () => {
    const m = new Map<string, number>();
    m.size === 0;
    m.set("key", 1);
    m.size === 0;
  },
);

Deno.bench(
  "Map - hasValue - Baseline",
  { group: "Map - hasValue", baseline: true },
  () => {
    const m = new Map(
      Array.from({ length: 10_000 }, (i) => [`key-${i}`, i]),
    );
    for (const v of m.values()) {
      if (Object.is(v, 9_999)) {
        break;
      }
    }
    for (const v of m.values()) {
      if (Object.is(v, 10_001)) {
        break;
      }
    }
  },
);

Deno.bench("Map - get", { group: "Map - get" }, () => {
  const m = new CollectionMap<string, number>([["key", 25]]);
  const v = m.get("not");
  const v2 = m.get("not", 10);
  const v3 = m.get("key");
  const v4 = m.get("key", 10);
});

Deno.bench(
  "Map - get - Baseline",
  { group: "Map - get", baseline: true },
  () => {
    const m = new Map<string, number>([["key", 25]]);
    const v = m.has("not") ? m.get("not") : undefined;
    const v2 = m.has("not") ? m.get("not") : 10;
    const v3 = m.has("key") ? m.get("key") : undefined;
    const v4 = m.has("key") ? m.get("key") : 10;
  },
);

Deno.bench("Map - merge", { group: "Map - merge" }, () => {
  const m = new CollectionMap<string, number>();
  for (let i = 0; i < 3; i++) {
    m.merge(
      "Key",
      1,
      (old, curr) => old > 1 ? undefined : old + curr,
    );
  }
});

Deno.bench(
  "Map - merge - Baseline",
  { group: "Map - merge", baseline: true },
  () => {
    const m = new Map<string, number>();
    for (let i = 0; i < 3; i++) {
      const v = m.get("Key");
      const n = v === undefined ? 1 : v > 2 ? undefined : v + 1;
      if (n === undefined) {
        m.delete(
          "Key",
        );
      } else {
        m.set("Key", n);
      }
    }
  },
);
