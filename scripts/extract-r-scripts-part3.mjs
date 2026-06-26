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

const outDir = 'r/geostatistics-london';

const regAnchor = text.indexOf('errorsarlm(');
const interpStart = text.indexOf('for(pkg', regAnchor);

console.log('regAnchor', regAnchor, 'interpStart', interpStart);

// Part III: find install.packages block before errorsarlm but after portfolio II script
const slice = text.slice(140000, regAnchor);
const rel = slice.lastIndexOf('install.packages');
const regStart = rel >= 0 ? 140000 + rel : text.lastIndexOf('library(spdep)', regAnchor);

if (regStart > 0 && interpStart > regStart) {
  fs.writeFileSync(`${outDir}/04_spatial_regression_pm25.R`, text.slice(regStart, interpStart).trim() + '\n');
  console.log('Wrote 04', interpStart - regStart, 'from', regStart);
}

if (interpStart > 0) {
  const end = text.indexOf('Metric calculation of the top 10 venue types', interpStart);
  const sliceEnd = end > interpStart ? end : text.length;
  fs.writeFileSync(`${outDir}/05_geostatistical_interpolation_pm25.R`, text.slice(interpStart, sliceEnd).trim() + '\n');
  console.log('Wrote 05', sliceEnd - interpStart);
}
