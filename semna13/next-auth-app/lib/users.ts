import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  loginAttempts: number;
  lockedUntil: number | null;
}

export const users: User[] = [];

export async function registerUser(name: string, email: string, password: string) {
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("El usuario ya existe");

  const hashed = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashed,
    loginAttempts: 0,
    lockedUntil: null,
  };
  users.push(user);
  return user;
}

export async function validateUser(email: string, password: string) {
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Usuario no encontrado");

  // Verificar bloqueo
  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const mins = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    throw new Error(`Cuenta bloqueada. Intenta en ${mins} minuto(s)`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 3) {
      user.lockedUntil = Date.now() + 5 * 60 * 1000; // bloqueo 5 min
      user.loginAttempts = 0;
      throw new Error("Demasiados intentos. Cuenta bloqueada por 5 minutos");
    }
    throw new Error(`Contraseña incorrecta. Intentos restantes: ${3 - user.loginAttempts}`);
  }

  user.loginAttempts = 0;
  user.lockedUntil = null;
  return user;
}