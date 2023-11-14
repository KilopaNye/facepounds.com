
function previewImage() {
    let fileInput = document.querySelector('.img-upload');
    let imagePreview = document.querySelector('.img-preview');

    if (fileInput.files && fileInput.files[0]) {
        console.log(fileInput.files)
        for (let i = 0; i < fileInput.files.length; i++) {
            let reader = new FileReader();

            reader.onload = function (e) {

                let img = document.createElement('img');
                img.src = e.target.result;

                imagePreview.appendChild(img);
            };

            reader.readAsDataURL(fileInput.files[i]);
        }
    }
}



function uploadProduct() {
    let token = localStorage.getItem('token');
    if (token) {
        let img = document.querySelector('.img-upload');
        let result = img.files
        let formData = new FormData();
        for (let i = 0; i < result.length; i++) {
            formData.append('file', result[i]);
        }

        let productName = document.querySelector(".product-name-value").value;
        let tagName = document.querySelectorAll('.product-tag-value')
        let tagResult = []
        for (let i = 0; i < tagName.length; i++) {
            let tag = tagName[i].value
            if (tag)
                tagResult.push(tag)
        }

        let introduce = document.querySelector(".product-introduce-value").value;
        let price = document.querySelector(".product-price-value").value;
        let amount = document.querySelector(".product-amount-value").value;
        let site = document.querySelector(".product-site-value").value;
        let where = document.querySelector(".product-where-value").value;
        productInfo = {
            productName: productName,
            tagResult: tagResult,
            introduce: introduce,
            price: price,
            amount: amount,
            site: site,
            where: where
        }
        console.log(productInfo)
        formData.append('message', JSON.stringify(productInfo));
        if (productName && introduce && price && amount && site && where) {
            fetch('/product/upload', {
                method: 'POST',
                headers: { 'enctype': "multipart/form-data" },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // window.location.href="/";
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
}


// let tagName =document.querySelectorAll('.product-tag-value')
// let tagResult=[]
// for (let i=0;i<ab.length;i++){
//     let tag = tagName[i].value
//     tagResult.push(tag)
// }
// console.log(tagResult)

function uploadProduct() {
    let token = localStorage.getItem('token');
    if (token) {
        let productName = document.querySelector(".product-name-value").value;
        let tagName = document.querySelectorAll('.product-tag-value')
        let tagResult = []
        for (let i = 0; i < tagName.length; i++) {
            let tag = tagName[i].value
            tagResult.push(tag)
        }
        let introduce = document.querySelector(".product-introduce-value").value;
        let price = document.querySelector(".product-price-value").value;
        let amount = document.querySelector(".product-amount-value").value;
        let site = document.querySelector(".product-site-value").value;
        let where = document.querySelector(".product-where-value").value;
        productInfo = {
            productName: productName,
            tagResult: tagResult,
            introduce: introduce,
            price: price,
            amount: amount,
            site: site,
            where: where
        }
        console.log(productInfo)
        if (productName && introduce && price && amount && site && where) {
            let token = localStorage.getItem('token');
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
            fetch("/api/booking", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(productInfo)
            }).then(response => response.json()).then(data => {
                console.log(data)
                if (data) {
                    return console.log(data);
                } else {
                    console.error("尚未登入", error);
                    loginBlock();
                }
            }).catch(error => {
                console.log("尚未登入", error);
                loginBlock();
            })
        } else {
            alert("欄位不得為空")
        }

        let fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', handleFileSelect);

        function handleFileSelect(event) {
            let files = event.target.files;
            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }
        }

        fetch('your-backend-endpoint', {
            method: 'POST',
            body: formData,
            // 不需要手動添加 'enctype: "multipart/form-data"'
        })
            .then(response => response.json())
            .then(data => {
                console.log('成功收到後端的回應:', data);
            })
            .catch(error => {
                console.error('發生錯誤:', error);
            });


    } else {
        loginBlock();
    }
}
