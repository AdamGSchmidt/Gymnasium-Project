/*
  DET SOM MÅSTE GÖRAS
    SAnatize function 
    Fixa kod skapa moduler
    Förbättra kollision (se komentar vid functionen)
    Fixa timestamps skapar lagg
    error chcking with socket on update
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

// config
const config = require('./config.json');

// Ser tilll så att cookie / session data går att avläsas
app.use(cookieParser());

// Ser tilll så att session går att avändas
// ******** ÄNDRA PLACEHOLDER ************
let storage = new session.MemoryStore;
console.log(storage)
app.use(session({
  secret: 'PLACEHOLDER',
  resave: false,
  saveUninitialized: true,
  store: storage
}));
let sessionId;

// Ser till att static filer i client som registerAccount.html går att nå
const clientPath = path.resolve(__dirname, 'client/');
app.use(express.static(clientPath));

// Start är index, när man kommer till sidan så börjar man på index
app.get('/', function (req, res) {
  if (req.session['login'] === true) {
    res.sendFile(__dirname + '/client/html/menu.html');
  } else {
    res.redirect('/');
  }
});

// menu route
app.get('/menu', function (req, res) {
  //if (req.session['login'] === true) {
  res.sendFile(__dirname + '/client/html/menu.html');
  //} else {
  // res.redirect('/');
  //}
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
    res.send({ redirect: '/menu' });
    res.end();
  }
});

// då get /game sckika game.html
app.get('/game', function (req, res) {
  if (req.session['login'] === true) {
    res.sendFile(__dirname + '/client/html/game.html');
    sessionId = req.session.id;
  } else {
    res.redirect('/');
  }
});

// kollar om man är loggedin
app.get('/getlogin', urlencodedParser, function (req, res) {
  res.send(JSON.stringify({
    username: req.session['username'],
    login: req.session['login']
  }));
  res.end();
});



app.get('/getprofielecontent', urlencodedParser, function (req, res) {

  let profileUsername = req.session['username'];
  let sql = `SELECT Username, UserID, Progress, Projectiles, Obliterations, Currency, Games FROM User WHERE Username = '${profileUsername}'`;
  databaseModule.connectToDB().query(sql, function (err, results) {
    if (err) {
      console.log('Error: Failed to get profile content,');
      console.log(err);
    } else {
      console.log(results);
      res.send(results);
    }
  });
});


// loggar ut
app.post('/logout', urlencodedParser, function (req, res) {
  req.session['login'] = false;
  req.session['username'] = null;
  res.end();
});

app.get('/getnumberofcurrentusers', urlencodedParser, function (req, res) {
  res.send({ users: currentConections });
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
const usersPositions = new Array();
const projectilePositions = new Array();
const lootPositions = new Array();

let time;

io.on('connection', (socket) => {
  let usernameSessin;
  storage.get(sessionId, (error, session) => {
    if (error || session == null) {
      console.log('ERROR WHILE GETING USERNAME IN /game')
    } else {
      usernameSessin = session['username'];
    }
    console.log("USERNAME ::::  " + usernameSessin)
    time = new Date();
    let usersPosition = {
      xCord: Math.floor((Math.random() * (config.game.map.xBoundary - config.game.player.startRadius)) + config.game.player.startRadius),
      yCord: Math.floor((Math.random() * (config.game.map.yBoundary - config.game.player.startRadius)) + config.game.player.startRadius),
      id: socket.id,
      username: usernameSessin,
      lastMessage: time,
      lastProjectile: time,
      obliterated: false,
      projectileSpeed: config.game.projectile.startSpeed,
      projectileRadius: config.game.projectile.startRadius,
      radius: config.game.player.startRadius
    };
    usersPositions.push(usersPosition);
  });
  currentConections++;

  console.log('a user connected, current: ' + currentConections);

  socket.on('update', (data) => {
    if (data && data.clientAngel && data.clientUseAngel && (typeof data.clientUseAngel === "boolean") && (typeof data.clientAngel === "number")) {
      for (let index = 0; index < usersPositions.length; index++) {
        if (socket.id == usersPositions[index].id) {
          data = data;
          time = new Date();
          let time2 = (usersPositions[index].lastMessage.setMilliseconds(usersPositions[index].lastMessage.getMilliseconds() + 12));
          time2 = new Date(time2);
          // if satsen ser till så att man endast kan röra sig om man är i spelet
          if (time > time2) {
            determinNewPosition(data.clientAngel, data.clientUseAngel, index);
          } else {
            console.log("TOO EARLY");
          }
          usersPositions[index].lastMessage = time;
        }
      }
    }
  });

  socket.on('newProjectile', (projectile) => {
    if (projectile && projectile.angel && projectile.id && (typeof projectile.angel === "number") && (typeof projectile.id === "string")) {
      let playerNotObliterated = true;
      let projectileTime = false;
      for (let index = 0; index < usersPositions.length; index++) {
        if (usersPositions[index].id == socket.id) {
          time = new Date();
          time2 = time + 1000;
          time2 = new Date(time2);
          if (usersPositions[index].lastProjectile == null || usersPositions[index].lastProjectile < time2) {
            projectileTime = true;
            usersPositions[index].lastProjectile = time;
          }
        }
      }
      if (projectileTime) {
        for (let index2 = 0; index2 < usersPositions.length; index2++) {
          if (socket.id == usersPositions[index2].id) {
            playerNotObliterated = false;
          }
        }
        if (!playerNotObliterated) {
          for (let index = 0; index < usersPositions.length; index++) {
            if (projectile.useAngel && (projectile.id === usersPositions[index].id)) {
              let newProjectile = {
                xCord: usersPositions[index].xCord + ((usersPositions[index].radius + usersPositions[index].projectileRadius + 4) * Math.cos(projectile.angel)), // 4 to avoid collision
                yCord: usersPositions[index].yCord + ((usersPositions[index].radius + usersPositions[index].projectileRadius + 4) * Math.sin(projectile.angel)),
                angel: projectile.angel,
                radius: usersPositions[index].projectileRadius,
                speed: usersPositions[index].projectileSpeed,
                id: projectile.id,
                username: usersPositions[index].username,
              }
              socket.emit('startreload');
              projectilePositions.push(newProjectile);
            }
          }
        }
      }
    }
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
  playerLootCollisionCheck();
  determinNewProjectile();
  playerProjectileCollisionCheck();
  let clientDataObj = {
    players: usersPositions || [],
    projectiles: projectilePositions || [],
    loot: lootPositions || []
  };
  io.emit('tick', JSON.stringify(clientDataObj));
}, 16);

const playerLootCollisionCheck = () => {
  for (let index = 0; index < lootPositions.length; index++) {
    for (let index2 = 0; index2 < usersPositions.length; index2++) {
      if (lootPositions[index] && usersPositions[index2]) {
        // Collision checking algorithim
        let distanceX = lootPositions[index].xCord - usersPositions[index2].xCord;
        let distanceY = lootPositions[index].yCord - usersPositions[index2].yCord;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < lootPositions[index].radius + usersPositions[index2].radius) {
          if (usersPositions[index2].projectileSpeed <= config.game.upgrade.maxSpeedProjectile) { // max speed
            usersPositions[index2].projectileSpeed *= config.game.upgrade.projectileSpeedMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileSpeed >= config.game.upgrade.maxSpeedProjectile) {
            usersPositions[index2].projectileSpeed = config.game.upgrade.maxSpeedProjectile;
          }
          if (usersPositions[index2].projectileRadius <= config.game.upgrade.maxRadiusProjectile) { // max radius
            usersPositions[index2].projectileRadius *= config.game.upgrade.projectileRadiusMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileRadius >= config.game.upgrade.maxRadiusProjectile) {
            usersPositions[index2].projectileRadius = config.game.upgrade.maxRadiusProjectile;
          }
          if (usersPositions[index2].radius >= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius *= config.game.upgrade.playerRadiusMultipler;
          }
          if (usersPositions[index2].radius <= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius = config.game.upgrade.minRadiusPlayer;
          }
          lootPositions.splice(index, 1);
          console.log("LOOT PLAYER COLLISION");
        }
      }
    }
  }
};

const playerProjectileCollisionCheck = () => {
  for (let index = 0; index < projectilePositions.length; index++) {
    for (let index2 = 0; index2 < usersPositions.length; index2++) {
      // Collision checking algorithim
      let distanceX = projectilePositions[index].xCord - usersPositions[index2].xCord;
      let distanceY = projectilePositions[index].yCord - usersPositions[index2].yCord;
      let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      if (distance < projectilePositions[index].radius + usersPositions[index2].radius) {
        usersPositions[index2].obliterated = true;
        io.emit('obliterated', {
          obliterated: usersPositions[index2].username,
          obliterator: projectilePositions[index].username,
          id: usersPositions[index2].id
        });
        createLoot(usersPositions[index2]);
        usersPositions.splice(index2, 1);
        console.log("PROJECTILE PLAYER COLLISION");
      }
    }
  }
}

const createLoot = (data) => {
  let loot = {
    radius: config.game.loot.startRadius,
    xCord: data.xCord,
    yCord: data.yCord
  }
  console.log("LOOT CREATED")
  lootPositions.push(loot);
};

const determinNewProjectile = () => {
  // Kolla om det finns en kollition mellan projectilerna
  if (projectilePositions.length >= 2) {
    for (let index = 0; index < projectilePositions.length; index++) {
      for (let index2 = 0; index2 < projectilePositions.length; index2++) {
        if (projectilePositions[index2] !== projectilePositions[index]) {
          // Collision checking algorithim
          let distanceX = projectilePositions[index].xCord - projectilePositions[index2].xCord;
          let distanceY = projectilePositions[index].yCord - projectilePositions[index2].yCord;
          let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < projectilePositions[index].radius + projectilePositions[index2].radius) {
            projectilePositions.splice(index, 1);
            console.log("PROJECTILE COLLISION")
          } else if ((projectilePositions[index].xCord == 0 && projectilePositions[index].yCord == config.game.map.yBoundary) || (projectilePositions[index].yCord == 0 && projectilePositions[index].xCord == config.game.map.xBoundary) || (projectilePositions[index].xCord == 0 && projectilePositions[index].yCord == 0) || (projectilePositions[index].xCord == config.game.map.xBoundary && projectilePositions[index].yCord == config.game.map.yBoundary)) {
            projectilePositions.splice(index, 1);
          }
        }
      }
    }
  }

  for (let index = 0; index < projectilePositions.length; index++) {
    if (projectilePositions[index].speed <= config.game.projectile.minSpeed) {
      projectilePositions.splice(index, 1);
      break;
    }
    // Byt till else if kanske ??
    if (projectilePositions[index].xCord >= (config.game.map.xBoundary - projectilePositions[index].radius + 1)) {
      projectilePositions[index].angel = (Math.PI - projectilePositions[index].angel);
      projectilePositions[index].speed *= config.game.projectile.speedChange;
      projectilePositions[index].xCord = config.game.map.xBoundary - projectilePositions[index].radius;
      continue;
    }
    if (projectilePositions[index].xCord <= (0 + projectilePositions[index].radius + 1)) {
      projectilePositions[index].angel = (Math.PI - projectilePositions[index].angel);
      projectilePositions[index].speed *= config.game.projectile.speedChange;
      projectilePositions[index].xCord = 0 + projectilePositions[index].radius;
      continue;
    }
    if (projectilePositions[index].yCord >= (config.game.map.yBoundary - projectilePositions[index].radius + 1)) {
      projectilePositions[index].angel = Math.PI - (-1 * (Math.PI - projectilePositions[index].angel));
      projectilePositions[index].speed *= config.game.projectile.speedChange;
      projectilePositions[index].yCord = config.game.map.yBoundary - projectilePositions[index].radius;
      continue;
    }
    if (projectilePositions[index].yCord <= (0 + projectilePositions[index].radius + 1)) {
      projectilePositions[index].angel = Math.abs((Math.PI - projectilePositions[index].angel));
      projectilePositions[index].speed *= config.game.projectile.speedChange;
      projectilePositions[index].yCord = 0 + projectilePositions[index].radius;
      continue;
    }
  }

  for (let index = 0; index < projectilePositions.length; index++) {
    projectilePositions[index].xCord += (Math.cos(projectilePositions[index].angel) * projectilePositions[index].speed);
    projectilePositions[index].yCord += (Math.sin(projectilePositions[index].angel) * projectilePositions[index].speed);
  }
}

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
          if (distance < usersPositions[index].radius + usersPositions[index2].radius) {
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
            collision = false;
          }
        }
      }
    }

    // Om ingen kollition byt position
    if (!collision) {
      if ((usersPositions[index].xCord <= config.game.map.xBoundary - usersPositions[index].radius) && (usersPositions[index].xCord >= usersPositions[index].radius) && moveX) {
        usersPositions[index].xCord += 4 * Math.cos(angle);
      }
      if ((usersPositions[index].yCord <= config.game.map.yBoundary - usersPositions[index].radius) && (usersPositions[index].yCord >= usersPositions[index].radius) && moveY) {
        usersPositions[index].yCord += 4 * Math.sin(angle);
      }
    }
    // Om vid vägg stanna
    if (usersPositions[index].xCord > config.game.map.xBoundary - usersPositions[index].radius) {
      usersPositions[index].xCord = config.game.map.xBoundary - usersPositions[index].radius - 1;
    }
    if (usersPositions[index].xCord < usersPositions[index].radius) {
      usersPositions[index].xCord = usersPositions[index].radius + 1;
    }
    if (usersPositions[index].yCord > config.game.map.yBoundary - usersPositions[index].radius) {
      usersPositions[index].yCord = config.game.map.yBoundary - usersPositions[index].radius - 1;
    }
    if (usersPositions[index].yCord < usersPositions[index].radius) {
      usersPositions[index].yCord = usersPositions[index].radius + 1;
    }
  }
}

// ****************************************************************************
