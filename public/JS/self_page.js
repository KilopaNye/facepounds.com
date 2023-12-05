function GoThisProduct(product) {
    let id = product.getAttribute('value')
    window.location.href = `/product/${id}`
}

function GoAuth() {
    window.location.href = "/user-auth-page"
}
function createProductDom(data) {
    let authIcon = document.querySelector('.icon')
    let authText = document.querySelector('.auth-text')
    if (data[0]['auth'] == "0") {
        authIcon.src = "/images/icons/safe_none.png"
        authText.textContent = "點我進行驗證"
        authIcon.setAttribute("onclick", "GoAuth();")
    } else {
        authIcon.src = "/images/icons/safe_true.png"
        authText.textContent = "已通過驗證"
    }

    let productFlex = document.querySelector(".product-flex");
    productFlex.textContent = ""
    let usernameTxt = document.querySelector('.member-name')
    usernameTxt.textContent = data[0]['username']
    let userImg = document.querySelector('.member-img')
    if (data[0]['userImg'].startsWith('https://')) {
        userImg.src = data[0]['userImg']
    } else {
        userImg.src = "https://d3utiuvdbysk3c.cloudfront.net/" + data[0]['userImg'];
    }

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
const memberImg = document.querySelector('.member-img')
let memberIcon;
function imgChange(ImgUrl) {
    memberImg.src = ImgUrl
}
memberImg.addEventListener('mouseover', () => {
    memberIcon = memberImg.src;
    imgChange("https://cdn-icons-png.flaticon.com/512/12206/12206178.png");
});

memberImg.addEventListener('mouseout', () => {
    imgChange(memberIcon);
});

memberImg.addEventListener('click', () => {
    let changeImgInfo = document.querySelector('.changeImg-flex')
    changeImgInfo.style.display = "block";
});

function delBox() {
    let changeImgInfo = document.querySelector('.changeImg-flex')
    changeImgInfo.style.display = "none";
}

function delNameBox() {
    let changeImgName = document.querySelector('.changeName-flex')
    changeImgName.style.display = "none";
}

function changeName() {
    let changeImgName = document.querySelector('.changeName-flex')
    changeImgName.style.display = "block";
}

function changeTagBlock() {
    let changeTag = document.querySelector('.changeTag-flex')
    changeTag.style.display = "block"
}
function delTagBox() {
    let changeTag = document.querySelector('.changeTag-flex')
    changeTag.style.display = "none"
}

function changeSelfBlock() {
    let changeSelf = document.querySelector('.changeSelf-flex')
    changeSelf.style.display = "block"
}

function delSelf() {
    let changeSelf = document.querySelector('.changeSelf-flex')
    changeSelf.style.display = "none"
}

const memberName = document.querySelector('.member-name')
let originalName;
memberName.addEventListener('mouseover', () => {
    originalName = memberName.textContent;
    memberName.textContent = "更改商家名稱";
});

memberName.addEventListener('mouseout', () => {
    memberName.textContent = originalName;
});

let changeTag = document.querySelector('.member-tags')
let originalTag;
changeTag.addEventListener('mouseover', () => {
    originalTag = changeTag.textContent;
    changeTag.textContent = "更改商家標籤";
});

changeTag.addEventListener('mouseout', () => {
    changeTag.textContent = originalTag;
});

let memberSelf = document.querySelector('.member-self')
let originalSelf;
memberSelf.addEventListener('mouseover', () => {
    originalSelf = memberSelf.textContent;
    memberSelf.textContent = "更改商家標籤";
});

memberSelf.addEventListener('mouseout', () => {
    memberSelf.textContent = originalSelf;
});


const showOk = () => {
    Swal.fire({
        icon: 'success',
        title: '更改成功',
    }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
            window.location.href = "/self_page";
        }
    })
}


function changeImg() {
    let loading=document.querySelector('.loading')
    loading.style.display="block"
    let token = localStorage.getItem('token');
    if (token) {
        let imgFile = document.querySelector('.imgFile')
        let result = imgFile.files;
        console.log(result)
        if(result.length<1){
            alert("不得為空")
            loading.style.display="none"
            return false
        }
        let formData = new FormData();
        formData.append('file', result[0]);

        fetch('/api/self-page/change-img', {
            method: 'POST',
            headers: {
                'enctype': "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data["data"]) {
                    showOk();
                    loading.style.display="none"
                }else{
                    alert("更新發生錯誤")
                    loading.style.display="none"
                    return false
                }

            })
            .catch(error => {
                console.error('Error:', error);
                loading.style.display="none"
                return false
            });
    }
}


function GoChangeName(){
    let loading=document.querySelector('.loading2')
    loading.style.display="block"
    let token = localStorage.getItem('token');
    if (token) {
        let newName = document.querySelector('.newName').value
        if(newName==""){
            alert("名稱不得為空")
            loading.style.display="none"
            return false
        }
        let result={
            newName:newName
        }
        fetch('/api/self-page/change-name', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(result)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data["data"]){
                    showOk();
                    loading.style.display="none"
                }else{
                    alert("更新發生錯誤")
                    loading.style.display="none"
                    return false
                }
                
            })
            .catch(error => {
                console.error('Error:', error);
                return false
            });
    }
}