const instanceCity = axios.create({
  baseURL: "https://provinces.open-api.vn/api/p/",
});

const instanceWeather = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/weather/",
});

export { instanceCity, instanceWeather };
