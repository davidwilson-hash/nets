const unfoldRange = document.getElementById("unfoldRange");
const resetBtn = document.getElementById("resetBtn");

const base = document.getElementById("base");
const faces = {
  north: document.getElementById("face-north"),
  east: document.getElementById("face-east"),
  south: document.getElementById("face-south"),
  west: document.getElementById("face-west"),
};

const labels = {
  base: document.getElementById("label-base"),
  north: document.getElementById("label-north"),
  east: document.getElementById("label-east"),
  south: document.getElementById("label-south"),
  west: document.getElementById("label-west"),
};

const inspectorTitle = document.getElementById("inspectorTitle");
const inspectorBody = document.getElementById("inspectorBody");

const info = {
  base: {
    title: "Base rectangle",
    body:
      "This rectangle is the foundation of the pyramid. Every triangular face meets along its edges.",
  },
  north: {
    title: "North triangular face",
    body:
      "A triangle attached to the top edge of the base. It meets the apex at the center.",
  },
  east: {
    title: "East triangular face",
    body:
      "A triangle attached to the right edge of the base. Together, the four faces create the peak.",
  },
  south: {
    title: "South triangular face",
    body:
      "A triangle attached to the bottom edge of the base. In the net, it folds outward.",
  },
  west: {
    title: "West triangular face",
    body:
      "A triangle attached to the left edge of the base. Its slant height controls the pyramid height.",
  },
};

const center = { x: 320, y: 220 };
const baseSize = { width: 240, height: 160 };
const slantHeight = 130;

const edges = {
  north: ["topLeft", "topRight", { x: 0, y: -1 }],
  east: ["topRight", "bottomRight", { x: 1, y: 0 }],
  south: ["bottomRight", "bottomLeft", { x: 0, y: 1 }],
  west: ["bottomLeft", "topLeft", { x: -1, y: 0 }],
};

const corners = {};

function setupBase() {
  const { width, height } = baseSize;
  const x = center.x - width / 2;
  const y = center.y - height / 2;
  base.setAttribute("x", x);
  base.setAttribute("y", y);
  base.setAttribute("width", width);
  base.setAttribute("height", height);

  corners.topLeft = { x, y };
  corners.topRight = { x: x + width, y };
  corners.bottomRight = { x: x + width, y: y + height };
  corners.bottomLeft = { x, y: y + height };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPoint(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  };
}

function triangleCentroid(p1, p2, p3) {
  return {
    x: (p1.x + p2.x + p3.x) / 3,
    y: (p1.y + p2.y + p3.y) / 3,
  };
}

function updateNet() {
  const t = Number(unfoldRange.value) / 100;

  Object.entries(edges).forEach(([key, [startKey, endKey, normal]]) => {
    const start = corners[startKey];
    const end = corners[endKey];
    const mid = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
    const apexOut = {
      x: mid.x + normal.x * slantHeight,
      y: mid.y + normal.y * slantHeight,
    };
    const apexFolded = { ...center };
    const apex = lerpPoint(apexFolded, apexOut, t);

    faces[key].setAttribute(
      "points",
      `${start.x},${start.y} ${end.x},${end.y} ${apex.x},${apex.y}`
    );

    const label = labels[key];
    const centroid = triangleCentroid(start, end, apex);
    label.setAttribute("x", centroid.x);
    label.setAttribute("y", centroid.y);
  });

  labels.base.setAttribute("x", center.x);
  labels.base.setAttribute("y", center.y);
}

function clearActive() {
  base.classList.remove("active");
  Object.values(faces).forEach((face) => face.classList.remove("active"));
}

function activateFace(key) {
  clearActive();
  if (key === "base") {
    base.classList.add("active");
  } else {
    faces[key].classList.add("active");
  }
  inspectorTitle.textContent = info[key].title;
  inspectorBody.textContent = info[key].body;
}

setupBase();
updateNet();

unfoldRange.addEventListener("input", updateNet);
resetBtn.addEventListener("click", () => {
  unfoldRange.value = "20";
  updateNet();
  activateFace("base");
});

base.addEventListener("click", () => activateFace("base"));
Object.entries(faces).forEach(([key, face]) => {
  face.addEventListener("click", () => activateFace(key));
});

activateFace("base");
