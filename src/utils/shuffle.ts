import { Coordinates } from "../tile";

export function shuffleMatrix(matrix: Coordinates): Coordinates {
    const shuffledMatrix = [...matrix];
    for (let i = shuffledMatrix.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledMatrix[i], shuffledMatrix[j]] = [shuffledMatrix[j], shuffledMatrix[i]];
    }
    return shuffledMatrix;
}