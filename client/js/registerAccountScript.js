window.onload = canvasSetup;

// AJAX och regestrering av konto
// *********************************************************************
// AJAX som används för post
function registerPOST() {
    let registerPassword = document.getElementById('passwordInputRegister').value;
    let registerPasswordRepete = document.getElementById('passwordRepeatInputRegister').value;
    let registerUsername = document.getElementById('usernameInputRegister').value;

    // tömemr input och errors
    document.getElementById('usernameErrorMessageSection').innerHTML = "";
    document.getElementById('passwordErrorMessageSection').innerHTML = "";
    document.getElementById('passwordRepeteErrorMessageSection').innerHTML = "";

    document.getElementById('passwordInputRegister').value = "";
    document.getElementById('passwordRepeatInputRegister').value = "";

    // Skicka ett post request och anropar utvalld funktion för svar
    $.ajax({
        type: "POST",
        url: "/register",
        timeout: 2000,
        data: { registerPassword: registerPassword, registerPasswordRepete: registerPasswordRepete, registerUsername: registerUsername },
        success: function (data) {
            postResultHandling(data);
            console.log(data);
        },
        error: function (jqXHR, textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err)
        }
    });
}

function postResultHandling(data) {
    data = JSON.parse(data);

    let registrationPasswordInputError = data.registrationPasswordInputError;
    let registrationPasswordInputRepeteError = data.registrationPasswordInputRepeteError;
    let registrationUsernameInputError = data.registrationUsernameInputError;
    let registrationUsernameInputFormatError = data.registrationUsernameInputFormatError;

    if (!registrationPasswordInputError) {
        passwordError();
    } if (!registrationPasswordInputRepeteError) {
        passwordMatchErrors();
    } if (!registrationUsernameInputError) {
        usernameTakenError();
    } if (!registrationUsernameInputFormatError) {
        usernameFormatError();
    }

    if (registrationPasswordInputError && registrationPasswordInputRepeteError && registrationUsernameInputError && registrationUsernameInputFormatError) {
        registrationSuccsess();
    }
}

// *********************************************************************

//  functioner som skriver ut error medelanden utifrån servern
// *********************************************************************
function usernameFormatError() {
    let usernameErrorText = "<p class='errorText' id='usernameWrongFormatError'>Minumum of four caracters</p>";
    document.getElementById('usernameErrorMessageSection').innerHTML = usernameErrorText;
}

function usernameTakenError() {
    let usernameErrorText = "<p class='errorText' id='usernameTakenError'>Username Taken</p>";
    document.getElementById('usernameErrorMessageSection').innerHTML = usernameErrorText;
}

function passwordError() {
    let passwordErrorText = "<p class='errorText' id='passwordWrongFormatLengthError'>Minimum of eight caracters</p>";
    passwordErrorText += "<p class='errorText' id='passwordWrongFormatNumberError'>Need to contain number</p>";
    passwordErrorText += "<p class='errorText' id='passwordWrongFormatUpperCaseError'>Need to contain upper case</p>";
    passwordErrorText += "<p class='errorText' id='passwordWrongFormatLowerCaseError'>Need to contain lower case</p>";
    document.getElementById('passwordErrorMessageSection').innerHTML = passwordErrorText;
}

function passwordMatchErrors() {
    let passwordRepeteErrorText = "<p class='errorText' id='passwordRepeteError'>Passwords do not match</p>";
    document.getElementById('passwordRepeteErrorMessageSection').innerHTML = passwordRepeteErrorText;
}
// *********************************************************************

// visar registerAccountSuccessMessage.
function registrationSuccsess() {
    document.getElementById("registerAccountSuccessMessage").style.visibility = "visible";
}

// Lägger in texten i tooltip span passwordRegisterTooltip.
// TANKEN ÄR ATT TOOLTIP DYNAMISKT SKA UPPDATERAS SÅ ATT NÄR MAN UPPFYLLER VILKOR SÅ FÖRSVINNER DEM
// ***TILLFÄLLIG***
function tooltipAddText() {
    var tooltipAddText = "Minimum of Eight Caracters.<br>Must Include Number.<br>Must Include Uppercase.<br>Must Include Lowercase.";
    document.getElementById('passwordRegisterTooltip').innerHTML = tooltipAddText;
}

// ALL SCRIPT EFTER DENNA KOD ÄR EN KOPIA AV INDEX'S SCRIPT. (FÖRUTOM START())
// DEN BÖR BYTTAS UT OCH FLYTTAS
// ***TILLGÄLLIG***

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
var coontainerSize;
// Ger vaiabler värden och "callar" andra funktioner, utan denna får variabler värdet null och
// skiten går sönder, detta händer pågrund av att js körs inan html är klar
function canvasSetup() {
    coontainerSize = document.getElementById("registerCanvasContainer");
    c = document.getElementById("registerCanvas");
    ctx = c.getContext("2d");
    resize();
    drawCircle();
}

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
    canvasWidth = coontainerSize.offsetWidth;
    console.log(canvasWidth);
    canvasHeight = coontainerSize.offsetHeight - 5;
    console.log(canvasHeight);
    // Sätter värde på sizeComparedTo
    sizeComparedTo = (1 + parseInt(canvasWidth / 250));
    console.log("ComparedTo:: " + sizeComparedTo);
    // Sätter det nya värderna
    c.width = canvasWidth;
    c.height = canvasHeight;
}

// ***TILLFÄLLIG*** Denna function callar tooltip text samt canvas setup ändra senare
function start() {
    console.log("Start");
    tooltipAddText();
    canvasSetup();
}