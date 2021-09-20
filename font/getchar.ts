import { BitmapBufferAPI, Decoder } from "https://deno.land/x/bitmap/mod.ts";

const data = await Deno.readFile("font/Willy.bmp");
const decoder = Decoder(BitmapBufferAPI.from(data));
const imgData = decoder.data;


export function get(char:string) {
	const start = char.charCodeAt(0)*8*16*4

	let resbmp:number[][] = [[]]
	for (let i = start; i < start+(16*8*4); i+=(8*4)) {
		for (let j = i; j < i+(8*4) ; j+=4) {
			resbmp.at(-1)?.push(imgData[j+1])
		}
		resbmp.push([])
	}
	return resbmp
}
