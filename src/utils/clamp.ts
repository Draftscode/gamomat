import { env } from "../environment/environment";

export function clamp(v: number) {
    if (v < 0) {
        return env.tilesPerReel + (v % (env.tilesPerReel + 1));
    }
    return v % env.tilesPerReel;
}

export function clampBetween(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
}