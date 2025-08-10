const firebaseUrl = "https://digital-plannerdb-default-rtdb.asia-southeast1.firebasedatabase.app";
const userId = localStorage.getItem("userId");

function addGoal() {
  const title = document.getElementById("goal-title").value.trim();
  const desc = document.getElementById("goal-desc").value.trim();
  const progress = parseInt(document.getElementById("goal-progress").value);

  if (!title || isNaN(progress)) {
    return alert("Please enter all fields correctly.");
  }

  const goal = { title, desc, progress, createdAt: new Date().toISOString() };

  fetch(`${firebaseUrl}/goals/${userId}.json`, {
    method: "POST",
    body: JSON.stringify(goal)
  })
  .then(() => {
    document.getElementById("goal-title").value = "";
    document.getElementById("goal-desc").value = "";
    document.getElementById("goal-progress").value = "";
    loadGoals();
  });
}


function loadGoals() {
  fetch(`${firebaseUrl}/goals/${userId}.json`)
    .then(res => res.json())
    .then(goals => {
      const goalList = document.getElementById("goal-list");
      goalList.innerHTML = "";

      if (goals) {
        Object.entries(goals).forEach(([id, goal]) => {
          const div = document.createElement("div");
          div.className = "goal-item";
          div.innerHTML = `
            <h3>${goal.title}</h3>
            <p>${goal.desc}</p>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: ${goal.progress}%">${goal.progress}%</div>
            </div>
          `;
          goalList.appendChild(div);
        });
      }
    });
}

// Load on page load
document.addEventListener("DOMContentLoaded", loadGoals);
