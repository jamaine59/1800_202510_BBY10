import { auth } from "./firebaseAPI_BBY10.js";

document.addEventListener("DOMContentLoaded", () => {
  const protectedPages = [
    "home.html",
    "mealPlanner.html",
    "social.html",
    "calculator.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();

  auth.onAuthStateChanged((user) => {
    if (!user && protectedPages.includes(currentPage)) {
      console.warn("Not logged in — redirecting");
      window.location.href = "index.html";
    } else {
      document.body.classList.remove("auth-checking");
    }
  });
});
