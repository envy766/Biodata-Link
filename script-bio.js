

/* =========================================================
   NATURAL METEOR SYSTEM
========================================================= */

const meteorCanvas = document.getElementById("meteorCanvas");
const meteorCtx = meteorCanvas.getContext("2d");

let meteors = [];
let meteorWidth = window.innerWidth;
let meteorHeight = window.innerHeight;

function resizeMeteorCanvas() {
  meteorWidth = window.innerWidth;
  meteorHeight = window.innerHeight;

  meteorCanvas.width = meteorWidth;
  meteorCanvas.height = meteorHeight;
}

window.addEventListener("resize", resizeMeteorCanvas);
resizeMeteorCanvas();


class NaturalMeteor {

  constructor() {
    this.reset(true);
  }

  reset(firstSpawn = false) {

    this.x = Math.random() * meteorWidth;
    this.y = -20 - Math.random() * 250;

    const angle = Math.PI / 2 + 0.35;

    this.speed = 5 + Math.random() * 4;

    this.vx =
      Math.cos(angle) *
      this.speed;

    this.vy =
      Math.sin(angle) *
      this.speed;

    this.size =
      1.1 +
      Math.random() * 1.2;

    this.tail =
      45 +
      Math.random() * 40;

    this.alpha =
      0.55 +
      Math.random() * 0.35;

    this.delay =
      firstSpawn
        ? Math.random() * 180
        : Math.random() * 90;
  }


  update() {

    if (this.delay > 0) {
      this.delay--;
      return;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (
      this.y > meteorHeight + 100 ||
      this.x < -150 ||
      this.x > meteorWidth + 150
    ) {
      this.reset();
    }
  }


  draw() {

    if (this.delay > 0)
      return;

    const length = Math.sqrt(
      this.vx * this.vx +
      this.vy * this.vy
    );

    const dirX =
      this.vx / length;

    const dirY =
      this.vy / length;

    const tailX =
      this.x -
      dirX * this.tail;

    const tailY =
      this.y -
      dirY * this.tail;

    const gradient =
      meteorCtx.createLinearGradient(
        tailX,
        tailY,
        this.x,
        this.y
      );

    gradient.addColorStop(
      0,
      "rgba(215,200,144,0)"
    );

    gradient.addColorStop(
      0.45,
      "rgba(215,200,144,0.08)"
    );

    gradient.addColorStop(
      0.75,
      "rgba(255,255,255,0.28)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,255,255,0.9)"
    );

    meteorCtx.save();

    meteorCtx.globalAlpha =
      this.alpha;

    meteorCtx.beginPath();

    meteorCtx.moveTo(
      tailX,
      tailY
    );

    meteorCtx.lineTo(
      this.x,
      this.y
    );

    meteorCtx.lineWidth =
      this.size * 1.4;

    meteorCtx.lineCap =
      "round";

    meteorCtx.strokeStyle =
      gradient;

    meteorCtx.shadowColor =
      "#ffffff";

    meteorCtx.shadowBlur =
      5;

    meteorCtx.stroke();

    meteorCtx.restore();


    const glow =
      meteorCtx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 4
      );

    glow.addColorStop(
      0,
      "rgba(255,255,255,0.9)"
    );

    glow.addColorStop(
      0.4,
      "rgba(255,255,255,0.35)"
    );

    glow.addColorStop(
      1,
      "rgba(215,200,144,0)"
    );

    meteorCtx.beginPath();

    meteorCtx.arc(
      this.x,
      this.y,
      this.size * 4,
      0,
      Math.PI * 2
    );

    meteorCtx.fillStyle =
      glow;

    meteorCtx.fill();


    meteorCtx.save();

    meteorCtx.beginPath();

    meteorCtx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    meteorCtx.fillStyle =
      "#ffffff";

    meteorCtx.shadowColor =
      "#ffffff";

    meteorCtx.shadowBlur =
      7;

    meteorCtx.fill();

    meteorCtx.restore();
  }
}


/* =========================================================
   CREATE METEORS
========================================================= */

for (let i = 0; i < 7; i++) {

  meteors.push(
    new NaturalMeteor()
  );

}


function animateMeteors() {

  meteorCtx.clearRect(
    0,
    0,
    meteorWidth,
    meteorHeight
  );

  meteors.forEach(
    meteor => {

      meteor.update();
      meteor.draw();

    }
  );

  requestAnimationFrame(
    animateMeteors
  );
}

animateMeteors();


/* =========================================================
   GOLDEN DUST / GOLDEN SMOKE
========================================================= */

const goldCanvas =
  document.getElementById("goldDustCanvas");

const goldCtx =
  goldCanvas.getContext("2d");

let goldParticles = [];


/* =========================================================
   CANVAS RESIZE
========================================================= */

