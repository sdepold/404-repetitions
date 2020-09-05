import { changeableLevelStats } from "../app/player";

export default {
  host: "",
  name: "home",
  items: [
    {
      title: "Dress up",
      requirements: {
        dressed: false,
        time: 10,
      },
      effects: {
        dressed: true,
      },
      soundEffect: [, , 528, 0.01, , 0.48, , 0.6, -11.6, , , , 0.32, 4.2],
      hideIfRequirementsNotMet: true,
    },
    {
      title: "Thorough sleep",
      requirements: {
        time: 480,
      },
      effects: {
        stamina: 100,
      },
    },
    {
      title: "Quick nap",
      requirements: {
        time: 120,
      },
      effects: {
        stamina: 50,
      },
    },
    ...changeableLevelStats.map((statName) => ({
      title: (player) => `Up ${statName} / Current: ${player.levelStats[statName]}`,
      requirements: {
        availableStatPoints: 1,
        time: 10,
      },
      effects: {
        availableStatPoints: -1,
        [`levelStats.${statName}`]: 1,
      },
      hideIfRequirementsNotMet: true,
    })),
  ],
};
