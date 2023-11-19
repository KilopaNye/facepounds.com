

function GoThisProduct(product){
    let id=product.getAttribute('value')
    window.location.href = `/product/${id}`
}

function createProductDom(data){
    for (let i = 0; i < data.length; i++) {
        let image = data[i]["image_urls"].split(',')
        let tag = data[i]["tag"].split(',')
        console.log(tag)
        let productFlex = document.querySelector(".product-flex");
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
        productIdOpacity.setAttribute('value',data[i]['id']);
        productIdOpacity.setAttribute('onclick',"GoThisProduct(this);");
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
        where.textContent =  data[i]["county_site"];
        cost.classList.add('where');
        whereDiv.appendChild(where);
    
        let tagArea = document.createElement('div');
        tagArea.classList.add('tag-area');
        productBox.appendChild(tagArea)
    
        for (let i = 0; i < tag.length; i++) {
            let tagBox = document.createElement('span')
            tagBox.classList.add('tag');
            tagBox.textContent = tag[i];
            tagArea.appendChild(tagBox);
        }
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
        console.log(data["data"][0]["image_urls"].split(','))
        let products = data["data"]
        console.log(products.length)
        createProductDom(products)
    }).catch(error => {
        console.log(error)
    })
}
getProductInfo()


// https://d3utiuvdbysk3c.cloudfront.net/

