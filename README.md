
# DietBuddy

## Overview
DietBuddy is a fitness-focused web application designed to help users manage their diet by generating personalized meal plans based on their daily caloric needs. It addresses the common challenge of figuring out what to eat to stay on track with fitness goals by providing automated meal recommendations and nutrition tracking.

Key features include user authentication, calorie calculators based on user-provided data (age, weight, height, activity level), daily meal plan generation, and a social feature that allows users to share their favorite meals. The app is mobile-responsive and built with a user-centric approach to simplify healthy eating.

Developed as part of the COMP 1800 course at BCIT, this project applies agile development principles, UX/UI design strategies, and full-stack web development skills using modern technologies and third-party APIs.

---

## Features

- User sign-up and login system with authentication.
- Responsive design for desktop and mobile.
- Personalized daily calorie calculator based on user input.
- Automatic meal plan generation aligned with user's caloric and dietary needs.
- Users can share meals with others and explore meals shared by the community.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Authentication & Hosting
- **Database**: Firestore
- **API**: Spoonacular API

---

## Usage

1. Open your browser and visit `http://localhost:3000`.
2. Create an account or log in with existing credentials.
3. Open the calculator page and enter your personal stats to calculate your recommended daily calorie intake.
4. Open the meal planner page and enter your preferred diet, daily caloric intake, and plan type to view your personalized meal plan.
5. Share meals with others or browse meals shared by the community on the social page.

---

## Project Structure

```
1800_202510_BBY10/
├── images/
├── scripts/
│   ├── calculator.js
│   ├── home.js
│   ├── login.js
│   ├── logout.js
│   ├── mealPlanner.js
│   ├── postMeal.js
│   ├── register.js
│   └── social.js
├── styles/
├── .gitignore
├── calculator.html
├── home.html
├── index.html
├── mealPlanner.html
├── README.md
└── social.html
```

---

## Contributors
- **Ibrahim Abudalah** - CST student with a passion for coding.
- **Brad Muirhead** - Fresh to coding and looking to learn the ropes.
- **Jamaine** - reading fantasy books.


---

## Acknowledgments

Example:
- Nutrition and meal data sourced from [Spoonacular](https://spoonacular.com/food-api).
- Code snippets for ___ algoirthm were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).

---

## Limitations and Future Work
### Limitations

Example:
- Currently only generates meal plans based on daily calories—not specific macronutrient goals.
- No filtering system implemented.
- The user interface can be further enhanced for accessibility.

### Future Work

Example: 
- Add macronutrient breakdown in meal plans.
- Add dark mode and accessibility enhancements.
- Create a dark mode for better usability in low-light conditions.
- Integrate customizable user profile.

---

