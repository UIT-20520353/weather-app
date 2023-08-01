"use strict";

import { instanceCity, instanceWeather, instanceLocation } from "./data.js";
import { cityList } from "./city.list.js";

const city = document.getElementById("city");
const locationName = document.getElementById("location__name");
const desc = document.getElementById("desc");
const temp = document.getElementById("temporature__text");
const realFeel = document.getElementById("real-feel");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind__speed");
const clouds = document.getElementById("clouds__all");
const visibility = document.getElementById("visibility");
const img = document.getElementById("weather-icon");

const api_key = "74538f9269edeae9d2cb195ce6450242";

document.addEventListener("DOMContentLoaded", async function () {
  const response = await instanceCity.get();

  for (const i in response.data) {
    const location = await instanceLocation.get("", {
      params: {
        q: response.data[i].codename,
        appid: api_key,
        limit: 1,
      },
    });

    if (location.data.length !== 0) {
      const option = createOption(response.data[i]);
      city.appendChild(option);
    } else {
      console.log(response.data[i]);
    }
  }

  city.value = "thanh_pho_ho_chi_minh";

  locationName.innerText = city.options[city.selectedIndex].text;

  getWeather(getCityFromList(city.options[city.selectedIndex].value));
});

city.onchange = function () {
  locationName.innerText = city.options[city.selectedIndex].text;
  getWeather(getCityFromList(city.options[city.selectedIndex].value));
};

function createOption(data) {
  const option = document.createElement("option");
  option.innerText = data.name;
  option.setAttribute("value", data.codename);

  return option;
}

function getCityFromList(code) {
  return cityList.find((item) => item.codename === code);
}

async function getWeather(currentCity) {
  const result = await instanceWeather.get("", {
    params: {
      lat: currentCity.coord.lat,
      lon: currentCity.coord.lon,
      appid: api_key,
      lang: "vi",
      units: "Metric",
    },
  });

  const detail = result.data.weather[0].description;

  if (detail.toUpperCase().includes("MƯA"))
    img.setAttribute("src", "./img/rainny_icon.svg");
  else if (detail.toUpperCase().includes("MÂY CỤM"))
    img.setAttribute("src", "./img/broken_clouds_icon.svg");
  else img.setAttribute("src", "./img/cloudy_icon.svg");

  desc.innerText = detail;
  temp.innerText = `${Math.round(result.data.main.temp)}°C`;
  realFeel.innerText = `${Math.round(result.data.main.feels_like)}°C`;
  humidity.innerText = `${result.data.main.humidity}%`;
  windSpeed.innerText = `${Math.round(result.data.wind.speed * 3.6)} km/h`;
  clouds.innerText = `${result.data.clouds.all} %`;
  if (result.data.visibility >= 10000) {
    visibility.innerText = "Trên 10 km";
  } else {
    visibility.innerText = `${Math.round(result.data.visibility / 1000)} km`;
  }
}
