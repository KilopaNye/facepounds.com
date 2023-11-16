let url = window.location.pathname;
let length_URL = url.split("/");
let product_id = length_URL.pop();
console.log(product_id);

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
    orderTarget.textContent =data['owner_pre_site'];
    
    data['tag']=data['tag'].split(',');
    

    for(let i=0;i<data['tag'].length;i++){
        let tagBox = document.createElement('span');
        tagBox.textContent=data['tag'][i];
        productTag.appendChild(tagBox);
    }


    let amountSelect = document.querySelector('.amount-select');
    for (let i = 1; i <= data['product_amount']; i++) {
        let amountOption = document.createElement('option');
        amountOption.setAttribute('value', i);
        amountOption.textContent=i;
        amountSelect.appendChild(amountOption);
    }

    let productImages = data['image_urls'].split(',');
    let photoArea = document.querySelector('.photo');
    for(let i=0;i<productImages.length;i++){
        let imageBox = document.createElement('img');
        imageBox.src = "https://d3utiuvdbysk3c.cloudfront.net/" + productImages[i];
        photoArea.appendChild(imageBox);
    }
    photoTitle.textContent =productImages.length + "張照片";

    //owner_info
    let ownerName = document.querySelector('.owner-name');
    let ownerImage = document.querySelector('.owner-image');
    ownerName.textContent = data['username'];
    ownerImage.src = data['userImg'];
}


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
        productInfoInput(data);
        // console.log(data["data"][0]["image_urls"].split(','))
        // let products = data["data"]
        // console.log(products.length)
        // createProductDom(products)
    }).catch(error => {
        console.log(error);
    })
}

getProductInfo(product_id)