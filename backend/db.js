const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const tempPath = path.join(__dirname, 'database.json.tmp');

// Initialize DB file safely if it doesn't exist
const initDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ users: [], resources: [] }, null, 2), 'utf-8');
    } else {
      const dataStr = fs.readFileSync(dbPath, 'utf-8');
      const data = JSON.parse(dataStr);
      if (!data.resources) {
        data.resources = [];
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    console.error("Error initializing database.json:", err);
  }
};

initDB();

// Synchronous fallback read for synchronous callers
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database.json:", err);
    return { users: [], resources: [] };
  }
};

// Atomic write strategy to prevent database corruption during writes
const writeDB = (data) => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, dataStr, 'utf-8');
    fs.renameSync(tempPath, dbPath);
  } catch (err) {
    console.error("Error writing atomically to database.json:", err);
  }
};

// Async non-blocking equivalents
const readDBAsync = async () => {
  try {
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database.json asynchronously:", err);
    return { users: [], resources: [] };
  }
};

const writeDBAsync = async (data) => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(tempPath, dataStr, 'utf-8');
    await fs.promises.rename(tempPath, dbPath);
  } catch (err) {
    console.error("Error writing database.json asynchronously:", err);
  }
};

module.exports = { readDB, writeDB, readDBAsync, writeDBAsync };
