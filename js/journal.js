document.addEventListener("DOMContentLoaded", () => {
  const quill = new Quill("#editor-container", {
    theme: "snow",
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['image', 'video'], // 👈 add image and video support
      ['clean']
    ]
  }
  });

  const saveBtn = document.getElementById("save-btn");
  const entryDate = document.getElementById("entry-date");
  const searchDate = document.getElementById("search-date");
  const searchBtn = document.getElementById("search-btn");
  const entriesContainer = document.getElementById("entries-container");

  saveBtn.addEventListener("click", () => {
    const date = entryDate.value;
    if (!date) return alert("Please select a date.");

    const content = quill.root.innerHTML;

    const entry = {
      content,
      timestamp: new Date().toISOString()
    };

    fetch(`${firebaseUrl}/journal/${date}.json`, {
      method: "PUT",
      body: JSON.stringify(entry),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(() => {
        alert("Journal entry saved!");
        quill.setContents([]);
      });
  });

  searchBtn.addEventListener("click", () => {
    const date = searchDate.value;
    if (!date) return alert("Please choose a date.");

    fetch(`${firebaseUrl}/journal/${date}.json`)
      .then(res => res.json())
      .then(entry => {
        entriesContainer.innerHTML = "";

        if (!entry) {
          entriesContainer.innerHTML = `<p class="no-entry">No entry found for ${date}</p>`;
        } else {
          const div = document.createElement("div");
          div.className = "entry";
          div.innerHTML = `<div class="entry-date">${date}</div><div class="entry-content">${entry.content}</div>`;
          entriesContainer.appendChild(div);
        }
      });
  });
});
