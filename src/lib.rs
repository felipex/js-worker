use uuid::Uuid;
use worker::*;

#[event(fetch)]
pub async fn main(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
	let url = req.url()?;
	match url.path() {
		"/message" => Response::ok("Olá, Worker!  Agora integrado ao github e com Rust."),
		"/random" => Response::ok(Uuid::new_v4().to_string()),
		_ => Response::error("Not Found", 404),
	}
}
