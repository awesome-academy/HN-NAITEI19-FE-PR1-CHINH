const navbar = document.querySelector('nav')

window.addEventListener('scroll', () => {
  let y = (window.scrollY || window.pageYOffset)
  const alpha = y/150
  navbar.style.backgroundColor = `rgba(255, 255, 255, ${y<10 ? 0.4 : alpha})`
})

// indexedDB setup

if (!('indexedDB' in window)) {
  alert("This browser doesn't support IndexedDB");
}

const request = window.indexedDB.open("cart");
let db = null;

request.onerror = (event) => {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
  db = event.target.result;
  updateNavCart();
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("cart", { keyPath: "id" });
  objectStore.createIndex("id", "id", { unique: true });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("price", "price", { unique: false });
  objectStore.createIndex("quantity", "quantity", { unique: false });
  objectStore.createIndex("image", "images", { unique: false });
}

function getCart(cb) {
  const transaction = db.transaction(["cart"], "readonly");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.getAll();
  let products = [];
  request.onsuccess = (event) => {
    // products = [{a:1, b:2}]
    products = event.target.result;
    cb(products);
  };
  request.onerror = (event) => {
    alert("Failed to get cart");
    cb(null)
  };
}

function getCartItem(productId, cb) {
  const transaction = db.transaction(["cart"], "readonly");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.get(productId);
  request.onsuccess = (event) => {
    const product = event.target.result;
    cb(product);
  };
  request.onerror = (event) => {
    alert("Failed to get cart item");
    cb(null)
  };
}

function addToCart(product) {
  const transaction = db.transaction(["cart"], "readwrite");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.add(product);
  request.onsuccess = (event) => {
    alert("Added to cart");
    updateNavCart();
  };
  request.onerror = (event) => {
    alert("Failed to add to cart");
  };
}

function addCartItemCount(productId, quantity) {
  const transaction = db.transaction(["cart"], "readwrite");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.get(productId);
  request.onsuccess = (event) => {
    const product = event.target.result;
    product.quantity = quantity;
    const requestUpdate = objectStore.put(product);
    requestUpdate.onsuccess = (event) => {
      alert("Updated cart");
      updateNavCart();
    };
    requestUpdate.onerror = (event) => {
      alert("Failed to update cart");
    };
  };
  request.onerror = (event) => {
    alert("Failed to get product");
  };
}

function updateCartItemQuantity(productId, quantity) {
  const transaction = db.transaction(["cart"], "readwrite");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.get(productId);
  request.onsuccess = (event) => {
    const product = event.target.result;
    product.quantity = quantity;
    const requestUpdate = objectStore.put(product);
    requestUpdate.onsuccess = (event) => {
      alert("Updated cart");
      updateNavCart();
    };
    requestUpdate.onerror = (event) => {
      alert("Failed to update cart");
    };
  };
  request.onerror = (event) => {
    alert("Failed to get product");
  };
}

function removeFromCart(productId) {
  const transaction = db.transaction(["cart"], "readwrite");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.delete(productId);
  request.onsuccess = (event) => {
    alert("Removed from cart");
    updateNavCart();
  };
  request.onerror = (event) => {
    alert("Failed to remove from cart");
  };
}

function clearCart() {
  const transaction = db.transaction(["cart"], "readwrite");
  const objectStore = transaction.objectStore("cart");
  const request = objectStore.clear();
  request.onsuccess = (event) => {
    alert("Cleared cart");
    updateNavCart();
  };
  request.onerror = (event) => {
    alert("Failed to clear cart");
  };
}

function updateNavCart() {
  getCart((products) => {
    const navCartContainer = document.getElementById("nav__cart-container");
    const navCartTotal = document.getElementById("nav__cart_total");
    console.log(navCartTotal, navCartContainer);
    let total = 0;
    navCartContainer.innerHTML = "";
    for(const product of products) {
      navCartContainer.innerHTML += `
        <div class="d-flex justify-content-between">
          <img src=${product.image} alt="" width="50" height="50">
          <div>
            <h6>${product.name}</h6>
            <div>${product.price}đ</div>
          </div>
          <button class="nav__cart__rm" onclick="removeFromCart(${product.id})"><span class="ti-close"></span></button>
        </div>
      `;
      total += product.price * product.quantity;
    }
    navCartTotal.innerHTML = `${total}đ`;
  });
}
