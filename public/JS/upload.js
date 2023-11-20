const showAlert = () => {
    Swal.fire({
        icon: 'success',
        title: '產品上架成功! ',
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
        text: '產品建立失敗，請檢查填寫內容或連繫客服。',
    })
}

function userCheck() {
    let token = localStorage.getItem('token');
    if (token) {
        return true;
    }else{
        window.location.href = "/";
    }
}
userCheck()

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
    document.querySelector('.opacity-load').style.display="block";
    document.querySelector('.cat-load').style.display="block";
    let token = localStorage.getItem('token');
    if (token) {
        let img = document.querySelector('.img-upload');
        let result = img.files;
        let filesLen= result.length;
        let formData = new FormData();
        for (let i = 0; i < filesLen; i++) {
            formData.append('file', result[i]);
        }

        function img_result_check(filesLen){
            if(filesLen<1) {
                console.log("圖片數量錯誤")
                return false;
            }else{
                return true;
            }

        }

        let productName = document.querySelector(".product-name-value").value;
        let tagName = document.querySelectorAll('.product-tag-value')
        let introduce = document.querySelector(".product-introduce-value").value;
        let price = document.querySelector(".product-price-value").value;
        let amount = document.querySelector(".product-amount-value").value;
        let site = document.querySelector(".product-site-value").value;
        let where = document.querySelector(".product-where-value").value;

        function isValidIntro(introduce){
            if(introduce.length>1000){
                console.log("文章長度錯誤")
                return false;
            }else{
                return true;
            };
        };
        
        const numericPattern = /^[1-9]\d*$/;
        function isValidPrice(price){
            if(!numericPattern.test(price)){
                console.log("price這邊錯了")
            }
            return numericPattern.test(price);
        }
        let tagResult = []
        for (let i = 0; i < tagName.length; i++) {
            let tag = tagName[i].value;
            if (tag){
                tagResult.push(tag)
            }
        }
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
        console.log("1",isValidIntro(introduce))
        console.log("2",isValidPrice(price))
        console.log("3",isValidPrice(amount))
        console.log("4",img_result_check(filesLen))
        formData.append('message', JSON.stringify(productInfo));
        if (productName && isValidIntro(introduce) && isValidPrice(price) && isValidPrice(amount) && site && where && img_result_check(filesLen)) {
            fetch('/api/product/upload', {
                method: 'POST',
                headers: { 'enctype': "multipart/form-data",
                "Authorization": `Bearer ${token}` },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    document.querySelector('.opacity-load').style.display="none";
                    document.querySelector('.cat-load').style.display="none";
                    showAlert();
                    window.location.href="/upload";
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }else{
            document.querySelector('.opacity-load').style.display="none";
            document.querySelector('.cat-load').style.display="none";
            showError();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.opacity-load').style.display="none";
    document.querySelector('.cat-load').style.display="none";
});


// let tagName =document.querySelectorAll('.product-tag-value')
// let tagResult=[]
// for (let i=0;i<ab.length;i++){
//     let tag = tagName[i].value
//     tagResult.push(tag)
// }
// console.log(tagResult)

// function uploadProduct() {
//     let token = localStorage.getItem('token');
//     if (token) {
//         let productName = document.querySelector(".product-name-value").value;
//         let tagName = document.querySelectorAll('.product-tag-value')
//         let tagResult = []
//         for (let i = 0; i < tagName.length; i++) {
//             let tag = tagName[i].value
//             tagResult.push(tag)
//         }
//         let introduce = document.querySelector(".product-introduce-value").value;
//         let price = document.querySelector(".product-price-value").value;
//         let amount = document.querySelector(".product-amount-value").value;
//         let site = document.querySelector(".product-site-value").value;
//         let where = document.querySelector(".product-where-value").value;
//         productInfo = {
//             productName: productName,
//             tagResult: tagResult,
//             introduce: introduce,
//             price: price,
//             amount: amount,
//             site: site,
//             where: where
//         }
//         console.log(productInfo)
//         if (productName && introduce && price && amount && site && where) {
//             let token = localStorage.getItem('token');
//             let headers = {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//             fetch("/api/booking", {
//                 method: "POST",
//                 headers: headers,
//                 body: JSON.stringify(productInfo)
//             }).then(response => response.json()).then(data => {
//                 console.log(data)
//                 if (data) {
//                     return console.log(data);
//                 } else {
//                     console.error("尚未登入", error);
//                     loginBlock();
//                 }
//             }).catch(error => {
//                 console.log("尚未登入", error);
//                 loginBlock();
//             })
//         } else {
//             alert("欄位不得為空")
//         }

//         let fileInput = document.getElementById('fileInput');
//         fileInput.addEventListener('change', handleFileSelect);

//         function handleFileSelect(event) {
//             let files = event.target.files;
//             let formData = new FormData();

//             for (let i = 0; i < files.length; i++) {
//                 formData.append('files[]', files[i]);
//             }
//         }

//         fetch('your-backend-endpoint', {
//             method: 'POST',
//             body: formData,
//             // 不需要手動添加 'enctype: "multipart/form-data"'
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('成功收到後端的回應:', data);
//             })
//             .catch(error => {
//                 console.error('發生錯誤:', error);
//             });


//     } else {
//         loginBlock();
//     }
// }
