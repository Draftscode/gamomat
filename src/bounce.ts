export class Bouncer {

    private gravity = -0.0958;
    private bounceFactor = .8;
    private bouncingSteps = 5;
    private currentBouncingSteps = 0;

    constructor() {

    }

    isActive() {
        return this.currentBouncingSteps < this.bouncingSteps
    }

    next(velocity: number) {
        this.currentBouncingSteps++;
        return -velocity * this.bounceFactor;
    }

    bounce(velocity: number) {


        if (this.currentBouncingSteps < this.bouncingSteps) {
            velocity += this.gravity;
        } else {
            velocity = 0;
        }
        return velocity;
    }
}