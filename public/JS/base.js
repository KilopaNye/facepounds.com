function searchProductBar(){
    let searchTagInput = document.querySelector(".tag").value == "" ? null : document.querySelector(".tag").value;
    let searchMuchInput = document.querySelector('.much').value == "" ? null : document.querySelector('.much').value
    let searchTextInput = document.querySelector('.searchTxt').value == "" ? null : document.querySelector('.searchTxt').value;
    let searchAreaInput = document.querySelector('.area').value == "" ? null : document.querySelector('.area').value;
    ;
    if(searchAreaInput=="none"){
        searchAreaInput=null
    }
    let param={
        tag:searchTagInput,
        much:searchMuchInput,
        text:searchTextInput,
        area:searchAreaInput
    }

    headers={
        "Content-Type": "application/json",
    }
    fetch("/product/get_info", {
        method:"POST",
        headers:headers,
        body:JSON.stringify({param})
    }).then(response => response.json()).then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error)
    })
}