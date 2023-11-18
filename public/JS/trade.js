let url = window.location.pathname;
let length_URL = url.split("/");
let order_uuid = length_URL.pop();

function preOrderDomCreate(data){
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



function getPreOrderByUUID() {
    let token = localStorage.getItem('token');
    if (token) {
        // console.log(order_info_body);
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }

        fetch(`/api/get_order_trade/${ order_uuid }`, {
            headers: headers,
        }).then(response => response.json()).then(data => {
            console.log(data);
            // if(data["data"]){
            preOrderDomCreate(data["data"]);
            // }else{
            // }
        }).catch(error => {
            console.log(error);
        })
    } else {
        alert("尚未登入，沒有操作權限")
    }
}
getPreOrderByUUID()

