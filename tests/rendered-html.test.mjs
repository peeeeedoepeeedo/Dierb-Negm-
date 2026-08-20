import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps Arabic RTL metadata and the production worker artifact", async () => {
  const layout=await readFile(new URL("../app/layout.tsx",import.meta.url),"utf8");
  const worker=await readFile(new URL("../dist/server/index.js",import.meta.url),"utf8");
  assert.match(layout,/lang="ar"/);
  assert.match(layout,/dir="rtl"/);
  assert.match(layout,/ديرب نجم/);
  assert.ok(worker.length>1000,"production worker artifact is unexpectedly empty");
});
