function GoTrade(orderUuid) {
    let order_uuid = orderUuid.getAttribute('value');
    window.location.href = `/trade/${order_uuid}`
}




function preOrderDom(data) {
    let Fa = document.querySelector(".trade-area-flex");
    Fa.textContent="";
    for (let i = 0; i < data.length; i++) {
        let orderInfoBox = document.createElement("div");
        orderInfoBox.classList.add('order-info-area');
        Fa.appendChild(orderInfoBox);

        let orderImg = document.createElement('img');
        orderImg.src = "https://d3utiuvdbysk3c.cloudfront.net/" + data[i]['image_url'];
        orderInfoBox.appendChild(orderImg);

        let orderInfo = document.createElement('div');
        orderInfo.classList.add('order-info');
        orderInfoBox.appendChild(orderInfo);

        let orderText = document.createElement('div');
        orderText.classList.add('order-text');
        orderInfo.appendChild(orderText);

        let nameDiv = document.createElement('div');
        nameDiv.textContent = '產品名稱：' + data[i]['product_name'];
        orderText.appendChild(nameDiv);

        let amountDiv = document.createElement('div');
        amountDiv.textContent = '購買數量：' + data[i]['product_amount'];
        orderText.appendChild(amountDiv);

        let priceDiv = document.createElement('div');
        priceDiv.textContent = '產品總價：' + data[i]['total_price'];
        orderText.appendChild(priceDiv);

        let siteDiv = document.createElement('div');
        siteDiv.textContent = '面交地點：' + data[i]['owner_pre_site'];
        orderText.appendChild(siteDiv);

        let TTimeDiv = document.createElement('div');
        if (data[i]['trade_time'] != "") {
            TTimeDiv.textContent = '面交時間：' + data[i]['trade_time'];
        }else{
            TTimeDiv.textContent = '面交時間：' + "待使用商議介面與賣家確認~";
        }
        orderText.appendChild(TTimeDiv);

        let sellerDiv = document.createElement('div');
        sellerDiv.textContent = '商家名稱：' + data[i]['username'];
        orderText.appendChild(sellerDiv);

        let GoTrade = document.createElement('img');
        GoTrade.src = '/images/icons/chat-box.png';
        GoTrade.setAttribute('value', data[i]['order_uuid'])
        GoTrade.setAttribute('onclick', `GoTrade(this);`)
        orderInfo.appendChild(GoTrade);
    }

}


let order_data;
let seller_data;
function getPreOrder() {
    let token = localStorage.getItem('token');
    if (token) {
        // console.log(order_info_body);
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/get_pre_order`, {
            headers: headers,
        }).then(response => response.json()).then(data => {
            console.log(data);
            // if(data["data"]){
            order_data = data["data"]
            preOrderDom(order_data)
            // }else{
            // }
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}
getPreOrder()

function getPreTrade() {
    let token = localStorage.getItem('token');
    if (token) {
        // console.log(order_info_body);
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/get_pre_trade`, {
            headers: headers,
        }).then(response => response.json()).then(data => {
            console.log(data);
            seller_data = data['data'];
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}

getPreTrade()