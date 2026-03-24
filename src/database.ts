import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database(path.join(__dirname, '../users.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Hash password function
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create tables
export function initializeDatabase() {
  // Users table (for all user types: customer, admin, owner)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'admin', 'owner')),
      avatar TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      loyalty_points INTEGER DEFAULT 0,
      order_count INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      permissions TEXT,
      department TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS owners (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      business_name TEXT,
      business_license TEXT,
      company_registration TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('Database initialized successfully');
}

// User management functions
export function createUser(name: string, email: string, password: string, role: 'customer' | 'admin' | 'owner', avatar?: string) {
  const id = 'user_' + crypto.randomBytes(8).toString('hex');
  const hashedPassword = hashPassword(password);

  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, email, hashedPassword, role, avatar || null);

    // Create role-specific record
    if (role === 'customer') {
      const custId = 'cust_' + crypto.randomBytes(8).toString('hex');
      db.prepare('INSERT INTO customers (id, user_id) VALUES (?, ?)').run(custId, id);
    } else if (role === 'admin') {
      const adminId = 'admin_' + crypto.randomBytes(8).toString('hex');
      db.prepare('INSERT INTO admins (id, user_id) VALUES (?, ?)').run(adminId, id);
    } else if (role === 'owner') {
      const ownerId = 'owner_' + crypto.randomBytes(8).toString('hex');
      db.prepare('INSERT INTO owners (id, user_id) VALUES (?, ?)').run(ownerId, id);
    }

    return { id, name, email, role };
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

export function authenticateUser(email: string, password: string) {
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, hashedPassword);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  return user;
}

export function getUserById(id: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function updateUser(id: string, updates: { name?: string; phone?: string; address?: string; avatar?: string }) {
  const validKeys = ['name', 'phone', 'address', 'avatar'];
  const keys = Object.keys(updates).filter(k => validKeys.includes(k));
  
  if (keys.length === 0) return;

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => (updates as any)[k]);

  db.prepare(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
}

export function deleteUser(id: string) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export function getAllUsers(role?: string) {
  if (role) {
    return db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC').all(role);
  }
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
}

export function getUsersByRole(role: 'customer' | 'admin' | 'owner') {
  return db.prepare('SELECT * FROM users WHERE role = ?').all(role);
}

export function updateCustomerStats(userId: string, orderCount: number, totalSpent: number, loyaltyPoints: number) {
  db.prepare(`
    UPDATE customers 
    SET order_count = ?, total_spent = ?, loyalty_points = ?
    WHERE user_id = ?
  `).run(orderCount, totalSpent, loyaltyPoints, userId);
}

export function getCustomerStats(userId: string) {
  return db.prepare('SELECT * FROM customers WHERE user_id = ?').get(userId);
}

export function searchUsers(query: string) {
  return db.prepare(`
    SELECT * FROM users 
    WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
    ORDER BY created_at DESC
  `).all(`%${query}%`, `%${query}%`, `%${query}%`);
}

export default db;
