// Globala variabler
let canvasWidth;
let canvasHeight;
let c;
let username;
let selectedMenue = 'play';

const defaoultScale = 680;


const startup = () => {
    // Hämntar användarnamn och anropar andera functioner
    getUsername();

    // hämtar antalet nuvarande spelare varje sekund
    /* getNumberOfUsers();
     setInterval(() => {
         getNumberOfUsers();
     }, 1000); */
}

const drawMenue = () => {
    console.log(canvasHeight + " , " + canvasWidth + " " + selectedMenue)
    let ctx = c.getContext("2d");
    ctx.clearRect(-10000, -10000, 26000, 26000);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // draw button boxes

    // top box
    ctx.fillStyle = '#777777';
    ctx.strokeStyle = '#777777';
    ctx.fillRect(0, 0, canvasWidth, (canvasHeight / 80) * 4.3);
    ctx.fillRect(0, 0, canvasWidth / 4, (canvasHeight / 80) * 7.4);
    ctx.beginPath();
    ctx.moveTo(0, (canvasHeight / 80) * 7.4);
    ctx.lineTo(canvasWidth / 4, (canvasHeight / 80) * 7.4);
    ctx.arcTo((canvasWidth / 10) * 3, (canvasHeight / 80) * 7.4, (canvasWidth / 10) * 3, 0, canvasWidth * 0.05);
    ctx.lineTo((canvasWidth / 10) * 3, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fill();

    // profile box
    if (selectedMenue === 'profile') {
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(0, (canvasHeight / 80) * 8.4, canvasWidth / 7, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, (canvasHeight / 80) * 8.4, canvasWidth / 8, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#FFFFFF";
    }
    // text
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('Profile', canvasWidth / 8 / 2.2, (canvasHeight / 80) * 14.8 / 0.9);

    // loadout box
    if (selectedMenue === 'loadout') {
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(0, (canvasHeight / 80) * 24.2, canvasWidth / 7, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, (canvasHeight / 80) * 24.2, canvasWidth / 8, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#FFFFFF";
    }
    // text
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('Loadout', canvasWidth / 8 / 2.2, (canvasHeight / 80) * 24.2 / 0.75);

    // play box
    if (selectedMenue === 'play') {
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(0, (canvasHeight / 80) * 40, canvasWidth / 7, (canvasHeight / 80) * 14.8);

        // Play button
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 24) * 12, (canvasHeight / 80) * 43.7, (canvasWidth / 24 * 2), (canvasHeight / 80) * 7.4);

        // Play text
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Play!', ((canvasWidth / 24) * 12) + ((canvasWidth / 24 * 2) / 2), ((canvasHeight / 80) * 43.7) + ((canvasHeight / 80) * 7.4 / 1.5));
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, (canvasHeight / 80) * 40, canvasWidth / 8, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#FFFFFF";
    }
    // text
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('Play', canvasWidth / 8 / 2.2, (canvasHeight / 80) * 43.7 / 0.9);

    // store box
    if (selectedMenue === 'store') {
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(0, (canvasHeight / 80) * 55.8, canvasWidth / 7, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, (canvasHeight / 80) * 55.8, canvasWidth / 8, (canvasHeight / 80) * 14.8);
        ctx.fillStyle = "#FFFFFF";
    }
    // text
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('Store', canvasWidth / 8 / 2.2, (canvasHeight / 80) * 55.8 / 0.867);

    // ??? box
    if (selectedMenue === '???') {
        ctx.fillStyle = "#ff6347";
        ctx.fillRect(0, (canvasHeight / 80) * 71.6, canvasWidth / 7, (canvasHeight / 80) * 8.5); 
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, (canvasHeight / 80) * 71.6, canvasWidth / 8, (canvasHeight / 80) * 8.5); 
        ctx.fillStyle = "#FFFFFF";
    }
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('???', canvasWidth / 8 / 2.2, (canvasHeight / 80) * 71.6 / 0.925);


    // username
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(username, canvasWidth / 8, canvasHeight / 18);
}

const changeMenue = (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    console.log(mouseX + " mouse click " + mouseY);

    if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 8.4) && mouseX < (canvasWidth / 8) && mouseY < (((canvasHeight / 80) * 14.8) + ((canvasHeight / 80) * 8.4))) {
        selectedMenue = 'profile';
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 24.2) && mouseX < (canvasWidth / 8) && mouseY < (((canvasHeight / 80) * 14.8)) + (((canvasHeight / 80) * 24.2))) {
        selectedMenue = 'loadout';
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 40) && mouseX < (canvasWidth / 8) && mouseY < (((canvasHeight / 80) * 40) + ((canvasHeight / 80) * 14.8))) {
        selectedMenue = 'play';
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 55.8) && mouseX < (canvasWidth / 8) && mouseY < ((canvasHeight / 80) * 55.8) + ((canvasHeight / 80) * 14.8)) {
        selectedMenue = 'store';
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 71.6) && mouseX < (canvasWidth / 8) && mouseY < ((canvasHeight / 80) * 71.6) + ((canvasHeight / 80) * 14.8)) {
        selectedMenue = '???';
    }
    drawMenue();

    switch (selectedMenue) {
        case 'profile':

            break;
        case 'loadout':

            break;
        case 'play':
            if (mouseX > ((canvasWidth / 24) * 12) && mouseY > ((canvasHeight / 80) * 43.7) && mouseX < (((canvasWidth / 24) * 12) + (canvasWidth / 24 * 2)) && mouseY < (((canvasHeight / 80) * 43.7) + ((canvasHeight / 80) * 7.4))) {
                play();
            }
            break;
        case 'store':

            break;
        case '???':

            break;
        default:
            break;
    }
}

const logout = () => {
    $.ajax({
        type: "POST",
        url: "/logout",
        timeout: 2000,
        data: {},
        success: function (data) {
            window.location.replace(window.location.protocol + "//" + window.location.host + '/');
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
        }
    });
}

const getUsername = () => {
    $.ajax({
        url: "/getusername",
        timeout: 2000,
        data: {},
        success: function (data) {

            username = data.Username;
            console.log(username)
            resize();
            drawMenue();
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
            resize();
            drawMenue();
        }
    });
}

const getNumberOfUsers = () => {
    $.ajax({
        url: "/getnumberofcurrentusers",
        timeout: 2000,
        data: {},
        success: function (data) {

            let numberOfUsers = data.users;
            setNumberOfUsers(numberOfUsers);
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
        }
    });
}

const play = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/game');
}


const setNumberOfUsers = (numberOfUsers) => {
    // document.getElementById('numberOfUsersCount').innerHTML = numberOfUsers;
}

const resize = () => {
    c = document.getElementById("menuCanvas");
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    c.style.display = 'block';
    c.width = canvasWidth;
    c.height = canvasHeight;
    drawMenue();
}

window.onload = () => {
    startup();
    document.getElementById("menuCanvas").addEventListener("click", changeMenue, false);
}
