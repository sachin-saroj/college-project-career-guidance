import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.json');
const TEMP_PATH = path.join(__dirname, 'database.json.tmp');

export async function getUsers() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.resources) parsed.resources = [];
    if (!parsed.users) parsed.users = [];
    return parsed;
  } catch (err) {
    return { users: [], resources: [] };
  }
}

export async function saveUsers(data) {
  const dataStr = JSON.stringify(data, null, 2);
  await fs.writeFile(TEMP_PATH, dataStr, 'utf-8');
  await fs.rename(TEMP_PATH, DB_PATH);
}
