import { db, auth } from "./firebaseAPI_BBY10.js";

let ImageString = "";
let ImageFile = null;

// Handle image base64 conversion
function listenFileSelect() {
  document.getElementById("mealImage").addEventListener("change", function (e) {
    ImageFile = e.target.files[0];
    if (ImageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        ImageString = e.target.result.split(",")[1];
        const imgElement = document.getElementById("imgPlacholder");
        if (imgElement) {
          imgElement.src = "data:image/png;base64," + ImageString;
        }
      };
      reader.readAsDataURL(ImageFile);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  listenFileSelect();

  const mealForm = document.getElementById("mealForm");

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    mealForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const mealName = document.getElementById("mealName").value;
      const description = document.getElementById("mealDescription").value;

      if (!mealName || !description || !ImageFile) {
        alert("Please fill out all fields.");
        return;
      }

      const postData = {
        name: mealName,
        description: description,
        imageUrl: ImageString,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      try {
        // ✅ 1. Add post to global "posts" collection
        const postRef = await db.collection("posts").add(postData);

        // ✅ 2. Add post ID to user's "myposts" array
        await db
          .collection("users")
          .doc(user.uid)
          .set(
            {
              myposts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
            },
            { merge: true }
          );

        console.log("Meal posted successfully!");
        alert("Post submitted!");

        // Optional: reset form
        mealForm.reset();
        document.getElementById("imgPlacholder").src = "";
        ImageFile = null;
        ImageString = "";
      } catch (err) {
        console.error("Error posting meal:", err);
        alert("Something went wrong.");
      }
    });
  });
});
