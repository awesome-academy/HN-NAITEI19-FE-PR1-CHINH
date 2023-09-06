const cartContainer = document.getElementById("cart-container");
const totalPrice = document.getElementById("total-price");
console.log(totalPrice);

window.onload = () => {
  // while (!db) { }
  const t = setTimeout(() => {
    getItems();
    clearTimeout(t);
  }, 500);
}

function getItems() {
  getCart((products) => {
    cartContainer.innerHTML = "";
    let total = 0;
    for (const product of products) {
      cartContainer.innerHTML += makeCartItem(product);
      total += product.price * product.quantity;
    }
    totalPrice.innerHTML = `<span class="fw-bold">Tổng số: ${total}đ</span>`;
  });
}

function makeCartItem(product) {
  return (`
  <tr>
    <th scope="row" class="border text-center">
      <img src="${product.image}" alt="" width="50" height="50">
    </th>
    <td scope="row" class="border align-middle text-center">${product.name}</td>
    <td scope="row" class="border align-middle text-center">${product.price}đ</td>
    <td scope="row" class="border align-middle text-center">
      <input class="cart__item-count" type="number" value="${product.quantity}" min="1" onchange="updateCartItemQuantity(${product.id}, this.value); getItems();">
    </td>
    <td scope="row" class="border align-middle text-center">${product.price * product.quantity}đ</td>
    <td scope="row" class="border align-middle text-center">
      <button class="cart__item-rm" onclick="removeFromCart(${product.id})"><span class="ti-trash"></span></button>
    </td>
  </tr>
  `)
}

function clearItems() {
  clearCart(); 
  getItems();
  alert('Clear success!');
}

function payItems() {
  clearCart(); 
  getItems();
  alert('Pay success!');
}
