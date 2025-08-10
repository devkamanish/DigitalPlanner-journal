document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-text");
  const taskCategory = document.getElementById("task-category");
  const addTaskBtn = document.getElementById("add-task-btn");

  const categoryLists = {
    work: document.getElementById("work-list"),
    personal: document.getElementById("personal-list"),
    hobbies: document.getElementById("hobbies-list")
  };

  // Fetch existing tasks from Firebase
  fetch(`${firebaseUrl}/todos.json`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        Object.entries(data).forEach(([id, task]) => {
          appendTaskItem(task.text, task.category, id);
        });
      }
    });

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const category = taskCategory.value;

    if (text === "") return;

    const task = { text, category };

    // Save to Firebase
    fetch(`${firebaseUrl}/todos.json`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        appendTaskItem(text, category, data.name);
        taskInput.value = "";
      });
  });

  function appendTaskItem(text, category, id) {
    const li = document.createElement("li");
    li.setAttribute("data-id", id);

    const span = document.createElement("span");
    span.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.float = "right";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.border = "none";
    deleteBtn.style.color = "red";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.title = "Delete Task";

    deleteBtn.onclick = () => deleteTask(id, li);

    li.appendChild(span);
    li.appendChild(deleteBtn);

    categoryLists[category].appendChild(li);
  }

  function deleteTask(id, element) {
    fetch(`${firebaseUrl}/todos/${id}.json`, {
      method: "DELETE"
    }).then(res => {
      if (res.ok) {
        element.remove();
      } else {
        alert("Failed to delete task.");
      }
    });
  }

  // Enable drag-and-drop for all columns
  Object.keys(categoryLists).forEach(category => {
    new Sortable(categoryLists[category], {
      group: "tasks",
      animation: 150,
      onEnd: () => {
        // Optionally update order or category in Firebase here
      }
    });
  });
});



