import app from "./app.js";
import config from "./config/config.js";
import { initDB } from "./migrate.js";

async function startServer() {
  try {
    // Run migrations / DB initialization first
    await initDB();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
