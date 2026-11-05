// Get stored data
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getBlogs() {
    return JSON.parse(localStorage.getItem("blogs")) || [];
}

// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let name = document.getElementById("regName").value;
        let email = document.getElementById("regEmail").value;
        let password = document.getElementById("regPassword").value;
        let confirm = document.getElementById("regConfirm").value;

        let users = getUsers();

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        if (users.some(user => user.email === email)) {
            alert("Email already registered!");
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful!");

        window.location.href = "login.html";
    });
}

// LOGIN FUNCTION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        let users = getUsers();

        let user = users.find(u =>
            u.email === email && u.password === password
        );

        if (user) {
            localStorage.setItem("currentUser", email);

            alert("Login successful!");

            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password!");
        }
    });
}

// CREATE BLOG FUNCTION
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        let users = getUsers();
        let user = users.find(u => u.email === currentUser);

        let title = document.getElementById("blogTitle").value;
        let category = document.getElementById("blogCategory").value;
        let excerpt = document.getElementById("blogExcerpt").value;
        let content = document.getElementById("blogContent").value;

        let blogs = getBlogs();

        blogs.push({
            id: Date.now(),
            title: title,
            category: category,
            excerpt: excerpt,
            content: content,
            author: user.name,
            email: currentUser,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("blogs", JSON.stringify(blogs));

        alert("Blog published successfully!");

        window.location.href = "dashboard.html";
    });
}

// DISPLAY BLOGS ON HOME PAGE
function displayBlogs() {
    let blogList = document.getElementById("blogList");

    if (!blogList) return;

    let blogs = getBlogs();

    if (blogs.length === 0) {
        blogList.innerHTML = "<p>No blogs published yet.</p>";
        return;
    }

    blogList.innerHTML = "";

    blogs.forEach(blog => {
        blogList.innerHTML += `
            <div class="blog-card">
                <span class="category">${blog.category}</span>
                <h3>${blog.title}</h3>
                <p>${blog.excerpt || blog.content.substring(0, 120)}</p>
                <small>By ${blog.author} | ${blog.date}</small>
            </div>
        `;
    });
}

// DASHBOARD FUNCTION
function displayDashboard() {
    let dashboard = document.getElementById("dashboardBlogs");

    if (!dashboard) return;

    let email = localStorage.getItem("currentUser");

    if (!email) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    let users = getUsers();
    let user = users.find(u => u.email === email);

    document.getElementById("welcomeTitle").innerText =
        "Welcome, " + user.name;

    let blogs = getBlogs().filter(b => b.email === email);

    if (blogs.length === 0) {
        dashboard.innerHTML = "<p>No blogs created yet.</p>";
        return;
    }

    dashboard.innerHTML = "";

    blogs.forEach(blog => {
        dashboard.innerHTML += `
            <div class="blog-card">
                <span class="category">${blog.category}</span>
                <h3>${blog.title}</h3>
                <p>${blog.excerpt || blog.content.substring(0, 120)}</p>
                <small>${blog.date}</small>
                <br><br>
                <button class="btn"
                    onclick="deleteBlog(${blog.id})">
                    Delete
                </button>
            </div>
        `;
    });
}

// DELETE BLOG
function deleteBlog(id) {
    let blogs = getBlogs();

    blogs = blogs.filter(blog => blog.id !== id);

    localStorage.setItem("blogs", JSON.stringify(blogs));

    displayDashboard();
}

// LOGOUT FUNCTION
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("currentUser");

        alert("Logged out successfully!");

        window.location.href = "index.html";
    });
}

// RUN FUNCTIONS
document.addEventListener("DOMContentLoaded", function() {
    displayBlogs();
    displayDashboard();
});