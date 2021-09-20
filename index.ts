import { decode } from "https://deno.land/std@0.107.0/encoding/base64.ts"
import gen from "./img.ts"


// Create new PNG image, parameters (only indexed 8-bit pngs are supported at the moment):
// width (number)
// height (number)
// depth (number of palette entries)
// [backgroundColor] (optional background color, when omitted 'transparent' is used)

let opts = {
	width: 1500,
	height: Math.floor(1500/1.91),
	bg_col: "#43aeff",
	dot_col: "#0062ac",
	text_col: "#001626",
	dot_adj_a: 5,
	dot_adj_b: 11,
	title: "Hello world!\n@\nStuff",
	title_scale: 10
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
			const url = new URL(requestEvent.request.url)
			const params = new URLSearchParams(url.search)
			if (requestEvent.request.method == "GET" && url.pathname == "/og.png") {
				//Overwrite the defaults
				console.log(`Request: ${requestEvent.request.url}`);
				
				for (const key in opts) {
					if (params.get(key)) {
						//@ts-ignore
						opts[key] = params.get(key)
					}
				}
				await requestEvent.respondWith(
					new Response(decode(gen(opts)), {
						status: 200,
						headers: {
							"content-type": "image/png",
						}
					}),
				);
			}
    }
  })();
}