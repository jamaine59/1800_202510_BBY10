import { apiKey, apiURL } from "./spoonacularAPI.js";

//adding active class to the selected diet button
const dietButtons = document.querySelectorAll(".diet-btn");
dietButtons.forEach((button) => {
  button.addEventListener("click", function () {
    dietButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
  });
});

let mealPlan = [];
const generateButton = document.querySelector(".btn-warning");
generateButton.addEventListener("click", async function () {
  const dietType = document.querySelector(".diet-btn.active").value;
  const calories = document.getElementById("calories").value;
  const mealType = document.querySelector(
    'input[name="planType"]:checked'
  ).value;

  // fetching the meal plan based on user input
  try {
    let response;
    if (mealType === "weekly") {
      response = await fetch(
        `${apiURL}apiKey=${apiKey}&timeFrame=week&targetCalories=${calories}&diet=${dietType}`
      );
    } else {
      response = await fetch(
        `${apiURL}apiKey=${apiKey}&timeFrame=day&targetCalories=${calories}&diet=${dietType}`
      );
    }

    const data = await response.json();
    mealPlan = data;
    console.log(mealPlan);
  } catch (error) {
    console.error("Error:", error);
  }
});
console.log(mealPlan);
