// Globala variabler
let canvasWidth;
let canvasHeight;
let c;
let username;
let login;
let selectedMenue = 'play';

const defaoultScale = 680;


const startup = () => {
    // Hämntar användarnamn och anropar andera functioner
    getLogin();

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
    ctx.globalCompositeOperation = 'ligther';
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

    // login buttons
    if (login == true) {
        // sign up
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 80) * 71.5, (canvasHeight / 80) * 1, canvasWidth / 80 * 8, (canvasHeight / 80) * 6);
        //text
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Friends', (canvasWidth / 80) * 75.5, canvasHeight / 16);

        // login
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 80) * 64, (canvasHeight / 80) * 1, canvasWidth / 80 * 7, (canvasHeight / 80) * 6);
        // text  
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Logout', (canvasWidth / 80) * 67.5, canvasHeight / 16);
    } else {
        // sign up
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 80) * 71.5, (canvasHeight / 80) * 1, canvasWidth / 80 * 8, (canvasHeight / 80) * 6);
        //text
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Sign Up', (canvasWidth / 80) * 75.5, canvasHeight / 16);

        // login
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 80) * 65, (canvasHeight / 80) * 1, canvasWidth / 80 * 6, (canvasHeight / 80) * 6);
        // text  
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Login', (canvasWidth / 80) * 68, canvasHeight / 16);
    }

    if (selectedMenue === 'profile') {
        // profile content 

        // box
        ctx.fillStyle = "#AAAAAA";
        ctx.fillRect(canvasWidth / 3.5, (canvasHeight / 80) * 20, canvasWidth / 1.7, (canvasHeight / 80) * 40);
        ctx.fillStyle = "#000000";

        // content
        if (login == true) {
            let contentList = getProfieleContent();
        } else {
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login to see profile', (canvasWidth / 1.72), (canvasHeight / 80) * 35);
            // login
            ctx.fillStyle = "#ff6347";
            ctx.fillRect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            // text  
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login', canvasWidth / 1.73, (canvasHeight / 80) * 45);
        }
    }

    if (selectedMenue === 'loadout') {
        // loadout content 

        // box
        ctx.fillStyle = "#AAAAAA";
        ctx.fillRect(canvasWidth / 3.5, (canvasHeight / 80) * 20, canvasWidth / 1.7, (canvasHeight / 80) * 40);
        ctx.fillStyle = "#000000";

        // content
        if (login == true) {
            let contentList = getProfieleContent();
        } else {
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login to change loadout', (canvasWidth / 1.72), (canvasHeight / 80) * 35);
            // login
            ctx.fillStyle = "#ff6347";
            ctx.fillRect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            // text  
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login', canvasWidth / 1.73, (canvasHeight / 80) * 45);
        }
    }
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

    if (login == false) {
        if (mouseX > (canvasWidth / 80) * 71.5 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 8 + (canvasWidth / 80) * 71.5 && mouseY < (((canvasHeight / 80) * 6) + ((canvasHeight / 80) * 1))) {
            registerFunc();
        } else if (mouseX > (canvasWidth / 80) * 65 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 6 + (canvasWidth / 80) * 65 && mouseY < (((canvasHeight / 80) * 8)) + (((canvasHeight / 80) * 1))) {
            loginFunc();
        }
    } else {
        if (mouseX > (canvasWidth / 80) * 71.5 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 8 + (canvasWidth / 80) * 71.5 && mouseY < (((canvasHeight / 80) * 6) + ((canvasHeight / 80) * 1))) {
            friendsFunc();
        } else if (mouseX > (canvasWidth / 80) * 65 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 6 + (canvasWidth / 80) * 65 && mouseY < (((canvasHeight / 80) * 8)) + (((canvasHeight / 80) * 1))) {
            logoutFunc();
        }
    }
    drawMenue();

    switch (selectedMenue) {
        case 'profile':
            if (login == false) {
                if (mouseX > (canvasWidth / 1.9) && mouseY > (canvasHeight / 80 * 40) && mouseX < (canvasWidth / 80 * 8 + (canvasWidth / 1.9)) && mouseY < ((canvasHeight / 80 * 8) + (canvasHeight / 80 * 40))) {
                    loginFunc();
                }
            }
            break;
        case 'loadout':
            if (login == false) {
                if (mouseX > (canvasWidth / 1.9) && mouseY > (canvasHeight / 80 * 40) && mouseX < (canvasWidth / 80 * 8 + (canvasWidth / 1.9)) && mouseY < ((canvasHeight / 80 * 8) + (canvasHeight / 80 * 40))) {
                    loginFunc();
                }
            }
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

const getProfieleContent = () => {
    $.ajax({
        url: "/getprofielecontent",
        timeout: 2000,
        data: {},
        success: function (data) {

        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
            resize();
            drawMenue();
        }
    });
};

const registerFunc = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/register');
};

const loginFunc = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host + '/');
};

const logoutFunc = () => {
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

const getLogin = () => {
    $.ajax({
        url: "/getlogin",
        timeout: 2000,
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            username = data.username || 'Guest';
            login = data.login || false;
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
