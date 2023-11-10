


function previewImage() {
    var fileInput = document.querySelector('.img-upload');
    var imagePreview = document.querySelector('.img-preview');

    // 确保选择了文件
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        for (var i = 0; i < fileInput.files.length; i++) {
            var reader = new FileReader();

            reader.onload = function(e) {
                // 创建一个新的图像元素
                var img = document.createElement('img');
                img.src = e.target.result;

                // 将预览图添加到页面
                imagePreview.appendChild(img);
            };

            // 读取文件内容并触发onload事件
            reader.readAsDataURL(fileInput.files[i]);
    }
}}