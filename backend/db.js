const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

// Initialize DB file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], resources: [] }), 'utf-8');
} else {
  // Ensure resources array exists for existing dbs
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (!data.resources) {
    data.resources = [];
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readDB, writeDB };
