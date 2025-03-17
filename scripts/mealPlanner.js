//adding active class to the selected diet button
const dietButtons = document.querySelectorAll(".diet-btn");
dietButtons.forEach((button) => {
  button.addEventListener("click", function () {
    dietButtons.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
  });
});

