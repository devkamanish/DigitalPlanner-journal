// js/planner.js
document.addEventListener("DOMContentLoaded", () => {
    const planDate = document.getElementById("plan-date");
    const planText = document.getElementById("plan-text");
    const savePlanBtn = document.getElementById("save-plan-btn");
    const planList = document.getElementById("plans-list");

    // Fetch saved plans from Firebase
    fetch(`${firebaseUrl}/plans.json`)
        .then(res => res.json())
        .then(data => {
            if (data) {
                Object.entries(data).forEach(([id, plan]) => {
                    appendPlanItem(plan.date, plan.text, id);
                });
            }
        });

    savePlanBtn.addEventListener("click", () => {
        const date = planDate.value;
        const text = planText.value.trim();

        if (date === "" || text === "") return alert("Please enter both date and text");

        const plan = { date, text };

        // Save plan to Firebase
        fetch(`${firebaseUrl}/plans.json`, {
            method: "POST",
            body: JSON.stringify(plan),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            appendPlanItem(date, text, data.name); // Firebase returns unique ID
            planText.value = "";
            planDate.value = "";
        });
    });

    function appendPlanItem(date, text, id) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${date}:</strong> ${text}`;
        li.setAttribute("data-id", id);
        planList.appendChild(li);
    }
});
