const fs = require('node:fs');
const path = require('node:path');

// projects.json is the source; this copy lets file:// previews load it as a script.
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));
if (!Array.isArray(data.projects)) throw new Error('Expected a projects array in projects.json');
fs.writeFileSync(
  path.join(__dirname, 'projects-data.js'),
  '// Generated from projects.json by sync-projects.cjs. Do not edit directly.\n' +
    `window.portfolioProjectData = ${JSON.stringify(data, null, 2)};\n`
);
console.log(`Updated local preview data for ${data.projects.length} projects.`);
