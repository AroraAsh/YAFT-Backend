const AchievementTypes = {
  total_distance: {
    name: "Distance Achievement",
    template_description: "Move {value} km since joining",
    levels: [10, 50, 100, 500, 1000, 5000]
  },
  total_steps: {
    name: "Step Achievement",
    template_description: "Make {value} steps since joining",
    levels: [5000, 50000, 100000, 1000000]
  },
  daily_distance: {
    name: "Daily Distance Achievement",
    template_description: "Move {value} km in a day",
    levels: [1, 2, 5, 10, 20, 30, 40, 50, 100]
  },
  monthly_distance: {
    name: "Weekly Distance Achievement",
    template_description: "Move {value} km in a week",
    levels: [10, 25, 50, 100]
  },
  total_weight_loss: {
    name: "Weight Loss Achievement",
    template_description: "Lose {value} kg since joining",
    levels: [1, 2, 5, 10, 20, 30, 40, 50]
  },
  // {
  //   type: "monthly_weight_loss",
  //   name: "Monthly Weight Loss Achievement",
  //   template_description: "Lose {value} kg in a month",
  //   levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  // },
  total_running: {
    name: "Running Achievement",
    template_description: "Run {value} km since joining",
    levels: [10, 50, 100, 500, 1000, 5000]
  },
  total_walking: {
    name: "Walking Achievement",
    template_description: "Walk {value} km since joining",
    levels: [10, 50, 100, 500, 1000, 5000]
  },
  total_biking: {
    name: "Biking Achievement",
    template_description: "Bike {value} km since joining",
    levels: [10, 50, 100, 500, 1000, 5000]
  },
  challenge: {
    name: "Challenge Achievement",
    template_description: "Win {value} challenges",
    levels: [1, 5, 10]
  },
  // {
  //   type: "goal",
  //   name: "Goal Achievement",
  //   template_description: "Meet your daily goals {value} times",
  //   levels: [1, 5, 10, 50, 100]
  // },
  
};

exports.getAchievementTypes = function(){
  return AchievementTypes;
}