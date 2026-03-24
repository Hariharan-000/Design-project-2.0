import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import {
  initializeDatabase,
  createUser,
  authenticateUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getUsersByRole,
  updateCustomerStats,
  getCustomerStats,
  searchUsers,
  hashPassword
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize database
initializeDatabase();

// ============ USER AUTHENTICATION ============

// Register new user
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validRoles = ['customer', 'admin', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = createUser(name, email, password, role, avatar);
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = authenticateUser(email, password);

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// ============ USER MANAGEMENT ============

// Get all users (with optional role filter)
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    let users;

    if (role && typeof role === 'string') {
      const validRoles = ['customer', 'admin', 'owner'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      users = getUsersByRole(role as 'customer' | 'admin' | 'owner');
    } else {
      users = getAllUsers();
    }

    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const user = getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { name, phone, address, avatar } = req.body;

    updateUser(req.params.id, { name, phone, address, avatar });

    const updatedUser = getUserById(req.params.id);
    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', (req: Request, res: Response) => {
  try {
    deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
app.get('/api/users/search/:query', (req: Request, res: Response) => {
  try {
    const users = searchUsers(req.params.query);
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CUSTOMER STATS ============

// Get customer stats
app.get('/api/customers/:userId/stats', (req: Request, res: Response) => {
  try {
    const stats = getCustomerStats(req.params.userId);

    if (!stats) {
      return res.status(404).json({ error: 'Customer stats not found' });
    }

    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer stats
app.put('/api/customers/:userId/stats', (req: Request, res: Response) => {
  try {
    const { orderCount, totalSpent, loyaltyPoints } = req.body;

    updateCustomerStats(req.params.userId, orderCount, totalSpent, loyaltyPoints);

    const stats = getCustomerStats(req.params.userId);
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Database initialized with user management`);
});
