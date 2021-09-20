import PNGImage from "https://esm.sh/pnglib-es6"
import { get } from "./font/getchar.ts"

const go = {
	width: 1500,
	height: Math.floor(1500/1.91),
	bg_col: "#43aeff",
	dot_col: "#0062ac",
	text_col: "#001626",
	dot_adj_a: 6,
	dot_adj_b: 11,
	title: "Hello world!\n@\nStuff",
	title_scale: 10
}

export default function genIMG(o: typeof go) {
	const image = new PNGImage(o.width, o.height, 8, o.bg_col);

	const dotcol = image.createColor(o.dot_col);
	const txtcol = image.createColor(o.text_col);

	const offsetw = Math.floor((o.width%(o.dot_adj_a * o.dot_adj_b))/2)
	const offseth = Math.floor((o.height%(o.dot_adj_a * o.dot_adj_b))/2)

	for (let w = offsetw; w < o.width; w++) {
		for (let h = offseth; h < o.height; h++) {
			if (
				Math.floor((w-offsetw)/o.dot_adj_a)%o.dot_adj_b == 0 &&
				Math.floor((h-offseth)/o.dot_adj_a)%o.dot_adj_b == 0 
				) {
				image.setPixel(w, h, dotcol);
			}
		}
	}

	//Add text
	o.title.split("\n").forEach((text:string, txtrow:number) => {
		text.split("").forEach((letter, i) => {
			get(letter).forEach((row, rowi) => {
				row.forEach((pixel, pixeli) => {
					if (pixel != 0) {
						for (let ilpxi = pixeli*o.title_scale; ilpxi < pixeli*o.title_scale+o.title_scale; ilpxi++) {
							for (let lrowi = rowi*o.title_scale; lrowi < rowi*o.title_scale+o.title_scale; lrowi++) {
								image.setPixel((ilpxi+o.title_scale+(8*i*o.title_scale)), lrowi+(16*o.title_scale*txtrow), txtcol);
							}
						}
					}
				})
			})
		})
	})

	// Convert image to base-64
	return image.getBase64();
}