/*
        Fixa scale
        tab bug fixad men kan utveklas
        Collision controll funkar men bör ändras
        BUGG kulur vid vänster och övre väggen fastnar då de skjuts med en vinkel parallel till väggen
*/

/* AOUTO CLICKER FOR TESTING 
    setInterval(function () { 
        document.getElementById('gameCanvas').click();
    },25);
*/

// Skapar konection
const socket = io();
let socketId;
socket.on('connect', function () {
    socketId = socket.id;
    console.log(socket.id);
});

// Variabler som håller reda på data
let canvasWidth;
let canvasHeight;
let playerPosition;
let mouseX = 0;
let mouseY = 0;
let angel;
let useAngel = true;
let reload = false;
let reloadBarValue = 0;
let topList = new Array();

const defaultScale = 680;
const feedList = new Array();

class Projectile {
    constructor() {
        this.angel = angel;
        this.useAngel = useAngel;
        this.id = socketId;
    }
}

// Get the canvas center and set it to player posision
const getCenterCanvas = () => {
    middlePosition = { xCord: (canvasWidth / 2), yCord: (canvasHeight / 2) };
}

// Draw all objects 
const draw = (currentUserPositions, currentProjectilePositions, currentLootPositions) => {
    getCenterCanvas();
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    ctx.clearRect(-10000, -10000, 26000, 26000);
    ctx.save();
    ctx.translate((middlePosition.xCord - playerPosition.xCord), (middlePosition.yCord - playerPosition.yCord));
    drawGrid();
    drawLoot(currentLootPositions);
    drawProjectiles(currentProjectilePositions);
    drawUsers(currentUserPositions);
    // ctx.scale((canvasWidth / defaultScale), (canvasWidth / defaultScale));
    ctx.restore();
}

const drawGrid = () => {
    getCenterCanvas();
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");

    // draw grid
    for (let index = 0; index < 131; index++) {
        ctx.strokeStyle = "#aaaaaa";
        ctx.beginPath();
        ctx.moveTo(0, (20 * index));
        ctx.lineTo(2600, 20 * index);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(20 * index, 0);
        ctx.lineTo(20 * index, 2600);
        ctx.stroke();
    }
    // draw border
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.rect(0, 0, 2600, 2600);
    ctx.stroke();
    ctx.lineWidth = 1;
}

