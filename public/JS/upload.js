


function previewImage() {
    let fileInput = document.querySelector('.img-upload');
    let imagePreview = document.querySelector('.img-preview');

    if (fileInput.files && fileInput.files[0]) {
        let reader = new FileReader();

        for (let i = 0; i < fileInput.files.length; i++) {
            let reader = new FileReader();

            reader.onload = function(e) {

                let img = document.createElement('img');
                img.src = e.target.result;

                imagePreview.appendChild(img);
            };

            reader.readAsDataURL(fileInput.files[i]);
    }
}}