import { auth, db } from "./firebaseAPI_BBY10.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(
    "#logoutButtonMobile, #logoutButtonDesktop"
  );

  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      auth
        .signOut()
        .then(() => {
          window.location.href = "./index.html";
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    });
  });
});

auth.onAuthStateChanged(async (user) => {
  const doc = await db.collection("users").doc(user.uid).get();
  document.getElementById("navGreeting").innerHTML = `Hello, ${
    doc.data().name
  }!`;
});
