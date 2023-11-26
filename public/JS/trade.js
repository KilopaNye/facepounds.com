let url = window.location.pathname;
let length_URL = url.split("/");
let order_uuid = length_URL.pop();
console.log(order_uuid)
let currentUrl = window.location.href;
let identity = currentUrl.split('=').pop()
console.log("身分別"+identity)
userLoginCheck();

const showAlert = () => {
    Swal.fire({
        icon: 'success',
        title: '商議結果建立成功!',
        text: '請於<待交易>介面查看相關內容',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/ready_check";
        }
    })
}

const showError = () => {
    Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '未登入帳戶或填寫有誤，或請聯繫客服人員',
    })
}

const deleteAlert = () => {
    Swal.fire({
        icon: 'success',
        title: '已成功刪除該筆交易!',
        text: '請回到首頁查看其他產品',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/";
        }
    })
}
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

    // let nameCheck = document.querySelector('.name-check');
    let amountCheck = document.querySelector('.amount-check');
    let priceCheck = document.querySelector('.price-check');
    let siteCheck = document.querySelector('.site-check');
    let timeCheck = document.querySelector('.time-check');

    // nameCheck.setAttribute('state', '0');
    amountCheck.setAttribute('state', '0');
    priceCheck.setAttribute('state', '0');
    siteCheck.setAttribute('state', '0');
    timeCheck.setAttribute('state', '0');

    // nameCheck.value = data['product_name'];
    amountCheck.value = data['order_amount']
    priceCheck.value = data['total_price']
    siteCheck.value = data['trade_site']
    timeCheck.value = data['trade_time']
    if (identity == "buyer") {
        let checkBtn = document.querySelectorAll('#check-btn')
        checkBtn.forEach(function (checkBtn) {
            checkBtn.textContent = '確認';
            checkBtn.setAttribute('value', 'buyer')
        });
        // nameCheck.setAttribute('readonly', 'true')
        amountCheck.setAttribute('readonly', 'true')
        priceCheck.setAttribute('readonly', 'true')
        siteCheck.setAttribute('readonly', 'true')
        timeCheck.setAttribute('readonly', 'true')
    } else {

        let checkBtn = document.querySelectorAll('#check-btn')
        checkBtn.forEach(function (checkBtn) {
            checkBtn.textContent = '更改';
            checkBtn.setAttribute('value', 'seller')
        });
    }
}


let order_info_data = "";
let seller_id = "";
let buyer_id = "";
let product_id = "";
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
            preOrderDomCreate(data["data"]);
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

var socket = io("facepounds.com",{
    path:"/mysocket"
});
// var socket = io("http://localhost:3000");

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
    messageBox.scrollTop = messageBox.scrollHeight;
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

