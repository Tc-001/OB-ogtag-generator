/// <reference path="./deploy.d.ts" />

import { createCanvas, EmulatedCanvas2D, EmulatedCanvas2DContext, loadImage } from "https://deno.land/x/canvas/mod.ts";
import rand from "./psrng.ts"

type ApiOpts = Record<string, string>

addEventListener("fetch",async (event: FetchEvent) => {
  const url = new URL(event.request.url)
  //Create an object with all provided options
  let opts_fin:ApiOpts = {}
  url.pathname.split("/")[1].split("+")
    .forEach(opts => {
      let split = opts.split("-")
      opts_fin[split[0]] = split[1]
    })
  const image = await genimg(opts_fin)
  const response = new Response(image, {
    headers: { "content-type": "image/png" },
  });
  //@ts-ignore event
  event.respondWith(response);
});


async function genimg(o: ApiOpts) {
  const canvas = createCanvas(1500, 1500);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = o.col?.replace("&h","#") ?? "skyblue";
  ctx.fillRect(0, 0, 1500, 1500);

  genBgRandPix(canvas, ctx, o.txt??"none")

  if (o.txt) {
    let text = decodeURIComponent(o.txt).split("&n")
    text.forEach((txt, i) => {
      ctx.fillStyle = o.txtf ?? "red";
      ctx.font = `${o.txts??"150"}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; 
      const dims = ctx.measureText(txt)
      ctx.fillText(txt, canvas.width/2-(dims.width/2), parseInt(o.txts??150)*(i+1)); 
    })
  }

  const image = await loadImage("https://ohkabots.ohkaspace.com/assets/images/logo.png");
  ctx.drawImage(image, (canvas.width/2)-(image.width()/2), canvas.height/2);

  return canvas.toBuffer("image/png")
}


function genBgRandPix(canvas: EmulatedCanvas2D, ctx:EmulatedCanvas2DContext , seed: string) {
  const pixedim = canvas.width/20
  const rng = rand(seed)
  ctx.globalAlpha = 0.1;
  for (let w = 0; w < canvas.width; w+=pixedim) {
    for (let h = 0; h < canvas.height; h+=pixedim) {
      if(rng() > 0.1) {
        ctx.fillStyle = `hsl(197, ${Math.floor(rng()*100)}%, ${Math.floor(rng()*100)}%)`;
        ctx.fillRect(w, h, pixedim, pixedim);
      }
    }
  }
  ctx.globalAlpha = 1.0;
}

