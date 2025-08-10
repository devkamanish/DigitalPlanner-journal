document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const datetimeInput = document.getElementById("datetime");
  const setReminderBtn = document.getElementById("set-reminder");
  const reminderList = document.getElementById("reminder-list");

  // Ask for notification permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Load existing reminders
  fetch(`${firebaseUrl}/reminders.json`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        Object.entries(data).forEach(([id, reminder]) => {
          showReminder(reminder, id);
          scheduleNotification(reminder);
        });
      }
    });

  setReminderBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const datetime = datetimeInput.value;

    if (!title || !datetime) {
      alert("Please enter both title and date/time.");
      return;
    }

    const reminder = { title, description, datetime };

    fetch(`${firebaseUrl}/reminders.json`, {
      method: "POST",
      body: JSON.stringify(reminder),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        showReminder(reminder, data.name);
        scheduleNotification(reminder);
        titleInput.value = "";
        descInput.value = "";
        datetimeInput.value = "";
      });
  });

  function showReminder(reminder, id) {
    const div = document.createElement("div");
    div.className = "reminder-item";
    div.innerHTML = `
      <div class="reminder-time">${new Date(reminder.datetime).toLocaleString()}</div>
      <div class="reminder-title">${reminder.title}</div>
      <div class="reminder-desc">${reminder.description}</div>
    `;
    reminderList.appendChild(div);
  }

  function scheduleNotification(reminder) {
    const timeUntilNotification = new Date(reminder.datetime).getTime() - Date.now();

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(reminder.title, {
            body: reminder.description,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
          });
        }
      }, timeUntilNotification);
    }
  }
});




