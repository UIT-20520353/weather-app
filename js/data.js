const instanceCity = axios.create({
  baseURL: "https://provinces.open-api.vn/api/p/",
});

const instanceWeather = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/weather/",
});

const instanceLocation = axios.create({
  baseURL: "http://api.openweathermap.org/geo/1.0/direct",
});

export { instanceCity, instanceWeather, instanceLocation };
