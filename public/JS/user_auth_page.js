function startAuth(){
    let inputElement = document.querySelector('.file-input')
    let token = localStorage.getItem('token');
    let catLoad = document.querySelector('.cat-loading')
    catLoad.style.display="flex"
    if (inputElement.files.length > 0) {
        var formData = new FormData();
        formData.append('file', inputElement.files[0]);
        headers = {
            "Authorization": `Bearer ${token}`
        }
        fetch('/api/auth', {
            method: 'POST',
            headers:headers,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data['data']);
            if (data["data"]){
                let resultNum = document.querySelector('.result-num')
                resultNum.textContent=data["data"]["number"]
                let resultIcon = document.querySelector('.result-icon')
                resultIcon.src="/images/icons/authentication.png"
                let resultTxt = document.querySelector('.result-txt')
                resultTxt.textContent = "驗證成功"
                resultTxt.style.color="rgb(110, 215, 84);"
                let backBtn = document.querySelector('.back-btn')
                backBtn.style.display="flex"
                catLoad.style.display="none"
            }else{
                console.log(data['error'])
                let resultNum = document.querySelector('.result-num')
                resultNum.textContent=data["error"]["number"]
                let resultIcon = document.querySelector('.result-icon')
                resultIcon.src="/images/icons/error.png"
                let resultTxt = document.querySelector('.result-txt')
                resultTxt.textContent = "驗證失敗"
                catLoad.style.display="none"
            }
        })
        .catch(error => {
            console.error('Error:', error);
            catLoad.style.display="none"
        });
    } else {
        console.log('No file selected.');
        catLoad.style.display="none"
    }
}



function userLoginCheck() {
    let token = localStorage.getItem('token');
    let catLoad = document.querySelector('.cat-loading')
    catLoad.style.display="none"
    if (!token) {
        console.log("尚未登入");
        window.location.href = "/";
        let logInButton = document.querySelector('#login-button');
        logInButton.style.display = "block"
        let logoutButton = document.querySelector('#logout-button');
        logoutButton.style.display = "none"
        alert("尚未登入，沒有操作權限")
        return userLoginBool = false;
    } else {
        console.log("登入");
        let logInButton = document.querySelector('#login-button');
        logInButton.style.display = "none";
        let logoutButton = document.querySelector('#logout-button');
        logoutButton.style.display = "block";
        return userLoginBool = true;
    }
}

userLoginCheck();

function GoBack(){
    window.location.href="/self_page"
}