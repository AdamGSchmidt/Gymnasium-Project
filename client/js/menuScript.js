/*
REMOVE ???
EXTEND NAME TAB
INNCLUDE LEVEL NAME AND LEVEL BAR IN TAB
Make bacground into gameplay ??
*/

// Globala variabler
let canvasWidth;
let canvasHeight;
let c;
let username;
let login;
let selectedMenue = 'play';
let profieleContent;
let loadouts;
let currentLoadout = 0;
let currency = 0;
let level = 1;

const defaoultScale = 680;


const startup = () => {
    // Hämntar användarnamn och anropar andera functioner
    getLogin();
    getLoaduts();

    // hämtar antalet nuvarande spelare varje sekund
    /* getNumberOfUsers();
     setInterval(() => {
         getNumberOfUsers();
     }, 1000); */
}

const drawMenue = () => {
    // Hide shit
    document.getElementById('loadoutContainer').style.display = 'none';
    document.getElementById('changeWeaponContainer').style.display = 'none';

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

    // currency
    if (login == true) {
        ctx.fillStyle = '#AAAAAA';
        ctx.fillRect(canvasWidth / 80 * 63, (canvasHeight / 80) * 1, canvasWidth / 80 * 5, (canvasHeight / 80) * 6);
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.font = `${18 * canvasWidth / defaoultScale}px Arial`;
        ctx.fillText(`${currency} $`, canvasWidth / 80 * 65.5, (canvasHeight / 80) * 5.8);
    } else {
        ctx.fillStyle = '#AAAAAA';
        ctx.fillRect(canvasWidth / 80 * 58, (canvasHeight / 80) * 1, canvasWidth / 80 * 5, (canvasHeight / 80) * 6);
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.font = `${18 * canvasWidth / defaoultScale}px Arial`;
        ctx.fillText(`${currency} $`, canvasWidth / 80 * 60.5, (canvasHeight / 80) * 5.8);
    }

    // level
    ctx.fillStyle = '#AAAAAA';
    ctx.fillRect(canvasWidth / 80 * 26, (canvasHeight / 80) * 1, canvasWidth / 80 * 5, (canvasHeight / 80) * 6);
    ctx.textAlign = "center";
    ctx.fillStyle = '#000000';
    ctx.font = `${18 * canvasWidth / defaoultScale}px Arial`;
    if (profieleContent) {
        level = profieleContent.Level;
    }
    ctx.fillText(level, canvasWidth / 80 * 28.5, (canvasHeight / 80) * 5.8);
    // level bar
    // background
    ctx.fillStyle = '#000000';
    ctx.fillRect(canvasWidth / 80 * 30.9, (canvasHeight / 80) * 1, canvasWidth / 80 * 15, (canvasHeight / 80) * 6);
    ctx.StrokeStyle = '#ff6347';
    ctx.lineWidth = 3;
    ctx.rect(canvasWidth / 80 * 31.4, (canvasHeight / 80) * 2, canvasWidth / 80 * 14, (canvasHeight / 80) * 3.8);
    ctx.stroke();
    let experience = 0;
    if (profieleContent) {
        experience = profieleContent.Experience;
    }
    // bar
    ctx.fillStyle = '#000000';
    ctx.fillRect(canvasWidth / 80 * 31.4, (canvasHeight / 80) * 2, canvasWidth / 80 * 14, (canvasHeight / 80) * 3.8);
    ctx.fillStyle = '#ff6347';
    ctx.fillRect(canvasWidth / 80 * 31.4, (canvasHeight / 80) * 2, canvasWidth / 80 * 14 * (experience / (level * 1000 * Math.pow(1.1, (level - 1)))), (canvasHeight / 80) * 3.8); // has the level formula
    // bar text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${14 * canvasWidth / defaoultScale}px Arial`;
    ctx.fillText(`${Math.floor(experience / (level * 1000 * Math.pow(1.1, (level - 1))) * 100)}%`, canvasWidth / 80 * 33.5, (canvasHeight / 80) * 5.2);
    console.log(experience)

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

    // play box
    if (selectedMenue === 'play') {
        document.getElementById('displayNameInput').style.visibility = 'visible';
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
        document.getElementById('displayNameInput').style.visibility = "hidden";
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

    // username
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(username, canvasWidth / 8, canvasHeight / 18);

    // login buttons
    if (login == true) {
        // logout
        ctx.fillStyle = "#ff6347";
        ctx.fillRect((canvasWidth / 80) * 69, (canvasHeight / 80) * 1, canvasWidth / 80 * 7, (canvasHeight / 80) * 6);
        // text  
        ctx.fillStyle = "#000000";
        ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText('Logout', (canvasWidth / 80) * 72.5, canvasHeight / 16);
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
        ctx.fillRect(canvasWidth / 3.5, (canvasHeight / 80) * 20, canvasWidth / 1.7, (canvasHeight / 80) * 46.5);
        ctx.fillStyle = "#000000";

        // content
        if (login == true) {
            // content
            drawProfileContent();
        } else {
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login to see profile', (canvasWidth / 1.72), (canvasHeight / 80) * 35);
            // login
            ctx.beginPath();
            ctx.fillStyle = "#ff6347";
            ctx.fillRect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            ctx.rect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            ctx.stroke(); r
            // text  
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login', canvasWidth / 1.73, (canvasHeight / 80) * 45);
        }
    }

    if (selectedMenue === 'store') {

        // content
        if (login == true) {
            console.log(currentLoadout)
            document.getElementById('loadoutContainer').style.display = 'initial';
            document.getElementById('selectedWeaponTxt').innerHTML = loadouts[currentLoadout].Name;
            document.getElementById('selectedWeaponImg').src = loadouts[currentLoadout].Image;
        } else {
            // box
            ctx.fillStyle = "#AAAAAA";
            ctx.fillRect(canvasWidth / 3.5, (canvasHeight / 80) * 20, canvasWidth / 1.7, (canvasHeight / 80) * 40);
            ctx.fillStyle = "#000000";

            // Login info
            ctx.fillStyle = "#000000";
            ctx.font = `${15 * canvasWidth / defaoultScale}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText('Login to see store', (canvasWidth / 1.72), (canvasHeight / 80) * 35);
            // login
            ctx.beginPath();
            ctx.fillStyle = "#ff6347";
            ctx.fillRect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            ctx.rect(canvasWidth / 1.9, (canvasHeight / 80) * 40, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
            ctx.stroke();
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
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 40) && mouseX < (canvasWidth / 8) && mouseY < (((canvasHeight / 80) * 40) + ((canvasHeight / 80) * 14.8))) {
        selectedMenue = 'play';
    } else if (mouseX > 0 && mouseY > ((canvasHeight / 80) * 55.8) && mouseX < (canvasWidth / 8) && mouseY < ((canvasHeight / 80) * 55.8) + ((canvasHeight / 80) * 14.8)) {
        selectedMenue = 'store';
    }

    if (login == false) {
        if (mouseX > (canvasWidth / 80) * 71.5 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 8 + (canvasWidth / 80) * 71.5 && mouseY < (((canvasHeight / 80) * 6) + ((canvasHeight / 80) * 1))) {
            registerFunc();
        } else if (mouseX > (canvasWidth / 80) * 65 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 6 + (canvasWidth / 80) * 65 && mouseY < (((canvasHeight / 80) * 8)) + (((canvasHeight / 80) * 1))) {
            loginFunc();
        }
    } else {
        if (mouseX > (canvasWidth / 80) * 69 && mouseY > ((canvasHeight / 80) * 1) && mouseX < canvasWidth / 80 * 7 + (canvasWidth / 80) * 69 && mouseY < (((canvasHeight / 80) * 8)) + (((canvasHeight / 80) * 1))) {
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
        case 'play':
            if (mouseX > ((canvasWidth / 24) * 12) && mouseY > ((canvasHeight / 80) * 43.7) && mouseX < (((canvasWidth / 24) * 12) + (canvasWidth / 24 * 2)) && mouseY < (((canvasHeight / 80) * 43.7) + ((canvasHeight / 80) * 7.4))) {
                play();
            }
            break;
        case 'store':
            if (login == false) {
                if (mouseX > (canvasWidth / 1.9) && mouseY > (canvasHeight / 80 * 40) && mouseX < (canvasWidth / 80 * 8 + (canvasWidth / 1.9)) && mouseY < ((canvasHeight / 80 * 8) + (canvasHeight / 80 * 40))) {
                    loginFunc();
                }
            }
            break;
        default:
            break;
    }
}
const drawProfileContent = () => {
    let ctx = c.getContext("2d");

    //  title box 1
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 3.2, (canvasHeight / 80) * 24, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 1
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.8, (canvasHeight / 80) * 29);

    //  data box 1
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 2.3, (canvasHeight / 80) * 24, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 1
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.1, (canvasHeight / 80) * 29);

    //  title box 2
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 3.2, (canvasHeight / 80) * 34, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 2
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.8, (canvasHeight / 80) * 39);

    //  data box 2
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 2.3, (canvasHeight / 80) * 34, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 2
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.1, (canvasHeight / 80) * 39);

    //  title box 3
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 3.2, (canvasHeight / 80) * 44, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 3
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.8, (canvasHeight / 80) * 49);

    //  data box 3
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 2.3, (canvasHeight / 80) * 44, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 3
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.1, (canvasHeight / 80) * 49);

    //  title box 4
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 3.2, (canvasHeight / 80) * 54, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 4
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.8, (canvasHeight / 80) * 59);

    //  data box 4
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 2.3, (canvasHeight / 80) * 54, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 4
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 2.1, (canvasHeight / 80) * 59);

    //  title box 5
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.7, (canvasHeight / 80) * 24, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.6, (canvasHeight / 80) * 29);

    //  data box 5
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.4, (canvasHeight / 80) * 24, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 5
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.3, (canvasHeight / 80) * 29);

    //  title box 6
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.7, (canvasHeight / 80) * 34, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 6
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.6, (canvasHeight / 80) * 39);

    //  data box 6
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.4, (canvasHeight / 80) * 34, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 6
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.3, (canvasHeight / 80) * 39);

    //  title box 7
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.7, (canvasHeight / 80) * 44, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 7
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.6, (canvasHeight / 80) * 49);

    //  data box 7
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.4, (canvasHeight / 80) * 44, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 7
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.3, (canvasHeight / 80) * 49);

    //  title box 8
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.7, (canvasHeight / 80) * 54, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  title 8
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.6, (canvasHeight / 80) * 59);

    //  data box 8
    ctx.fillStyle = "#777777";
    ctx.fillRect(canvasWidth / 1.4, (canvasHeight / 80) * 54, canvasWidth / 80 * 8, canvasHeight / 80 * 8);
    // text  data 8
    ctx.fillStyle = "#000000";
    ctx.font = `${10 * canvasWidth / defaoultScale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText('PLACEHOLDER', canvasWidth / 1.3, (canvasHeight / 80) * 59);
}
const getProfieleContent = () => {
    $.ajax({
        url: "/getprofielecontent",
        timeout: 2000,
        data: {},
        success: function (data) {
            profieleContent = data[0];
            console.log(profieleContent)
            currency = profieleContent.Currency;
            // level = profieleContent.Level;
            if (currency > 1000 && currency < 1000000) {
                currency = `${Math.round((currency / 100)) / 10}k`
            } else if (currency > 1000000) {
                currency = `${Math.round((currency / 100000)) / 10}m`
            }
            resize();
            drawMenue();
            getCurrentLoaduts();
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error getprofilecontent');
        }
    });
};

const getLoaduts = () => {
    $.ajax({
        url: "/getskins",
        timeout: 2000,
        data: {},
        success: function (data) {
            loadouts = data;
            console.log(loadouts)
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error getloadouts');
        }
    });
};

const getCurrentLoaduts = () => {
    $.ajax({
        url: "/getcurrentskins",
        timeout: 2000,
        data: {},
        success: function (data) {
            currentLoadout = JSON.parse(data);
            let element = document.getElementById('changeWeaponContainer');
            element.innerHTML = '';
            for (i of loadouts) {
                let selectedOrNot;
                console.log(currentLoadout + "..." + i.ID)
                console.log(currentLoadout)
                if (currentLoadout == i.ID) {
                    selectedOrNot = `<div class="changeLoadoutSelectedContainer"><span class="changeLoadoutSelected">Selected</span></div>`;
                } else if (level < i.Requierment) {
                    console.log(profieleContent.Level + ":::::::::" + i.Requierment)
                    selectedOrNot = `<div class="changeLoadoutRequiresContainer"><span class="changeLoadoutRequires">Requiers lvl ${i.Requierment}</span></div>`
                } else {
                    selectedOrNot = `<input onclick=changeLoadout(${i.ID}) type="button" class="changeLoadoutBtn" value="Select">`;
                }
                element.innerHTML += `<div class="selectedLoadoutContainer2">
                                        <div class="selectedTitleContainer">
                                            <span class="selectedTitle">${i.Name}</span>
                                        </div>
                                        <div class="selectedLoadout">
                                            <img class="selectedImg2" src="${i.Image}" alt="">
                                        </div>
                                        ${selectedOrNot}
                                     </div>`;
            }
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error getcurrentloadouts');
        }
    });
};

const changeLoadout = (id) => {
    $.ajax({
        type: "POST",
        url: "/changeskin",
        timeout: 2000,
        data: { id },
        success: (data) => {
            getCurrentLoaduts();
        },
        error: (jqXHR, textStatus, err) => {
            alert('Error changeLoadout');
        }
    });
}


const getDisplayName = () => {
    $.ajax({
        url: "/getdisplayname",
        timeout: 2000,
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            if (data.displayName) {
                document.getElementById('displayNameInput').value = data.displayName;
            }
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error getdisplay name');
        }
    });
};

const changeWeapon = () => {
    document.getElementById('changeWeaponContainer').style.display = 'initial';
}

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
            alert('Error logout');
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
            console.log(username);
            if (login) {
                getDisplayName();
                getProfieleContent();
            } else {
                resize();
                drawMenue();
            }
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error login');
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
            alert('Error getnumberofusers');
        }
    });
}

const play = () => {
    $.ajax({
        type: "POST",
        url: "/setdisplayname",
        timeout: 2000,
        data: {
            displayName: document.getElementById('displayNameInput').value
        },
        success: function (data) {
            window.location.replace(window.location.protocol + "//" + window.location.host + '/game');
        },
        error: () => {
            alert('Error setdisplaynamae');
        }
    });
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
const changeLoadoutDisplay = data => {
    if (data) {
        document.getElementById('skinSelector').style.backgroundColor = '#ff6347';
        document.getElementById('skinSelectorText').style.color = '#FFFFFF';
        document.getElementById('weaponSelector').style.backgroundColor = '#AAAAAA';
        document.getElementById('weaponSelectorText').style.color = '#ff6347';
    } else {
        document.getElementById('skinSelector').style.backgroundColor = '#AAAAAA';
        document.getElementById('skinSelectorText').style.color = '#ff6347';
        document.getElementById('weaponSelector').style.backgroundColor = '#ff6347';
        document.getElementById('weaponSelectorText').style.color = '#FFFFFF';
    }
}

window.onload = () => {
    startup();
    document.getElementById("menuCanvas").addEventListener("click", changeMenue, false);
}