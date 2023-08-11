require("dotenv").config();
require("colors");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listarlugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;
  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //mostrar mensaje
        const termino = await leerInput("Ciudad");
        const lugares = await busquedas.buscarCiudad(termino);
        const idSeleccionado = await listarlugares(lugares);

        if (idSeleccionado === "0") continue;
        const { nombre, lng, lat } = await lugares.find(
          (lugar) => lugar.id === idSeleccionado
        );

        busquedas.agregarHistorial(nombre);

        const { desc, temp, min, max } = await busquedas.climaLugar(lat, lng);

        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", nombre.green);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("Descripción:", desc.green);
        console.log("Temperatura:", temp);
        console.log("Mínima:", min);
        console.log("Máxima:", max);
        break;
      case 2:
        busquedas.capitalizeHistorial.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    await pausa();
  } while (opt !== 0);
};

main();
