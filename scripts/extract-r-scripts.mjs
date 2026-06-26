import fs from 'fs';
import AdmZip from 'adm-zip';

const z = new AdmZip('public/projectdoc/Geostatistics_London.docx');
const xml = z.readAsText('word/document.xml');
const text = xml
  .replace(/<w:tab\/>/g, '\t')
  .replace(/<\/w:p>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const sections = [
  { name: '01_point_pattern_cross_k_and_setup.R', start: 'Rscript for Portfolio I - Part 1' },
  { name: '02_point_pattern_nn_risk_kde.R', start: 'Rscript for Portfolio I - Part 2' },
  { name: '03_cumulative_impact_zones.R', start: 'Rscript for Portfolio II' },
];

const outDir = 'r/geostatistics-london';
fs.mkdirSync(outDir, { recursive: true });

function extractCode(fromMarker, toMarker) {
  let start = text.indexOf(fromMarker);
  if (start < 0) return null;
  // skip TOC line
  start = text.indexOf('\n', start) + 1;
  // find first R-like line
  const codeStart = text.indexOf('install.packages', start);
  const end = toMarker ? text.indexOf(toMarker, codeStart) : text.length;
  if (codeStart < 0 || end < 0) return null;
  return text.slice(codeStart, end).trim() + '\n';
}

const markers = sections.map((s) => s.start);
for (let i = 0; i < sections.length; i++) {
  const code = extractCode(markers[i], markers[i + 1] ?? 'Metric calculation of the top 10 venue types');
  if (!code) {
    console.warn('Missing section:', sections[i].name);
    continue;
  }
  const path = `${outDir}/${sections[i].name}`;
  fs.writeFileSync(path, code);
  console.log('Wrote', path, `(${code.length} chars)`);
}

// Search for Portfolio III/IV scripts
for (const m of ['Portfolio III', 'Portfolio IV', 'Spatial lag', 'regression kriging', 'library(spdep)']) {
  const idx = text.indexOf(m);
  if (idx >= 0) console.log('Found', m, 'at', idx);
}
