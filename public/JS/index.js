for (let i = 0; i < 1; i++) {

    let productFlex = document.querySelector(".product-flex");
    let productBox = document.createElement("div");
    productBox.classList.add("product-box");
    productFlex.appendChild(productBox);

    let productImg = document.createElement("img");
    productImg.src = "/images/image/test.jpg";
    productBox.appendChild(productImg);
    let productTitle = document.createElement("div");
    productTitle.classList.add("product-title");
    productTitle.textContent = '香蕉栗子磅蛋糕';
    productBox.appendChild(productTitle);

    let productText = document.createElement("div");
    productText.classList.add("product-text");
    productBox.appendChild(productText);

    let firstTxtDiv = document.createElement('div');
    productText.appendChild(firstTxtDiv);

    let costDiv = document.createElement('div');
    costDiv.textContent = "價格：";
    firstTxtDiv.appendChild(costDiv);
    let cost = document.createElement('span');
    cost.textContent = "30";
    cost.classList.add('cost');
    costDiv.appendChild(cost);

    let muchDiv = document.createElement('div');
    muchDiv.textContent = "庫存：";
    firstTxtDiv.appendChild(muchDiv);
    let much = document.createElement('span');
    much.textContent = "5";
    cost.classList.add('much');
    muchDiv.appendChild(much);


    let secondTxtDiv = document.createElement('div');
    productText.appendChild(secondTxtDiv);

    let storeDiv = document.createElement('div');
    storeDiv.textContent = "商家：";
    secondTxtDiv.appendChild(storeDiv);
    let store = document.createElement('span');
    store.textContent = "2424";
    store.classList.add('store');
    storeDiv.appendChild(store);

    let whereDiv = document.createElement('div');
    whereDiv.textContent = "地區：";
    secondTxtDiv.appendChild(whereDiv);
    let where = document.createElement('span');
    where.textContent = "234";
    cost.classList.add('where');
    whereDiv.appendChild(where);

    let tagArea = document.createElement('div');
    tagArea.classList.add('tag-area');
    productBox.appendChild(tagArea)

    for (let i = 0; i < 3; i++) {
        let tag = document.createElement('span')
        tag.classList.add('tag');
        tag.textContent = "香蕉"
        tagArea.appendChild(tag)
    }
}

function getProductInfo(param=null){
    headers={
        "Content-Type": "application/json",
    }
    fetch("/product/get_info", {
        method:"POST",
        headers:headers,
        body:JSON.stringify({param:param})
    }).then(response => response.json()).then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error)
    })
}
getProductInfo()