function getMessageLoad() {
    fetch(`/api/trade/get_message_load/${order_uuid}`, {
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
            messageDiv.textContent = messageLoad[i]["username"] + ':' + messageLoad[i]['message'];
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




function accept(identity) {
    let user = identity.getAttribute('value');
    let index = identity.getAttribute('index');
    let info = document.querySelector(`.${index}-check`);
    let infoState = info.getAttribute('state')
    if (user == "buyer") {
        if(infoState == 0){
            saveOrder(info, index);
        }else{
            deleteOrder(info, index);
        }
        
    } else if (user == "seller") {
        changeOrder(info, index);
    }
}

function stateCheck(){
    let amountCheck = document.querySelector('.amount-check');
    let priceCheck = document.querySelector('.price-check');
    let siteCheck = document.querySelector('.site-check');
    let timeCheck = document.querySelector('.time-check');
    if (amountCheck.getAttribute("state") == 1 && priceCheck.getAttribute("state") == 1 && siteCheck.getAttribute("state") == 1 && timeCheck.getAttribute("state") == 1) {
        // console.log("通過");
        let orderBtn = document.querySelector('.order-btn');
        orderBtn.style.display = "flex";
        orderBtn.style.alignItems = "center";
        orderBtn.style.justifyContent = "center";

    } else {
        // console.log("還沒");
        let orderBtn = document.querySelector('.order-btn');
        orderBtn.style.display = "none";
    }
}

function saveOrder(info, index) {
    if (info.value) {
        // info.style.backgroundColor = "#53FF53";
        let btn = document.querySelector(`.${index}-btn`);
        btn.style.backgroundColor=" #f85757"
        btn.textContent="取消"
        info.setAttribute('state', '1');
        socket.emit('stage_check', { "index": index, 'room': order_uuid })
    } else {
        alert("不能是空白");
        return false
    }

    
    stateCheck()
};

function deleteOrder(info, index){
    if (info.value) {
        let btn = document.querySelector(`.${index}-btn`);
        btn.style.backgroundColor=" #99EA52"
        btn.textContent="確認"
        info.setAttribute('state', '0');
        socket.emit('stage_change', { "index": index, 'room': order_uuid })
    } else {
        alert("錯誤");
        return false
    }

    stateCheck()
}

function changeOrder(info, index) {
    if (info.value) {
        info.setAttribute('state', '1');
        socket.emit('info_change', { "index": index, 'room': order_uuid, "message": info.value });
    } else {
        alert("不能是空白");
    }
}


socket.on('stage_response', function (data) {
    console.log(data);
    let info = document.querySelector(`.${data.index}-check`);
    info.style.backgroundColor = "#53FF53";
});

socket.on('stage_change_response', function (data) {
    let info = document.querySelector(`.${data.index}-check`);
    info.style.backgroundColor = "#FFFFFF"
    let btn = document.querySelector(`.${data.index}-btn`);
    if(identity=="buyer"){
        let info = document.querySelector(`.${data.index}-check`);
        info.setAttribute('state', '0');
        btn.style.backgroundColor=" #99EA52"
        btn.textContent="確認"
        stateCheck()
    }
});

socket.on('info_change_response', function (data) {
    let info = document.querySelector(`.${data.index}-check`);
    console.log(info)
    info.value = data.message;
    info.style.backgroundColor = "#FFFFFF";
    if(identity=="buyer"){
    
    let btn = document.querySelector(`.${data.index}-btn`);
    btn.textContent="確認"
    btn.style.backgroundColor=" #99EA52"
    
    if (data.index == "amount") {
        let amount = document.querySelector('.product-amount');
        amount.textContent = data.message;
        let amountCheck = document.querySelector(`.${data.index}-check`);
        amountCheck.setAttribute('state', '0');
    } else if (data.index == "price") {
        let price = document.querySelector('.product-price');
        price.textContent = data.message;
        let priceCheck = document.querySelector(`.${data.index}-check`);
        priceCheck.setAttribute('state', '0');
    } else if (data.index == "site") {
        let site = document.querySelector('.product-site');
        site.textContent = data.message;
        let siteCheck = document.querySelector(`.${data.index}-check`);
        siteCheck.setAttribute('state', '0');
    } else if (data.index == "time") {
        let timeCheck = document.querySelector(`.${data.index}-check`);
        timeCheck.setAttribute('state', '0');
    }
    stateCheck()
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
    return formattedDateTime;
}
function GoBack() {
    window.location.href = "/ready_check"
}

function orderOK() {
    let token = localStorage.getItem('token');
    let title = document.querySelector('.product-name').textContent;
    let amountCheck = document.querySelector('.amount-check').value;
    let priceCheck = document.querySelector('.price-check').value;
    let siteCheck = document.querySelector('.site-check').value;
    let timeCheck = document.querySelector('.time-check').value;
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
        fetch(`/api/trade/ready_order`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ order_result })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["data"]) {
                showAlert();
            } else if (data["error"]) {
                showError(error);
            }

        }).catch(error => {
            console.log(error);
            showError(error);
        })
    }
}


function delete_pre_order() {
    let token = localStorage.getItem('token');
    let order_result = {
        orderUUID: order_uuid
    }
    if (token) {

        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        fetch(`/api/product/delete_pre_check`, {
            headers: headers,
            method: "PUT",
            body: JSON.stringify({ order_result })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["data"]) {
                deleteAlert();
            } else if (data["error"]) {
                showError(error);
            }

        }).catch(error => {
            console.log(error);
            showError(error);
        })
    }
}




let myVideo = document.createElement('video');
myVideo.muted = true

function addVideoStream(video, stream) {
    video.srcObject = stream
    let otherVideoGrid = document.querySelector('.other-video-box')
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    otherVideoGrid.append(video)
}

let peers = {}
let state = true;

function startStream() {
    if (!state) {
        alert("已存在連線");
        return;
    }

    // socket.emit('peer_invite_message', { identity: identity, roomId: order_uuid });

    const peer = new Peer(identity, {
        secure: true,
        port: '443',
        host: "/"
    });

    // 新增錯誤處理
    peer.on('error', error => {
        console.error('Peer連線錯誤:', error);
    });

    socket.on('error', error => {
        console.error('Socket錯誤:', error);
    });

    peer.on("open", (id) => {
        console.log(`Your peer ID is: ${id}`);
        socket.emit('join-room', { ROOM_ID: order_uuid, id: id });
        state = false;
    });

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        handleNewStream(stream,peer);
    }).catch(error => {
        console.error('錯誤:', error);
    });
}

