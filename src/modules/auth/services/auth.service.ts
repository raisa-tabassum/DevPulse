import bcrypt from "bcrypt";
import type { RUser, User } from "../../../types";
import { pool } from "../../../db";

class AuthService {
  async createUser(user: RUser & { password: string }) {
    const { name, email, role, password } = user;

    // Validate role
    if (role && !["contributor", "maintainer"].includes(role)) {
      throw new Error("Invalid role");
    }

    const hash = await bcrypt.hash(password, 10);

    const res = await pool.query(
      `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
      RETURNING id, name, email, role, created_at, updated_at
      `,
      [name, email, hash, role],
    );

    return res.rows[0];
  }

  async validateUser(email: string, password: string) {
    const res = await pool.query(
      `
      SELECT id, name, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    if (res.rows.length === 0) {
      return null;
    }

    const { password_hash, ...user } = res.rows[0] as User;
    const isValid = await bcrypt.compare(password, password_hash);
    return isValid ? user : null;
  }

  async getUserById(id: string) {
    const res = await pool.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = $1
      `,
      [id],
    );
    return res.rows[0] as RUser & { id: number };
  }
}

export default new AuthService();
