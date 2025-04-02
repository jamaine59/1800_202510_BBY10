import { db, auth } from "./firebaseAPI_BBY10.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.uid).get();
    const mealPlan = doc.exists ? doc.data().mealPlan?.data : null;
    document.getElementById("userGreeting").innerHTML = `Hello, ${
      doc.data().name
    }!`;
    renderSavedMealPlan(mealPlan);
  } catch (err) {
    console.error("Error loading saved meal plan:", err);
  }
});

function renderSavedMealPlan(mealPlan) {
  const container = document.getElementById("savedMealPlan");
  container.innerHTML = "";

  if (!mealPlan) {
    container.innerHTML = "<p>No saved meal plan found.</p>";
    return;
  }

  if (mealPlan.meals && mealPlan.nutrients) {
    const mealsHTML = mealPlan.meals
      .map(
        (meal) => `
        <div class="card" style="width: 18rem;">
          <img src="https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg" class="card-img-top" alt="${meal.title}">
          <div class="card-body">
            <h5 class="card-title">${meal.title}</h5>
            <p class="card-text"><strong>Ready in:</strong> ${meal.readyInMinutes} minutes</p>
            <a href="${meal.sourceUrl}" class="btn btn-primary">View Recipe</a>
          </div>
        </div>
      `
      )
      .join("");

    const nutrients = mealPlan.nutrients;
    const nutrientsHTML = `
      <div class="card" style="width: 18rem;">
        <div class="card-header">Nutrients</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Calories: ${Math.floor(
            nutrients.calories
          )}</li>
          <li class="list-group-item">Protein: ${Math.floor(
            nutrients.protein
          )}</li>
          <li class="list-group-item">Carbs: ${Math.floor(
            nutrients.carbohydrates
          )}</li>
          <li class="list-group-item">Fat: ${Math.floor(nutrients.fat)}</li>
        </ul>
      </div>
    `;

    container.innerHTML = mealsHTML + nutrientsHTML;
    return;
  }

  if (mealPlan.week) {
    container.innerHTML = `<p>You have a weekly plan generated. Go to <a href="mealPlanner.html">Meal Planner</a> to view it in detail.</p>`;
    return;
  }
}
