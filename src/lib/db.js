import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

export const readDB = () => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

export const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

if (!globalThis.sessions) {
  globalThis.sessions = new Map();
}

export const sessions = globalThis.sessions;