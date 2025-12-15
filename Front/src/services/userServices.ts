import { compare, hash } from "bcryptjs";
import JWT from "jsonwebtoken";
import pool from "./db";


export const createUser = async (name: string, email: string, password: string) => {
  const client = await pool.connect();

  try {
    const existingEmail = await client.query(
      `SELECT id FROM "User" WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()]
    );

    if (existingEmail.rowCount && existingEmail.rowCount > 0) return null;

    const hashedPassword = await hash(password, 10);

    const result = await client.query(
  `INSERT INTO "User" ("name", "email", "password", "createdAt", "updatedAt")
   VALUES ($1, $2, $3, NOW(), NOW())
   RETURNING "id", "name", "email"`,
  [name, email.toLowerCase(), hashedPassword]
);

    return result.rows[0] ?? null;
  } finally {
    client.release();
  }
};

export const logUser = async (email: string, password: string) => {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      `SELECT * FROM "User" WHERE email = $1 LIMIT 1`,
      [email]
    );

    const user = userResult.rows[0];
    if (!user) return null;

    const validPassword = await compare(password, user.password);
    if (!validPassword) return null;

    const token = JWT.sign(
      { id: user.id, email: user.email, admin: user.admin },
      process.env.JWT_SECRET_KEY as string
    );

    await client.query(
      `UPDATE "User" SET token = $1 WHERE id = $2`,
      [token, user.id]
    );

    return token;
  } finally {
    client.release();
  }
};

export const getUserIdByToken = async (token: string) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id FROM "User" WHERE token = $1 LIMIT 1`,
      [token]
    );

    return result.rows[0]?.id ?? null;
  } finally {
    client.release();
  }
};