function resizeGoldCanvas() {

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  goldCanvas.width =
    window.innerWidth * dpr;

  goldCanvas.height =
    window.innerHeight * dpr;

  goldCanvas.style.width =
    window.innerWidth + "px";

  goldCanvas.style.height =
    window.innerHeight + "px";

  goldCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}

window.addEventListener(
  "resize",
  resizeGoldCanvas
);

resizeGoldCanvas();


/* =========================================================
   GOLD PARTICLE
========================================================= */

class GoldParticle {

  constructor() {
    this.reset(true);
  }


  reset(first = false) {

    const frame =
      document.querySelector(
        ".photo-frame"
      );

    if (!frame)
      return;

    const rect =
      frame.getBoundingClientRect();

    this.centerX =
      rect.left +
      rect.width / 2;

    this.centerY =
      rect.top +
      rect.height / 2;

    const radiusX =
      rect.width / 2 +
      15 +
      Math.random() * 55;

    const radiusY =
      rect.height / 2 +
      15 +
      Math.random() * 55;

    const angle =
      Math.random() *
      Math.PI *
      2;

    this.x =
      this.centerX +
      Math.cos(angle) *
      radiusX;

    this.y =
      this.centerY +
      Math.sin(angle) *
      radiusY;

    this.speed =
      0.20 +
      Math.random() * 0.55;

    this.drift =
      (Math.random() - 0.5) *
      0.30;

    this.phase =
      Math.random() *
      Math.PI *
      2;

    this.phaseSpeed =
      0.012 +
      Math.random() * 0.025;

    this.size =
      0.5 +
      Math.random() * 1.5;

    this.glow =
      4 +
      Math.random() * 8;

    this.alpha =
      0.15 +
      Math.random() * 0.40;

    this.life = 0;

    this.maxLife =
      180 +
      Math.random() * 220;

    this.delay =
      first
        ? Math.random() * 150
        : 0;

    this.currentAlpha = 0;
  }


  update() {

    if (this.delay > 0) {
      this.delay--;
      return;
    }

    this.life++;

    this.y -=
      this.speed;

    this.phase +=
      this.phaseSpeed;

    this.x +=
      this.drift +
      Math.sin(this.phase) *
      0.22;


    let fade = 1;

    if (this.life < 45) {

      fade =
        this.life / 45;

    }


    if (
      this.life >
      this.maxLife - 60
    ) {

      fade =
        (
          this.maxLife -
          this.life
        ) / 60;

    }


    this.currentAlpha =
      this.alpha *
      Math.max(
        0,
        Math.min(
          1,
          fade
        )
      );


    if (
      this.life >=
      this.maxLife
    ) {

      this.reset();

    }

  }


  draw() {

    if (
      this.delay > 0 ||
      this.currentAlpha <= 0
    )
      return;

    goldCtx.save();

    goldCtx.globalAlpha =
      this.currentAlpha;

    goldCtx.shadowColor =
      "#f6d77a";

    goldCtx.shadowBlur =
      this.glow;

    const radius =
      this.size * 4;

    const gradient =
      goldCtx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        radius
      );

    gradient.addColorStop(
      0,
      "rgba(255,248,190,0.95)"
    );

    gradient.addColorStop(
      0.25,
      "rgba(255,220,120,0.65)"
    );

    gradient.addColorStop(
      0.55,
      "rgba(244,201,93,0.25)"
    );

    gradient.addColorStop(
      1,
      "rgba(215,183,91,0)"
    );

    goldCtx.fillStyle =
      gradient;

    goldCtx.beginPath();

    goldCtx.arc(
      this.x,
      this.y,
      radius,
      0,
      Math.PI * 2
    );

    goldCtx.fill();


    goldCtx.fillStyle =
      "#ffe8a0";

    goldCtx.shadowBlur =
      6;

    goldCtx.beginPath();

    goldCtx.arc(
      this.x,
      this.y,
      this.size * 0.7,
      0,
      Math.PI * 2
    );

    goldCtx.fill();

    goldCtx.restore();
  }
}


/* =========================================================
   CREATE GOLD PARTICLES
========================================================= */

function createGoldParticles() {

  goldParticles = [];

  for (let i = 0; i < 75; i++) {

    goldParticles.push(
      new GoldParticle()
    );

  }

}

createGoldParticles();


/* =========================================================
   UPDATE PARTICLES ON RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    createGoldParticles();

  }
);


/* =========================================================
   GOLD DUST ANIMATION
========================================================= */

function animateGoldDust() {

  goldCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  goldParticles.forEach(
    particle => {

      particle.update();
      particle.draw();

    }
  );

  requestAnimationFrame(
    animateGoldDust
  );
}

animateGoldDust();

