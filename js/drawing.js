const BRUSH_RADIUS = 4;

let curves = [];
let drawing = false;
let needsRepaint = false;

// curves and figures
function circle(point) {
  ctx.beginPath();
  ctx.arc(...point, BRUSH_RADIUS / 2, 0, 2 * Math.PI);
  ctx.fill();
}

function smoothCurveBetween(p1, p2) {
  // Bezier control point
  const cp = p1.map((coord, idx) => (coord + p2[idx]) / 2);
  ctx.quadraticCurveTo(...p1, ...cp);
}

// установка цвета линии по клику на выбранный цвет
function getColor(el) {
  switch (el) {
    case "red":
      ctx.fillStyle = "#ea5d56";
      ctx.strokeStyle = "#ea5d56";
      break;
    case "yellow":
      ctx.fillStyle = "#f3d135";
      ctx.strokeStyle = "#f3d135";
      break;
    case "green":
      ctx.fillStyle = "#6cbe47";
      ctx.strokeStyle = "#6cbe47";
      break;
    case "blue":
      ctx.fillStyle = "#53a7f5";
      ctx.strokeStyle = "#53a7f5";
      break;
    case "purple":
      ctx.fillStyle = "#b36ade";
      ctx.strokeStyle = "#b36ade";
      break;
  }
}

let menuColor = mainInterface.querySelectorAll('.draw-tools input');

for (colors of menuColor) {
  colors.addEventListener("click", (e) => {
    getColor(e.target.value);
  });
}

function smoothCurve(points) {
  ctx.beginPath();
  ctx.lineWidth = BRUSH_RADIUS;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.moveTo(...points[0]);

  for (let i = 1; i < points.length - 1; i++) {
    smoothCurveBetween(points[i], points[i + 1]);
  }

  ctx.stroke();
}

function makePoint(x, y) {
  return [x, y];
};

function createCanvas() {
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.style.top = `${image.offsetTop}px`;
  canvas.style.left = `${image.offsetLeft}px`;
  canvas.classList.add('canvas');
  imageWrap.appendChild(canvas);
}

function draw() {
  createCanvas();

  // default color
  ctx.fillStyle = "#6cbe47";
  ctx.strokeStyle = "#6cbe47";

  canvas.addEventListener("mousedown", (evt) => {
    drawing = true;
    undone = []; // reset the undone stack

    const curve = []; // create a new curve

    curve.push(makePoint(evt.offsetX, evt.offsetY)); // add a new point
    curves.push(curve); // add the curve to the array of curves
    needsRepaint = true;
  });

  canvas.addEventListener("mouseup", (evt) => {
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener("mouseleave", (evt) => {
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener("mousemove", (evt) => {
    if (drawing) {
      // add a point
      const point = makePoint(evt.offsetX, evt.offsetY)
      curves[curves.length - 1].push(point);
      needsRepaint = true;
    }
  });
}

// cancel action last drawing
document.addEventListener('keydown', function (evt) {
  if (evt.ctrlKey && evt.keyCode === 90) {
    curves.pop();
    repaint();
  }
})


// rendering
function repaint() {
  // clear before repainting
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  curves
    .forEach((curve) => {
      // first...
      circle(curve[0]);

      // the body is compraised of lines
      smoothCurve(curve);
    });
}

function tick() {
  if (needsRepaint) {
    repaint();
    needsRepaint = false;
  }

  window.requestAnimationFrame(tick);
}

tick();
