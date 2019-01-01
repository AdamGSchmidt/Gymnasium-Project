/*

  DET SOM MÅSTE GÖRAS
    ÄNDRA LOGIN INPUT TILLL ETT FORM SÅ ATT INFORMATIONEN KAN ANVÄNDS I SESSION

    TEST TEST TEST TEST TEST

*/

// Initiala variabler
// Globala variabler
const app = require('express')();
const http = require('http').Server(app);
const express = require('express');
const path = require('path');
const io = require('socket.io')(http);
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const saltRounds = 10;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Ser tilll så att cookie / session data går att avläsas
app.use(cookieParser());

// Ser tilll så att session går att avändas
// ******** ÄNDRA PLACEHOLDER ************
app.use(session({
  secret: 'PLACEHOLDER',
  resave: false,
  saveUninitialized: true
}));
console.log(app.session);

// Ser till att static filer i client som registerAccount.html går att nå
const clientPath = path.resolve(__dirname, 'client/');
app.use(express.static(clientPath));

// Start är index, när man kommer till sidan så börjar man på index
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

// Register får rätt fil
app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/client/html/registerAccount.html');
});

// Register post 
app.post('/register', urlencodedParser, function (req, res) {
  let registrationPasswordInput = req.body.registerPassword;
  let registrationPasswordInputRepete = req.body.registerPasswordRepete;
  let registrationUsernameInput = req.body.registerUsername;
  registerAccountFunction(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput);

  // REGISTER FUNCTIONS
  // Checks if inputs have correct format and if so then creates account
  function registerAccountFunction(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput) {
    let checkUsernameRegistrationVariable;
    checkIfUsernameTaken(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput);
  }

  // Checks if username finns then runs formatinf functions
  function checkIfUsernameTaken(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput) {
    let sql = `SELECT * FROM User WHERE Username = '${registrationUsernameInput}'`;
    connectToDB().query(sql, function (err, results) {
      if (err) {
        console.log('Error: Failed to check username, register');
      } else {
        console.log(results);
        console.log(results.length);
        console.log(sql);
        if (results.length === 0) {
          checkUsernameRegistrationVariable = true;
          registerAccountFunctionStep2(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput, checkUsernameRegistrationVariable);
        } else {
          checkUsernameRegistrationVariable = false;
          registerAccountFunctionStep2(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput, checkUsernameRegistrationVariable);
        }
      }
    });
  }

  // Kollar om all formatering stämemr och scikar ett medelande tillll klienten utifrån det
  function registerAccountFunctionStep2(registrationPasswordInput, registrationPasswordInputRepete, registrationUsernameInput, checkUsernameRegistrationVariable) {
    let checkPassMatchRegistrationVariable = checkPasswordMatchRegistration(registrationPasswordInput, registrationPasswordInputRepete);
    let checkUsernameRegistrationFormatVariable = checkUsernameFormatRegistration(registrationUsernameInput);
    let checkPasswordRegistrationVariable = checkPasswordRegistration(registrationPasswordInput);
    console.log(registrationPasswordInput);
    let resultObj = {
      registrationPasswordInputError: checkPasswordRegistrationVariable,
      registrationPasswordInputRepeteError: checkPassMatchRegistrationVariable,
      registrationUsernameInputError: checkUsernameRegistrationVariable,
      registrationUsernameInputFormatError: checkUsernameRegistrationFormatVariable,
    };
    console.log(JSON.stringify(resultObj));

    if (checkPassMatchRegistrationVariable && checkUsernameRegistrationVariable && checkPasswordRegistrationVariable && checkUsernameFormatRegistration) {

      registerNewUser(registrationPasswordInput, registrationUsernameInput);
      res.send(JSON.stringify(resultObj));
      res.end();
    } else {
      res.send(JSON.stringify(resultObj));
      res.end();
    }
  }
});

// Lyssna efter anslutningar
http.listen(3000, function () {
  console.log('listening on :3000');
});

app.get('/404', function(req, res) {
  res.sendFile(__dirname + '/client/html/404.html');
});

app.get('*', function(req, res) {
  res.redirect('/404');
});

