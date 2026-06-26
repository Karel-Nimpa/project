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

for (const term of ['errorsarlm', 'lm.LMtest', 'log(PM2.5', 'krige', 'gstat', 'Portfolio III', 'PM2.5 grid']) {
  const idx = text.indexOf(term);
  console.log(term, idx);
  if (idx >= 0) console.log(' ', text.slice(idx, idx + 120).replace(/\n/g, ' '));
}
