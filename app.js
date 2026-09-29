const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const routeSelect = document.getElementById("route");
const commentInput = document.getElementById("comment");

const calculateButton = document.getElementById("calculateButton");
const orderButton = document.getElementById("orderButton");
const resetButton = document.getElementById("resetButton");

const priceCard = document.getElementById("priceCard");
const successCard = document.getElementById("successCard");
const priceElement = document.getElementById("price");

let calculatedPrice = 0;

function validateForm() {
  if (!fromInput.value.trim()) {
    alert("Укажите адрес подачи");
    fromInput.focus();
    return false;
  }

  if (!toInput.value.trim()) {
    alert("Укажите адрес назначения");
    toInput.focus();
    return false;
  }

  if (!routeSelect.value) {
    alert("Выберите маршрут");
    routeSelect.focus();
    return false;
  }

  return true;
}

function calculatePrice() {
  const selectedPrice = Number(routeSelect.value);

  if (!selectedPrice) {
    alert("Сначала выберите маршрут");
    return;
  }

  calculatedPrice = selectedPrice;
  priceElement.textContent = `${calculatedPrice} ₽`;

  priceCard.classList.remove("hidden");

  priceCard.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
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

  const telegramUser = tg?.initDataUnsafe?.user || null;

  const order = {
    type: "new_order",
    id: String(Date.now()),
    city: "Анапа",
    tariff: "Стандарт",

    customer: {
      telegramId: telegramUser?.id || null,
      firstName: telegramUser?.first_name || "",
      lastName: telegramUser?.last_name || "",
      username: telegramUser?.username || ""
    },

    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    routePrice: calculatedPrice,
    comment: commentInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  console.log("Создан заказ:", order);

  if (tg) {
    tg.sendData(JSON.stringify(order));
  } else {
    alert(
      "Mini App открыто не через Telegram.

" +
      "Заказ сформирован только в тестовом режиме."
    );
  }

  priceCard.classList.add("hidden");
  successCard.classList.remove("hidden");

  successCard.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function resetForm() {
  fromInput.value = "";
  toInput.value = "";
  routeSelect.value = "";
  commentInput.value = "";

  calculatedPrice = 0;
  priceElement.textContent = "0 ₽";

  priceCard.classList.add("hidden");
  successCard.classList.add("hidden");

  fromInput.focus();
}

calculateButton.addEventListener("click", () => {
  if (validateForm()) {
    calculatePrice();
  }
});

orderButton.addEventListener("click", createOrder);
resetButton.addEventListener("click", resetForm);
