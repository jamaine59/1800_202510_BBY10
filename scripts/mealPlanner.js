import { apiKey, apiURL } from "./spoonacularAPI.js";
import { db, auth } from "./firebaseAPI_BBY10.js";

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
  const activeDietBtn = document.querySelector(".diet-btn.active");
  const caloriesInput = document.getElementById("calories");
  const selectedMealType = document.querySelector(
    'input[name="planType"]:checked'
  );

  if (!activeDietBtn) {
    Swal.fire("Please select a diet type");
    return;
  }

  if (
    !caloriesInput ||
    isNaN(caloriesInput.value) ||
    caloriesInput.value.trim() === "" ||
    caloriesInput.value <= 0
  ) {
    Swal.fire("Please enter a valid number for calories");
    return;
  }

  if (!selectedMealType) {
    Swal.fire("Please select a meal plan type (daily or weekly)");
    return;
  }

  const dietType = activeDietBtn.value;
  const calories = caloriesInput.value;
  const mealType = selectedMealType.value;

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

    const user = auth.currentUser; // Get the current authenticated user
    const userId = user ? user.uid : null;

    if (userId) {
      // Save meal plan to Firestore
      await saveMealPlanToFirestore(userId, mealPlan);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  const plan = document.getElementById("plan");
  const nutrients = document.getElementById("nutrients");

  if (Object.keys(mealPlan).length === 2) {
    plan.innerHTML = mealPlan.meals
      .map((meal) => {
        return `
              <div class="card card-daily">
                  <img src=${`https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg`} class="card-img-top" alt=${
          meal.title
        }>
                  <div class="card-body">
                      <h5 class="card-title">${meal.title}</h5>
                      <p class="card-text"><strong>Ready in: </strong>${
                        meal.readyInMinutes
                      }</p>
                      <a href=${
                        meal.sourceUrl
                      } class="btn btn-primary">Meal recipe</a>
                  </div>
              </div>`;
      })
      .join("");
    nutrients.innerHTML = `<div class="card m-4" style="width: 18rem;">
      <div class="card-header">
        Nutrients
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Calories: ${Math.floor(
          mealPlan.nutrients.calories
        )}</li>
        <li class="list-group-item">Protein: ${Math.floor(
          mealPlan.nutrients.protein
        )}</li>
        <li class="list-group-item">Carbohydrate: ${Math.floor(
          mealPlan.nutrients.carbohydrates
        )}</li>
        <li class="list-group-item">Fat: ${Math.floor(
          mealPlan.nutrients.fat
        )}</li>
      </ul>
    </div>`;
  } else {
    const { week } = mealPlan;
    plan.innerHTML = `<div class="accordion accordion-flush" id="accordionExample"></div>`;
    const accordion = document.getElementById("accordionExample");

    accordion.innerHTML = Object.entries(week)
      .map(([day, { meals, nutrients }], index) => {
        return `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
            data-bs-target="#flush-collapse${day}" aria-expanded="false" 
            aria-controls="flush-collapse${day}">
            ${
              day.charAt(0).toUpperCase() + day.slice(1)
            }  <!-- Capitalize the first letter -->
          </button>
        </h2>
        <div id="flush-collapse${day}" class="accordion-collapse collapse" 
          aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
          <div class="accordion-body d-lg-flex justify-content-around w-100">
            ${meals
              .map((meal) => {
                return `
                <div class="card" style="width: 18rem; margin: 1rem 0.8rem;">
                  <img src="https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg" class="card-img-top" alt="${meal.title}">
                  <div class="card-body">
                    <h5 class="card-title">${meal.title}</h5>
                    <p class="card-text"><strong>Ready in: </strong>${meal.readyInMinutes} minutes</p>
                    <a href="${meal.sourceUrl}" class="btn btn-primary">Meal recipe</a>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
          <div class="card m-4" style="width: 18rem;">
            <div class="card-header">
              Nutrients
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Calories: ${Math.floor(
                nutrients.calories
              )}</li>
              <li class="list-group-item">Protein: ${Math.floor(
                nutrients.protein
              )}</li>
              <li class="list-group-item">Carbohydrate: ${Math.floor(
                nutrients.carbohydrates
              )}</li>
              <li class="list-group-item">Fat: ${Math.floor(nutrients.fat)}</li>
            </ul>
          </div>
        </div>
      </div>
    `;
      })
      .join("");
  }
});

async function saveMealPlanToFirestore(userId, mealPlan) {
  if (!userId) {
    console.error("User is not authenticated.");
    return;
  }

  try {
    const userMeals = db.collection("users").doc(userId);

    // merge true will overwrite the existing data -- might change later
    await userMeals.set(
      {
        mealPlan: {
          data: mealPlan,
          savedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving meal plan to Firestore:", error);
  }
}

//fetching the saved meal plan from firestore
function fetchAndRenderSavedMealPlan() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      const savedPlan = doc.exists ? doc.data().mealPlan?.data : null;

      if (savedPlan && savedPlan.week) {
        renderSavedWeeklyMealPlan(savedPlan);
      } else {
        console.log("No saved weekly plan found.");
      }
    } catch (err) {
      console.error("Error fetching saved meal plan:", err);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderSavedMealPlan();
});

function renderSavedWeeklyMealPlan(mealPlan) {
  const plan = document.getElementById("plan");
  const { week } = mealPlan;

  if (!week || !plan) return;

  plan.innerHTML = `<div class="accordion accordion-flush" id="accordionExample"></div>`;
  const accordion = document.getElementById("accordionExample");
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  accordion.innerHTML = Object.entries(week)
    .sort(
      ([dayA], [dayB]) =>
        dayOrder.indexOf(dayA.toLowerCase()) -
        dayOrder.indexOf(dayB.toLowerCase())
    )
    .map(
      ([day, { meals, nutrients }], index) => `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
            data-bs-target="#flush-collapse${day}" aria-expanded="false" 
            aria-controls="flush-collapse${day}">
            ${
              day.charAt(0).toUpperCase() + day.slice(1)
            }  <!-- Capitalize the first letter -->
          </button>
        </h2>
        <div id="flush-collapse${day}" class="accordion-collapse collapse" 
          aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
          <div class="accordion-body d-lg-flex justify-content-around w-100">
            ${meals
              .map((meal) => {
                return `
                <div class="card" style="width: 18rem; margin: 1rem 0.8rem;">
                  <img src="https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg" class="card-img-top" alt="${meal.title}">
                  <div class="card-body">
                    <h5 class="card-title">${meal.title}</h5>
                    <p class="card-text"><strong>Ready in: </strong>${meal.readyInMinutes} minutes</p>
                    <a href="${meal.sourceUrl}" class="btn btn-primary">Meal recipe</a>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
          <div class="card m-4" style="width: 18rem;">
            <div class="card-header">
              Nutrients
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Calories: ${Math.floor(
                nutrients.calories
              )}</li>
              <li class="list-group-item">Protein: ${Math.floor(
                nutrients.protein
              )}</li>
              <li class="list-group-item">Carbohydrate: ${Math.floor(
                nutrients.carbohydrates
              )}</li>
              <li class="list-group-item">Fat: ${Math.floor(nutrients.fat)}</li>
            </ul>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}
