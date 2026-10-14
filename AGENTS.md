# js-worker

Cloudflare Worker in Rust via `workers-rs`, Wrangler 4.

## Prerequisites

- Rust toolchain with `wasm32-unknown-unknown` target.
- `worker-build` installed (`cargo install worker-build`).

## Commands

- `npm run dev` / `npm start` — local dev (`wrangler dev`, default http://localhost:8787/); runs the configured Rust build.
- `npm run build` — `worker-build --release`.
- `npm run deploy` — deploy to Cloudflare.
- `npm test` — `cargo test`.

## Layout

- Entrypoint: `src/lib.rs`, `#[event(fetch)]` handler returning `Result<Response>`.
- Worker routes: `/message` → `"Olá, Worker!  Agora integrado ao github."`; `/random` → UUID; anything else → `404`.
- Static assets: `public/` served by Cloudflare Assets (`assets.directory` in `wrangler.jsonc`); `/` is `public/index.html`. Asset routing takes precedence.
- Wrangler entrypoint is `build/worker/shim.mjs`, produced by `worker-build`.
- `Cargo.lock` is committed; generated `target/` and `build/` are gitignored.

## Config

- Compatibility date `2026-10-06`, flag `global_fetch_strictly_public`.
- Observability enabled; `upload_source_maps: true`.
- No bindings configured (all bindings commented).
- Keep `[profile.release]` as currently configured (`lto` disabled); enabling LTO breaks `worker-build`'s wasm-bindgen step by removing the externref table.

## Debugging

- `npx wrangler dev` prints a Local Explorer base URL. Endpoints under `/cdn-cgi/local/explorer/...` inspect workers/bindings/storage and query captured traces via SQL.

## Cloudflare

- APIs and limits change; fetch current docs (developers.cloudflare.com or the docs MCP) before non-trivial platform work instead of relying on memory.