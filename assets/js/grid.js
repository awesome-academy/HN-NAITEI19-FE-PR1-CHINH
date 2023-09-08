const urlParams = new URLSearchParams(window.location.search);
let limitParam = parseInt(urlParams.get('_limit'));
let pageParam = parseInt(urlParams.get('_page'));
let queryParam = urlParams.get('q');
let catParam = urlParams.get('cat');
console.log(limitParam, pageParam);
limitParam = Number.isNaN(limitParam) ? 9 : limitParam;
pageParam = Number.isNaN(pageParam) ? 1 : pageParam;

const productContainer = document.getElementById("product-card-container");
productContainer.innerHTML = "<p>loading</p>";

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
          productContainer.innerHTML = "";
          if (products.length === 0) {
            productContainer.innerHTML = "<p>Không tìm thấy sản phẩm nào</p>";
            return;
          }
          for (const product of products) {
            productContainer.innerHTML += makeProductCard(product);
          }
          document.getElementById("search-query").innerHTML = queryParam ? `Kết quả tìm kiếm cho: "${queryParam}"` : "";
          document.getElementById("search-query").innerHTML = catParam ? `Kết quả tìm kiếm cho loại: "${catParam}"` : "";
        } catch (e) {
          console.log(e);
          alert("invalid response from server");
        }
        makePagination(httpRequest.getResponseHeader("X-Total-Count"), httpRequest.getResponseHeader("Link"));
      } else {
        alert("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", `http://localhost:3000/products?_page=${pageParam}&_limit=${limitParam}${queryParam ? `&q=${queryParam}` : ''}${catParam ? `&q=${catParam}` : ''}`);
  httpRequest.send();
}

function makeProductCard(product) {
  return (`
    <a href="detail.html?id=${product.id}" class="text-decoration-none" style="color: initial">
      <div class="card product-card">
        <img class="card-img-top" src="${product.images[0]}" alt="Card image cap">
        <div class="card-body">
          <h5 class="product-card__title text-uppercase">${product.brand}</h5>
          <p class="product-card__text">${product.name}</p>
          <hr>
          <p class="product-card__price">${product.discountedPrice}đ</p>
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
  if (linkHeader.length === 0) {
    const firstLink = links.find(l => l.includes("rel=\"first\"")).split('; ')[0].slice(1, -1).split("?")[1]
    const lastLink = links.find(l => l.includes("rel=\"last\"")).split('; ')[0].slice(1, -1).split("?")[1]
    for (let p of paginations) {
      p.innerHTML += `<li class="list-pagination__item"><a href="list.html?${firstLink}"><i class="fas fa-caret-left px-2"></i></a></li>`
      for (let i = 1; i <= Math.ceil(totalCount / limitParam); i++) {
        p.innerHTML += `<li class="list-pagination__item ${i === pageParam ? "active" : ""} fw-semibold px-2"><a href="?_page=${i}&_limit=${limitParam}">${i}</a></li>`
      }
      p.innerHTML += `<li class="list-pagination__item"><a href="list.html?${lastLink}"><i class="list-pagination__item fas fa-caret-right px-2"></i></a></li>`
    }
    return
  }
  for (let p of paginations) {
    for (let i = 1; i <= Math.ceil(totalCount / limitParam); i++) {
      p.innerHTML += `<li class="list-pagination__item ${i === pageParam ? "active" : ""} fw-semibold px-2"><a href="?_page=${i}&_limit=${limitParam}">${i}</a></li>`
    }
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

