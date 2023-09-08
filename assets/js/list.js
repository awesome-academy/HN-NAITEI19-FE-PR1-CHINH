const urlParams = new URLSearchParams(window.location.search);
let limitParam = parseInt(urlParams.get('_limit'));
let pageParam = parseInt(urlParams.get('_page'));
console.log(limitParam, pageParam);
limitParam = Number.isNaN(limitParam) ? 3 : limitParam;
pageParam = Number.isNaN(pageParam) ? 1 : pageParam;

const blogContainer = document.getElementById("product-card-container");
blogContainer.innerHTML = "<p>loading</p>";

const paginations = document.querySelectorAll(".list-pagination");
console.log(paginations);

let products;

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
      if (httpRequest.status === 200) {
        try {
          products = JSON.parse(httpRequest.responseText);
          console.log(products);
          blogContainer.innerHTML = "";
          for (const product of products) {
            blogContainer.innerHTML += makeProductCard(product);
          }
          makePagination(httpRequest.getResponseHeader("X-Total-Count"), httpRequest.getResponseHeader("Link"));
        } catch (e) {
          alert("invalid response from server");
        }
      } else {
        alert("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", `http://localhost:3000/products?_page=${pageParam}&_limit=${limitParam}`);
  httpRequest.send();
}

function makeProductCard(product) {
  let stars = "";
  for(let i = 0; i < product.stars; i++) {
    stars += `<i class="fas fa-star"></i>`
  }
  return (`
  <a href="detail.html?id=${product.id}" class="text-decoration-none" style="color: initial">      
    <div class="w-full d-flex gap-3 product-card">
        <img src="${product.images[0]}" alt="">
        <div class="product-card__desc">
          <h4>${product.name}</h4>
          <div>
            <span>
              ${stars}
            </span>
            <span class="mx-2">( ${product.purchaseCount} lượt mua )</span>
          </div>
          <p>${product.desc}</p>
          <p class="product-card__price">${product.price}đ</p>
          <div class="product-card__action">
            <button class="btn btn-outline-dark" onclick="purchase(${product.id})">MUA HÀNG</button>
            <button class="btn btn-success"><span class="ti-heart text-white"></span></button>
            <button class="btn btn-outline-dark"><span class="ti-reload"></span></button>
          </div>
        </div>
      </div>
    </a>
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

function purchase(id) {
  getCartItem(id, (p) => {
    if (!p) {
      const product = products.find(prod => prod.id === id)
      addToCart({
        id: id,
        name: product.name,
        image: product.images[0],
        price: product.discountedPrice,
        quantity: 1,
      });
      return;
    }
    addCartItemCount(id, 1);
  });
}
