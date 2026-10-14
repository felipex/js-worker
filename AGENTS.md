# js-worker

Cloudflare Worker, TypeScript base, Wrangler 4.

## Commands

- `npm run dev` / `npm start` — local dev (`wrangler dev`, default http://localhost:8787/).
- `npm run deploy` — deploy to Cloudflare.
- `npm test` — Vitest via `@cloudflare/vitest-plugin`.
- Single test: `npx vitest run test/index.spec.ts -t "<test name substring>"`.
- Type check: `npm run typecheck` (runs `wrangler types && tsc --noEmit`).
- Generate types: `npm run generate-types` after changing `wrangler.jsonc` or compatibility settings.

## Layout

- Entrypoint: `src/index.ts`, default export typed as `ExportedHandler<Env>`.
- Generated types: `worker-configuration.d.ts` from `npm run generate-types` (commit it; rerun after `wrangler.jsonc` changes). tsconfig pulls it in.
- Worker routes: `/message` → `"Olá, Worker!  Agora integrado ao github."`; `/random` → UUID; anything else → `404` from the Worker.
- Static assets: `public/` is served by Cloudflare Assets (`assets.directory` in `wrangler.jsonc`); `/` is `public/index.html`, which calls `/message` and `/random`. Asset routing takes precedence, so the Worker's default `404` only applies to non-asset paths.
- No lint or format scripts. Style: tabs, 140 cols, single quotes, semicolons (`.prettierrc`, `.editorconfig`). Match when editing.

## Testing

- Config: `vitest.config.mjs` uses `cloudflareTest({ wrangler: { configPath: "./wrangler.jsonc" } })`.
- Unit style: `import worker from "../src"` then `worker.fetch(request, env, ctx)` with `createExecutionContext`/`waitOnExecutionContext`.
- Integration style: `SELF.fetch(request)`.
- `env` has no bindings currently (all bindings commented in `wrangler.jsonc`).
- Known mismatch: `test/index.spec.ts` inline snapshots for `/message` still expect `"Hello, World!"`, but `src/index.ts` returns the Portuguese string above. Decide which side is authoritative before changing either; do not just regenerate snapshots.

## Config

- Compatibility date `2026-10-06`, flag `global_fetch_strictly_public`.
- Observability enabled; `upload_source_maps: true`.
- No bindings configured. `.wrangler/` (gitignored) holds local dev state and can go stale; delete it if bindings/state look wrong.

## Debugging

- `npx wrangler dev` prints a Local Explorer base URL. Endpoints under `/cdn-cgi/local/explorer/...` inspect workers/bindings/storage and query captured traces via SQL. Useful for binding or storage issues.

## Cloudflare

- APIs and limits change; fetch current docs (developers.cloudflare.com or the docs MCP) before non-trivial platform work instead of relying on memory.