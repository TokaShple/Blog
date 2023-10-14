import {Sequelize} from "sequelize";
export const connection  = new Sequelize ("blog","root","",{
    host:"localhost",
    dialect:"mysql"
})
try {
  await connection.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
