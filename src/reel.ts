import { Bouncer } from "./bounce";
import { env } from "./environment/environment";
import { Coordinates, Tile } from "./tile";
import { clamp, clampBetween } from "./utils/clamp";
import { uuid } from "./utils/uuid";

interface ReelOptions {
    offsetX: number; // offset on the canvas
    maxSpeed: number; // max speed on fully accelerated reels
    acc: number; // acceleration
}

export class Reel {
    private _uuid = uuid(); // mostly usedfor debugginf purposes
    private _tiles: Tile[]; // tiles of the reel
    private _oldTime: number; // old time stamp for delta calculation
    private _ctx: CanvasRenderingContext2D; // rendering context
    private _curVelocity = 0; // current speed of the reel
    private _delta = 0; // number of updated steps
    private _coords: Coordinates; // mapped coordinates on sprite
    private _options: ReelOptions = {
        offsetX: 0,
        maxSpeed: 5,
        acc: .1,
    };
    private _totalSteps = 4; // max steps after stop was triggered
    private _curSteps = 0; // current animation step
    private _isRotating = false; // either reel is rotating or not
    private _renderIdx = 0; // rendered index of each tile
    private bouncer: Bouncer; // handles bouncing animations
    private stopResolver: (value: [number, number, string]) => void; // resolve to end promise

    constructor(canvas: HTMLCanvasElement, options: Partial<ReelOptions>, coords: Coordinates, ...tiles: Tile[]) {
        this._tiles = tiles;
        this._ctx = canvas.getContext('2d');
        this._coords = coords;
        this._options = Object.assign(this._options, options);
    }

    // starts spinning the reel
    start() {
        this._isRotating = true;
        this._curVelocity = 0;
        this.bouncer = new Bouncer();
    }

    // stops spinning the reel
    async stop() {
        this._isRotating = false;
        return new Promise<[number, number, string]>((resolve: (value: [number, number, string]) => void) => {
            this.stopResolver = resolve;
        });
    }

    clampDelta() {
        // if reel is not rotating and delta is smaller zero, its a bounce effect
        if (this._delta < 0 && !this._isRotating && this.bouncer?.isActive()) {

            this._curVelocity = this.bouncer.next(this._curVelocity);
        }

        // make sure delta is always in between zero and 140
        if (this._delta > 140) {
            this._delta = this._delta % 140;
            if (!this._isRotating) {
                this._curSteps++;
            }

            this._renderIdx = (this._renderIdx + 1) % env.tilesPerReel;
        }

        if (!this._isRotating && !this.bouncer?.isActive() && this.stopResolver) {

            const result = this._coords[clamp((1) - this._renderIdx)];
            this.stopResolver(result);
            this.stopResolver = null;
            this._delta = 0;
        }

    }

    // updates rendering of the reel
    update(time: number) {
        if (!this._tiles) { return; }

        const deltaTime = time - (this._oldTime ?? time);
        this._oldTime = time;

        this._delta += deltaTime * this._curVelocity;

        // clamp delta
        this.clampDelta();

        // do bouncing
        if (!this._isRotating && this._curSteps >= this._totalSteps) {
            this._curVelocity = this.bouncer.bounce(this._curVelocity);
        }

        // calculates visual speed
        if (this._isRotating && this._curVelocity < this._options.maxSpeed) {
            this._curVelocity = clampBetween(this._curVelocity + this._options.acc, 0, this._options.maxSpeed);
        }


        // renders tiles with x and y offsets all tiles
        for (let y = -1, idx = 0; idx < this._tiles.length; idx++) {
            const coords = this._coords[clamp((y + idx) - this._renderIdx)];
            const cx = coords[0];
            const cy = coords[1];

            // draws one tile with a specific chunk of the sprite
            this._tiles[idx].drawTile(this._ctx, this._options.offsetX, y + idx, cx, cy, this._delta);
        }
    }
}