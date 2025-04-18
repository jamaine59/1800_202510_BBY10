import { db, auth } from "./firebaseAPI_BBY10.js";

const registerForm = document.getElementById("signUpForm");
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("signUpName").value;
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const defaultAvatar = "./images/default-avatar.avif";

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      const user = userCredential.user;
      // Create a user document in Firestore with name and email
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        defaultAvatar: defaultAvatar,
      });
    })
    .then(function () {
      window.location.href = "home.html";
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire("Error: " + errorMessage);
    });
});
