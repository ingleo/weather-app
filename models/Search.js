const fs = require("fs");
const axios = require("axios");

const mapboxUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const openweatherUrl = "https://api.openweathermap.org/data/2.5/weather";

class Search {
  records = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get mapboxParams() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get openweatherParams() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  get capitalizeRecords() {
    return this.records.map((place) => {
      let words = place.split(" ");
      words = words.map((w) => w[0].toUpperCase() + w.substring(1));
      return words.join(" ");
    });
  }

  async getCity(place = "") {
    try {
      const instance = axios.create({
        baseURL: `${mapboxUrl}/${place}.json`,
        params: this.mapboxParams,
      });

      const response = await instance.get();

      return response.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async getWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `${openweatherUrl}`,
        params: { ...this.openweatherParams, lat, lon },
      });

      const response = await instance.get();
      const { weather, main } = response.data;

      return {
        desc: weather[0].description,
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.error(error.message);
    }
  }

  addRecord(place = "") {
    if (this.records.includes(place.toLowerCase())) {
      return;
    }
    this.records.unshift(place.toLowerCase());

    this.saveDB();
  }

  saveDB() {
    const payload = {
      records: this.records,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.records = data.records;
  }
}

module.exports = Search;
