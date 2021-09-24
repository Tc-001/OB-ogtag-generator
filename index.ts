let opts: Record<string, string|number> = {
	width: 1500,
	height: Math.floor(1500/1.91),
	bg_col: "#43aeff",
	dot_col: "#0062ac",
	text_col: "#001626",
	dot_adj_a: 26,
	dot_adj_b: 2,
	title: "Hello world!\n@\nStuff",
	title_scale: 10,
	bgsvg: "",
	logo: "https://ohkabots.ohkaspace.com/assets/images/logo.png"
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
			const url = new URL(requestEvent.request.url)
			console.log(url.pathname);
			
			if (requestEvent.request.method == "GET" && url.pathname.endsWith("/og/")) {
				//Overwrite the defaults
				console.log(`Request: ${requestEvent.request.url}`);
				const usropts = JSON.parse(atob(decodeURIComponent(url.pathname.split("/")[1])))
				
				for (const key in opts) {
					if (usropts[key]!==undefined) {
						//@ts-ignore
						opts[key] = usropts[key]
					}
				}
				await requestEvent.respondWith(
					new Response(await makehtml(opts), {
						status: 200,
						headers: {
							"content-type": "text/html",
						}
					}),
				);
			} else {
				await requestEvent.respondWith(new Response("404", {status: 404}))
			}
    }
  })();
}

async function makehtml(iopts: typeof opts) {
	var html = await Deno.readTextFile("og.html")

	iopts.bgsvg = "data:image/svg+xml;utf8,"+encodeURIComponent(
	`<svg width="${iopts.dot_adj_a}" height="${iopts.dot_adj_a}" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<rect x="0" y="0" width="${iopts.dot_adj_a}" height="${iopts.dot_adj_a}" fill="${iopts.bg_col}"/>
		<rect 
			x="${Math.floor(parseInt(iopts.dot_adj_a.toString())/2-parseInt(iopts.dot_adj_b.toString())/2)}" 
			y="${Math.floor(parseInt(iopts.dot_adj_a.toString())/2-parseInt(iopts.dot_adj_b.toString())/2)}" 
			width="${iopts.dot_adj_b}" 
			height="${iopts.dot_adj_b}" 
			fill="${iopts.dot_col}"
		/>
	</svg>`)

	for (const key in iopts) {

		html = html.replaceAll(`server(${key})`, `${iopts[key]}`.replaceAll("\n","<br />"))
	}
	return html
}