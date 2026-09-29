const APP_CONFIG = {
  city: "Анапа",
  currency: "₽",

  tariff: {
    id: "standard",
    title: "Стандарт",
    boarding: 150,
    pricePerKm: 35,
    pricePerMinute: 8,
    minimum: 250
  },

  zones: [
    {
      id: "center-center",
      title: "Центр → Центр",
      price: 250
    },
    {
      id: "center-djemete",
      title: "Центр → Джемете",
      price: 400
    },
    {
      id: "center-vityazevo",
      title: "Центр → Витязево",
      price: 500
    },
    {
      id: "center-sukko",
      title: "Центр → Сукко",
      price: 650
    },
    {
      id: "center-utrish",
      title: "Центр → Большой Утриш",
      price: 900
    }
  ]
};