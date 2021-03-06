/*
  DET SOM MÅSTE GÖRAS
    SAnatize function (byt till annan mysql)
    Fixa kod skapa moduler
    Förbättra kollision (se komentar vid functionen)
    Stäng all conections 
    Fixa skins
    Fixa loadouts
    Fixa store
    Fixa ny login och regestration                             
    Fixa css och canvas utseende
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
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});
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
    res.send({
      login: false
    });
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
    res.send({
      redirect: '/menu'
    });
    res.end();
  }
});

// då get /game sckika game.html
app.get('/game', function (req, res) {
  // if (req.session['login'] === true) {
  res.sendFile(__dirname + '/client/html/game.html');
  sessionId = req.session.id;
  //} else {
  //res.redirect('/');
  //}
});

// kollar om man är loggedin
app.get('/getlogin', urlencodedParser, function (req, res) {
  res.send(JSON.stringify({
    username: req.session['username'],
    login: req.session['login']
  }));
  res.end();
});

app.get('/getdisplayname', function (req, res) {
  res.send(JSON.stringify({
    displayName: req.session['displayName']
  }));
  res.end();
});

app.post('/setdisplayname', urlencodedParser, function (req, res) {
  let displayName = req.body.displayName;
  if (/[A-Za-z0-9]/.test(displayName)) {
    req.session['displayName'] = displayName;
  } else {
    req.session['displayName'] = req.session['username'] || 'Guest';
  }
  res.end();
});

app.get('/getprofielecontent', urlencodedParser, function (req, res) {
  let profileUsername = req.session['username'];
  let sql = `SELECT Username, Projectiles, Obliterations, Games, ScoreSum, HighScore, Experience, Level, Currency FROM User WHERE Username = '${profileUsername}'`;
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

app.get('/getloadouts', urlencodedParser, function (req, res) {
  let sql = `SELECT * FROM Loadout`;
  let con = databaseModule.connectToDB();
  con.query(sql, function (err, results) {
    if (err) {
      console.log('Error: Failed to get loadout content,');
      console.log(err);
    } else {
      console.log(results);
      res.send(results);
    }
  });
  con.end();
});

app.get('/getcurrentloadouts', urlencodedParser, function (req, res) {
  let response = req.session['weapon'];
  if (response == undefined) {
    req.session['weapon'] = 0;
    response = 0;
  }
  res.send(JSON.stringify(response));
});

app.post('/changeweapon', urlencodedParser, function (req, res) {
  let id = req.body.id;
  let username = req.session['username'];
  let sql = `SELECT Requierment, Level FROM Loadout, User WHERE Loadout.ID = ${id} AND User.Username = '${username}';`;
  let con = databaseModule.connectToDB();
  con.query(sql, function (err, results) {
    if (err) {
      console.log('Error: Failed to change loadout,');
      console.log(err);
    } else {
      console.log(results)
      console.log(results.length + "::::::::" + results[0])
      if (results.length != 0) {
        if (results[0].Level >= results[0].Requierment) {
          req.session['weapon'] = id;
          console.log("WEAPON CHANGED")
        } else {
          console.log("LEVEL TO LOW TO CHANGE WEAPON")
        }
      }
      res.end();
    }
  });
  con.end();
});

// loggar ut
app.post('/logout', urlencodedParser, function (req, res) {
  req.session['login'] = false;
  req.session['username'] = null;
  res.end();
});

app.get('/getnumberofcurrentusers', urlencodedParser, function (req, res) {
  res.send({
    users: currentConections
  });
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
const checkPasswordMatchRegistration = (registrationPasswordInput, registrationPasswordInputRepete) => {
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
const checkPasswordRegistration = (registrationPasswordInput) => {
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
const primaryLootPositions = new Array();
const secondaryLootPositions = new Array();
let time;

io.on('connection', (socket) => {
  let usernameSessin;
  let displayNameSession;
  storage.get(sessionId, (error, session) => {
    if (error || session == null) {
      console.log('ERROR WHILE GETING USERNAME IN /game')
    } else {
      usernameSessin = session['username'];
      displayNameSession = session['displayName'] || 'Guest';
    }
    console.log("USERNAME ::::  " + usernameSessin)
    time = new Date();
    let usersPosition = {
      xCord: Math.floor((Math.random() * (config.game.map.xBoundary - config.game.player.startRadius)) + config.game.player.startRadius),
      yCord: Math.floor((Math.random() * (config.game.map.yBoundary - config.game.player.startRadius)) + config.game.player.startRadius),
      id: socket.id,
      //socket, För att sckika data till spesific spelare
      angel: 0,
      useAngel: false,
      username: usernameSessin || 'Guest',
      displayName: displayNameSession || 'Guest',
      lastProjectile: time,
      obliterated: false,
      projectileSpeed: config.game.projectile.startSpeed,
      projectileRadius: config.game.projectile.startRadius,
      radius: config.game.player.startRadius,
      score: 0,
      lootNumber: 0,
      obliterations: 0,
      projectiles: 0
    };
    usersPositions.push(usersPosition);
  });
  currentConections++;

  console.log('a user connected, current: ' + currentConections);

  socket.on('update', (data) => {
    if (data && data.clientAngel && (typeof data.clientUseAngel === "boolean") && (typeof data.clientAngel === "number")) {
      for (let index = 0; index < usersPositions.length; index++) {
        if (socket.id == usersPositions[index].id) {
          // if satsen ser till så att man endast kan röra sig om man är i spelet
          usersPositions[index].angel = data.clientAngel;
          usersPositions[index].useAngel = data.clientUseAngel;
        }
      }
    } else {
      for (let index = 0; index < usersPositions.length; index++) {
        if (socket.id == usersPositions[index].id) {
          // if satsen ser till så att man endast kan röra sig om man är i spelet
          usersPositions[index].angel = data.clientAngel;
          usersPositions[index].useAngel = false;
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
            usersPositions[index].projectiles += 1;
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
                displayName: usersPositions[index].displayName
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
  determinNewPlayerPosition();
  playerPrimaryLootCollisionCheck();
  playerSecondaryLootCollisionCheck();
  determinNewProjectile();
  playerProjectileCollisionCheck();
  increaseScore();
  createSecondaryLoot();
  let clientDataObj = {
    players: usersPositions || [],
    projectiles: projectilePositions || [],
    primaryLoot: primaryLootPositions || [],
    secondaryLoot: secondaryLootPositions || [],
  };
  io.emit('tick', JSON.stringify(clientDataObj));
}, 16);

const increaseScore = () => {
  for (let index = 0; index < usersPositions.length; index++) {
    usersPositions[index].score += config.game.score.perTick;
  }
}

const determinNewPlayerPosition = () => {
  for (let index = 0; index < usersPositions.length; index++) {
    let angle = usersPositions[index].angel;
    let useAngle = usersPositions[index].useAngel;
    if (useAngle === true) {

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
}

const playerPrimaryLootCollisionCheck = () => {
  for (let index = 0; index < primaryLootPositions.length; index++) {
    for (let index2 = 0; index2 < usersPositions.length; index2++) {
      if (primaryLootPositions[index] && usersPositions[index2]) {
        // Collision checking algorithim
        let distanceX = primaryLootPositions[index].xCord - usersPositions[index2].xCord;
        let distanceY = primaryLootPositions[index].yCord - usersPositions[index2].yCord;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < primaryLootPositions[index].radius + usersPositions[index2].radius) {
          if (usersPositions[index2].projectileSpeed <= config.game.upgrade.maxSpeedProjectile) { // max speed
            usersPositions[index2].projectileSpeed *= config.game.loot.projectileSpeedMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileSpeed >= config.game.upgrade.maxSpeedProjectile) {
            usersPositions[index2].projectileSpeed = config.game.upgrade.maxSpeedProjectile;
          }
          if (usersPositions[index2].projectileRadius <= config.game.upgrade.maxRadiusProjectile) { // max radius
            usersPositions[index2].projectileRadius *= config.game.loot.projectileRadiusMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileRadius >= config.game.upgrade.maxRadiusProjectile) {
            usersPositions[index2].projectileRadius = config.game.upgrade.maxRadiusProjectile;
          }
          if (usersPositions[index2].radius >= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius *= config.game.loot.playerRadiusMultipler;
          }
          if (usersPositions[index2].radius <= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius = config.game.upgrade.minRadiusPlayer;
          }
          console.log(primaryLootPositions[index].score + "   " + config.game.score.percentage)
          usersPositions[index2].score += config.game.score.primaryLoot + primaryLootPositions[index].score * config.game.score.percentage;
          usersPositions[index2].lootNumber += 1;
          primaryLootPositions.splice(index, 1);
          console.log("LOOT PLAYER COLLISION     " + usersPositions[index2].score);
        }
      }
    }
  }
};

const playerSecondaryLootCollisionCheck = () => {
  for (let index = 0; index < secondaryLootPositions.length; index++) {
    for (let index2 = 0; index2 < usersPositions.length; index2++) {
      if (secondaryLootPositions[index] && usersPositions[index2]) {
        // Collision checking algorithim
        let distanceX = secondaryLootPositions[index].xCord - usersPositions[index2].xCord;
        let distanceY = secondaryLootPositions[index].yCord - usersPositions[index2].yCord;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < secondaryLootPositions[index].radius + usersPositions[index2].radius) {
          if (usersPositions[index2].projectileSpeed <= config.game.upgrade.maxSpeedProjectile) { // max speed
            usersPositions[index2].projectileSpeed *= config.game.secondaryLoot.projectileSpeedMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileSpeed >= config.game.upgrade.maxSpeedProjectile) {
            usersPositions[index2].projectileSpeed = config.game.upgrade.maxSpeedProjectile;
          }
          if (usersPositions[index2].projectileRadius <= config.game.upgrade.maxRadiusProjectile) { // max radius
            usersPositions[index2].projectileRadius *= config.game.secondaryLoot.projectileRadiusMultiplier; // INCREASE BY 10%
          }
          if (usersPositions[index2].projectileRadius >= config.game.upgrade.maxRadiusProjectile) {
            usersPositions[index2].projectileRadius = config.game.upgrade.maxRadiusProjectile;
          }
          if (usersPositions[index2].radius >= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius *= config.game.secondaryLoot.playerRadiusMultipler;
          }
          if (usersPositions[index2].radius <= config.game.upgrade.minRadiusPlayer) {
            usersPositions[index2].radius = config.game.upgrade.minRadiusPlayer;
          }
          console.log(secondaryLootPositions[index].score + "   " + config.game.score.percentage)
          usersPositions[index2].score += config.game.score.secondaryLoot;
          secondaryLootPositions.splice(index, 1);
          console.log("LOOT PLAYER COLLISION     " + usersPositions[index2].score);
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
        let experience = usersPositions[index2].score * config.game.reward.experiencePerScore;
        let currency = usersPositions[index2].lootNumber * config.game.reward.currencyPerLoot;
        if (usersPositions[index2].username != projectilePositions[index].username) {
          usersPositions[index2].obliterations += 1;
        }
        io.emit('obliterated', {
          obliterated: usersPositions[index2].displayName,
          obliterator: projectilePositions[index].displayName,
          obliteratorID: projectilePositions[index].id,
          obliteratedID: usersPositions[index2].id,
          experience,
          currency
        });
        if (usersPositions[index2].username) {
          databaseModule.updateUserProfileReward(experience, currency, usersPositions[index2].score, usersPositions[index2].obliterations, usersPositions[index2].projectiles, usersPositions[index2].username);
        }
        for (let index3 = 0; index3 < usersPositions.length; index3++) {
          if (usersPositions[index3].username == projectilePositions[index].username) {
            usersPositions[index3].score += config.game.score.obliteration;
            break;
          }
        }
        createPrimaryLoot(usersPositions[index2]);
        usersPositions.splice(index2, 1);
        console.log("PROJECTILE PLAYER COLLISION");
      }
    }
  }
}

const createPrimaryLoot = (data) => {
  let loot = {
    radius: config.game.loot.startRadius,
    xCord: data.xCord,
    yCord: data.yCord,
    score: data.score
  }
  console.log("PRIMARY LOOT CREATED")
  primaryLootPositions.push(loot);
};

const createSecondaryLoot = () => {
  let ammountPerUser = config.game.secondaryLoot.ammountPerUser;
  if ((secondaryLootPositions.length) < (currentConections * ammountPerUser)) {
    let difference = Math.abs((secondaryLootPositions.length) - (currentConections * ammountPerUser));
    for (let index = 0; index < difference; index++) {
      let loot = {
        radius: config.game.secondaryLoot.startRadius,
        xCord: Math.floor(Math.random() * (config.game.map.xBoundary - 2 * config.game.secondaryLoot.startRadius) + config.game.secondaryLoot.startRadius),
        yCord: Math.floor(Math.random() * (config.game.map.yBoundary - 2 * config.game.secondaryLoot.startRadius) + config.game.secondaryLoot.startRadius),
        score: config.game.score.secondaryLoot
      }
      console.log("SECONDARY LOOT CREATED")
      secondaryLootPositions.push(loot);
    }
  }
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
      projectilePositions[index].angel = Math.PI - (-1 * (Math.PI - projectilePositions[index].angel));
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
// ****************************************************************************