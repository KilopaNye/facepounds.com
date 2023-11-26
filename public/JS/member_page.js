function GoCheck() {
    window.location.href = "/ready_check"
}

function GoUpload() {
    window.location.href = "/upload"
}

function GoTrade() {
    window.location.href = "/ready_trade"
}
userLoginCheck();
let userLoginBool;
function userLoginCheck() {
    let token = localStorage.getItem('token');
    if (!token) {
        console.log("尚未登入");
        window.location.href = "/";
        let logInButton = document.querySelector('#login-button');
        logInButton.style.display = "block"
        let logoutButton = document.querySelector('#logout-button');
        logoutButton.style.display = "none"
        return userLoginBool = false;
    } else {
        let logInButton = document.querySelector('#login-button');
        logInButton.style.display = "none";
        let logoutButton = document.querySelector('#logout-button');
        logoutButton.style.display = "block";
        return userLoginBool = true;
    }
}