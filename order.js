let cart = [];

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const sendOrder = document.getElementById("sendOrder");


// ===============================
// ADD TO CART
// ===============================

document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        cartPanel.classList.add("active");
        cartOverlay.classList.add("active");
    });

});


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        count += item.quantity;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small>${item.price} сом × ${item.quantity}</small>
            </div>

            <div class="quantity">

                <button onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${index}, 1)">
                    +
                </button>

            </div>

            <strong>
                ${itemTotal} сом
            </strong>
        `;

        cartItems.appendChild(div);

    });

    cartCount.textContent = count;
    cartTotal.textContent = total;
}


// ===============================
// CHANGE QUANTITY
// ===============================

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


// ===============================
// OPEN CART
// ===============================

cartButton.addEventListener("click", () => {

    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");

});


// ===============================
// CLOSE CART
// ===============================

closeCart.addEventListener("click", closeCartPanel);

cartOverlay.addEventListener("click", closeCartPanel);

function closeCartPanel() {

    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");

}


// ===============================
// SEND ORDER TO CLOUDFLARE
// ===============================

sendOrder.addEventListener("click", async () => {

    if (cart.length === 0) {

        alert("Аввал хӯрок интихоб кунед.");

        return;
    }

    const name =
        document.getElementById("orderName").value.trim();

    const phone =
        document.getElementById("orderPhone").value.trim();

    const address =
        document.getElementById("orderAddress").value.trim();

    const comment =
        document.getElementById("orderComment").value.trim();


    if (!name || !phone || !address) {

        alert("Лутфан ном, телефон ва адресро пур кунед.");

        return;
    }


    let total = 0;

    let products = "";


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        products +=
            `• ${item.name} × ${item.quantity} = ${itemTotal} сомонӣ\n`;

    });


    // Маълумоти фармоиш
    const order = {

        name: name,

        phone: phone,

        address: address,

        comment: comment,

        items: products,

        total: total

    };


    sendOrder.disabled = true;

    sendOrder.textContent = "⏳ Фиристода мешавад...";


    try {

        // ===============================
        // CLOUDFLARE WORKER
        // ===============================

        const response = await fetch(
            "https://zarafshon-orders.saidmahdisolihov654.workers.dev/order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(order)
            }
        );


        const result = await response.json();


        if (!response.ok || !result.success) {

            console.error("Server error:", result);

            throw new Error("Order error");

        }


        // ===============================
        // SUCCESS
        // ===============================

        alert(
            "✅ Фармоиши шумо қабул шуд!\n\n" +
            "Ресторан бо шумо тамос мегирад."
        );


        cart = [];

        updateCart();


        document.getElementById("orderName").value = "";

        document.getElementById("orderPhone").value = "";

        document.getElementById("orderAddress").value = "";

        document.getElementById("orderComment").value = "";


        closeCartPanel();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Фармоиш фиристода нашуд.\n\n" +
            "Лутфан баъдтар кӯшиш кунед."
        );

    }


    sendOrder.disabled = false;

    sendOrder.textContent = "📲 Фармоиш додан";

});