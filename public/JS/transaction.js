let url = window.location.pathname;
let length_URL = url.split("/");
let order_uuid = length_URL.pop();
console.log(order_uuid)
let currentUrl = window.location.href;
let identity = currentUrl.split('=').pop()
console.log("身分別" + identity)

if (identity == "buyer") {
    let orderBtn = document.querySelector('.order-btn')
    orderBtn.style.display = "block"
    orderBtn.style.display = "flex";
    orderBtn.style.alignItems = "center";
    orderBtn.style.justifyContent = "center";
}


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
    }).catch(error => {
        alert(error)
        return userLoginBool = false;
    })
}
userLoginCheck();

function preOrderDomCreate(data) {
    // console.log(data)
    let title = document.querySelector('.product-name');
    let amount = document.querySelector('.product-amount');
    let price = document.querySelector('.product-price');
    let site = document.querySelector('.product-site');
    let orderImg = document.querySelector('.order-img');
    orderImg.src = "https://d3utiuvdbysk3c.cloudfront.net/" + data['image_url'].split(',')[0];
    title.textContent = data['product_name'];
    amount.textContent = data['order_amount'];
    price.textContent = data['total_price'];
    site.textContent = data['trade_site'];
}


let order_info_data = "";
let seller_id = "";
let buyer_id = "";
let product_id = "";
function getPreOrderByUUID() {
    let token = localStorage.getItem('token');
    if (token) {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/transaction/order/${order_uuid}`, {
            headers: headers,
        }).then(response => response.json()).then(data => {
            preOrderDomCreate(data["data"]);
            console.log(data)
            order_info_data = data["data"];
            seller_id = order_info_data['seller_id']
            buyer_id = order_info_data['buyer_id']
            product_id = order_info_data['product_id']
            console.log("sssss", order_info_data)
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}
getPreOrderByUUID()


// var socket = io("http://localhost:3000");
var socket = io("facepounds.com",{
    path:"/mysocket"
});

function joinRoom(order_uuid) {
    let token = localStorage.getItem('token');
    let room = order_uuid;
    socket.emit('join', { token: token, room: room });
}

function leaveRoom() {
    let room = document.getElementById('room').value;
    socket.emit('leave', { username: username, room: room });
}

socket.on('connect_response', function (data) {
    joinRoom(order_uuid);
});

let user = "";
socket.on('join_room_announcement', function (data) {
    console.log(data)
});

socket.on('leave_room_announcement', function (data) {
    console.log(data.user + ' has left the room: ' + data.room);
});


function sendMessage() {
    let time = getTimeNow();
    let token = localStorage.getItem('token');
    let message = document.querySelector('.input-message-box').value;
    if (message) {
        socket.emit('send_message_to_room', { 'token': token, "time": time, 'room': order_info_data['order_uuid'], 'message': message });
        let messages = document.querySelector('.input-message-box');
        messages.value = "";
    }

}
socket.on('sendMessageResponse', function (data) {
    let messageBox = document.querySelector('.message-box');
    let messageDiv = document.createElement('div');
    messageDiv.textContent = data.username + ':' + data.message;
    messageBox.appendChild(messageDiv);
    let timeSpan = document.createElement('span');
    timeSpan.textContent = getTimeNow();
    messageDiv.appendChild(timeSpan);
});
let inviteState = true;


socket.on('invite-response', (data) => {
    console.log("SKR")
    let messageBox = document.querySelector('.message-box');
    let messageDiv = document.createElement('div');
    if (inviteState) {
        if (data.identity == "buyer") {
            messageDiv.textContent = "-----買家已進入視訊聊天室-----";
        } else {
            messageDiv.textContent = "-----賣家已進入視訊聊天室-----";
        }
        messageDiv.style.textAlign = "center"
        messageDiv.style.fontSize = "14px"
        messageDiv.style.opacity = "0.5"
        messageBox.appendChild(messageDiv);
    }
})

let messageInput = document.querySelector('.input-message-box');
messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
        messageInput.value = "";
    }
});

function getTimeNow() {
    let now = new Date(); // 取得當前時間
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // 月份是從0開始的，所以要加1
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    function padZero(number) {
        return number < 10 ? '0' + number : number;
    }

    // 格式化為24小時制日期時間
    let formattedDateTime = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    return formattedDateTime
}

socket.on('order-ok-response',()=>{
    showOk();
})

function getMessageLoad() {
    let token = localStorage.getItem('token');
    headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    fetch(`/api/message-history/${order_uuid}`, {
        headers: headers,
    }).then(response => response.json()).then(data => {
        console.log(data);
        user = data.user;
        // console.log(data);
        let messageLoad = data["data"];
        for (let i = 0; i < messageLoad.length; i++) {
            let messageBox = document.querySelector('.message-box');
            messageBox.scrollTop = messageBox.scrollHeight;
            let messageDiv = document.createElement('div');
            messageDiv.textContent = messageLoad[i]["username"] + ': ' + messageLoad[i]['message'];
            messageBox.appendChild(messageDiv);
            let timeSpan = document.createElement('span');
            timeSpan.textContent = messageLoad[i]['upload_time'];
            messageDiv.appendChild(timeSpan);
        }
        // order_info_data = data['data']
    }).catch(error => {
        console.log(error);
    })
}

getMessageLoad();


function orderOK() {
    let token = localStorage.getItem('token');
    let title = order_info_data['order_name']
    let amountCheck = order_info_data['order_amount']
    let priceCheck = order_info_data['total_price']
    let siteCheck = order_info_data['trade_site']
    let timeCheck = order_info_data['trade_time']
    let order_result = {
        name: title,
        amount: amountCheck,
        price: priceCheck,
        site: siteCheck,
        orderUUID: order_uuid,
        trade_time: timeCheck,
        seller_id: seller_id,
        buyer_id: buyer_id,
        product_id: product_id,
        order_time: getTimeNow()
    }
    if (token) {

        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        fetch(`/api/transaction/order`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ order_result })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["data"]) {
                showAlert();
                socket.emit("order-ok",{room:order_uuid})
            } else if (data["error"]) {
                showError(error);
            }

        }).catch(error => {
            console.log(error);
            showError(error);
        })
    }
}

const showOk = () => {
    Swal.fire({
        icon: 'success',
        title: '對方已確認完成訂單!',
        text: '請於<歷史交易紀錄>介面查看相關內容',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/ready_trade";
        }
    })
}

const showAlert = () => {
    Swal.fire({
        icon: 'success',
        title: '訂單交易已完成!',
        text: '請於<歷史交易紀錄>介面查看相關內容',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/trade-history";//待改網址
        }
    })
}

const showCheck = () => {
    Swal.fire({
        title: "操作確認",
        text: "是否確認完成該筆交易",
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            orderOK();
        }
    });
}

const showError = () => {
    Swal.fire({
        icon: 'error',
        title: '發生錯誤',
        text: '請聯繫客服人員',
    })
}
function orderOkCheck() {

}




function GoBack() {
    window.location.href = "/ready_trade"
}