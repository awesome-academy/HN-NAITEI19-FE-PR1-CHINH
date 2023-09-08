const urlParams = new URLSearchParams(window.location.search);
let limitParam = parseInt(urlParams.get('_limit'));
let pageParam = parseInt(urlParams.get('_page'));
console.log(limitParam, pageParam);
limitParam = Number.isNaN(limitParam) ? 9 : limitParam;
pageParam = Number.isNaN(pageParam) ? 1 : pageParam;

const blogContainer = document.getElementById("blog-card-container");
blogContainer.innerHTML = "<p>loading</p>";

const paginations = document.querySelectorAll(".list-pagination");
console.log(paginations);

let blogs;

window.addEventListener("load", (e) => {
  console.log("load")
  makeRequest()
})

function makeRequest() {
  const httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      switch(httpRequest.status) {
        case 200: case 304 :
          try {
            products = JSON.parse(httpRequest.responseText);
            console.log(products);
            blogContainer.innerHTML = "";
            for (const product of products) {
              blogContainer.innerHTML += makeBlogCard(product);
            }
            makePagination(httpRequest.getResponseHeader("X-Total-Count"), httpRequest.getResponseHeader("Link"));
          } catch (e) {
            console.error(e);
            alert("invalid response from server");
          }
          break
        case 404:
          break
        default:
          alert("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", `http://localhost:3000/blogs?_page=${pageParam}&_limit=${limitParam}`);
  httpRequest.send();
}

function makeBlogCard(blog) {
  return (`
    <div class="blog-card m-3 d-flex flex-column">
      <div class="blog-card__img">
        <img src="${blog.image}" alt="blog-img">
      </div>
      <a href="blog-detail.html?id=${blog.id}" style="text-decoration: none; color: initial;">
      <h6 class="blog-card__title">${blog.title}</h6>
      </a>
      <hr>
      <div class="blog-card__preview">${blog.content}</div>
      <div class="blog-card__author">
        Bởi 
        <span>${blog.author}</span>
        <span>${blog.date}</span>
      </div>
      <hr>
      <div class="d-flex justify-content-between">
        <div class="blog-card__seemore">Đọc thêm <span class="ti-angle-right mx-2"></span></div>
        <div class="blog-card__ncomments">
          <span>${blog.commentsCount}</span> bình luận
        </div>
      </div>
    </div>
  `)
}

function makePagination(totalCount, linkHeader) {
  console.log(totalCount, linkHeader);
  const links = linkHeader.split(",");
  const firstLink = links.find(l => l.includes("rel=\"first\"")).split('; ')[0].slice(1, -1).split("?")[1]
  const lastLink = links.find(l => l.includes("rel=\"last\"")).split('; ')[0].slice(1, -1).split("?")[1]
  for(let p of paginations) {
    p.innerHTML += `<li class="list-pagination__item"><a href="list.html?${firstLink}"><i class="fas fa-caret-left px-2"></i></a></li>`
    for(let i = 1; i <= Math.ceil(totalCount / limitParam); i++) {
      p.innerHTML += `<li class="list-pagination__item ${i === pageParam ? "active" : ""} fw-semibold px-2"><a href="?_page=${i}&_limit=${limitParam}">${i}</a></li>`
    }
    p.innerHTML += `<li class="list-pagination__item"><a href="list.html?${lastLink}"><i class="list-pagination__item fas fa-caret-right px-2"></i></a></li>`
  }
}
