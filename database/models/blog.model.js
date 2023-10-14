import { connection } from "../connection.js";
import { DataTypes } from "sequelize";
import { userSchema } from "./user.model.js";
export const blogSchema = connection.define("blog",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  title:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  userId:{
    type:DataTypes.INTEGER,
    references:{
      model:userSchema,
      key: 'id'
    }
  },

  images:{
    type:DataTypes.JSON,
    defaultValue:[]
  },

  deletedAt: {
    type: DataTypes.DATE, // Add the deletedAt column
    allowNull: true, // Allow null values to indicate the blog is not deleted
  },

},{
  timestamps:true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  paranoid: true, // Enable soft deletes
  deletedAt: "deletedAt", // Specify the column to use for soft deletes
})
userSchema.hasMany(
  blogSchema,
  { 
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  }
);
blogSchema.belongsTo(userSchema);
connection.sync();
