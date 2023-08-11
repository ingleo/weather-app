require("dotenv").config();
require("colors");
const {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
} = require("./helpers/inquirer");

const Search = require("./models/Search");

const main = async () => {
  const search = new Search();

  let option;
  do {
    option = await inquirerMenu();

    switch (option) {
      case 1:
        //mostrar mensaje
        const term = await readInput("City");
        const places = await search.getCity(term);
        const selectedId = await listPlaces(places);

        if (selectedId === "0") continue;
        const { name, lng, lat } = await places.find(
          (place) => place.id === selectedId
        );

        search.addRecord(name);

        const { desc, temp, min, max } = await search.getWeather(lat, lng);

        console.clear();
        console.log("\nCity information\n".green);
        console.log("City:", name.green);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("Description:", desc.green);
        console.log("Temperature:", temp);
        console.log("Min:", min);
        console.log("Max:", max);
        break;
      case 2:
        search.capitalizeRecords.forEach((place, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    await pause();
  } while (option !== 0);
};

main();
