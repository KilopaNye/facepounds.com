function GoThisProduct(product) {
    let id = product.getAttribute('value')
    window.location.href = `/product/${id}`
}


function createProductDom(data) {
    let authIcon = document.querySelector('.icon')
    let authText = document.querySelector('.auth-text')
    if(data[0]['auth']=="0"){
        authIcon.src="/images/icons/safe_none.png"
        authText.textContent="點我進行驗證"
    }else{
        authIcon.src="/images/icons/safe_true.png"
        authText.textContent="已通過驗證"
    }

    let productFlex = document.querySelector(".product-flex");
    productFlex.textContent = ""
    let usernameTxt = document.querySelector('.member-name')
    usernameTxt.textContent = data[0]['username']
    let userImg = document.querySelector('.member-img')
    userImg.src=data[0]['userImg']
    let selfText = document.querySelector('.member-tags')
    selfText.textContent = data[0]['self_intro']
    let selfIntro = document.querySelector('.member-self')
    selfIntro.textContent = data[0]['self_text']
    for (let i = 0; i < data.length; i++) {
        let image = data[i]["image_url"].split(',')
        let tag = data[i]["tag_name"].split(',')
        console.log(tag)

        let productBox = document.createElement("div");
        productBox.classList.add("product-box");
        productFlex.appendChild(productBox);

        let productImg = document.createElement("img");
        productImg.src = "https://d3utiuvdbysk3c.cloudfront.net/" + image[0];
        productBox.appendChild(productImg);

        let productTitle = document.createElement("div");
        productTitle.classList.add("product-title");
        productTitle.textContent = data[i]["product_name"];
        productBox.appendChild(productTitle);

        let productIdOpacity = document.createElement('div');
        productIdOpacity.setAttribute('value', data[i]['id']);
        productIdOpacity.setAttribute('onclick', "GoThisProduct(this);");
        productIdOpacity.classList.add('product-id-opacity');
        productBox.appendChild(productIdOpacity);

        let productText = document.createElement("div");
        productText.classList.add("product-text");
        productBox.appendChild(productText);

        let firstTxtDiv = document.createElement('div');
        productText.appendChild(firstTxtDiv);

        let costDiv = document.createElement('div');
        costDiv.textContent = "價格：";
        firstTxtDiv.appendChild(costDiv);
        let cost = document.createElement('span');
        cost.textContent = data[i]["product_price"];
        cost.classList.add('cost');
        costDiv.appendChild(cost);

        let muchDiv = document.createElement('div');
        muchDiv.textContent = "庫存：";
        firstTxtDiv.appendChild(muchDiv);
        let much = document.createElement('span');
        much.textContent = data[i]["product_amount"];
        cost.classList.add('much');
        muchDiv.appendChild(much);


        let secondTxtDiv = document.createElement('div');
        productText.appendChild(secondTxtDiv);

        let storeDiv = document.createElement('div');
        storeDiv.textContent = "商家：";
        secondTxtDiv.appendChild(storeDiv);
        let store = document.createElement('span');
        store.textContent = data[i]["username"];
        store.classList.add('store');
        storeDiv.appendChild(store);

        let whereDiv = document.createElement('div');
        whereDiv.textContent = "地區：";
        secondTxtDiv.appendChild(whereDiv);
        let where = document.createElement('span');
        where.textContent = data[i]["county_site"];
        cost.classList.add('where');
        whereDiv.appendChild(where);

        let tagArea = document.createElement('div');
        tagArea.classList.add('tag-area');
        productBox.appendChild(tagArea)

        for (let i = 0; i < tag.length; i++) {
            let tagBox = document.createElement('span')
            tagBox.classList.add('tag');
            tagBox.textContent = tag[i];
            // tagBox.setAttribute('onclick', "search_tag(this);");
            tagArea.appendChild(tagBox);
        }
    }
    let catLoad = document.querySelector('.cat-load')
    catLoad.style.display = "none";
}


function getProductInfo(param = null) {
    let token = localStorage.getItem('token');
    headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    let catLoad = document.querySelector('.cat-load')
    catLoad.style.display = "block";
    fetch("/api/self-page/self-info", {
        method: "POST",
        headers: headers
    }).then(response => response.json()).then(data => {
        console.log(data)
        let products = data["data"]
        createProductDom(products)
    }).catch(error => {
        console.log(error)
    })
}
getProductInfo()

userLoginCheck();
function userLoginCheck() {
    let token = localStorage.getItem('token');
    if (!token) {
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
}