"use strict";

const telegram =
  window.Telegram &&
  window.Telegram.WebApp
    ? window.Telegram.WebApp
    : null;

if (telegram) {
  telegram.ready();
  telegram.expand();
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


function fillRoutes() {
  routeSelect.innerHTML = "";

  const emptyOption =
    document.createElement("option");

  emptyOption.value = "";
  emptyOption.textContent =
    "Выберите маршрут";

  routeSelect.appendChild(emptyOption);

  APP_CONFIG.routes.forEach(
    function (route) {
      const option =
        document.createElement("option");

      option.value =
        String(route.price);

      option.dataset.routeId =
        route.id;

      option.textContent =
        route.title
        + " — "
        + route.price
        + " ₽";

      routeSelect.appendChild(option);
    }
  );
}


function validateForm() {
  if (fromInput.value.trim() === "") {
    alert("Укажите адрес подачи");
    fromInput.focus();
    return false;
  }

  if (toInput.value.trim() === "") {
    alert("Укажите адрес назначения");
    toInput.focus();
    return false;
  }

  if (routeSelect.value === "") {
    alert("Выберите маршрут");
    routeSelect.focus();
    return false;
  }

  return true;
}


function calculatePrice() {
  if (!validateForm()) {
    return false;
  }

  calculatedPrice =
    Number(routeSelect.value);

  if (calculatedPrice <= 0) {
    alert("Не удалось определить стоимость");
    return false;
  }

  priceElement.textContent =
    calculatedPrice + " ₽";

  priceCard.classList.remove("hidden");

  return true;
}


function createOrder() {
  if (!validateForm()) {
    return;
  }

  if (calculatedPrice <= 0) {
    const success =
      calculatePrice();

    if (!success) {
      return;
    }
  }

  const selectedOption =
    routeSelect.options[
      routeSelect.selectedIndex
    ];

  const telegramUser =
    telegram &&
    telegram.initDataUnsafe &&
    telegram.initDataUnsafe.user
      ? telegram.initDataUnsafe.user
      : null;

  const order = {
    type: "new_order",
    id: String(Date.now()),
    city: APP_CONFIG.city,
    tariff: APP_CONFIG.tariff,
    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    route: selectedOption.textContent,
    routePrice: calculatedPrice,
    comment: commentInput.value.trim(),
    customer: {
      telegramId:
        telegramUser
          ? telegramUser.id
          : null,
      firstName:
        telegramUser
          ? telegramUser.first_name || ""
          : "",
      lastName:
        telegramUser
          ? telegramUser.last_name || ""
          : "",
      username:
        telegramUser
          ? telegramUser.username || ""
          : ""
    },
    createdAt:
      new Date().toISOString()
  };

  console.log("Создан заказ:", order);

  if (telegram) {
    telegram.sendData(
      JSON.stringify(order)
    );
    return;
  }

  alert(
    "Mini App открыто вне Telegram.

"
    + "Заказ создан только в тестовом режиме."
  );

  priceCard.classList.add("hidden");
  successCard.classList.remove("hidden");
}


function resetForm() {
  fromInput.value = "";
  toInput.value = "";
  routeSelect.value = "";
  commentInput.value = "";

  calculatedPrice = 0;

  priceElement.textContent =
    "0 ₽";

  priceCard.classList.add("hidden");
  successCard.classList.add("hidden");

  fromInput.focus();
}


calculateButton.addEventListener(
  "click",
  function () {
    calculatePrice();
  }
);

orderButton.addEventListener(
  "click",
  function () {
    createOrder();
  }
);

resetButton.addEventListener(
  "click",
  function () {
    resetForm();
  }
);

fillRoutes();
