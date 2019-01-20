/*
         ***   I DENNA FIL SKA FUNKTIONERA SOM HAR ATT GÖRA MED DATABASEN VARA   ***
*/

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mysql = require('mysql'); // Global databas variabel

// skapa anslutnong
let con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "hej123"
});

// testar och skapar anslutiningen
con.connect(function (err) {
   if (err) throw err;
   console.log("CONNECTED TO DATABASE MANEGER");
});

// HITTA OCH ANSLUT TILL DATABASEN
let conDatabseModule = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "hej123",
   database: "mydb"
});
// OM DATABASEN INTE FINNS SÅ SKAPA DEN
// Se till så att variabeln con har rätt värde
conDatabseModule.connect(function (err) {
   if (err) {
      console.log("CREATING DATABASE");
      createDatabase();
      con = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "hej123",
         database: "mydb"
      });
   }
   console.log("CONNECTED TO DATABASE");
});

// SKAPAR DATABASEN
function createDatabase() {
   con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hej123"
   });
   con.query("CREATE DATABASE mydb", function (err, result) {
      if (err) throw err;
      console.log("DATABASE CREATED");
      createTable();
   });
}

// Skapar tabel
function createTable() {
   con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "hej123",
      database: "mydb"
   });
   console.log("CREATING TABLE");
   let sql = "CREATE TABLE User (Username VARCHAR(255) NOT NULL, UserID int NOT NULL AUTO_INCREMENT, Password VARCHAR(255) NOT NULL, Progress VARCHAR(255), UNIQUE(UserID), PRIMARY KEY(UserID) );";
   con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("TABLE CREATED");
   });
}
con.end();

module.exports = {

   // Create new user
   registerNewUser: function (registrationPasswordInput, registrationUsernameInput) {
      bcrypt.hash(registrationPasswordInput, saltRounds).then(function (hash) {
         conDatabseModule.connect(function (err) {
            let sql = `INSERT INTO User (Username, Password) VALUES ('${registrationUsernameInput}', '${hash}')`;
            conDatabseModule.query(sql, function (err, result, fields) {
               if (err) {
                  throw err;
               } else {
                  console.log("ACCOUNT " + registrationUsernameInput + " REGISTERED");
               }
            });
         });
      });
   },

   connectToDB: function () {
      let con = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "hej123",
         database: "mydb"
      });
      return con;
   },

   validateLogin: async function (loginUsernameInput, loginPasswordInput) {
      let sql = `SELECT Password FROM User WHERE Username = '${loginUsernameInput}'`;
      await conDatabseModule.query(sql, function (err, results) {
         if (err) {
            console.log('Error: Failed to check username, login');
         } else {
            console.log(results);
            console.log(results.length);
            console.log(sql);
            if (results.length === 1) {
               let loginPasswordHash = results[0].Password;
               bcrypt.compare(loginPasswordInput, loginPasswordHash, function (err, res) {
                  if (res) {
                     return true;
                  } else {
                     return false;
                  }
               });
            } else {
               return false;
            }
         }
      });
   } /*,
   // DENNA FUNGERAR EJ https://www.quora.com/How-can-I-check-if-a-username-existed-with-Node-js
   checkIfUsernameTaken: async function (registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput) {
      let sql = `SELECT Username FROM User WHERE Username = '${registrationUsernameInput}'`;
      let result;
      await conDatabseModule.query(sql, function (err, results) {
         if (err) {
            console.log('Error: Failed to check username, register');
         } else {
            console.log(results);
            console.log(results.length);
            console.log(sql);
            result = results.length;
            return result;
         }
      });
   } */ 
}