function handleNewStream(stream,peer) {
    console.log("handleNewStream ERR")
    const videoElement = document.createElement('video');
    const videoGrid = document.querySelector('.self-video-box');
    videoElement.muted = true;
    videoElement.srcObject = stream;
    videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
    });

    videoGrid.append(videoElement);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.classList.add("second");

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('join-response', userId => {
        console.log(userId['userId']);
        connectNewUser(userId['userId'], stream,peer);
    });

    socket.on("response", data => {
        console.log(data.message);
        handlePeerResponse();
    });
}

function handlePeerResponse() {
    if (peers['userId']) {
        peers['userId'].close();
        peers = {};
    }
    console.log("handlePeer ERR")

    const videos = document.querySelectorAll('.second');
    videos.forEach(video => video.remove());
}

function connectNewUser(userId, stream,peer) {
    const call = peer.call(userId, stream);
    const newVideo = document.createElement('video');
    newVideo.classList.add('second');

    call.on('stream', userVideosStream => {
        addVideoStream(newVideo, userVideosStream);
    });

    call.on('close', () => {
        console.log("Peer連線已關閉");
    });

    call.on('error', error => {
        console.error('呼叫過程中出現錯誤:', error);
    });

    peers['userId'] = call;
}

// function startStream() {
//     if (state) {
//         socket.emit('peer_invite_message', { identity: identity, roomId: order_uuid })

//         const peer = new Peer(undefined, {
//             secure: true,
//             port: '443',
//             host: "/"
//         });

