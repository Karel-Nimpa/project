import fs from 'fs';
import path from 'path';

const src = fs.readFileSync('src/data/projects.ts', 'utf8');
const paths = new Set();
const re = /publicAsset\('([^']+)'\)/g;
let m;
while ((m = re.exec(src))) paths.add(m[1]);

const missing = [];
const problematic = [];
for (const p of [...paths].sort()) {
  const full = path.join('public', ...p.split('/'));
  if (!fs.existsSync(full)) missing.push(p);
  const base = p.split('/').pop() ?? '';
  if (/[,()]/.test(base) || /[\u2018\u2019\u2013]/.test(base) || base.endsWith(' .jpg'))
    problematic.push(p);
}

console.log('TOTAL PATHS:', paths.size);
console.log('\nMISSING (' + missing.length + '):');
missing.forEach((p) => console.log(' ', p));
console.log('\nPROBLEMATIC FILENAMES (' + problematic.length + '):');
problematic.forEach((p) => console.log(' ', p));

const dl = [...src.matchAll(/download:\s*"([^"]+)"/g)].map((x) => x[1]);
console.log('\nDOWNLOAD PATHS:');
for (const p of dl) {
  const full = path.join('public', ...p.split('/'));
  console.log(fs.existsSync(full) ? 'OK' : 'MISSING', p);
}

// List public/image top-level
const imgRoot = 'public/image';
if (fs.existsSync(imgRoot)) {
  const dirs = fs.readdirSync(imgRoot);
  console.log('\npublic/image entries:', dirs.length);
}
