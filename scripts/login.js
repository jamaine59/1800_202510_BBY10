import { auth } from "./firebaseAPI_BBY10.js"; // Import the Firebase auth instance

// Handle form submission
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Login with Firebase Auth
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      loginForm.reset();
      window.location.href = "home.html";
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
});
