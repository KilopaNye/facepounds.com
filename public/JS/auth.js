const showRegisterOk = () => {
    Swal.fire({
        icon: 'success',
        title: '用戶建立成功!',
        text: '請點擊右上角登入按鈕登入帳戶',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/";
        }
    })
}



function goRegister() {
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display = "none";
    registerBox.style.display = "block";
}
function goLogin() {
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display = "block";
    registerBox.style.display = "none";
}

function closeInput() {
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display = "none";
    loginBox.style.display = "none";
}
function closeRegister() {
    let loginBg = document.querySelector(".login-class");
    let registerBox = document.querySelector(".register-box");
    loginBg.style.display = "none";
    registerBox.style.display = "none";
}

function loginBlock() {
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display = "block";
    loginBox.style.display = "block";
}
function logoutBlock() {
    window.localStorage.removeItem('token');
    window.location.href = "/";
}

function register() {
    let headers = {
        "Content-Type": "application/json",
    };
    let name = document.querySelector('.name-text').value;
    let email = document.querySelector('.email-text').value;
    let password = document.querySelector('.password-text').value;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    function isValidEmail(email) {
        return emailPattern.test(email);
    }

    const namePattern = /^[\u4e00-\u9fa5a-zA-Z_]{1,8}$/;
    function isValidName(name) {
        return namePattern.test(name);
    }

    const passwordPattern = /^[a-zA-Z0-9_]+$/;
    function isValidPassword(password) {
        return passwordPattern.test(password);
    }

    if (isValidName(name) && isValidEmail(email) && isValidPassword(password)) {
        fetch("/api/user", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: name, email: email, password: password })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["error"] != null) {
                let errorMessage = document.querySelector(".error-message")
                errorMessage.innerHTML = "註冊失敗，重複註冊的Email或其他原因"
                errorMessage.style.color = "red"
            } else {
                let errorMessage = document.querySelector(".error-message")
                errorMessage.innerHTML = "註冊成功，請登入會員帳號!"
                errorMessage.style.color = "#99FF33"
                showRegisterOk()
            }
        }).catch(error => {
            console.error("發生錯誤", error);
        });
    } else {
        let errorMessage = document.querySelector(".error-message")
        errorMessage.innerHTML = "註冊失敗，請依照正確格式填寫"
        errorMessage.style.color = "red"
    }
};

function login() {
    let headers = {
        "Content-Type": "application/json",
    };
    let email = document.querySelector('.login-email').value;
    let password = document.querySelector('.login-password').value;
    if (email && password) {
        fetch("/api/user/auth", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ email: email, password: password })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["error"] != true) {
                let token = data["token"];
                console.log(token);
                window.localStorage.setItem('token', token);
                window.location.href = window.location.pathname;
            } else {
                let message = document.querySelector('.message')
                message.innerHTML = "登入失敗，帳號密碼錯誤或其他原因"
                message.style.color = "red"
            };
        }).catch(error => {
            console.error("發生錯誤", error);
        });
    } else {
        let message = document.querySelector('.message')
        message.innerHTML = "電子信箱、密碼欄位不得為空"
        message.style.color = "red"
    };
};
let userLoginBool;
function userLoginCheck() {
    let token = localStorage.getItem('token');
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    fetch("/api/user/auth", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        // console.log(data['data'])
        if (!data['data']) {
            console.log("尚未登入");
            window.location.href="/";
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
    }).catch(error => {
        return userLoginBool = false;
    })
}


function userLoginCheck_index() {
    let token = localStorage.getItem('token');
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    fetch("/api/user/auth", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        // console.log(data['data'])
        if (!data['data']) {
            console.log("尚未登入");
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
    }).catch(error => {
        return userLoginBool = false;
    })
}
