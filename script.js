const imagesWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadBtn = lightBox.querySelector(".uil-import");

const apikey = "nSUVfac3cqRdebzcc4YcZlAuIRvKNGMcSGghGd5hHeJMBLsSqYVj43en"
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(()=> alert("img not download"));
}

const showLightBox = (name,img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadBtn.setAttribute("data-img",img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
                <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                       <i class="uil uil-import"></i>
                    </button>
                </div>
            </li>`
    ).join("");
}

const getImages = (apiURL) => {
    loadMore.innerHTML = "loading...";
    loadMore.classList.add("disabled");
    fetch(apiURL, {
        headers : { Authorization: apikey }
    }).then (res => res.json()).then(data => {
        generateHTML(data.photos)
        loadMore.innerHTML = "load More";
        loadMore.classList.remove("disabled");
    })
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null;
    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMore.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click",hideLightbox);
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));