import { db, auth } from "./firebaseAPI_BBY10.js";

async function getPosts() {
    const postsContainer = document.getElementById("containerPosts"); 
    
    // Clears previous posts -  
    // postsContainer.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "post"));
        querySnapshot.forEach((doc) => {
            const postData = doc.data();

            // Create post elements
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");

            const mealName = document.createElement("h2");
            mealName.textContent = postData.name;

            const mealDescription = document.createElement("p");
            mealDescription.textContent = postData.description;


            // Change this depending on how we store images in firestore
            const mealImage = document.createElement("img");
            mealImage.src = postData.imageUrl; 
            mealImage.alt = "Meal Image";
            mealImage.style.maxWidth = "100%"; 

            // Append elements to post div
            postDiv.appendChild(mealName);
            postDiv.appendChild(mealDescription);
            postDiv.appendChild(mealImage);

            // Append post div to the container
            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }
}
getPosts()