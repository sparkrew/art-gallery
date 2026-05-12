// Top-left → bottom-right random mosaic fill (no grid)
// Click or press R to regenerate.

var sketch = function(p) {

  let tiles = [];

  const TILE_R = 10;
  const GAP = .01;
  const PADDING = 20;

  const BG = "#8f8f8f";
  const TILE_COLOR = "#1e5cff";

  const CANDIDATE_MULT = 100;
  const HOLE_SAMPLES = 3500;
  const HOLE_ADDS_MULT = 0.9;
  const RELAX_ITERS = 80;

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    p.pixelDensity(2);
    p.noLoop();
    generateMural();
  };

  p.draw = function() {
    p.background(BG);
    p.noStroke();
    p.fill(TILE_COLOR);

    for (const t of tiles) {
      p.push();
      p.translate(t.x, t.y);
      p.rotate(t.rot);
      p.beginShape();
      for (const pt of t.poly) p.vertex(pt.x, pt.y);
      p.endShape(p.CLOSE);
      p.pop();
    }
  };

  p.mousePressed = function() { regenerate(); };
  p.keyPressed = function() { if (p.key === 'r' || p.key === 'R') regenerate(); };

  function regenerate() {
    generateMural();
    p.redraw();
  }

  function generateMural() {
    tiles = [];

    const minX = PADDING + TILE_R;
    const maxX = p.width - PADDING - TILE_R;
    const minY = PADDING + TILE_R;
    const maxY = p.height - PADDING - TILE_R;

    const minDist = 2 * TILE_R + GAP;
    const area = (maxX - minX) * (maxY - minY);
    const baseCount = area / (minDist * minDist);

    let centers = scanFillCenters(
      minX, maxX, minY, maxY,
      minDist,
      p.floor(baseCount * CANDIDATE_MULT)
    );

    centers = fillHoles(
      centers,
      minX, maxX, minY, maxY,
      minDist,
      p.floor(baseCount * HOLE_ADDS_MULT)
    );

    centers = relaxRepelOnly(
      centers,
      minX, maxX, minY, maxY,
      minDist,
      RELAX_ITERS
    );

    for (const c of centers) {
      tiles.push({
        x: c.x,
        y: c.y,
        rot: p.random(p.TWO_PI),
        poly: generateConvexTile(TILE_R)
      });
    }
  }

  function scanFillCenters(minX, maxX, minY, maxY, minDist, candidateCount) {
    const candidates = [];
    for (let i = 0; i < candidateCount; i++) {
      candidates.push({ x: p.random(minX, maxX), y: p.random(minY, maxY) });
    }

    candidates.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

    const cell = minDist;
    const minDistSq = minDist * minDist;

    const pts = [];
    const hash = new Map();

    addPoint({ x: minX, y: minY }, pts, hash, cell);

    for (const c of candidates) {
      if (farEnoughHash(c.x, c.y, pts, hash, cell, minDistSq)) {
        addPoint(c, pts, hash, cell);
      }
    }

    return pts;
  }

  function addPoint(pt, pts, hash, cell) {
    const idx = pts.length;
    pts.push(pt);

    const gx = p.floor(pt.x / cell);
    const gy = p.floor(pt.y / cell);
    const key = gx + "," + gy;

    if (!hash.has(key)) hash.set(key, []);
    hash.get(key).push(idx);
  }

  function farEnoughHash(x, y, pts, hash, cell, minDistSq) {
    const gx = p.floor(x / cell);
    const gy = p.floor(y / cell);

    for (let ix = gx - 1; ix <= gx + 1; ix++) {
      for (let iy = gy - 1; iy <= gy + 1; iy++) {
        const bucket = hash.get(ix + "," + iy);
        if (!bucket) continue;

        for (const idx of bucket) {
          const pt = pts[idx];
          const dx = pt.x - x, dy = pt.y - y;
          if (dx * dx + dy * dy < minDistSq) return false;
        }
      }
    }
    return true;
  }

  function fillHoles(pts, minX, maxX, minY, maxY, minDist, maxAdds) {
    const cell = minDist;

    for (let add = 0; add < maxAdds; add++) {
      const hash = buildHash(pts, cell);

      let best = null;
      let bestD2 = -1;

      for (let s = 0; s < HOLE_SAMPLES; s++) {
        const x = p.random(minX, maxX);
        const y = p.random(minY, maxY);
        const d2 = nearestDist2(x, y, pts, hash, cell);

        if (d2 > bestD2) {
          bestD2 = d2;
          best = { x, y };
        }
      }

      if (!best) break;
      if (p.sqrt(bestD2) < minDist) break;

      pts.push(best);
    }

    return pts;
  }

  function buildHash(pts, cell) {
    const map = new Map();
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      const gx = p.floor(pt.x / cell);
      const gy = p.floor(pt.y / cell);
      const key = gx + "," + gy;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(i);
    }
    return map;
  }

  function nearestDist2(x, y, pts, hash, cell) {
    if (pts.length === 0) return Infinity;

    const cx = p.floor(x / cell);
    const cy = p.floor(y / cell);
    let best = Infinity;

    for (let r = 0; r < 18; r++) {
      for (let gx = cx - r; gx <= cx + r; gx++) {
        for (let gy = cy - r; gy <= cy + r; gy++) {
          if (p.abs(gx - cx) !== r && p.abs(gy - cy) !== r) continue;

          const bucket = hash.get(gx + "," + gy);
          if (!bucket) continue;

          for (const idx of bucket) {
            const pt = pts[idx];
            const dx = pt.x - x, dy = pt.y - y;
            const d2 = dx * dx + dy * dy;
            if (d2 < best) best = d2;
          }
        }
      }
      if (best < Infinity && r * cell > p.sqrt(best) + cell) break;
    }

    return best;
  }

  function relaxRepelOnly(pts, minX, maxX, minY, maxY, minDist, iters) {
    const cell = minDist;
    const minDistSq = minDist * minDist;
    const pushK = 0.18;

    for (let it = 0; it < iters; it++) {
      const hash = buildHash(pts, cell);
      const next = pts.map(pt => ({ x: pt.x, y: pt.y }));

      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        let fx = 0, fy = 0;

        const gx = p.floor(pt.x / cell);
        const gy = p.floor(pt.y / cell);

        for (let ix = gx - 1; ix <= gx + 1; ix++) {
          for (let iy = gy - 1; iy <= gy + 1; iy++) {
            const bucket = hash.get(ix + "," + iy);
            if (!bucket) continue;

            for (const j of bucket) {
              if (j === i) continue;
              const q = pts[j];

              const dx = pt.x - q.x;
              const dy = pt.y - q.y;
              const d2 = dx * dx + dy * dy;
              if (d2 === 0 || d2 >= minDistSq) continue;

              const d = p.sqrt(d2);
              const overlap = (minDist - d);
              const ux = dx / d;
              const uy = dy / d;

              fx += ux * overlap * pushK;
              fy += uy * overlap * pushK;
            }
          }
        }

        next[i].x = p.constrain(pt.x + fx, minX, maxX);
        next[i].y = p.constrain(pt.y + fy, minY, maxY);
      }

      pts = next;
    }

    return pts;
  }

  function generateConvexTile(radius) {
    for (let attempt = 0; attempt < 300; attempt++) {
      const m = p.floor(p.random(10, 22));
      const pts = [];

      for (let i = 0; i < m; i++) {
        const a = p.random(p.TWO_PI);
        const r = radius * 1.2 * p.sqrt(p.random());
        pts.push({ x: r * p.cos(a), y: r * p.sin(a) });
      }

      let hull = convexHull(pts);
      if (hull.length < 3 || hull.length > 7) continue;

      hull = normalizeToRadius(hull, radius);

      if (sideRatio(hull) > 5.0) continue;
      if (minSide(hull) < radius * 0.25) continue;

      return hull;
    }

    return regularPoly(p.floor(p.random(3, 8)), radius);
  }

  function regularPoly(n, radius) {
    const pts = [];
    const start = p.random(p.TWO_PI);
    for (let i = 0; i < n; i++) {
      const a = start + i * p.TWO_PI / n;
      pts.push({ x: radius * p.cos(a), y: radius * p.sin(a) });
    }
    return pts;
  }

  function centroid(pts) {
    let cx = 0, cy = 0;
    for (const pt of pts) { cx += pt.x; cy += pt.y; }
    return { x: cx / pts.length, y: cy / pts.length };
  }

  function normalizeToRadius(pts, radius) {
    const c = centroid(pts);
    let maxD = 0;

    const centered = pts.map(pt => {
      const x = pt.x - c.x;
      const y = pt.y - c.y;
      maxD = p.max(maxD, p.sqrt(x * x + y * y));
      return { x, y };
    });

    const s = (maxD > 0) ? (radius / maxD) : 1;
    return centered.map(pt => ({ x: pt.x * s, y: pt.y * s }));
  }

  function sideRatio(poly) {
    let mn = Infinity, mx = 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const d = p.dist(a.x, a.y, b.x, b.y);
      mn = p.min(mn, d);
      mx = p.max(mx, d);
    }
    return mx / mn;
  }

  function minSide(poly) {
    let mn = Infinity;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      mn = p.min(mn, p.dist(a.x, a.y, b.x, b.y));
    }
    return mn;
  }

  function convexHull(points) {
    if (points.length <= 1) return points.slice();

    const pts = points.slice().sort((a, b) => (a.x === b.x) ? a.y - b.y : a.x - b.x);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const lower = [];
    for (const pt of pts) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) {
        lower.pop();
      }
      lower.push(pt);
    }

    const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const pt = pts[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) {
        upper.pop();
      }
      upper.push(pt);
    }

    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

};
