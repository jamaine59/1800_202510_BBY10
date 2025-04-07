import { db } from "./firebaseAPI_BBY10.js";

document.addEventListener("DOMContentLoaded", async () => {
  const postsContainer = document.getElementById("postsContainer");

  try {
    const displaypost = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();
    postsContainer.innerHTML = "";

    displaypost.forEach(async (doc) => {
      const post = doc.data();
      const userDoc = await db.collection("users").doc(post.authorId).get();
      const userName = userDoc.exists ? userDoc.data().name : "Unknown User";

      const postElement = document.createElement("div");
      postElement.classList.add("post-card");
      postElement.innerHTML = `<div class="card card-social-feed" style="width: 18rem;">
      <h4 style="padding-left:1rem; padding-top: 1rem;">@${userName}</h4>
        <img src="data:image/png;base64,${post.imageUrl}" class="card-img-top feed-img" alt=${post.name}>
        <div class="card-body">
          <h5 class="card-title">${post.name}</h5>
          <p class="card-text">${post.description}</p>
        </div>
      </div>`;
      postsContainer.appendChild(postElement);
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
});
