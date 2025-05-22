// Global variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem('talentHubUsers')) || [];
let userSkills = [];
let editSkills = [];
let selectedUserId = null;
let allSkills = new Set();

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    generateSkillFilters();
});

// Authentication functions
function showLoginForm() {
    hideAllForms();
    document.getElementById('loginForm').style.display = 'block';
}

function showRegisterForm() {
    hideAllForms();
    document.getElementById('registerForm').style.display = 'block';
}

function hideAllForms() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        showDashboard();
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('fullName').value;
    const profession = document.getElementById('profession').value;
    const bio = document.getElementById('bio').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('An account with this email already exists.');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        email,
        password,
        fullName,
        profession,
        bio,
        hourlyRate: parseInt(hourlyRate),
        skills: [...userSkills],
        joinDate: new Date().toLocaleDateString(),
        avatar: fullName.charAt(0).toUpperCase()
    };

    users.push(newUser);
    localStorage.setItem('talentHubUsers', JSON.stringify(users));
    
    // Add skills to global skills set
    userSkills.forEach(skill => allSkills.add(skill));
    
    currentUser = newUser;
    userSkills = [];
    showDashboard();
}

function showDashboard() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
    document.getElementById('userNav').style.display = 'flex';
    document.getElementById('currentUserName').textContent = currentUser.fullName;
    
    // Hide auth buttons since user is now logged in
    hideAllForms();
    
    displayUserProfile();
    displayAllUsers();
    updateStats();
    generateSkillFilters();
}

function logout() {
    currentUser = null;
    userSkills = [];
    editSkills = [];
    
    // Show welcome screen and hide dashboard
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('userNav').style.display = 'none';
    
    // Show auth buttons again
    document.querySelector('.auth-buttons').style.display = 'flex';
    hideAllForms();
    
    // Reset forms
    document.querySelectorAll('form').forEach(form => form.reset());
    document.getElementById('skillsDisplay').innerHTML = '';
}

// Skills management
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    
    if (skill && !userSkills.includes(skill)) {
        userSkills.push(skill);
        updateSkillsDisplay();
        skillInput.value = '';
    }
}

function updateSkillsDisplay() {
    const display = document.getElementById('skillsDisplay');
    display.innerHTML = userSkills.map(skill => 
        `<div class="skill-tag">
            ${skill}
            <span class="remove" onclick="removeSkill('${skill}')">×</span>
        </div>`
    ).join('');
}

function removeSkill(skill) {
    userSkills = userSkills.filter(s => s !== skill);
    updateSkillsDisplay();
}

function addEditSkill() {
    const skillInput = document.getElementById('editSkillInput');
    const skill = skillInput.value.trim();
    
    if (skill && !editSkills.includes(skill)) {
        editSkills.push(skill);
        updateEditSkillsDisplay();
        skillInput.value = '';
    }
}

function updateEditSkillsDisplay() {
    const display = document.getElementById('editSkillsDisplay');
    display.innerHTML = editSkills.map(skill => 
        `<div class="skill-tag">
            ${skill}
            <span class="remove" onclick="removeEditSkill('${skill}')">×</span>
        </div>`
    ).join('');
}

function removeEditSkill(skill) {
    editSkills = editSkills.filter(s => s !== skill);
    updateEditSkillsDisplay();
}