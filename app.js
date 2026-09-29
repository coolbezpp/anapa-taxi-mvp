const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const fromInput =
  document.getElementById("from");

const toInput =
  document.getElementById("to");

const routeSelect =
  document.getElementById("route");

const commentInput =
  document.getElementById("comment");

const calculateButton =
  document.getElementById("calculateButton");

const orderButton =
  document.getElementById("orderButton");

const resetButton =
  document.getElementById("resetButton");

const priceCard =
  document.getElementById("priceCard");

const successCard =
  document.getElementById("successCard");

const priceElement =
  document.getElementById("price");

let calculatedPrice = 0;


function loadRoutes() {
  routeSelect.innerHTML = "";

  const emptyOption =
    document.createElement("option");

  emptyOption.value = "";
  emptyOption.textContent =
    "Vyberite marshrut";

  routeSelect.appendChild(emptyOption);

  APP_CONFIG.routes.forEach(function (route) {
    const option =
      document.createElement("option");

    option.value =
      String(route.price);

    option.dataset.routeId =
      route.id;

    option.textContent =
      route.title + " - " + route.price + " RUB";

    routeSelect.appendChild(option);
  });
}


function validateForm() {
  if (!fromInput.value.trim()) {
    alert("Ukazhite adres podachi");
    return false;
  }

  if (!toInput.value.trim()) {
    alert("Ukazhite adres naznacheniya");
    return false;
  }

  if (!routeSelect.value) {
    alert("Vyberite marshrut");
    return false;
  }

  return true;
}


function calculatePrice() {
  if (!validateForm()) {
    return;
  }

  calculatedPrice =
    Number(routeSelect.value);

  if (!calculatedPrice) {
    alert("Stoimost ne opredelena");
    return;
  }

  priceElement.textContent =
    calculatedPrice + " RUB";

  priceCard.classList.remove("hidden");
}


function createOrder() {
  if (!validateForm()) {
    return;
  }

  if (!calculatedPrice) {
    calculatePrice();
  }

  if (!calculatedPrice) {
    return;
  }

  const telegramUser =
    tg?.initDataUnsafe?.user || null;

  const order = {
    type: "new_order",
    id: String(Date.now()),
    city: APP_CONFIG.city,
    tariff: APP_CONFIG.tariff.id,

    customer: {
      telegramId:
        telegramUser?.id || null,

      firstName:
        telegramUser?.first_name || "",

      lastName:
        telegramUser?.last_name || "",

      username:
        telegramUser?.username || ""
    },

    from:
      fromInput.value.trim(),

    to:
      toInput.value.trim(),

    routePrice:
      Number(calculatedPrice),

    comment:
      commentInput.value.trim(),

    createdAt:
      new Date().toISOString()
  };

  console.log("Order:", order);

  if (tg) {
    tg.sendData(
      JSON.stringify(order)
    );
  } else {
    alert("Testovyi rezhim: zakaz sozdan");
  }

  priceCard.classList.add("hidden");
  successCard.classList.remove("hidden");
}


function resetForm() {
  fromInput.value = "";
  toInput.value = "";
  routeSelect.value = "";
  commentInput.value = "";

  calculatedPrice = 0;
  priceElement.textContent = "0 RUB";

  priceCard.classList.add("hidden");
  successCard.classList.add("hidden");
}


calculateButton.addEventListener(
  "click",
  calculatePrice
);

orderButton.addEventListener(
  "click",
  createOrder
);

resetButton.addEventListener(
  "click",
  resetForm
);

loadRoutes();
