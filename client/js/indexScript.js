// DEKLARATION AV X OCH Y
var x_cord;
var y_cord;
// Deklaration av anda variabler
var c;
var ctx;
var trigValue = 0;
//Deklaration av ticker
var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
//Deklaration av storleks variabler
var canvasWidth;
var canvasHeight;
//Deklaration av storleks förhållande använder width = 250px som standard
var sizeComparedTo;
// Inehåller kontainern för ritytan. Används för att ändara ritytans storlek.
var containerSize;



// Ger vaiabler värden och "callar" andra funktioner, utan denna får variabler värdet null och
// skiten går sönder, detta händer pågrund av att js körs inan html är klar
function canvasSetup() {
    containerSize = document.querySelector("#indexCanvisContainer");
    c = document.querySelector("#indexCanvas");
    ctx = c.getContext("2d");
    resize();
    drawCircle();
}
// Kollar om sidan har lattad klart om den har det så kör canvasSetup()
window.onload = canvasSetup;

//ritar och animerar canvas
function drawCircle() {
    // TÖMER CANVAS
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Tar fram nya x och y kordinater
    x_cord = 50 * Math.cos(trigValue);
    y_cord = 50 * Math.sin(trigValue);

    // loopen ser till så att fler en ett exemplar per variant skrivs ut om det behövs
    // sizeComparedTo dvs. canvas storleken besämmer
    for (let index = 1; index <= sizeComparedTo; index++) {

        // RITAR PÅ CANVAS, Cirkel i Cirkelbana
        ctx.beginPath();
        ctx.arc(index * (90 + x_cord), index * (90 + y_cord), 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

        // Ritar på canvas, Cirkel i bana i y-led
        ctx.beginPath();
        ctx.arc((index * 220), index * (122 + (y_cord * 2)), 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

        // Ritar på canvas, Cirkel i bana i x-led
        ctx.beginPath();
        ctx.arc(index * (122 + (x_cord * 2)), (((index - 1) * 180) + 240), 20, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

    }

    // Ökar värdet och updaterar sidan
    trigValue += Math.PI / 128;
    requestAnimationFrame(drawCircle);
}

// ändrar storlek på canvis och gör den responsiv
function resize() {
    // Sparar nya värden och loggar dem
    canvasWidth = containerSize.offsetWidth;
    console.log(canvasWidth);
    canvasHeight = containerSize.offsetHeight;
    console.log(canvasHeight);
    // Sätter värde på sizeComparedTo
    sizeComparedTo = (1 + parseInt(canvasWidth / 250));
    console.log("ComparedTo:: " + sizeComparedTo);
    // Sätter det nya värderna
    c.width = canvasWidth;
    c.height = canvasHeight;
}

// Ajax login post tar svaret och sckikar användaren till en annan sida eller skriver felmedelanden
function login() {
    let passwordInput = document.getElementById('passwordInput').value;
    let usernameInput = document.getElementById('usernameInput').value;
    console.log(usernameInput + " " + passwordInput);

    $.ajax({
        type: "POST",
        url: "/login",
        timeout: 2000,
        data: { passwordInput: passwordInput, usernameInput: usernameInput },
        success: function (data) {
            if (typeof data.redirect == 'string') {
                window.location.replace(window.location.protocol + "//" + window.location.host + data.redirect);
            }
            else {
                if (!data.login) {
                    document.getElementById('inputErrorSection').innerHTML = "";
                    verificationError();
                }
            }
        },
        error: function (jqXHR, textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err)
        }
    });
}
// Skriver ut nätverksfelmedelandet
function networkError() {
    var networkErrorText = "<p class='errorText' id='networkErrorText'>Login Attempt Failed</p>"
    document.getElementById('inputErrorSection').innerHTML += networkErrorText;
}
// Skriver ut verifikerar error
function verificationError() {
    var verificationErrorText = "<p class='errorText' id ='verificationErrorText'>Wrong Username/Password Combination</p>"
    document.getElementById('inputErrorSection').innerHTML += verificationErrorText;
}