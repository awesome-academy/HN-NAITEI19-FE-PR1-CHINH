const urlParams = new URLSearchParams(window.location.search);
let idParam = parseInt(urlParams.get('id'));
if(!idParam) {
  window.location.href = "404.html";
}

const galleryLeft = document.querySelector(".gallery-left");
const galleryRight = document.querySelector(".gallery-right");

const prodName = document.getElementById("prod-name");
const prodBrand = document.getElementById("prod-brand");
const prodPrice = document.getElementById("prod-price");
const prodDiscountedPrice = document.getElementById("prod-discounted-price");
const prodDesc = document.getElementById("prod-desc");
const prodColor = document.getElementById("prod-color");
const prodSize = document.getElementById("prod-size");
const prodCount = document.getElementById("prod-count");

let blog;

window.addEventListener("load", (e) => {
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
      switch (httpRequest.status) {
        case 200:
          try {
            blog = JSON.parse(httpRequest.responseText);
            console.log(blog);
            displayProduct(blog);
          } catch (e) {
            alert("invalid response from server");
          }
          break
        case 404:
          window.location.href = "404.html";
          break
        default:
          alert("There was a problem with the request.");
      }
    }
  };
  httpRequest.open("GET", `http://localhost:3000/products/${idParam}`);
  httpRequest.send();
}

function displayProduct(product) {
  // gallery left
  galleryLeft.innerHTML += '<button class="border-0"><i class="ti-arrow-up"></i></button>';
  for(let i = 0; i < product.images.length; i++) {
    galleryLeft.innerHTML += `<img src="${product.images[i]}" alt="">`;
  }
  galleryLeft.innerHTML += '<button class="border-0"><i class="ti-arrow-down"></i></button>';

  // gallery right
  galleryRight.innerHTML += `<img src="${product.images[0]}" alt="">`;

  // product info
  prodName.innerHTML = product.name;
  prodBrand.innerHTML = product.brand;
  prodPrice.innerHTML = `${product.discountedPrice}đ`;
  prodDiscountedPrice.innerHTML = `${product.price}đ`;
  prodDesc.innerHTML = product.desc;
  for(let i = 0; i < product.colors.length; i++) {
    prodColor.innerHTML += `<option value="${product.colors[i]}" ${i===0 ? 'selected' : ''}>${product.colors[i]}</option>`;
  }
  for(let i = 0; i < product.sizes.length; i++) {
    prodSize.innerHTML += `<option value="${product.sizes[i]}" ${i===0 ? 'selected' : ''}>${product.sizes[i]}</option>`;
  }
  prodCount.ariaValueMax = product.quantity;
}

function purchase() {
  // console.log(prodCount.value)
  // console.log(product);
  getCartItem(idParam, (p) => {
    if (!p) {
      addToCart({
        id: idParam,
        name: blog.name,
        image: blog.images[0],
        price: blog.discountedPrice,
        quantity: parseInt(prodCount.value),
      });
      return;
    }
    addCartItemCount(idParam, parseInt(prodCount.value));
  });
}
