import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

class Particle {
    /// r - distance from origin
    /// theta - angle from positive z-axis to the point [0, pi]
    /// phi - angle from positive x-axis to the projection of the point into the x-y plane [0, 2pi]
    constructor(r, theta, phi) {
        let x = r * Math.sin(theta) * Math.cos(phi)
        let y = r * Math.sin(theta) * Math.sin(phi)
        let z = r * Math.cos(theta)

        this.pos = { x, y, z }
    }

    // Particle(){
    //   ranCos = random(-1, 1);
    //   radNum = radians(random(360));
    //   float xPos = radius * sqrt(1 - pow(ranCos,2)) * cos(radNum);
    //   float yPos = radius * sqrt(1 - pow(ranCos,2)) * sin(radNum);
    //   float zPos = radius * ranCos;
    //   p = new PVector(xPos, yPos, zPos);
    // }

    update() {}
}

function project(pt, fov_factor) {
    let { x, y, z } = pt

    return {
        x: (fov_factor * x) / z,
        y: (fov_factor * y) / z,
    }
}

const sphericalParticles = {
    defaultParams: {
        radius: 0.5, // relative so screen width

        count: 256,

        size: 1.0,
        color: '#FF0000',
    },

    _particles: [],
    _lastTime: null,

    init({ count, radius }) {
        // create N random particles
        let particles = []
        for (let i = 0; i < count; i++) {
            particles.push(
                new Particle(
                    radius, //
                    Math.random() * Math.PI,
                    Math.random() * 2.0 * Math.PI
                )
            )
        }
        this._particles = particles
        this._lastTime = null
    },

    render(ctx, { width, height, t, size, color }) {
        const dt = t - this._lastTime
        this._lastTime = t

        // Update particles
        // TODO

        // Draw particles
        for (let particle of this._particles) {
            // const alpha = Math.max(p.life / p.maxLife, 0)
            ctx.fillStyle = color
            ctx.beginPath()

            // apply camera position
            const camera_position = { x: 0, y: 0, z: -2 }
            let p = {
                x: particle.pos.x - camera_position.x,
                y: particle.pos.y - camera_position.y,
                z: particle.pos.z - camera_position.z,
            }

            // project to screen
            p = project(p, 640)
            p.x += width / 2.0
            p.y += height / 2.0

            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fill()
        }
    },
}

const mode = 2
const fullSize = [1080, 1080]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const layers = [new Layer({ size: modeSize }, sphericalParticles)]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 10, // seconds
    targetFPS: 24,
    antialias: false,
    layers,
})
await player.loadAndStart()

/*

class Particle{

  void update(){
    noiseDetail(3,0.65);
    noiseNum = noise(p.x*noiseScale, p.y*noiseScale, p.z*noiseScale) * 0.01;

    float sign = 0;
    if (p.y > 0){sign = 1;}
    if (p.y < 0){sign = -1;}
    float aCos = acos(p.z / sqrt(pow(p.x, 2) + pow(p.y,2)+pow(p.z,2)));
    float signAcos = sign * acos(p.x / sqrt(pow(p.x,2)+pow(p.y,2)))+noiseNum;

    p.x = radius * sin(aCos) * cos(signAcos);
    p.y = radius * sin(aCos) * sin(signAcos);
    p.z = radius * cos(aCos) + cos(signAcos)*1.2;

    stroke(255);
    strokeWeight(2);
    point(p.x, p.y, p.z);
  }
}
*/