const drawUsers = (currentUserPositions) => {
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    for (let index = 0; index < currentUserPositions.length; index++) {
        if (currentUserPositions[index].id) {
            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.fillText(currentUserPositions[index].username, currentUserPositions[index].xCord, currentUserPositions[index].yCord - currentUserPositions[index].radius - 10);

            ctx.beginPath();
            ctx.arc(currentUserPositions[index].xCord, currentUserPositions[index].yCord, currentUserPositions[index].radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.fill();
        }
    }
    // draw Player
    ctx.beginPath();
    ctx.arc(playerPosition.xCord, playerPosition.yCord, playerPosition.radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
    // reload progress bar
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(playerPosition.xCord, playerPosition.yCord, playerPosition.radius + 14, 3 * Math.PI / 2, reloadBarValue + 3 * Math.PI / 2, true);
    ctx.strokeStyle = "#ff6347";
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
}

const drawProjectiles = (currentProjectilePositions) => {
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    for (let index = 0; index < currentProjectilePositions.length; index++) {
        ctx.beginPath();
        ctx.arc(currentProjectilePositions[index].xCord, currentProjectilePositions[index].yCord, currentProjectilePositions[index].radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#ff6347";
        ctx.fill();
        ctx.fillStyle = "#000000";
    }
}

const drawLoot = (currentLootPositions) => {
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    for (let index = 0; index < currentLootPositions.length; index++) {
        ctx.beginPath();
        ctx.arc(currentLootPositions[index].xCord, currentLootPositions[index].yCord, currentLootPositions[index].radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(currentLootPositions[index].xCord, currentLootPositions[index].yCord, currentLootPositions[index].radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
};


const newPlayerPosition = (event) => {
    getCenterCanvas();
    mouseX = event.clientX;
    mouseY = event.clientY;
    // calculate angel from middle
    let angleX = mouseX - middlePosition.xCord;
    let angleY = (mouseY - middlePosition.yCord);
    if ((angleX == 0 && angleY == 0) || ((middlePosition.xCord - mouseX < playerPosition.radius - 5 && middlePosition.xCord - mouseX > -1 * (playerPosition.radius - 5)) && (middlePosition.yCord - mouseY < playerPosition.radius - 5 && middlePosition.yCord - mouseY > -1 * (playerPosition.radius - 5)))) {
        angel = 0;
        useAngel = false;
    } else {
        useAngel = true;
        angel = Math.atan2(angleY, angleX);
    }
    console.log(angel * (180 / Math.PI) + " , " + useAngel);
}

const newProjectile = (event) => {
    let projectile = new Projectile();
    console.log(projectile);
    socket.emit('newProjectile', projectile);
}


// Ändrar canvasa storlek
// SKAPER EN BUGG FIXA SNARAST, antons dator inte må bra
const resize = () => {
    let containerSize = document.getElementById('gameCanvasContainer');
    let c = document.querySelector("#gameCanvas");
    c.style.display = 'block';
    canvasWidth = window.innerWidth;
    console.log(canvasWidth);
    canvasHeight = window.innerHeight;
    console.log(canvasHeight);
    // Sätter det nya värderna
    c.width = canvasWidth;
    c.height = canvasHeight;
    getCenterCanvas();
}

// Hämta username
const getUser = () => {
    $.ajax({
        url: "/getlogin",
        timeout: 2000,
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            let playerUsername = data.username;
            setUser(playerUsername);
        },
        error: () => {
            alert('Error');
        }
    });
    resize();
}

// Logga ut
function quit() {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/menu');
}

const restart = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/game');
}

// Sätt username på usernameText
const setUser = (username) => {
    console.log(username)
    document.getElementById('usernameText').innerHTML = username;
}

const drawTopScoreFeed = (currentUserPositions, playerPosition) => {
    topList = [];
    let feedItem = {
        username: playerPosition.username,
        score: playerPosition.score
    };
    topList.push(feedItem);
    for (let index = 0; index < currentUserPositions.length; index++) {
        let feedItem = {
            username: currentUserPositions[index].username,
            score: currentUserPositions[index].score
        };
        topList.push(feedItem);
        topList.sort((a, b) => {
            if (a.score < b.score) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    if (topList.length > 9) {
        topList.splice(7, topList.length - 1);
    }
    topList.sort((a, b) => {
        if (a.score < b.score) {
            return -1;
        } else {
            return 0;
        }
    });
    topList.reverse();
    let feedText = '';
    for (let index = 0; index < topList.length; index++) {
        if (topList[index].username == playerPosition.username) {
            feedText += `<div class="topListContainer"> <span class="topListFeedNumber2"> ${index + 1}. </span> <span class="topListFeedUsername2">  ${topList[index].username} </span> <span class="topListFeedScore2"> ${topList[index].score} </span> </div>`;
        } else {
            feedText += `<div class="topListContainer"> <span class="topListFeedNumber"> ${index + 1}. </span> <span class="topListFeedUsername">  ${topList[index].username} </span> <span class="topListFeedScore"> ${topList[index].score} </span> </div>`;
        }
    }
    console.log(feedText)
    console.log(topList)
    document.getElementById('topListContainer').innerHTML = feedText;
}

document.addEventListener('mousemove', newPlayerPosition, false);
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("click", newProjectile);
document.addEventListener('mousedown', (event) => { event.preventDefault(); }, false);

socket.on('tick', (data) => {
    let parsedData = JSON.parse(data);
    let currentUserPositions = [];
    currentUserPositions = parsedData.players;
    let currentProjectilePositions = parsedData.projectiles;
    let currentLootPositions = parsedData.loot;
    if (currentUserPositions) {
        for (let index = 0; index < currentUserPositions.length; index++) {
            if (currentUserPositions[index].id == socketId) {
                playerPosition = {
                    xCord: currentUserPositions[index].xCord,
                    yCord: currentUserPositions[index].yCord,
                    radius: currentUserPositions[index].radius,
                    username: currentUserPositions[index].username,
                    score: currentUserPositions[index].score
                }
                currentUserPositions.splice(index, 1);
            }
        }
        draw(currentUserPositions, currentProjectilePositions, currentLootPositions);
        socket.emit('update', {
            clientAngel: angel,
            clientUseAngel: useAngel
        });
        drawTopScoreFeed(currentUserPositions, playerPosition);
    }
});

socket.on('obliterated', (data) => {
    let feedItem = {
        obliterated: data.obliterated,
        obliterator: data.obliterator
    };
    feedList.push(feedItem);
    if (feedList.length > 9) {
        feedList.splice(0, 1);
    }
    let feedText = '';
    for (let index = 0; index < feedList.length; index++) {
        if (feedList[index].obliterator == playerPosition.username) {
            feedText += `<span class="obliteratedFeed2"> ${feedList[index].obliterator}  obliterated  ${feedList[index].obliterated} </span>`;
        } else {
            feedText += `<span class="obliteratedFeed"> ${feedList[index].obliterator}  obliterated  ${feedList[index].obliterated} </span>`;
        }
    }
    document.getElementById('obliteratedFeedContainer').innerHTML = feedText;

    if (socketId == data.id) {
        setTimeout(() => {
            if (feedItem.obliterator == feedItem.obliterated) {
                document.getElementById('obliteratedMessage3').innerHTML = `by yourself`;
            } else {
                document.getElementById('obliteratedMessage3').innerHTML = `by ${feedItem.obliterator}`;
            }
            document.getElementById('obliteratedMessageContainer').style.visibility = 'visible';
        }, 32);
    }
});

socket.on('startreload', () => {
    reload = true;
});


setInterval(() => {
    if (reload) {
        reloadBarValue += ((Math.PI * 2) / 62.5); // 62.5 is half the tick rate;
        if (reloadBarValue >= Math.PI * 2) {
            reload = false;
            reloadBarValue = 0;
        }
    }
}, 14.5);