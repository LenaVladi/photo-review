const BRUSH_RADIUS = 4;

let nodeCanvas;
let ctx;

let curves = [];
let undone = [];
let drawing = false;
let needsRepaint = false;
let color = "#6cbe47";

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

let menu__color = document.querySelectorAll("input.menu__color");

for (colors of menu__color) {
  colors.addEventListener("click", (e) => {
    switch (e.target.value) {
      case "red":
        color = "#ea5d56";
        break;
      case "yellow":
        color = "#f3d135";
        break;
      case "green":
        color = "#6cbe47";
        break;
      case "blue":
        color = "#53a7f5";
        break;
      case "purple":
        color = "#b36ade";
        break;
    }
  });
}

function smoothCurve(points) {
  ctx.beginPath();
  ctx.lineWidth = BRUSH_RADIUS;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = color;

  ctx.moveTo(...points[0]);

  for (let i = 1; i < points.length - 1; i++) {
    smoothCurveBetween(points[i], points[i + 1]);
  }

  ctx.stroke();
  // ctx.closePath();
}

function makePoint(x, y) {
  return [x, y];
};

modeDraw.addEventListener("click", () => {
  nodeCanvas = wrapApp.querySelector(".canvas");
  ctx = nodeCanvas.getContext("2d");

  nodeCanvas.addEventListener("mousedown", (evt) => {
    drawing = true;
    undone = []; // reset the undone stack

    const curve = []; // create a new curve

    curve.push(makePoint(evt.offsetX, evt.offsetY)); // add a new point
    curves.push(curve); // add the curve to the array of curves
    needsRepaint = true;
  });

  nodeCanvas.addEventListener("mouseup", (evt) => {
    drawing = false;
    ctx.closePath();
  });

  nodeCanvas.addEventListener("mouseleave", (evt) => {
    drawing = false;
    ctx.closePath();
  });

  nodeCanvas.addEventListener("mousemove", (evt) => {
    if (drawing) {
      // add a point
      const point = makePoint(evt.offsetX, evt.offsetY)
      curves[curves.length - 1].push(point);
      needsRepaint = true;
    }
  });
});

// rendering
function repaint() {
  // clear before repainting
  ctx.clearRect(0, 0, wrapApp.width, wrapApp.height);

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
