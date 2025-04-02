import { db } from "./firebaseAPI_BBY10.js";

document.addEventListener("DOMContentLoaded", async () => {
  const postsContainer = document.getElementById("postsContainer");

  try {
    const displaypost = await db.collection("posts").orderBy("createdAt", "desc").get();
    postsContainer.innerHTML = ""; // Clear previous content

    displaypost.forEach(async (doc) => {
      const post = doc.data();
      const userDoc = await db.collection("users").doc(post.authorId).get();
      const userName = userDoc.exists ? userDoc.data().name : "Unknown User";

      const postElement = document.createElement("div");
      postElement.classList.add("post-card");
      postElement.innerHTML = `
        <div class="post-content">
        <div class="post-header">
            <span class="post-user">${userName}</span>
          </div>
          <h3>${post.name}</h3>
          <img src="data:image/png;base64,${post.imageUrl}" alt="Meal Image" class="post-image" />
          <p>${post.description}</p>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
});
