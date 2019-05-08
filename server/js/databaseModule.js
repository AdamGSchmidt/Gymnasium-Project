/*
 ***   I DENNA FIL SKA FUNKTIONERA SOM HAR ATT GÖRA MED DATABASEN VARA   ***
 */

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mysql = require('mysql'); // Global databas variabel
const skins = require('../../skins.json');

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
   let sql = `CREATE TABLE User (
   Username VARCHAR(255) NOT NULL, 
   UserID int NOT NULL AUTO_INCREMENT, 
   Password VARCHAR(255) NOT NULL, 
   Projectiles int,
   Obliterations int,
   Currency int,
   Experience int,
   Level int,
   Games int,
   HighScore int,
   ScoreSum int,
   UNIQUE(UserID), 
   PRIMARY KEY(UserID) );`;
   con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("TABLE CREATED");
   });
   console.log("CREATING TABLE");
   sql = `CREATE TABLE Skins (
   Name VARCHAR(255) NOT NULL, 
   ID int NOT NULL, 
   Requierment int NOT NULL,
   Cost int NOT NULL,
   Color VARCHAR(255) NOT NULL,
   PRIMARY KEY(ID) );`;
   con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("TABLE CREATED");
   });
   con.end();
}

const insertLoadout = () => {
   let sql;
   sql = 'TRUNCATE TABLE Skins';
   conDatabseModule.query(sql, function (err, result, fields) {
      if (err) {
         console.log("ERROR WHILE DELETINNG SKINS");
         console.log(err);
      } else {
      }
   });
   for (let index = 0; index < skins.length; index++) {
      sql = `INSERT INTO Skins (Name, ID, Requierment, Cost, Color) VALUES ('${skins[index].name}', '${skins[index].id}', ${skins[index].requierment}, ${skins[index].cost}, '${skins[index].color}')`;
      conDatabseModule.query(sql, function (err, result, fields) {
         if (err) {
            console.log("ERROR WHILE INSERTING skins");
            console.log(err);
         } else {
         }
      });
   }
}

insertLoadout();


con.end();

module.exports = {

   // Create new users
   registerNewUser: (registrationPasswordInput, registrationUsernameInput) => {
      bcrypt.hash(registrationPasswordInput, saltRounds).then(function (hash) {
         conDatabseModule.connect(function (err) {
            let sql = `INSERT INTO User (Username, Password, Projectiles, Obliterations, Currency, Experience, Games, HighScore, ScoreSum, Level) VALUES ('${registrationUsernameInput}', '${hash}', ${0}, ${0}, ${0} , ${0}, ${0} , ${0}, ${0}, ${1})`;
            conDatabseModule.query(sql, function (err, result, fields) {
               if (err) {
                  console.log("REGISTATION FAILED");
                  console.log(err);
               } else {
                  console.log("ACCOUNT " + registrationUsernameInput + " REGISTERED");
               }
            });
         });
      });
   },

   connectToDB: () => {
      let con = mysql.createConnection({
         host: "localhost",
         user: "root",
         password: "hej123",
         database: "mydb"
      });
      return con;
   },

   updateUserProfileReward: (experience, currency, score, obliterations, projectiles, username) => {
      let sql = `UPDATE User SET Currency = Currency + ${currency}, Experience = Experience + ${experience}, ScoreSum = ScoreSum + ${score}, Obliterations = Obliterations + ${obliterations}, Projectiles = Projectiles + ${projectiles}, Games = Games + ${1} WHERE Username = '${username}'`;
      conDatabseModule.query(sql, function (err, result, fields) {
         if (err) {
            console.log(err);
            console.log("ERROR WHILE TRYING TO UPDATE USER INFO")
         } else {
            console.log("ACCOUNT UPDATED ");
         }
      });
      sql = `SELECT HighScore  FROM User WHERE Username = '${username}'`
      conDatabseModule.query(sql, function (err, result, fields) {
         if (err) {
            console.log(err);
            console.log("ERROR WHILE TRYING TO GET HIGHSCORE")
         } else {
            if (result[0] != undefined) {
               if (score > result[0].HighScore) {
                  let sql = `UPDATE User SET HighScore =  ${score} WHERE Username = '${username}'`;
                  conDatabseModule.query(sql, function (err, result, fields) {
                     if (err) {
                        console.log(err);
                        console.log("ERROR WHILE TRYING TO SET NEW HIGHSCORE")
                     } else {
                        console.log("NEW HIGHSCORE");
                     }
                  });
               }
            }
            sql = `SELECT Level, Experience FROM User WHERE Username = '${username}'`;
            conDatabseModule.query(sql, function (err, result, fields) {
               if (err) {
                  console.log(err);
                  console.log("ERROR WHILE TRYING TO CHECK LEVEL")
               } else {
                  if (result[0] =! undefined) {
                     let level = result[0].Level;
                     let experience2 = result[0].Experience;
                     if (experience2 >= ((level * 1000) * Math.pow(1.2, (level - 1)))) {
                        experience2 -= ((level * 1000) * Math.pow(1.2, (level - 1)));
                        let sql = `UPDATE User SET Level = Level + ${1}, Experience = ${experience2} WHERE Username = '${username}'`;
                        conDatabseModule.query(sql, function (err, result, fields) {
                           if (err) {
                              console.log(err);
                              console.log("ERROR WHILE TRYING TO LEVEL UP")
                           } else {
                              console.log("LEVEL UP ");
                           }
                        });
                     }
                  }
               }
            });
         }
      });
   }
   /*
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
                        loginAttemptSuccess();
                     } else {
                        loginAttemptFail();
                     }
                  });
               } else {
                  loginAttemptFail();
               }
            }
         });
      }*/
   /*,
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