console.log("SERVER START");

// Kör test functionen från databas modulen
const databaseModule = require('./server/js/databaseModule.js');
let databaseModuleTest = databaseModule.test();
console.log(databaseModuleTest);

// *** ALLA FUNKTIONER EFTER DETTA BÖR FLYTTAS TILL DATABASEMODULE ***
// *****************************************************************************

// CONNECT TO DATABASE
const mysql = require('mysql'); // Global databas variabel

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hej123"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("CONNECTED TO DATABASE MANEGER");
});

// HITTA OCH ANSLUT TILL DATABASEN
con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hej123",
  database: "mydb"
});

// OM DATABASEN INTE FINNS SÅ SKAPA DEN
// Se till så att variabeln con har rätt värde
con.connect(function (err) {
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

function connectToDB() {
  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hej123",
    database: "mydb"
  });
  return con;
}
// *****************************************************************************

// REGESTRATION VALIDATION
// KAVR: SE TILL SÅ ATT LÄNGDEN INTE ÄR ÖVER 255 CHARS.
// *****************************************************************************

// RegEx för att kolla om formatet är rätt

// DENNA KOLLAR OM DE BÅDA LÖSENORDEN ÄR SAMMA
// returnar true om de är det annar false
function checkPasswordMatchRegistration(registrationPasswordInput, registrationPasswordInputRepete) {
  if (registrationPasswordInput == registrationPasswordInputRepete) {
    return true;
  } else return false;
}

// Kollar username formatet
function checkUsernameFormatRegistration(registrationUsernameInput) {
  let regExCheckFormatUsername = /^.{4,}$/;
  if (regExCheckFormatUsername.test(registrationUsernameInput)) {
    return true;
  } else {
    return false;
  }
}

// KOLLAR SÅ ATT PASSWORD ÄR RÄTT FORMAT
// Om det är det returnar den true annar returnar den false
function checkPasswordRegistration(registrationPasswordInput) {
  let regExCheckFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  console.log(registrationPasswordInput + "asdasdasdasdsa");
  if (regExCheckFormat.test(registrationPasswordInput)) {
    return true;
  } else return false;
}

// Create new user
function registerNewUser(registrationPasswordInput, registrationUsernameInput) {
  bcrypt.hash(registrationPasswordInput, saltRounds).then(function (hash) {
    connectToDB().connect(function (err) {
      let sql = `INSERT INTO User (Username, Password) VALUES ('${registrationUsernameInput}', '${hash}')`;
      connectToDB().query(sql, function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          console.log("ACCOUNT " + registrationUsernameInput + " REGISTERED");
        }
      });
    });
  });
}

// *****************************************************************************

// CONECTIONS
// *****************************************************************************
// On connection skriv medelande on dissconection srkiv medelande
// conection är då en sockets skapas, diconect är då den sidan stängs
io.on('connection', function (socket) {

  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  // LOGIN FUNCTIONS
  socket.on('loginAttempt', function (data) {
    let loginUsernameInput = data.loginUsername;
    let loginPasswordInput = data.loginPassword;
    console.log(loginUsernameInput + " " + loginPasswordInput)
    validateLogin(loginUsernameInput, loginPasswordInput);
  });

  // Jämnför databasen med input
  function validateLogin(loginUsernameInput, loginPasswordInput) {
    let sql = `SELECT Password FROM User WHERE Username = '${loginUsernameInput}'`;
    connectToDB().query(sql, function (err, results) {
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
              // SUSSECC
              loginAttemptSuccess();
            } else {
              // FAIL
              loginAttemptFail();
            }
          });
        } else {
          // FAILL
          loginAttemptFail();
        }
      }
    });
  }

  // Skikar fail medelande till servern
  function loginAttemptFail() {
    socket.emit('registerAttemptFail', {});
    console.log("User login fail");
  }

  // Skicakr success medelande tillll servern
  // Ska även skapa en session
  function loginAttemptSuccess() {
    socket.emit('SuccessAttemptFail', {});
    console.log("User login success");
    console.log(app.session);
  }

});

// ****************************************************************************
