import { Pool } from "pg";

// ponytail: single connection pool, no ORM. Dev default = podman postgres:18-alpine.
export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://fp:fp@localhost:5432/fp_toolbox",
});
