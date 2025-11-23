import { UserType } from "../schema";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcrypt";
import { client } from "../db";

export default async function userRoutes(fastify: FastifyInstance) {
  // handle user register
  fastify.post<{ Body: UserType }>("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .code(400)
        .send({ message: "Please provide your email and password" });
    }

    try {
      const existingUser = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );
      if (existingUser.rows.length > 0) {
        return res
          .code(409)
          .send({ message: "Email address already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await client.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
        [email, hashedPassword],
      );

      return res
        .code(201)
        .send({ message: "Registration successful!", user: newUser.rows[0] });
    } catch (error) {
      console.error("Error during registration:", error);
      return res
        .code(500)
        .send({ message: "An error occurred during registration." });
    }
  });

  // handle user login
  fastify.post<{ Body: UserType }>("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const userExists = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      if (userExists.rows.length > 0) {
        const storedPassword = userExists.rows[0].password;
        if (bcrypt.compareSync(password, storedPassword)) {
          res.code(200).send({ message: "Login successful!" });
        } else {
          res.code(500).send({ message: "Authentication failed" });
        }
      } else {
        res.code(500).send({ message: "Authenticaion failed" });
      }
    } catch (error) {
      console.error("Login error");
      return res.code(500).send({ message: "Authenticaion failed" });
    }
  });
}
