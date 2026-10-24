import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure users.json exists
function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading users file:', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users file:', err);
  }
}

export function registerUser({ name, email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(7),
    name: name?.trim() || cleanEmail.split('@')[0],
    email: cleanEmail,
    password: password, // In production, hash with bcrypt
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    isUnlimited: true
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

export function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();

  const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function loginWithGoogle({ name, email, picture, googleId }) {
  if (!email) {
    throw new Error('Google account email is required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();

  let user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Automatically create new Google authenticated user
    user = {
      id: 'google_' + (googleId || Date.now()),
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      picture: picture || null,
      authProvider: 'google',
      createdAt: new Date().toISOString(),
      isUnlimited: true
    };
    users.push(user);
    saveUsers(users);
  } else {
    // Update profile info if changed
    if (name) user.name = name;
    if (picture) user.picture = picture;
    saveUsers(users);
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}
