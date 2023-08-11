const inquirer = require("inquirer");
require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "What do you want to do?",
    choices: [
      { value: 1, name: `${"1.".green} Look for city` },
      { value: 2, name: `${"2.".green} View search history` },
      { value: 0, name: `${"0.".green} Exit\n` },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();

  console.log("=====================".green);
  console.log("Select an option".white);
  console.log("=====================\n".green);

  const { option } = await inquirer.prompt(questions);

  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"enter".green} to contine`,
    },
  ];

  await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Enter a value please";
        }

        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}`.green;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0".green + " Cancel",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select place: ",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
};
