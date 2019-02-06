// Globala variabler
let canvasWidth;
let canvasHeight;
let c;
let username;

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
    console.log(canvasHeight + " window size " + canvasWidth)
    let ctx = c.getContext("2d");
    ctx.clearRect(-10000, -10000, 26000, 26000);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // draw button boxes

    ctx.fillStyle = "#D3D3D3";
    ctx.fillRect(0, 0, canvasWidth / 4, canvasHeight / 10);

    ctx.fillStyle = "#0000FF";
    ctx.fillRect(0, canvasHeight / 10, canvasWidth / 8, (canvasHeight / 5));

    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, (canvasHeight / 10) * 3, canvasWidth / 8, (canvasHeight / 5));

    ctx.fillStyle = "#FFA500";
    ctx.fillRect(0, (canvasHeight / 2), canvasWidth / 8, (canvasHeight / 5));

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, (canvasHeight / 10) * 7, canvasWidth / 8, (canvasHeight / 5));

    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(0, (canvasHeight / 10) * 9, canvasWidth / 8, (canvasHeight / 10));

    // username

    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(username, canvasWidth / 8, canvasHeight / 18);
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
}