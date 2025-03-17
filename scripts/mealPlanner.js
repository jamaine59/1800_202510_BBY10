//adding active class to the selected diet button
const dietButtons = document.querySelectorAll(".diet-btn");
dietButtons.forEach((button) => {
  button.addEventListener("click", function () {
    dietButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
  });
});

const generateButton = document.querySelector(".btn-warning");
generateButton.addEventListener("click", function () {
  const dietType = document.querySelector(".diet-btn.active").value;
  const calories = document.getElementById("calories").value;
  const mealType = document.querySelector(
    'input[name="planType"]:checked'
  ).value;

  console.log(dietType, calories, mealType);
});
