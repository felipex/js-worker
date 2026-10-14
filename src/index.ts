export default {
	async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/message':
				return new Response('Olá, Worker!  Agora integrado ao github e em Typescript.');
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
