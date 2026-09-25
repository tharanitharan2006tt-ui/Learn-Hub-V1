// LearnHub demo interactions. Data is stored in this browser only.
const courses = [
  { id: "python", title: "Python Programming", description: "Learn Python from fundamentals to practical projects.", price: 499, rating: "4.8", lessons: 25, hours: 18 },
  { id: "web", title: "Web Development", description: "Create responsive websites with HTML, CSS and JavaScript.", price: 599, rating: "4.9", lessons: 30, hours: 22 },
  { id: "react", title: "React Development", description: "Build modern interfaces with reusable React components.", price: 699, rating: "4.9", lessons: 32, hours: 24 },
  { id: "java", title: "Java Programming", description: "Master Java and object-oriented programming.", price: 599, rating: "4.8", lessons: 29, hours: 20 },
  { id: "sql", title: "SQL Essentials", description: "Query, organize and manage relational databases.", price: 399, rating: "4.7", lessons: 22, hours: 15 },
  { id: "javascript", title: "JavaScript Fundamentals", description: "Add interactivity and build useful browser applications.", price: 549, rating: "4.8", lessons: 28, hours: 20 }
];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const root = document.body.dataset.root || "";

// Keep navigation correct whether a page is opened from the root or HTML folder.
document.querySelectorAll("[data-nav]").forEach((link) => {
  const destination = link.dataset.nav;
  link.href = root + (destination === "home" ? "index.html" : `HTML/${destination}.html`);
});

const courseGrid = document.querySelector("[data-course-grid]");
if (courseGrid) {
  const featured = courseGrid.dataset.featured === "true";
  const visible = featured ? courses.slice(0, 3) : courses;
  const enrolled = read("learnhub-enrollments", []);
  courseGrid.innerHTML = visible.map((course) => `<article class="course_card" id="${course.id}"><span class="course_icon" aria-hidden="true">${course.id === "web" ? "🌐" : course.id === "react" ? "⚛️" : course.id === "sql" ? "🗄️" : "⌘"}</span><h3>${course.title}</h3><p>${course.description}</p><p class="course_meta">⭐ ${course.rating} <span>·</span> ${course.lessons} lessons <span>·</span> ${course.hours} hours</p><strong class="course_price">₹${course.price}</strong><button class="button_link enroll_button" type="button" data-enroll="${course.id}" ${enrolled.includes(course.id) ? "disabled" : ""}>${enrolled.includes(course.id) ? "Added to My Learning" : "Enroll now"}</button></article>`).join("");
}

const learningGrid = document.querySelector("[data-learning-grid]");
if (learningGrid) {
  const enrolled = read("learnhub-enrollments", []);
  if (!enrolled.length) {
    learningGrid.innerHTML = `<div class="empty_state"><h3>Your learning journey starts here</h3><p>Enroll in a course to see it in your learning space.</p><a class="button_link" href="${root}HTML/courses.html">Browse courses</a></div>`;
  } else {
    learningGrid.innerHTML = enrolled.map((id) => courses.find((course) => course.id === id)).filter(Boolean).map((course) => `<article class="learning_card"><span class="course_icon" aria-hidden="true">📘</span><h3>${course.title}</h3><p>${course.description}</p><div class="progress_info"><span>Ready to begin</span><span>0%</span></div><div class="progress_bar"><div class="progress" style="width:0%"></div></div><a class="button_link" href="${root}HTML/course_details.html#${course.id}">Continue learning</a></article>`).join("");
  }
}

document.querySelectorAll("[data-enroll]").forEach((button) => button.addEventListener("click", () => {
  const user = read("learnhub-user", null);
  if (!user) { location.href = `${root}HTML/register.html?course=${encodeURIComponent(button.dataset.enroll)}`; return; }
  const id = button.dataset.enroll;
  const enrolled = read("learnhub-enrollments", []);
  if (!enrolled.includes(id)) { enrolled.push(id); save("learnhub-enrollments", enrolled); }
  button.textContent = "Added to My Learning";
  button.disabled = true;
}));

const registerForm = document.querySelector("#register-form");
if (registerForm) registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = registerForm.elements.name.value.trim();
  const email = registerForm.elements.email.value.trim().toLowerCase();
  const password = registerForm.elements.password.value;
  if (password !== registerForm.elements.confirm_password.value) { registerForm.elements.confirm_password.setCustomValidity("Passwords do not match."); registerForm.reportValidity(); return; }
  registerForm.elements.confirm_password.setCustomValidity("");
  const users = read("learnhub-users", []);
  if (users.some((user) => user.email === email)) { alert("An account with this email already exists. Please log in."); return; }
  users.push({ name, email, password }); save("learnhub-users", users); save("learnhub-user", { name, email });
  const requestedCourse = new URLSearchParams(location.search).get("course");
  if (courses.some((course) => course.id === requestedCourse)) save("learnhub-enrollments", [...new Set([...read("learnhub-enrollments", []), requestedCourse])]);
  location.href = "my_learning.html";
});

const loginForm = document.querySelector("#login-form");
if (loginForm) loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  const user = read("learnhub-users", []).find((entry) => entry.email === email && entry.password === password);
  if (!user) { alert("Email or password is incorrect. Register if you are new to LearnHub."); return; }
  save("learnhub-user", { name: user.name, email: user.email });
  const requestedCourse = new URLSearchParams(location.search).get("course");
  if (courses.some((course) => course.id === requestedCourse)) save("learnhub-enrollments", [...new Set([...read("learnhub-enrollments", []), requestedCourse])]);
  location.href = "my_learning.html";
});

const accountLabel = document.querySelector("[data-account-label]");
const currentUser = read("learnhub-user", null);
if (accountLabel && currentUser) { accountLabel.textContent = `Hi, ${currentUser.name.split(" ")[0]}`; accountLabel.href = `${root}HTML/my_learning.html`; accountLabel.hidden = false; }
