import { CollectionSet } from "./mod.ts";

Deno.bench("Set - union", { group: "Set - union" }, () => {
  const m = new CollectionSet(["key"]);
  const newS = m.union(new CollectionSet(["key-2"]));
  newS.has("key");
  newS.has("key-2");
});

Deno.bench(
  "Set - union - Baseline",
  { group: "Set - union", baseline: true },
  () => {
    const s = new Set(["key"]);
    const newS = new Set(s);
    for (const v of new Set("key-2").keys()) {
      newS.add(v);
    }
    newS.has("key");
    newS.has("key-2");
  },
);
