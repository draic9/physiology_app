import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DATABASE_FILE = 'database.db';

export const getDatabaseConnection = async () => {
  return open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
  });
};

export const createTable = async () => {
  const db = await getDatabaseConnection();
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);
  await db.close();
};

export const getUsers = async () => {
  const db = await getDatabaseConnection();
  const users = await db.all('SELECT * FROM users');
  await db.close();
  return users;
};

export const addUser = async (name: string, email: string) => {
  const db = await getDatabaseConnection();
  await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  await db.close();
};