const cartContainer = document.getElementById("cart-container");
const totalPrice = document.getElementById("total-price");
const form = document.getElementById("form-customer");

let products;

window.onload = () => {
  // while (!db) { }
  const t = setTimeout(() => {
    getItems();
    clearTimeout(t);
  }, 500);
}

function getItems() {
  getCart((ps) => {
    products = ps;
    cartContainer.innerHTML = "";
    let total = 0;
    for (const p of ps) {
      cartContainer.innerHTML += makeCartItem(p);
      total += p.price * p.quantity;
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
      <span class="cart__item-count">${product.quantity}</span>
    </td>
    <td scope="row" class="border align-middle text-center">${product.price * product.quantity}đ</td>
  </tr>
  `)
}

form.addEventListener("submit", payItems);
function payItems(event) {
  event.preventDefault();
  // get all fields of form with id="form-customer" and send a post request to localhost:3000/invoices
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  data.products = products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
  }));
  console.log(data);
  // send data to server
  const request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/invoices");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(data));
  request.onload = () => {
    if (request.status === 201) {
      alert("Đặt hàng thành công!");
      clearCart(); 
      getItems();
      window.location.href = "/";
      // updateProductQuanity(() => {
      // });
    } else {
      alert("Đặt hàng thất bại!");
    }
  };
}

// function updateProductQuanity(cb) {
//   // get products quantity from json-server and update quantity of each purchased product
//   for(const product of products) {
//     let request = new XMLHttpRequest();
//     request.open("GET", `http://localhost:3000/products/${product.id}`);
//     request.send();
//     request.onload = () => {
//       if (request.status === 200) {
//         const p = JSON.parse(request.response);
//         request = new XMLHttpRequest();
//         request.open("PATCH", `http://localhost:3000/products/${product.id}`);
//         request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//         request.send(JSON.stringify({
//           quantity: parseInt(p.quantity) - product.quantity,
//         }));
//         request.onload = () => {
//           if (request.status === 200) {
//             console.log("Updated product quantity");
//             cb();
//           } else {
//             throw new Error("Failed to update product quantity");
//           }
//         };
//       } else {
//         throw new Error("Failed to get product");
//       }
//     }
        
    
//   }

// }
