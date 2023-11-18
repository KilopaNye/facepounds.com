let url = window.location.pathname;
let length_URL = url.split("/");
let product_id = length_URL.pop();
console.log(product_id);

const showAlert = () => {
    Swal.fire({
        icon: 'success',
        title: '訂單建立成功! ',
        text: '請於<待處理的交易>介面查看相關內容',
    }).then((result) => {
        console.log(result)
        if(result.isConfirmed){
            window.location.href="/ready_check";
        }
    })
}

const showError = () => {
    Swal.fire({
        icon: 'error',
        title: 'WoW',
        text: '訂單建立失敗，請檢查填寫內容或連繫客服。',
    })
}


let productPrice;
function productInfoInput(data) {
    // LeftFrame
    let productTitle = document.querySelector('.product-title');
    let productIntro = document.querySelector('.product-text');
    let photoTitle = document.querySelector('.photo-title');
    let productTag = document.querySelector('.product-tag-area');

    productTitle.textContent = data['product_name'];
    productIntro.textContent = data['product_intro'];

    // rightFrame
    let productName = document.querySelector('.order-id');
    let productCost = document.querySelector('.order-cost');
    let orderTarget = document.querySelector('.order-target');

    productName.textContent = data['product_name'];
    productCost.textContent = "NT$ " + data['product_price'] + "/份";
    orderTarget.textContent = data['owner_pre_site'];

    data['tag'] = data['tag'].split(',');

    productPrice = data['product_price']
    for (let i = 0; i < data['tag'].length; i++) {
        let tagBox = document.createElement('span');
        tagBox.textContent = data['tag'][i];
        productTag.appendChild(tagBox);
    }


    let amountSelect = document.querySelector('.amount-select');
    for (let i = 1; i <= data['product_amount']; i++) {
        let amountOption = document.createElement('option');
        amountOption.setAttribute('value', i);
        amountOption.textContent = i;
        amountSelect.appendChild(amountOption);
    }

    let productImages = data['image_urls'].split(',');
    let photoArea = document.querySelector('.photo');
    for (let i = 0; i < productImages.length; i++) {
        let imageBox = document.createElement('img');
        imageBox.src = "https://d3utiuvdbysk3c.cloudfront.net/" + productImages[i];
        photoArea.appendChild(imageBox);
    }
    photoTitle.textContent = productImages.length + "張照片";

    //owner_info
    let ownerName = document.querySelector('.owner-name');
    let ownerImage = document.querySelector('.owner-image');
    ownerName.textContent = data['username'];
    ownerImage.src = data['userImg'];
}
let order_info = null;
function getProductInfo(product_id) {
    headers = {
        "Content-Type": "application/json",
    }
    fetch(`/api/product/${product_id}`, {
        method: "GET",
        headers: headers,
    }).then(response => response.json()).then(data => {
        console.log(data);
        data = data["data"];
        order_info = data;
        productInfoInput(data);
    }).catch(error => {
        console.log(error);
    })
}

getProductInfo(product_id)

function orderProduct(order_info) {
    let token = localStorage.getItem('token');
    if (token) {
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

        console.log(formattedDateTime);

        let productAmount = document.querySelector('.amount-select').value;
        let productRemark = document.querySelector('.order-message').value;
        total_price = productAmount * productPrice;
        console.log(total_price)
        let order_info_body = {
            product_id: product_id,
            productAmount: productAmount,
            productRemark: productRemark,
            seller_id: order_info["user_id"],
            order_time: formattedDateTime,
            total_price: total_price
        }
        // console.log(order_info_body);
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/new_order`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ order_info: order_info_body })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data["data"]){
                showAlert();
            }else{
                showError();
            }
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}

