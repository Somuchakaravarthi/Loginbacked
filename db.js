const sql = require('mssql');
const config = require('./dbConfig');

async function getUsers() {
  try {
    console.log('Config:', config); // Log configuration for debugging
    console.log('Attempting to connect to the database...');
    await sql.connect(config);
    console.log('Connection established.');
    const result = await sql.query`SELECT * FROM Userdata`;
    console.log('Query executed successfully.');
    console.log('check result in localhost');
    return result;
  } catch (err) {
    console.error('SQL error:', err);
    throw err;
  }
}
async function login(username,password){
    try{
        await sql.connect(config);
        const result=await sql.query `SELECT Name,Password FROM Userdata WHERE Name=${username} AND Password=${password}`
        return result.recordset.length > 0;
    }
    catch(err){
        throw err;
    }
}
async function addUser(name,password, email) {
  try {
    await sql.connect(config);
    await sql.query`INSERT INTO Userdata (Name,Password, Email) VALUES (${name},${password},${email})`;
     console.log('Data inserted successfully.');
  } catch (err) {
    console.error('SQL error', err);
    throw err;
  }
}
async function userExists(name) {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Userdata WHERE Name = ${name}`;
    return result.recordset.length > 0; // Returns true if user exists, false otherwise
  } catch (err) {
    console.error('SQL error (userExists):', err);
    throw err;
  }
}
async function emailExists(email){
    try{
        await sql.connect(config);
        const result= await sql.query`Select * FROM Userdata WHERE Email=${email}`
        return result.recordset.length>0;
    }catch(ere){
        throw err;
    }
}
module.exports = {
  getUsers,
  addUser,
  userExists,
  emailExists,
  login
};
