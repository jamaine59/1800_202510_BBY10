import { db, auth } from "./firebaseAPI_BBY10.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.uid).get();
    const mealPlan = doc.exists ? doc.data().mealPlan?.data : null;
    const savedPosts = doc.exists ? doc.data().myposts : null;

    const postDataArray = [];

    for (const postId of savedPosts) {
      const postDoc = await db.collection("posts").doc(postId).get();
      if (postDoc.exists) {
        postDataArray.push({ id: postDoc.id, ...postDoc.data() });
      }
    }

    document.getElementById("userGreeting").innerHTML = `Hello, ${
      doc.data().name
    }!`;
    renderSavedMealPlan(mealPlan);
    renderSavedPosts(postDataArray);
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
        <div class="card home-meal-card" style="width: 12rem; height: 23rem; display: flex; flex-direction: column; justify-content: space-between;">
          <img src="https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg" class="card-img-top meal-img" alt="${meal.title} "style="height: 150px; object-fit: cover; width: 100%;">

          <div class="card-body" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h5 class="card-title">${meal.title}</h5>
              <p class="card-text">
                <strong>Ready in:</strong> ${meal.readyInMinutes} minutes
              </p>
            </div>
            <a href="${meal.sourceUrl}" class="btn btn-primary mt-2">View Recipe</a>
          </div>
        </div>`
      )
      .join("");

    const nutrients = mealPlan.nutrients;
    const nutrientsHTML = `
      <div class="card" style="width: 12rem;">
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

function renderSavedPosts(postDataArray) {
  const container = document.getElementById("savedPosts");
  container.innerHTML = "";

  if (!postDataArray) {
    container.innerHTML = "<p style='color: white;'>No saved posts found.</p>";
    return;
  }

  if (postDataArray) {
    container.innerHTML = postDataArray
      .map(
        (post) => `
      <div class="card card-social-feed" style="width: 15rem;" data-post-id="${post.id}">
        <img src="data:image/png;base64,${post.imageUrl}" class="card-img-top feed-img" alt=${post.name}>
        <div class="card-body">
          <h5 class="card-title">${post.name}</h5>
          <p class="card-text">${post.description}</p>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger mt-2 mb-4 w-50 align-self-center removePostBtn"
          data-id="${post.id}">
          Remove Post
        </button>
      </div>`
      )
      .join("");

    //removing post
    const removeBtns = container.querySelectorAll(".removePostBtn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this post?"
        );
        if (!confirmDelete) return;

        const postId = btn.getAttribute("data-id");
        const user = auth.currentUser;

        try {
          await db.collection("posts").doc(postId).delete();

          await db
            .collection("users")
            .doc(user.uid)
            .update({
              myposts: firebase.firestore.FieldValue.arrayRemove(postId),
            });

          //removing the card  element
          btn.closest(".card").remove();
        } catch (err) {
          console.error("Error deleting post:", err);
          alert("Something went wrong deleting the post.");
        }
      });
    });
  }
}
