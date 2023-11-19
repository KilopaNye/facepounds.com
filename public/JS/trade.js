let url = window.location.pathname;
let length_URL = url.split("/");
let order_uuid = length_URL.pop();

function preOrderDomCreate(data) {
    console.log(data)
    let title = document.querySelector('.product-name');
    let amount = document.querySelector('.product-amount');
    let price = document.querySelector('.product-price');
    let site = document.querySelector('.product-site');
    let orderImg = document.querySelector('.order-img');
    orderImg.src = "https://d3utiuvdbysk3c.cloudfront.net/" + data['image_url'].split(',')[0];
    title.textContent = data['product_name'];
    amount.textContent = data['product_amount'];
    price.textContent = data['total_price'];
    site.textContent = data['owner_pre_site'];

    let nameCheck = document.querySelector('.name-check');
    let amountCheck = document.querySelector('.amount-check');
    let priceCheck = document.querySelector('.price-check');
    let siteCheck = document.querySelector('.site-check');
    let timeCheck = document.querySelector('.time-check');
    nameCheck.value = data['product_name'];
    amountCheck.value = data['product_amount']
    priceCheck.value = data['total_price']
    siteCheck.value = data['owner_pre_site']
}


let order_info_data;

function getPreOrderByUUID() {
    let token = localStorage.getItem('token');
    if (token) {
        // console.log(order_info_body);
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/get_order_trade/${order_uuid}`, {
            headers: headers,
        }).then(response => response.json()).then(data => {
            console.log(data);
            preOrderDomCreate(data["data"]);
            order_info_data = data['data']
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}
getPreOrderByUUID()

var socket = io();

function joinRoom(order_info_data) {
    let token = localStorage.getItem('token');
    let room = order_info_data['order_uuid'];
    socket.emit('join', { token: token, room: room });
}

function leaveRoom() {
    let room = document.getElementById('room').value;
    socket.emit('leave', { username: username, room: room });
}

socket.on('connect_response', function () {
    joinRoom(order_info_data);
});

let user = "";
socket.on('join_room_announcement', function (data) {
    console.log(data.user + ' has joined the room: ' + data.room);
    user = data.user
    console.log(user)
});

socket.on('leave_room_announcement', function (data) {
    console.log(data.user + ' has left the room: ' + data.room);
});


function sendMessage() {
    let token = localStorage.getItem('token');
    let message = document.querySelector('.input-message-box').value;
    message.value= "";
    if (message) {
        socket.emit('send_message_to_room', { 'token': token, 'room': order_info_data['order_uuid'], 'message': message })
    }
}
socket.on('sendMessageResponse', function (data) {
    let messageBox = document.querySelector('.message-box')
    let messageDiv = document.createElement('div')
    messageDiv.textContent = data.username + '：　' + data.message;
    messageBox.appendChild(messageDiv)
});

let messageInput = document.querySelector('.input-message-box');
messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
        messageInput.value= "";
    }
});