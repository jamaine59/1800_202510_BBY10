import { db, auth } from "./firebaseAPI_BBY10.js";

// Handle form submission
const registerForm = document.getElementById("signUpForm");
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("signUpName").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;

  // Register user with Firebase Auth
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      console.log("User registered:", user);

      // Create a user document in Firestore with name and email
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
      });
    })
    .then(function () {
      alert("Registration successful!");
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error code:", errorCode, "Error message:", errorMessage);
      alert("Error: " + errorMessage);
    });
});
