import "dotenv/config";
import { env } from "./env.js";
import "./firebase";
import { connectMongo } from "./db.js";
import { createApp } from "./app.js";

async function main() {
  await connectMongo();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
