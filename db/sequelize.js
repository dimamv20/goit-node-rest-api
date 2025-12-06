import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "db_contacts_yjyf",
  "db_contacts_yjyf_user",
  "cNUT0ZHJD0YRBTyVa1QehE172EiWEQ0D",
  {
    host: "dpg-d4pnc2idbo4c73be4pj0-a.virginia-postgres.render.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);



export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};
