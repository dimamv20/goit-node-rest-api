import app from "./app.js";
import { initializeDatabase } from "./db/sequelize.js";

const { PORT = 3000 } = process.env;

const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
