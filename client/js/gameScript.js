/*
        Fixa rezize så att den inte förstör absolut allt (VET EJ VARFÖR??????)
        Fixa scale
        tab bug fixad men kan utveklas
        Collision controll funkar men bör ändras
        canvas save and restore för att fixa buggar??
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
let middlePosition, lastMiddlePosition;
let canvasWidth;
let canvasHeight;
let playerPosition;
let lastPlayerPosition = {
    xCord: 0,
    yCord: 0
}
let mouseX = 0;
let mouseY = 0;
let angel;
let useAngel = true;
let notFirst = false;

let reload = false;
let reloadBarValue = 0;

class Projectile {
    constructor() {
        this.angel = angel;
        this.useAngel = useAngel;
        this.id = socketId;
    }
}

// Get the canvas center and set it to player posision
const getCenterCanvas = () => {
    let containerSize = document.getElementById('gameCanvasContainer');
    // SKA KOLLA OM DE ÄR FÖRSTA OCH SPARA VÄRDERNA
    if (!notFirst) {
        lastMiddlePosition = { xCord: (canvasWidth / 2), yCord: (canvasHeight / 2) };
    } else {
        lastMiddlePosition = { xCord: middlePosition.xCord, yCord: middlePosition.yCord };
    }
    middlePosition = { xCord: (canvasWidth / 2), yCord: (canvasHeight / 2) };
}

// Draw all objects 
const draw = (currentUserPositions, currentProjectilePositions, currentLootPositions) => {
    getCenterCanvas();
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    // Clear canvas
    if (notFirst) {
        ctx.translate(-1 * (middlePosition.xCord - lastPlayerPosition.xCord), -1 * (middlePosition.yCord - lastPlayerPosition.yCord));
        ctx.clearRect(-10000, -10000, 26000, 26000);
    }
    notFirst = true;
    ctx.translate((middlePosition.xCord - playerPosition.xCord), (middlePosition.yCord - playerPosition.yCord));
    drawGrid();
    drawLoot(currentLootPositions);
    drawProjectiles(currentProjectilePositions);
    drawUsers(currentUserPositions);
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
    ctx.strokeStyle = "#000000";
    ctx.rect(0, 0, 2600, 2600);
    ctx.stroke();
}

const drawUsers = (currentUserPositions) => {
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    for (let index = 0; index < currentUserPositions.length; index++) {
        if (currentUserPositions[index].id) {
            ctx.beginPath();
            ctx.arc(currentUserPositions[index].xCord, currentUserPositions[index].yCord, currentUserPositions[index].radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.fill();
            // console.log(" sdadasd");
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
    ctx.arc(playerPosition.xCord, playerPosition.yCord, 20 + 14, 3* Math.PI/2, reloadBarValue + 3*  Math.PI/2, true);
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
    if ((angleX == 0 && angleY == 0) || ((middlePosition.xCord - mouseX < 15 && middlePosition.xCord - mouseX > -15)) && (middlePosition.yCord - mouseY < 15 && middlePosition.yCord - mouseY > -15)) {
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
    console.log("asdasd")
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
        type: "POST",
        url: "/game",
        timeout: 2000,
        data: {},
        success: function (data) {

            let username = data.Username;
            setUser(username);
        },
        error: () => {
            alert('Error');
        }
    });
    resize();
}

// Logga ut
const logout = () => {
    $.ajax({
        type: "POST",
        url: "/logout",
        timeout: 2000,
        data: {},
        success: function (data) {
            window.location.replace(window.location.protocol + "//" + window.location.host + '/');
        },
        error:  () => {
            alert('Error');
        }
    });
}

const restart = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/game');
}

// Sätt username på usernameText
const setUser = (username) => {
    document.getElementById('usernameText').innerHTML = username;
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
                    radius: currentUserPositions[index].radius
                }
                currentUserPositions.splice(index, 1);
            }
        }
        draw(currentUserPositions, currentProjectilePositions, currentLootPositions);
        socket.emit('update', {
            clientAngel: angel,
            clientUseAngel: useAngel
        });
        lastPlayerPosition.xCord = playerPosition.xCord;
        lastPlayerPosition.yCord = playerPosition.yCord;
    }
});

socket.on('obliterated', (data) => {
    if (socketId == data) {
        setTimeout(() => {
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