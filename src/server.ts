import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectAndInitializeDatabase } from "./db";
import reviewRoutes from "./routes/reviews";
import userRoutes from "./routes/users";

export const fastify = Fastify({
  logger: true,
});

// allowed origins for CORS (local and prod)
const allowed_origins: string[] = [
  process.env.DEV || "dev",
  process.env.PROD || "prod",
];
await fastify.register(cors, {
  origin: allowed_origins,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// --- ROUTES ---
fastify.register(reviewRoutes);
fastify.register(userRoutes);

// --- Start Server ---
const port = parseInt(process.env.APP_PORT || "3000");
const host: string = process.env.HOST || "0.0.0.0";

async function startServer() {
  try {
    await connectAndInitializeDatabase();

    fastify.listen({ host: host, port: port }, () => {
      console.log(`Listening: ${host}:${port}`);
    });
  } catch (error) {
    console.error("APP: Error: ", error);
    process.exit(1);
  }
}

startServer();
