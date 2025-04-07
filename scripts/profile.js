import { auth, db } from "./firebaseAPI_BBY10.js";

const modal = new bootstrap.Modal(document.getElementById("profileModal"));
const modalAvatar = document.getElementById("modalAvatar");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileImage = document.getElementById("profileImage");
const calorieDisplay = document.getElementById("calorieDisplay");
const removePhotoBtn = document.getElementById("removePhotoBtn");

const avatarMobile = document.getElementById("profileAvatarMobile");
const avatarDesktop = document.getElementById("profileAvatarDesktop");
const profileBtnMobile = document.getElementById("profileBtnMobile");
const profileBtnDesktop = document.getElementById("profileBtnDesktop");

let currentUser = null;
let avatarBase64 = "";
let avatarMarkedForRemoval = false;
const defaultAvatar = "./images/default-avatar.avif";

[profileBtnMobile, profileBtnDesktop].forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      modal.show();
    });
  }
});

auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  currentUser = user;

  try {
    const doc = await db.collection("users").doc(user.uid).get();
    const data = doc.data();

    if (data?.name && profileName) {
      profileName.value = data.name;
    }

    if (calorieDisplay) {
      calorieDisplay.textContent = data?.calories
        ? `${data.calories} kcal/day`
        : "Not calculated yet";
    }

    if (data?.avatar) {
      const avatarUrl = `data:image/png;base64,${data.avatar}`;
      modalAvatar.src = avatarUrl;
      if (avatarMobile) avatarMobile.src = avatarUrl;
      if (avatarDesktop) avatarDesktop.src = avatarUrl;
      if (removePhotoBtn) removePhotoBtn.classList.remove("d-none");
    } else {
      modalAvatar.src = defaultAvatar;
      if (avatarMobile) avatarMobile.src = defaultAvatar;
      if (avatarDesktop) avatarDesktop.src = defaultAvatar;
      if (removePhotoBtn) removePhotoBtn.classList.add("d-none");
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
});

// this is to show selected image
profileImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    avatarBase64 = reader.result.split(",")[1];
    avatarMarkedForRemoval = false;
    if (modalAvatar) {
      modalAvatar.src = `data:image/png;base64,${avatarBase64}`;
    }
    if (removePhotoBtn) removePhotoBtn.classList.remove("d-none");
  };
  reader.readAsDataURL(file);
});

// this is to show after image is removed
removePhotoBtn?.addEventListener("click", () => {
  avatarMarkedForRemoval = true;
  avatarBase64 = "";

  modalAvatar.src = defaultAvatar;
  if (avatarMobile) avatarMobile.src = defaultAvatar;
  if (avatarDesktop) avatarDesktop.src = defaultAvatar;
});

// saving
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const updates = {
    name: profileName.value.trim(),
  };

  if (avatarBase64) {
    updates.avatar = avatarBase64;
  }

  if (avatarMarkedForRemoval && !avatarBase64) {
    updates.avatar = firebase.firestore.FieldValue.delete();
  }

  try {
    await db
      .collection("users")
      .doc(currentUser.uid)
      .set(updates, { merge: true });

    // this is to refetch and check if no avatar found use default avatar
    const updatedDoc = await db.collection("users").doc(currentUser.uid).get();
    const updatedData = updatedDoc.data();

    if (updatedData?.avatar) {
      const avatarUrl = `data:image/png;base64,${updatedData.avatar}`;
      if (avatarMobile) avatarMobile.src = avatarUrl;
      if (avatarDesktop) avatarDesktop.src = avatarUrl;
    } else {
      if (avatarMobile) avatarMobile.src = defaultAvatar;
      if (avatarDesktop) avatarDesktop.src = defaultAvatar;
    }

    modal.hide();
    avatarMarkedForRemoval = false;
    avatarBase64 = "";
  } catch (err) {
    console.error("Error updating profile:", err);
  }
});

// this is to reset modal if no saved changes made
document
  .getElementById("profileModal")
  .addEventListener("hidden.bs.modal", () => {
    avatarBase64 = "";
    avatarMarkedForRemoval = false;
  });
