const path = require('node:path');
const { app } = require('electron');
const { NovaPadDatabase } = require('./Database');

let instance = null;

function getDbPaths() {
  const userDataPath = app.getPath('userData');
  return {
    dbPath: path.join(userDataPath, 'novapad.sqlite3'),
    schemaPath: path.join(__dirname, 'novapad_schema.sql'),
  };
}

function initializeDatabase() {
  if (instance) return instance;
  const paths = getDbPaths();
  instance = new NovaPadDatabase(paths).init();
  return instance;
}

function getDatabase() {
  return instance || initializeDatabase();
}

function closeDatabase() {
  if (!instance) return;
  instance.close();
  instance = null;
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  getDbPaths,
};
