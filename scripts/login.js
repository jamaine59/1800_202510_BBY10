import { auth } from "./firebaseAPI_BBY10.js";

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

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
      Swal.fire("Error: " + errorMessage);
    });
});
