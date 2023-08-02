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

  response.data.forEach((item) => {
    const option = createOption(item);
    city.appendChild(option);
  });

  city.value = "thanh_pho_ho_chi_minh";

  const location = await instanceLocation.get("", {
    params: {
      q: "thanh_pho_ho_chi_minh",
      appid: api_key,
      limit: 1,
    },
  });

  locationName.innerText = city.options[city.selectedIndex].text;

  getWeather(location.data[0].lat, location.data[0].lon);
});

city.onchange = async function () {
  locationName.innerText = city.options[city.selectedIndex].text;

  const location = await instanceLocation.get("", {
    params: {
      q: city.options[city.selectedIndex].value,
      appid: api_key,
      limit: 1,
    },
  });

  if (location.data.length === 0) {
    getWeather(null, null);
    // desc.innerText = "--";
    // temp.innerText = "--°C";
    // realFeel.innerText = "--°C";
    // humidity.innerText = "-- %";
    // windSpeed.innerText = "-- km/h";
    // clouds.innerText = "-- %";
    // visibility.innerText = "-- km";
    // img.setAttribute("src", "./img/question_icon.svg");
    return;
  }

  getWeather(location.data[0].lat, location.data[0].lon);
};

function createOption(data) {
  const option = document.createElement("option");
  option.innerText = data.name;
  option.setAttribute("value", data.codename);

  return option;
}

async function getWeather(lat, lon) {
  let result;

  if (lat && lon)
    result = await instanceWeather.get("", {
      params: {
        lat,
        lon,
        appid: api_key,
        lang: "vi",
        units: "Metric",
      },
    });
  // else result = {

  // }

  const detail = result?.data.weather[0].description || null;

  if (!detail) img.setAttribute("src", "./img/question_icon.svg");
  else if (detail.toUpperCase().includes("MƯA"))
    img.setAttribute("src", "./img/rainny_icon.svg");
  else if (detail.toUpperCase().includes("MÂY CỤM"))
    img.setAttribute("src", "./img/broken_clouds_icon.svg");
  else if (detail.toUpperCase().includes("NẮNG"))
    img.setAttribute("src", "./img/sun_icon.svg");
  else img.setAttribute("src", "./img/cloudy_icon.svg");

  desc.innerText = detail ? capitalizeFirstLetter(detail) : "--";
  temp.innerText = `${Math.round(result?.data.main.temp) || "--"}°C`;
  realFeel.innerText = `${Math.round(result?.data.main.feels_like) || "--"}°C`;
  humidity.innerText = `${result?.data.main.humidity || "--"}%`;
  windSpeed.innerText = `${
    Math.round(result?.data.wind.speed * 3.6) || "--"
  } km/h`;
  clouds.innerText = `${result?.data.clouds.all} %`;
  if (result?.data.visibility >= 10000) {
    visibility.innerText = "Trên 10 km";
  } else {
    visibility.innerText = `${
      Math.round(result?.data.visibility / 1000) || "--"
    } km`;
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
