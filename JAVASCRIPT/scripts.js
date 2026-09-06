// LearnHub - JavaScript

// Login Form
const loginForm = document.querySelector(".login_container form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        alert("Login successful!");

        loginForm.reset();
    });
}


// Register Form
const registerForm = document.querySelector(".register_container form");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirm_password").value;

        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Registration successful!");

        registerForm.reset();
    });
}