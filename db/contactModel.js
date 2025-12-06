import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";
import { User } from "./userModel.js";

export const Contact = sequelize.define(
  "contact",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
      owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  },
  {
    tableName: "contacts",
    timestamps: false,
  },
  
);


User.hasMany(Contact, { foreignKey: "owner", as: "contacts" });
Contact.belongsTo(User, { foreignKey: "owner", as: "ownerInfo" });
