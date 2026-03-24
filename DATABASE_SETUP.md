# Database Setup Guide

## Overview
This application uses SQLite with a Node.js/Express backend to manage user data for customers, admins, and owners with image upload, user ID, and password authentication.

## Database Structure

### Tables

#### users
Main user table for all user types:
- `id` - Unique user identifier (auto-generated)
- `name` - User's full name
- `email` - Email address (unique)
- `password` - Hashed password (SHA-256)
- `role` - User role: 'customer', 'admin', or 'owner'
- `avatar` - User avatar/profile image (base64 or URL)
- `phone` - Phone number
- `address` - User's address
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

#### customers
Extended data for customer accounts:
- `id` - Customer record ID
- `user_id` - Reference to users table
- `loyalty_points` - Accumulated loyalty points
- `order_count` - Total orders placed
- `total_spent` - Total amount spent

#### admins
Extended data for admin accounts:
- `id` - Admin record ID
- `user_id` - Reference to users table
- `permissions` - Admin permissions (JSON)
- `department` - Department name

#### owners
Extended data for owner accounts:
- `id` - Owner record ID
- `user_id` - Reference to users table
- `business_name` - Business name
- `business_license` - License number
- `company_registration` - Registration number

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Backend Server
```bash
npm run server
```
The server will start on `http://localhost:5000`

### 3. Run Frontend (in another terminal)
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

### 4. Run Both Together
```bash
npm run dev:all
```
This runs the server and frontend concurrently.

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "customer",
    "avatar": "base64_image_data_or_url"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user_xyz",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "avatar": "..."
    },
    "token": "auth_token_xyz"
  }
  ```

### User Management

#### Get All Users
- **GET** `/api/users`
- **Query Params:** `role` (optional: 'customer', 'admin', 'owner')

#### Get User by ID
- **GET** `/api/users/:id`

#### Update User Profile
- **PUT** `/api/users/:id`
- **Body:** Any fields to update (name, phone, address, avatar)

#### Delete User
- **DELETE** `/api/users/:id`

#### Search Users
- **GET** `/api/users/search/:query`

### Customer Stats

#### Get Customer Stats
- **GET** `/api/customers/:userId/stats`

#### Update Customer Stats
- **PUT** `/api/customers/:userId/stats`
- **Body:**
  ```json
  {
    "orderCount": 5,
    "totalSpent": 1500.00,
    "loyaltyPoints": 150
  }
  ```

## Frontend Service Usage

Use the `databaseService.ts` file in your React components:

```typescript
import { registerUser, loginUser, getUserById, updateUserProfile } from './services/databaseService';

// Register a customer
const result = await registerUser(
  'John Doe',
  'john@example.com',
  'password123',
  'customer',
  'avatar_data'
);

// Login
const loginResult = await loginUser('john@example.com', 'password123');

// Get specific user
const user = await getUserById('user_xyz');

// Update profile
await updateUserProfile('user_xyz', {
  phone: '555-1234',
  address: '123 Main St'
});
```

## Database File Location
The SQLite database is created at: `users.db` in the project root directory.

## Security Notes
- Passwords are hashed using SHA-256
- Use HTTPS in production
- Store authentication tokens securely
- Implement proper validation on the backend
- Use environment variables for sensitive data

## Troubleshooting

### Server won't start
- Ensure port 5000 is not in use
- Check Node.js version (v16+)
- Run `npm install` again

### CORS errors
- Ensure the backend server is running on http://localhost:5000
- Check that the `API_BASE_URL` in databaseService.ts matches

### Database errors
- Delete `users.db` to reset the database
- Check file permissions in the project directory
- Ensure better-sqlite3 is installed correctly

## Example Usage Flows

### Customer Registration & Login Flow
1. User fills registration form
2. Call `registerUser()` with role='customer'
3. Database creates users + customers record
4. User receives auth token
5. Store token and user data in localStorage

### Admin Management Flow
1. Owner/Admin registers new admin with role='admin'
2. Admin can view all users, customers, manage orders
3. Admin permissions stored in admins table
4. Update customer stats after each order

