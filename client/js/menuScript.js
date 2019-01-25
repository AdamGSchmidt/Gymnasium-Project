

const startup = () => {
    // Hämtar användarnamn
    getUsername();

    // hämtar antalet nuvarande spelare varje sekund
    getNumberOfUsers();
    setInterval(() => {
        getNumberOfUsers();
    }, 1000);
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

            let username = data.Username;
            setUser(username);
        },
        error: function (jqXHR, textStatus, err) {
            alert('Error');
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

const setUser = (username) => {
    document.getElementById('usernameText').innerHTML = username;
}

const setNumberOfUsers = (numberOfUsers) => {
    document.getElementById('numberOfUsersCount').innerHTML = numberOfUsers;
}

const resize = () => {
    let containerSize = document.getElementById('menuCanvasContainer');
    let c = document.getElementById("menuCanvas");
    let canvasWidth = containerSize.innerWidth;
    let canvasHeight = containerSize.innerHeight;
    c.style.width = canvasWidth;
    c.style.height = canvasHeight;
}

startup();