//         peer.on("open", (id) => {
//             // 當 Peer 成功打開時
//             console.log(`Your peer ID is: ${id}`);
//             socket.emit('join-room', { ROOM_ID: order_uuid, id: id })
//             state = false
//         });
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         }).then(function (stream) {
//             const videoElement = document.createElement('video');
//             // videoElement.srcObject = stream;
//             const videoGrid = document.querySelector('.self-video-box')
//             videoElement.muted = true
//             videoElement.srcObject = stream
//             videoElement.addEventListener('loadedmetadata', () => {
//                 videoElement.play()
//             })

//             videoGrid.append(videoElement)
//             peer.on('call', call => {
//                 call.answer(stream)
//                 const video = document.createElement('video')
//                 video.classList.add("second")

//                 call.on('stream', userVideoStream => {
//                     addVideoStream(video, userVideoStream)
//                 })
//             })

//             socket.on('join-response', userId => {
//                 console.log(userId['userId'])
//                 userid = userId['userId']
//                 connectNewUser(userid, stream)
//             })

//             socket.on("response", (data) => {
//                 console.log(data.message)
//                 if (peers['userId']) {
//                     peers['userId'].close()
//                     peers = {}
//                 }
//                 console.log("對方離開了")
//                 const Video = document.querySelector('.first');
//                 Video.srcObject = null;
//                 Video.remove()
//             })
//             document.querySelector('.stopStream-icon').addEventListener('click', () => {
//                 if (peers['userId']) {
//                     peers['userId'].close()
//                     peers = {}
//                     console.log("XD")
//                 }
//             })

//             function connectNewUser(userId, stream) {
//                 const call = peer.call(userId, stream)
//                 const newVideo = document.createElement('video');
//                 newVideo.classList.add('second');

//                 call.on('stream', userVideosStream => {
//                     addVideoStream(newVideo, userVideosStream)
//                 })
//                 call.on('close', function () {
//                     console.log("close")
//                     newVideo.srcObject = null;
//                     newVideo.remove()
//                     console.log("GG")
//                 })
//                 call.on('error', (error) => {
//                     console.error('Error during call:', error);
//                 });

//                 peers['userId'] = call

//             }
//         })
//             .catch(function (error) {
//                 console.error('未偵測到開啟的攝影機:', error);
//             });
//     } else {
//         alert("已存在連線")
//     }
// }














// function startStream() {
//     if (state) {
//         socket.emit('peer_invite_message', { identity: identity, roomId: order_uuid })

//         const peer = new Peer(undefined, {
//             secure: true,
//             port: '443',
//             host: "/"

//         });

//         peer.on("open", (id) => {
//             // 當 Peer 成功打開時
//             console.log(`Your peer ID is: ${id}`);
//             socket.emit('join-room', { ROOM_ID: order_uuid, id: id })
//             state = false
//         });
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         }).then(function (stream) {
//             const videoElement = document.createElement('video');
//             // videoElement.srcObject = stream;
//             const videoGrid = document.querySelector('.self-video-box')
//             videoElement.muted = true
//             videoElement.srcObject = stream
//             videoElement.addEventListener('loadedmetadata', () => {
//                 videoElement.play()
//             })

//             videoGrid.append(videoElement)
//             peer.on('call', call => {
//                 call.answer(stream)
//                 const video = document.createElement('video')
//                 video.classList.add("first")

//                 call.on('stream', userVideoStream => {
//                     addVideoStream(video, userVideoStream)
//                 })
//             })

//             socket.on('join-response', userId => {
//                 console.log(userId['userId'])
//                 userid = userId['userId']
//                 connectNewUser(userid, stream)
//             })

//             socket.on("response", (data) => {
//                 console.log(data.message)
//                 if (peers['userId']) {
//                     peers['userId'].close()
//                     peers = {}
//                 }
//                 const Video = document.querySelector('.first');
//                 // Video.srcObject = null;
//                 // Video.remove()
//             })
//             document.querySelector('.stopStream-icon').addEventListener('click', () => {
//                 if (peers['userId']) {
//                     peers['userId'].close()
//                     peers = {}
//                     console.log("XD")
//                 }
//             })

//             function connectNewUser(userId, stream) {
//                 const call = peer.call(userId, stream)
//                 const newVideo = document.createElement('video');
//                 newVideo.classList.add('second');

//                 call.on('stream', userVideosStream => {
//                     addVideoStream(newVideo, userVideosStream)
//                 })
//                 call.on('close', function () {
//                     console.log("close")
//                     newVideo.srcObject = null;
//                     newVideo.remove()
//                     console.log("GG")
//                 })
//                 call.on('error', (error) => {
//                     console.error('Error during call:', error);
//                 });

//                 peers['userId'] = call

//             }
//         })
//             .catch(function (error) {
//                 console.error('未偵測到開啟的攝影機:', error);
//             });
//     } else {
//         alert("已存在連線")
//     }
// }


// function startStream() {
//     if(state){
//         socket.emit('peer_invite_message', {identity:identity,roomId:order_uuid})

//         const peer = new Peer(identity, {
//             secure: true,
//             port:'443',
//             host: "/"

//         }); 
        
//         peer.on("open", (id) => {
//             // 當 Peer 成功打開時
//             console.log(`Your peer ID is: ${id}`);
//             socket.emit('join-room', { ROOM_ID: order_uuid, id: id })
//             state=false
//         });
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         }).then(function (stream) {
//             const videoElement = document.createElement('video');
//             // videoElement.srcObject = stream;
//             const videoGrid = document.querySelector('.self-video-box')
//             videoElement.muted = true
//             videoElement.srcObject = stream
//             videoElement.addEventListener('loadedmetadata', () => {
//                 videoElement.play()
//             })
    
//             videoGrid.append(videoElement)
//             peer.on('call', call => {
//                 call.answer(stream)
//                 const video = document.createElement('video')
//                 video.classList.add("second")
    
//                 call.on('stream', userVideoStream => {
//                     addVideoStream(video, userVideoStream)
//                 })
//             })
    
//             socket.on('join-response', userId => {
//                 console.log(userId['userId'])
//                 userid = userId['userId']
//                 connectNewUser(userid, stream)
//             })
    
//             socket.on("response", (data) => {
//                 console.log(data.message)
//                 if (peers['userId']) {
//                     peers['userId'].close()
//                     peers = {}
//                 }
//                 const Videos = document.querySelector('.second');
                
//                 if (Videos) {
//                     Videos.remove();                    
//                 }

                
//             })
    
//             function connectNewUser(userId, stream) {
//                 const call = peer.call(userId, stream)
//                 const newVideo = document.createElement('video');
//                 newVideo.classList.add('second');
    
//                 call.on('stream', userVideosStream => {
//                     addVideoStream(newVideo, userVideosStream)
//                 })
//                 call.on('close', function () {
//                     console.log("close")
//                     console.log("GG")
//                 })
//                 call.on('error', (error) => {
//                     console.error('Error during call:', error);
//                 });
    
//                 peers['userId'] = call
                
//             }
//         })
//             .catch(function (error) {
//                 console.error('未偵測到開啟的攝影機:', error);
//             });
//     }else{
//         alert("已存在連線")
//     }
// }
