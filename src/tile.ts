export type Coordinates = [number, number, string][];

const WIDTH = 165;

export class Tile {
    private _img: HTMLImageElement;

    constructor(img: HTMLImageElement) {
        this._img = img;
    }

    // draws a single tile
    drawTile(ctx: CanvasRenderingContext2D, dx: number, dy: number, sx: number, sy: number, delta: number) {
        const width = WIDTH;
        const height = 140;
        const offsetX = width * sx;
        const offsetY = height * sy;

        // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
        ctx.drawImage(this._img, offsetX, offsetY, width, height, dx * width, (dy * height) + (delta), width, height);
    }
}

CanvasRenderingContext2D