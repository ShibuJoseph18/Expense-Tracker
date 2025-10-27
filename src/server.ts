import app from "./app.js";
import config from "./config/config.js";

async function startServer() {
  try {
    // Start Express server
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
