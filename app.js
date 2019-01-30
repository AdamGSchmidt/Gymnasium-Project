/*
  DET SOM MÅSTE GÖRAS
    SAnatize function 
    Fixa kod skapa moduler
    Förbättra kollision (se komentar vid functionen)
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
const databaseModule = require('./server/js/databaseModule.js');

// Ser tilll så att cookie / session data går att avläsas
app.use(cookieParser());

// Ser tilll så att session går att avändas
// ******** ÄNDRA PLACEHOLDER ************
app.use(session({
  secret: 'PLACEHOLDER',
  resave: false,
  saveUninitialized: true
}));

// Ser till att static filer i client som registerAccount.html går att nå
const clientPath = path.resolve(__dirname, 'client/');
app.use(express.static(clientPath));

// Start är index, när man kommer till sidan så börjar man på index
app.get('/', function (req, res) {
  if (req.session['login'] === true) {
    res.sendFile(__dirname + '/client/html/game.html');
  } else {
    res.redirect('/');
  }
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
    databaseModule.connectToDB().query(sql, function (err, results) {
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

      databaseModule.registerNewUser(registrationPasswordInput, registrationUsernameInput);
      res.send(JSON.stringify(resultObj));
      res.end();
    } else {
      res.send(JSON.stringify(resultObj));
      res.end();
    }
  }
});

// då man går till /404 sänd 404
app.get('/404', function (req, res) {
  res.sendFile(__dirname + '/client/html/404.html');
});

// login function tar ett post från /login
app.post('/login', urlencodedParser, function (req, res) {
  let loginUsernameInput = req.body.usernameInput;
  let loginPasswordInput = req.body.passwordInput;
  console.log(loginUsernameInput + " " + loginPasswordInput)

  // Jämnför databasen med input
  validateLogin(loginUsernameInput, loginPasswordInput);

  function validateLogin(loginUsernameInput, loginPasswordInput) {
    let sql = `SELECT Password FROM User WHERE Username = '${loginUsernameInput}'`;
    databaseModule.connectToDB().query(sql, function (err, results) {
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
  }

  // login fail
  function loginAttemptFail() {
    res.send({ login: false });
    res.end();
    console.log("User login fail");
  }

  // login success
  // Ska även skapa en session
  function loginAttemptSuccess() {
    console.log("User login success");
    req.session['login'] = true;
    req.session['username'] = loginUsernameInput;
    console.log(req.session);
    res.send({ redirect: '/game' });
    res.end();
  }
});

// då get /game sckika game.html
app.get('/game', function (req, res) {
  if (req.session['login'] === true) {
    res.sendFile(__dirname + '/client/html/game.html');
  } else {
    res.redirect('/');
  }
});

// kollar om man är loggedin
app.post('/game', urlencodedParser, function (req, res) {
  res.send({ Username: req.session['username'] });
  res.end();
});

// loggar ut
app.post('/logout', urlencodedParser, function (req, res) {
  req.session['login'] = false;
  req.session['username'] = null;
  res.end();
});


app.get('*', function (req, res) {
  res.redirect('/404');
});

// Lyssna efter anslutningar
http.listen(3000, function () {
  console.log('listening on :3000');
});

console.log("SERVER START");

// *** ALLA FUNKTIONER EFTER DETTA BÖR FLYTTAS TILL DATABASEMODULE ***
// *****************************************************************************

// CONNECT TO DATABASE
const mysql = require('mysql'); // Global databas variabel
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

// *****************************************************************************

// CONECTIONS WEBSOCKET, AND GAME MECHANICS
// *****************************************************************************
// On connection skriv medelande on dissconection srkiv medelande
// conection är då en sockets skapas, diconect är då den sidan stängs
let currentConections = 0;
let usersPositions = [];
let time;

io.on('connection', (socket) => {

  currentConections++;
  time = new Date();
  let usersPosition = {
    xCord: Math.floor((Math.random() * 2570)),
    yCord: Math.floor((Math.random() * 2570)),
    id: socket.id,
    lastMessage: time.getMilliseconds() + 1000
  };
  console.log(usersPosition);
  usersPositions.push(usersPosition);
  console.log(usersPositions);
  console.log(socket.id);

  console.log('a user connected, current: ' + currentConections);

  socket.emit('tick', JSON.stringify(usersPositions));

  socket.on('update', (data) => {
    for (let index = 0; index < usersPositions.length; index++) {
      if (socket.id == usersPositions[index].id) {
        data = data;
        time = new Date();
        // if satsen ser till så att man endast kan röra sig om man är i spelet
        if (((usersPositions[index].lastMessage + 15) % 1000) < time.getMilliseconds()) {
          determinNewPosition(data.clientAngel, data.clientUseAngel, index);
        } else {
          console.log("TOO EARLY");
        }
        usersPositions[index].lastMessage = time.getMilliseconds();
      }
    }
  });

  socket.on('newProjectile', (projectile) => {
    console.log(projectile.angel);
  });

  socket.on('disconnect', () => {
    for (let index = 0; index < usersPositions.length; index++) {
      if (socket.id === usersPositions[index].id) {
        usersPositions.splice(index, 1);
        console.log('removed from array');
      }
    }
    currentConections--;
    console.log('user disconnected, current: ' + currentConections);
    console.log(usersPositions);
  });
});

setInterval(() => {
  io.emit('tick', JSON.stringify(usersPositions));
}, 16);

function determinNewPosition(angle, useAngle, index) {
  if (useAngle && angle) {

    // Kolla om det finns en kollition
    let collision = false;
    let moveX = true;
    let moveY = true;

    if (usersPositions.length != 1) {
      for (let index2 = 0; index2 < usersPositions.length; index2++) {
        if (usersPositions[index2].id !== usersPositions[index].id) {
          // Collision checking algorithim
          let distanceX = usersPositions[index].xCord - usersPositions[index2].xCord;
          let distanceY = usersPositions[index].yCord - usersPositions[index2].yCord;
          let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < 20 + 20) { // 20 is the radius change later
            console.log('COLLISION')
            collision = true;
            if (distanceX < 0) {
              moveX = false
              usersPositions[index].xCord = usersPositions[index].xCord - 0.07;
            } else if (distanceX > 0) {
              moveX = false
              usersPositions[index].xCord = usersPositions[index].xCord + 0.07;
            }
            if (distanceY < 0) {
              moveY = false
              usersPositions[index].yCord = usersPositions[index].yCord - 0.07;
            } else if (distanceY > 0) {
              moveY = false
              usersPositions[index].yCord = usersPositions[index].yCord + 0.07;
            }
          } else {
            // console.log('NOT')
            collision = false;
          }
        }
      }
    }

    // Om ingen kollition byt position
    if (!collision) {
      if ((usersPositions[index].xCord <= 2579) && (usersPositions[index].xCord >= 21) && moveX) {
        usersPositions[index].xCord += 4 * Math.cos(angle);
      }
      if ((usersPositions[index].yCord <= 2579) && (usersPositions[index].yCord >= 21) && moveY) {
        usersPositions[index].yCord += 4 * Math.sin(angle);
      }
    }
    // Om vid vägg stanna
    if (usersPositions[index].xCord >= 2579) {
      usersPositions[index].xCord = 2579;
    }
    if (usersPositions[index].xCord <= 21) {
      usersPositions[index].xCord = 21;
    }
    if (usersPositions[index].yCord >= 2579) {
      usersPositions[index].yCord = 2579;
    }
    if (usersPositions[index].yCord <= 21) {
      usersPositions[index].yCord = 21;
    }
  }
}

// ****************************************************************************
