const firebaseUrl = "https://digital-plannerdb-default-rtdb.asia-southeast1.firebasedatabase.app";

// Signup
function signup() {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  fetch(`${firebaseUrl}/users.json`)
    .then(res => res.json())
    .then(users => {
      const userExists = users && Object.values(users).some(user => user.email === email);
      
      if (userExists) {
        alert("Email already registered!");
      } else {
        const newUser = {
          email,
          password,
          createdAt: new Date().toISOString()
        };

        fetch(`${firebaseUrl}/users.json`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        })
        .then(() => {
          alert("Signup successful!");
          window.location.replace("login.html");
        });
      }
    });
}

// Login
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  fetch(`${firebaseUrl}/users.json`)
    .then(res => res.json())
    .then(users => {
      const userEntry = users && Object.entries(users).find(([id, user]) => 
        user.email === email && user.password === password
      );

      if (userEntry) {
        const [userId, userData] = userEntry;

        // Store session info in localStorage
        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", userData.email);

        alert("Login successful!");
        // Redirect to app home, accounting for relative paths
        const path = window.location.pathname.replace(/\\/g, '/');
        const destination = path.includes('/auth/') ? "../index.html" : "index.html";
        window.location.replace(destination);
      } else {
        alert("Invalid credentials!");
      }
    });

}




