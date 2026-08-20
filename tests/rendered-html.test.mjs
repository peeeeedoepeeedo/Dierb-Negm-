import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps Arabic RTL metadata and the Next.js production build", async () => {
  const layout=await readFile(new URL("../app/layout.tsx",import.meta.url),"utf8");
  const buildId=await readFile(new URL("../.next/BUILD_ID",import.meta.url),"utf8");
  const appManifest=JSON.parse(await readFile(new URL("../.next/server/app-paths-manifest.json",import.meta.url),"utf8"));
  assert.match(layout,/lang="ar"/);
  assert.match(layout,/dir="rtl"/);
  assert.match(layout,/ديرب أونلاين/);
  assert.ok(buildId.trim().length>5,"Next.js BUILD_ID is unexpectedly empty");
  for(const route of ["/page","/login/page","/register/page","/ask/page","/privacy/page"]){
    assert.ok(appManifest[route],`missing production route ${route}`);
  }
});
