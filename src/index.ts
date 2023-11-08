import { env } from "./environment/environment";
import "./index.css";
import { Reel } from "./reel";
import { Coordinates, Tile } from "./tile";
import { shuffleMatrix } from "./utils/shuffle";

const COORDS: Coordinates = require('./assets/coords.json').slice(0, env.tilesPerReel);

// sprite used for tile rendering
const sprite = require('./assets/img.jpg');


// main entrypoint
function main() {

    const btnStart = document.querySelector("button[id='btn-start']") as HTMLButtonElement;
    const btnStop = document.querySelector("button[id='btn-stop']") as HTMLButtonElement;

    const canvas = document.querySelector("canvas[id='game']") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    // create and reuse image for tiles on the reels
    const img = new Image();
    img.src = sprite;

    // reels used for the slot machine
    const reels: Reel[] = [];

    // rendering loop
    const render = (time: number) => {
        // clear drawing area
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // updates all reels
        reels?.forEach(r => {
            r.update(time);
        });

        window.requestAnimationFrame(render);

    };

    // loads image and executes rendering hook afterward
    img.onload = () => {
        // create reels (can be minified for tiles creation but has more flexibility here)
        reels.push(
            new Reel(canvas, { acc: .1 }, shuffleMatrix(COORDS),
                new Tile(img),
                new Tile(img),
                new Tile(img),
                new Tile(img),
            ),
            new Reel(canvas, { offsetX: 1, acc: .05, maxSpeed: 4 }, shuffleMatrix(COORDS),
                new Tile(img),
                new Tile(img),
                new Tile(img),
                new Tile(img),
            ), new Reel(canvas, { offsetX: 2, acc: .2, maxSpeed: 4.5 }, shuffleMatrix(COORDS),
                new Tile(img),
                new Tile(img),
                new Tile(img),
                new Tile(img),
            ),
        );

        render(0);
    }

    // initialize ui interactions
    btnStart.addEventListener('click', () => {

        reels?.forEach(r => r.start());
        btnStop.classList.remove('hidden');
        btnStart.classList.add('hidden');
        document.querySelector("p[id='success']").classList.add('hidden');
        document.querySelector("p[id='error']").classList.add('hidden');
        hideNotification();
    });

    // stop handling
    btnStop.addEventListener('click', async () => {

        btnStop.classList.add('hidden');

        const promises = [];
        for (let i = 0; i < reels.length; i++) {
            promises.push(await reels[i].stop());
        }

        const results = await Promise.all(promises);

        // check winning condition (only playing row)
        if (results.find(r => results[0][2] !== r[2])) {
            showError();
        } else {
            showSuccess();
        }

        btnStart.classList.remove('hidden');

    });
}

// message after winning
function showSuccess() {
    document.querySelector("p[id='success']").classList.remove('hidden');
    document.querySelector("p[id='error']").classList.add('hidden');
}

// message on losing
function showError() {
    document.querySelector("p[id='success']").classList.add('hidden');
    document.querySelector("p[id='error']").classList.remove('hidden');
}

// hide all messages
function hideNotification() {
    document.querySelector("p[id='success']").classList.add('hidden');
    document.querySelector("p[id='error']").classList.add('hidden');
}

main();