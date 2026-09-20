const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function kitRoot(kit) {
  return path.resolve(projectRoot, kit.folder);
}

function workRoot(kit) {
  const root = kitRoot(kit);
  const relocated = path.join(root, 'info');
  return fs.existsSync(relocated) ? relocated : root;
}

function workPath(kit, ...parts) {
  return path.join(workRoot(kit), ...parts);
}

function productionPath(kit, filename) {
  return path.join(kitRoot(kit), filename);
}

function firstExisting(paths) {
  const found = paths.find(p => fs.existsSync(p));
  if (!found) throw new Error(`Required file not found. Checked: ${paths.join('; ')}`);
  return found;
}

module.exports = {kitRoot, workRoot, workPath, productionPath, firstExisting};
