/*
        Fixa rezize så att den inte förstör absolut allt (VET EJ VARFÖR??????)
        Fixa scale
        tab bug fixad men kan utveklas
        Collision controll funkar men bör ändras
        ändra logout till quit
        */
// Skapar konection
const socket = io();
let socketId;
socket.on('connect', function () {
    socketId = socket.id;
    console.log(socket.id);
});

// Variabler som håller reda på data
let currentUserPositions = [];
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

// Get the canvas center and set it to player posision
function getCenterCanvas() {
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
function draw(currentUserPositions) {
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
    drawUsers(currentUserPositions);
}

function drawGrid() {
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

function drawUsers(currentUserPositions) {
    c = document.getElementById("gameCanvas");
    ctx = c.getContext("2d");
    for (let index = 0; index < currentUserPositions.length; index++) {
        if (currentUserPositions[index].id) {
            ctx.beginPath();
            ctx.arc(currentUserPositions[index].xCord, currentUserPositions[index].yCord, 20, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.fill();
            // console.log(" sdadasd");
        }
    }
    // draw Player
    ctx.beginPath();
    ctx.arc(playerPosition.xCord, playerPosition.yCord, 20, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
}


function newPlayerPosition(event) {
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


// Ändrar canvasa storlek
function resize() {
    let containerSize = document.getElementById('gameCanvasContainer');
    let c = document.querySelector("#gameCanvas");
    c.style.display = 'block';
    canvasWidth = containerSize.offsetWidth;
    console.log(canvasWidth);
    canvasHeight = containerSize.offsetHeight;
    console.log(canvasHeight);
    // Sätter det nya värderna
    c.width = canvasWidth;
    c.height = canvasHeight;
    getCenterCanvas();
}

// Hämta username
function getUser() {
    $.ajax({
        url: "/getusername",
        timeout: 2000,
        data: {},
        success: function (data) {

            let username = data.Username;
            setUser(username);
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
        }
    });
    resize();
}

// Logga ut
function quit() {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/menu');
}

// Sätt username på usernameText
function setUser(username) {
    document.getElementById('usernameText').innerHTML = username;
}

document.addEventListener('mousemove', newPlayerPosition, false);

socket.on('tick', function (data) {
    let currentUserPositions = JSON.parse(data);
    for (let index = 0; index < currentUserPositions.length; index++) {
        if (currentUserPositions[index].id == socketId) {
            playerPosition = {
                xCord: currentUserPositions[index].xCord,
                yCord: currentUserPositions[index].yCord,
            }
            currentUserPositions.splice(index, 1);
        }
    }
    draw(currentUserPositions);
    socket.emit('update', {
        clientAngel: angel,
        clientUseAngel: useAngel
    });
    lastPlayerPosition.xCord = playerPosition.xCord;
    lastPlayerPosition.yCord = playerPosition.yCord;
});