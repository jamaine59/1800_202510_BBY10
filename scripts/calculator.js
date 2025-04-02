document.querySelectorAll(".tab-pane form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tabId = form.closest(".tab-pane").id;
    const genderInput = form.querySelector("input[name='gender']:checked");
    const inputs = form.querySelectorAll(".form-control");
    const selects = form.querySelectorAll("select.form-control");

    if (!genderInput) {
      alert("Please select your gender.");
      return;
    }
    const gender = genderInput.value;

    for (let input of inputs) {
      if (input.value.trim() === "") {
        alert("Please fill in all input fields.");
        return;
      }
    }

    for (let select of selects) {
      if (select.value.trim() === "") {
        alert("Please select all dropdown options.");
        return;
      }
    }

    let age,
      weightKg,
      heightCm,
      totalInches = 0;

    const activityText = selects[selects.length - 1].value;
    const activityMap = {
      "Sedentary (office job)": 1.2,
      "Light Exercise (1-2 days/week)": 1.375,
      "Moderate Exercise (3-5 days/week)": 1.55,
      "Heavy Exercise (6-7 days/week)": 1.725,
      "Athlete (2x per day)": 1.9,
    };
    const activityMultiplier = activityMap[activityText];

    if (tabId === "imperial") {
      age = parseInt(inputs[0].value);
      const weightLbs = parseFloat(inputs[1].value);
      const heightText = selects[0].value;

      const heightMatches = heightText.match(/\d+/g);

      if (!heightMatches || heightMatches.length < 2) {
        alert("Please select a valid height.");
        return;
      }

      const [ft, inch] = heightMatches.map(Number);
      totalInches = ft * 12 + inch;

      heightCm = totalInches * 2.54;
      weightKg = weightLbs * 0.453592;
    } else if (tabId === "metric") {
      age = parseInt(inputs[0].value);
      weightKg = parseFloat(inputs[1].value);
      heightCm = parseFloat(inputs[2].value);
      totalInches = heightCm / 2.54;
    }

    let bmr;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const maintenanceCalories = Math.round(bmr * activityMultiplier);

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let bmiClass = "Normal Weight";
    if (bmi < 18.5) bmiClass = "Underweight";
    else if (bmi >= 25 && bmi < 30) bmiClass = "Overweight";
    else if (bmi >= 30) bmiClass = "Obese";

    document.querySelector("#results").innerHTML = `
     <div class="card my-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Your Maintenance Calories</h2>
        <p class="card-text">
          <strong>${maintenanceCalories}</strong> calories per day
        </p>

        <h3 class="mt-4">Calories by Activity Level</h3>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Basal Metabolic Rate: ${Math.round(bmr)} cal/day
          </li>
          ${Object.entries(activityMap)
            .map(
              ([label, mult]) => `
                <li class="list-group-item">${label}: ${Math.round(
                bmr * mult
              )} cal/day</li>
              `
            )
            .join("")}
        </ul>

        <h3 class="mt-4">BMI Score: ${bmi.toFixed(1)}</h3>
        <p>You are classified as <strong>${bmiClass}</strong>.</p>
      </div>
    </div>`;
  });
});
