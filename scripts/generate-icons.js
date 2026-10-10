const fs = require('fs');
const path = require('path');
const { createPng } = require('./png-encoder');

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projX = ax + t * dx;
  const projY = ay + t * dy;
  return Math.hypot(px - projX, py - projY);
}

function signedDistToRoundedBox(px, py, cx, cy, w, h, r) {
  const qx = Math.abs(px - cx) - w / 2 + r;
  const qy = Math.abs(py - cy) - h / 2 + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function getLetterCoverage(nx, ny) {
  const sw = 4.4; // Stroke half-width

  // --- LETTER P ---
  // Spine: (23, 25) to (23, 75)
  const dPSpine = distToSegment(nx, ny, 23, 25, 23, 75);

  // Top horizontal bar: (23, 25) to (36, 25)
  const dPTop = distToSegment(nx, ny, 23, 25, 36, 25);

  // Mid horizontal bar: (23, 49) to (36, 49)
  const dPMid = distToSegment(nx, ny, 23, 49, 36, 49);

  // Arc loop: semicircle from (36, 25) to (36, 49), centered at (36, 37) with radius 12
  let dPArc = 999;
  if (nx >= 36) {
    dPArc = Math.abs(Math.hypot(nx - 36, ny - 37) - 12);
  }

  const dP = Math.min(dPSpine, dPTop, dPMid, dPArc);

  // --- LETTER M ---
  // Left vertical leg: (54, 25) to (54, 75)
  const dMLeft = distToSegment(nx, ny, 54, 25, 54, 75);

  // Right vertical leg: (84, 25) to (84, 75)
  const dMRight = distToSegment(nx, ny, 84, 25, 84, 75);

  // Left diagonal: (54, 25) to (69, 56)
  const dMDiag1 = distToSegment(nx, ny, 54, 25, 69, 56);

  // Right diagonal: (84, 25) to (69, 56)
  const dMDiag2 = distToSegment(nx, ny, 84, 25, 69, 56);

  const dM = Math.min(dMLeft, dMRight, dMDiag1, dMDiag2);

  const minDist = Math.min(dP, dM);

  // Anti-aliased smooth edge
  return Math.max(0, Math.min(1, (sw - minDist) / 1.1 + 0.5));
}

function renderIcon(size, isMaskable = false, cornerRadiusRatio = 0.22) {
  const pixelFn = (x, y, w, h) => {
    const px = x / w;
    const py = y / h;
    const distFromCenter = Math.hypot(px - 0.45, py - 0.45);

    let bgR = Math.round(15 + (30 - 15) * ((px + py) / 2));
    let bgG = Math.round(23 + (41 - 23) * ((px + py) / 2));
    let bgB = Math.round(42 + (59 - 42) * ((px + py) / 2));

    // Subtle blue radial glow
    const glow = Math.max(0, 1 - distFromCenter * 1.4) * 0.22;
    bgR = Math.round(bgR + 37 * glow);
    bgG = Math.round(bgG + 99 * glow);
    bgB = Math.round(bgB + 235 * glow);

    // Alpha for corner rounding
    let bgAlpha = 1;
    if (!isMaskable && cornerRadiusRatio > 0) {
      const r = w * cornerRadiusRatio;
      const d = signedDistToRoundedBox(x + 0.5, y + 0.5, w / 2, h / 2, w, h, r);
      bgAlpha = Math.max(0, Math.min(1, 0.5 - d));
    }

    if (bgAlpha <= 0) return [0, 0, 0, 0];

    // Normalized letter coordinates (0..100)
    let nx = px * 100;
    let ny = py * 100;

    if (isMaskable) {
      // Android safe zone is 80%, so scale letters by 0.72 towards center (50, 50)
      nx = (nx - 50) / 0.72 + 50;
      ny = (ny - 50) / 0.72 + 50;
    }

    let letterCov = 0;
    if (nx >= 0 && nx <= 100 && ny >= 0 && ny <= 100) {
      letterCov = getLetterCoverage(nx, ny);
    }

    const finalR = Math.round(bgR * (1 - letterCov) + 255 * letterCov);
    const finalG = Math.round(bgG * (1 - letterCov) + 255 * letterCov);
    const finalB = Math.round(bgB * (1 - letterCov) + 255 * letterCov);
    const finalA = Math.round(bgAlpha * 255);

    return [finalR, finalG, finalB, finalA];
  };

  return createPng(size, size, pixelFn);
}

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

console.log('Generating crisp PWA icons...');
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), renderIcon(192, false, 0.22));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), renderIcon(512, false, 0.22));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), renderIcon(192, true, 0));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), renderIcon(512, true, 0));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), renderIcon(180, false, 0));
fs.writeFileSync(path.join(iconsDir, 'favicon-48x48.png'), renderIcon(48, false, 0.22));

const png48 = renderIcon(48, false, 0.22);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);

const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(48, 0);
icoEntry.writeUInt8(48, 1);
icoEntry.writeUInt8(0, 2);
icoEntry.writeUInt8(0, 3);
icoEntry.writeUInt16LE(1, 4);
icoEntry.writeUInt16LE(32, 6);
icoEntry.writeUInt32LE(png48.length, 8);
icoEntry.writeUInt32LE(22, 12);

const icoFile = Buffer.concat([icoHeader, icoEntry, png48]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoFile);

console.log('All icons generated successfully!');
