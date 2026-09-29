const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const cityName = document.getElementById("cityName");
const zoneSelect = document.getElementById("zone");
const calculateButton = document.getElementById("calculateButton");
const orderButton = document.getElementById("orderButton");
const closeButton = document.getElementById("closeButton");

const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const commentInput = document.getElementById("comment");

const priceCard = document.getElementById("priceCard");
const priceValue = document.getElementById("priceValue");
const statusCard = document.getElementById("statusCard");

let calculatedPrice = 0;

cityName.textContent = APP_CONFIG.city;

APP_CONFIG.zones.forEach((zone) => {
  const option = document.createElement("option");

  option.value = zone.id;
  option.textContent = `${zone.title} — ${zone.price} ₽`;

  zoneSelect.appendChild(option);
});

function getSelectedZone() {
  const zoneId = zoneSelect.value;

  return APP_CONFIG.zones.find((zone) => zone.id === zoneId);
}

function validateForm() {
  if (!fromInput.value.trim()) {
    alert("Укажите адрес подачи");
    return false;
  }

  if (!toInput.value.trim()) {
    alert("Укажите адрес назначения");
    return false;
  }

  if (!zoneSelect.value) {
    alert("Выберите направление");
    return false;
  }

  return true;
}

calculateButton.addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  const zone = getSelectedZone();

  calculatedPrice = zone.price;

  priceValue.textContent =
    `${calculatedPrice} ${APP_CONFIG.currency}`;

  priceCard.classList.remove("hidden");
  priceCard.scrollIntoView({ behavior: "smooth" });
});

orderButton.addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  const user = tg?.initDataUnsafe?.user || null;
  const zone = getSelectedZone();

  const order = {
    type: "new_order",
    orderId: String(Date.now()),
    city: APP_CONFIG.city,
    tariff: APP_CONFIG.tariff.id,
    tariffTitle: APP_CONFIG.tariff.title,
    customer: {
      telegramId: user?.id || null,
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      username: user?.username || ""
    },
    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    zone: zone.title,
    comment: commentInput.value.trim(),
    estimatedPrice: calculatedPrice,
    createdAt: new Date().toISOString()
  };

  console.log("Новый заказ:", order);

  if (tg) {
    tg.sendData(JSON.stringify(order));
  } else {
    alert("Тестовый режим: заказ сформирован");
  }

  priceCard.classList.add("hidden");
  statusCard.classList.remove("hidden");
  statusCard.scrollIntoView({ behavior: "smooth" });
});

closeButton.addEventListener("click", () => {
  if (tg) {
    tg.close();
  } else {
    statusCard.classList.add("hidden");
  }
});