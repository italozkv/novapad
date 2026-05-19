const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function generateAppKey() {
  return crypto.randomBytes(32).toString('base64url');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const key = generateAppKey();
const keyFile = path.join(__dirname, '..', 'server', 'data', 'app-key.txt');
ensureDir(keyFile);
fs.writeFileSync(keyFile, key + '\n', 'utf8');

console.log(key);
console.log(`Saved to ${keyFile}`);
