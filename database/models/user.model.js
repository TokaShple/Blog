import { connection } from "../connection.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export const userSchema = connection.define("user",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false,
    required:true,
    min:[2,"Too Short Name!!!!"]
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false,
    required:true,
    min:[2,"Too Short Name!!!!"]
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,
    required:true,
    min:[8,"Min Length 8 Character!!!!"]
  },
  phone:{
    type:DataTypes.INTEGER,
    allowNull:false,
    required:true,
    len:[11,"Phone Number must be 11 Numbers or more!!"]
  },
  role:{
    type:DataTypes.ENUM,
    allowNull:false,
    values:['admin','user'],
    defaultValue:'user'
  },
  age:{
    type:DataTypes.DATE
  },
  confirmed:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  },
  active:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  },
  profilePicture:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  lastseen:{
    type:DataTypes.DATE,
  },
  changePasswordAt:{
    type:DataTypes.DATE,
  },
  deletedAt:{
    type:DataTypes.DATE,
  },
  reactiveAt:{
    type:DataTypes.DATE,
  },
  codeVerification:{
    type:DataTypes.STRING,
  }
},
{
  timestamps:true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  paranoid:true //ENABLE Soft Delete
})

userSchema.beforeCreate(async (user, options) => {
  try {
    const salt = await bcrypt.genSalt( Number(process.env.Rounds) );
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    console.log("password Hashed correctly....",hashedPassword);
  } catch (error) {
    throw error;
  }
});

userSchema.beforeUpdate(async (user, options) => {
  try {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(parseInt(process.env.Rounds));
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      user.changePasswordAt = new Date();
      console.log("password Hashed correctly....",hashedPassword);
    }
  } catch (error) {
    throw error;
  }
});

connection.sync();