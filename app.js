
const primary = document.getElementById("primary");
const play = document.getElementById("play");
const song = document.getElementById("song");

const imgurl = "https://upload.wikimedia.org/wikipedia/commons/0/0c/Luscinia_luscinia._Svenska_f%C3%A5glar.jpg"

let birds = new Array();
let playing = false;

function play_once() {
    if (!playing) {
        return;
    }
    // Skip past the catalog number:
    song.currentTime = 6;
    // Attach a repeat callback:
    song.addEventListener("ended", play_once);
    // And play:
    song.play();
}


function toggle_play() {
    if (!playing) {
        playing = true;
        play_once()
        play.innerText = "⏸";
        for (const bird of birds) {
            bird.fly();
        }
    } else {
        playing = false;
        song.pause();
        play.innerText = "▶";
    }
}

play.addEventListener("click", toggle_play);

function pct(v) {
    return Math.round(100 * v);
}

// From https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function rand_normal(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function randcoord() {
    return rand_normal(0.5, 0.2);
}

class Bird {
    constructor() {
        // How long it takes to fly to a new location.
        this.flutter = -1;
        while (this.flutter < 0.3) {
            this.flutter = rand_normal(1.2, 0.5);
        }
        this.leave = -1;
        while (this.leave < 0.3) {
            this.leave = rand_normal(5, 2);
        }

        this.element = document.createElement("img");
        this.element.src = imgurl;
        this.element.classList.add("bird");

        // We want to make our fly-in look nice, minimize crossings.
        // Pick our "first target" locations
        // We need to start offscreen:
        const first_x = randcoord();
        const first_y = randcoord();
        // And then advance them offscreen:
        if (first_x < 0.5) {
            this.x = first_x - 2;
        } else {
            this.x = first_x + 2;
        }
        if (first_y < 0.5) {
            this.y = first_y - 2;
        } else {
            this.y = first_y + 2;
        }
        this.update_location();
        // Then set the next target:
        this.x = first_x;
        this.y = first_y;

        primary.appendChild(this.element);

    }

    update_location() {
        this.element.style = `transition-delay: ${this.leave}s; transition-duration: ${this.flutter}s; left: ${pct(this.x)}%; top: ${pct(this.y)}%`;
        this.x = randcoord();
        this.y = randcoord();
    }

    fly() {
        // Call-to-self.
        if (playing) {
            this.element.addEventListener("transitionend", () => {
                this.fly();
            });
            this.update_location()
        }
    }

}

for (let i = 0; i < 10; i++) {
    let b = new Bird();
    birds.push(b);
}


