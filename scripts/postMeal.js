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
listenFileSelect();

const mealForm = document.getElementById("mealForm");

mealForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const mealName = document.getElementById("mealName").value;
  const description = document.getElementById("mealDescription").value;

  if (!mealName || !description || !ImageFile) {
    alert("Please fill out all fields.");
    return;
  }

  const user = auth.currentUser;

  // Create the post object
  const postData = {
    name: mealName,
    description: description,
    imageUrl: ImageString,
  };

  try {
    if (user) {
      await db
        .collection("users")
        .doc(user.uid)
        .set(
          {
            posts: firebase.firestore.FieldValue.arrayUnion(postData),
          },
          { merge: true }
        );
      console.log("Meal posted successfully!");
    }
  } catch (err) {
    console.error("Error posting meal:", err);
    alert("Something went wrong.");
  }
});
