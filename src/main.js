const studentNames = [
  "Abhay Kale", "Adinath Patil", "Ankit Bhalke", "Arman Patel", "Ashish Sonaniya",
  "Dayanand Jat", "Devansh Mittal", "Dhireena Banu", "Ganesh Choudhary", "Jay Mehta",
  "Kaif Khan", "Kaif Shaikh", "Khushi Agarwal", "Khushi Shah", "Mohhamed Rehan",
  "Moin Kadival", "Parthiv", "Piyush Chouhan", "Pranay Sonaniya",
  "Priya", "Priyanshu Tailor", "Radheshyam Bhati", "Roshan Bhendekar", "Rushikesh",
  "Shayaz", "Sripathi Lakshmi Narasimha Dhruv Teja ", "Sumit Tiwari", "Yashraj", "Zahid Shaikh",
  "GODBOLE VISHVAJEET SURYAKANT", "KUMKUM JANGIR", "ADITYA DOLHARE", "UTKARSH KUMAR", "ANOOP",
  "ABHISHEK YADAV", "SHIVAM KUMAR JHA", "RUSHIKESH SHINDE", "SATYAM SATYAM YADUVANSHI", "AVISHKAR RAVIKANT CHAVAN",
  "SHRADDHA NITIN LIMBEKAR", "BHARAT KUMAR", "RUGVED KADAM", "ABHINAV SINGH", "SOHAM SHINDE",
  "RUDRA ABHISHEK", "BAIBHAV KUMAR", "AKSHATA BIRADAR", "PULAK SAHA", "MILIND THAKARE",
  "SAI SHENDGE", "HARSHVARDHAN SINGH CHAUHAN", "ASHWINLAL", "ADITYA VAWHAL", "ABHILASH",
  "ASHISH SHARMA", "SURAJ MADHESHIYA", "SANKALP TIWARI", "AYUSH KARANJIYA", "DHRUVARAJ NIKAM",
  "KRISHNA GUPTA", "VIVEK INGLE", "VIVEK MISHRA", "GYANRANJAN KUMAR", "SAURYAMAN BISEN",
  "ADITHYA HK", "SHAIKH ARMAN", "ARINDAM SARKAR", "SHRESTHA ARYA", "AYESHA SHEIKH",
  "ABRAR SHEIKH", "KSHITIJ DAS", "VIVEK BHURBHURE", "SOHAM SAWANT", "Ashu Singh"
];

const cities = [
  'Pune', 'Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Kochi', 'Bhubaneswar', 'Guwahati',
  'Nagpur', 'Thiruvananthapuram', 'Dehradun', 'Shimla', 'Ranchi'
];

const states = [
  'Maharashtra', 'Karnataka', 'Delhi', 'Maharashtra', 'Telangana',
  'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh',
  'Punjab', 'Madhya Pradesh', 'Kerala', 'Odisha', 'Assam',
  'Maharashtra', 'Kerala', 'Uttarakhand', 'Himachal Pradesh', 'Jharkhand'
];

const femaleNames = [
  "Dhireena Banu", "Khushi Agarwal", "Khushi Shah", "Priya", "KUMKUM JANGIR",
  "SHRADDHA NITIN LIMBEKAR", "AKSHATA BIRADAR", "SHRESTHA ARYA", "AYESHA SHEIKH"
];

function generateFallbackStudents() {
  return studentNames.map((name, i) => {
    const isFemale = femaleNames.includes(name);
    const boyAvatars = [1, 2];
    const girlAvatars = [3, 4];
    const avatarId = isFemale
      ? girlAvatars[Math.floor(Math.random() * girlAvatars.length)]
      : boyAvatars[Math.floor(Math.random() * boyAvatars.length)];

    const cityIndex = (i * 7) % cities.length;

    // Check localStorage for any saved edits (for backward compatibility)
    const storedData = JSON.parse(localStorage.getItem(`student_${name}`)) || {};

    return {
      _id: `fallback_${i}`,
      name,
      location: storedData.location || `${cities[cityIndex]}, ${states[cityIndex]}`,
      avatar: storedData.avatar || `public/student_avatar_${avatarId}.png`,
      batch: 2023 + (i % 3),
      campus: ["Bengaluru", "Pune", "Hyderabad"][i % 3],
      about: storedData.about || `A passionate School of Technology student exploring the future of innovation.`,
      portfolio: storedData.portfolio || `https://github.com/`,
      achievements: storedData.achievements || ["Deans List", "Hackathon Finalist"]
    };
  });
}

// API Configuration
const API_BASE_URL = '/api';
let USE_BACKEND = true; // Will be set to false if backend is unavailable

// App State
let students = [];
let activeCampus = 'All';
let activeBatch = 'All';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// DOM Elements
const studentGrid = document.getElementById('student-grid');
const resultsText = document.getElementById('results-text');
const filtersContainer = document.getElementById('filters');
const paginationContainer = document.getElementById('pagination');
const themeToggle = document.getElementById('theme-toggle');
const loginTrigger = document.getElementById('login-trigger');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const userMenu = document.getElementById('user-menu');
const userInitials = document.getElementById('user-initials');
const logoutBtn = document.getElementById('logout-btn');
const editProfileTrigger = document.getElementById('edit-profile-trigger');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-profile-form');
const studentModal = document.getElementById('student-modal');
const modalBody = document.getElementById('modal-body');

// API Helper Functions
async function fetchStudents(campus = null, batch = null) {
  // Try to fetch from backend first
  if (USE_BACKEND) {
    try {
      const params = new URLSearchParams();
      if (campus && campus !== 'All') params.append('campus', campus);
      if (batch && batch !== 'All') params.append('batch', batch);

      const response = await fetch(`${API_BASE_URL}/students?${params}`);
      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      console.log('%c[API] Loaded students from backend', 'color: #10b981;');
      return data;
    } catch (error) {
      console.warn('Backend not available, using fallback data:', error);
      USE_BACKEND = false; // Disable backend for subsequent calls
    }
  }

  // Fallback to local data
  console.log('%c[FALLBACK] Using local student data', 'color: #f59e0b;');
  const fallbackStudents = generateFallbackStudents();

  // Apply filters locally
  let filtered = fallbackStudents;
  if (campus && campus !== 'All') {
    filtered = filtered.filter(s => s.campus === campus);
  }
  if (batch && batch !== 'All') {
    filtered = filtered.filter(s => s.batch.toString() === batch);
  }

  return filtered;
}

async function loginStudent(name) {
  // Try backend first
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend login failed, trying fallback:', error);
      USE_BACKEND = false;
    }
  }

  // Fallback: search in local students array
  const found = students.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (!found) {
    throw new Error('Student not found');
  }
  return found;
}

async function updateStudent(id, updates) {
  // Try backend first
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update student');

      return await response.json();
    } catch (error) {
      console.warn('Backend update failed, using localStorage:', error);
      USE_BACKEND = false;
    }
  }

  // Fallback: update in local array and save to localStorage
  const studentIndex = students.findIndex(s => s._id === id);
  if (studentIndex === -1) throw new Error('Student not found');

  const updatedStudent = { ...students[studentIndex], ...updates };
  students[studentIndex] = updatedStudent;

  // Save to localStorage for persistence
  localStorage.setItem(`student_${updatedStudent.name}`, JSON.stringify({
    avatar: updatedStudent.avatar,
    location: updatedStudent.location,
    about: updatedStudent.about,
    portfolio: updatedStudent.portfolio,
    achievements: updatedStudent.achievements
  }));

  return updatedStudent;
}

// Theme Logic
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
};

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
});

// Auth Logic
const updateAuthUI = () => {
  if (currentUser) {
    loginTrigger.classList.add('hidden');
    userMenu.classList.remove('hidden');
    if (currentUser.avatar) {
      userInitials.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      userInitials.innerText = initials;
    }
  } else {
    loginTrigger.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
};

loginTrigger.addEventListener('click', () => loginModal.classList.add('active'));
document.getElementById('login-close').addEventListener('click', () => loginModal.classList.remove('active'));

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('login-name').value;

  try {
    const student = await loginStudent(nameInput);
    currentUser = student;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    loginModal.classList.remove('active');
    loginForm.reset();
    renderStudents();
  } catch (error) {
    alert(error.message || "Student not found. Try 'Abhay Kale'.");
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  updateAuthUI();
  renderStudents(); // Refresh cards to remove edit badges
});

// Profile Editing
const photoPreview = document.getElementById('photo-preview');
const avatarInput = document.getElementById('edit-avatar');

// Handle file upload preview
avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      photoPreview.src = event.target.result;
      photoPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

editProfileTrigger.addEventListener('click', () => {
  // Pre-fill existing avatar if it exists
  if (currentUser.avatar) {
    photoPreview.src = currentUser.avatar;
    photoPreview.style.display = 'block';
  } else {
    photoPreview.style.display = 'none';
  }

  document.getElementById('edit-location').value = currentUser.location || '';
  document.getElementById('edit-about').value = currentUser.about || '';
  document.getElementById('edit-portfolio').value = currentUser.portfolio || '';
  document.getElementById('edit-achievements').value = (currentUser.achievements || []).join(', ');
  editModal.classList.add('active');
});

document.getElementById('edit-close').addEventListener('click', () => editModal.classList.remove('active'));
document.getElementById('edit-cancel').addEventListener('click', () => editModal.classList.remove('active'));

async function saveProfileChanges() {
  try {
    const updates = {
      location: document.getElementById('edit-location').value,
      about: document.getElementById('edit-about').value,
      portfolio: document.getElementById('edit-portfolio').value,
      achievements: document.getElementById('edit-achievements').value.split(',').map(s => s.trim()).filter(s => s)
    };

    if (currentUser.avatar) {
      updates.avatar = currentUser.avatar;
    }

    const updatedStudent = await updateStudent(currentUser._id, updates);

    // Update current user and session storage
    currentUser = updatedStudent;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update in local students array
    const idx = students.findIndex(s => s._id === currentUser._id);
    if (idx !== -1) students[idx] = updatedStudent;

    editModal.classList.remove('active');
    updateAuthUI();
    renderStudents();
  } catch (error) {
    alert('Failed to save profile changes. Please try again.');
    console.error('Save profile error:', error);
  }
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Handle avatar upload
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentUser.avatar = event.target.result; // base64 string
      saveProfileChanges();
    };
    reader.readAsDataURL(file);
  } else {
    // If no new file, keep existing avatar
    saveProfileChanges();
  }
});

// Profile Modal Logic
window.openProfile = (id) => {
  const student = students.find(s => s._id === id);
  if (!student) return;

  const isOwn = currentUser && currentUser._id === student._id;

  modalBody.innerHTML = `
    <div class="modal-header">
      <img src="${student.avatar}" alt="${student.name}" class="modal-avatar">
      <div class="modal-info">
        <h2>${student.name}</h2>
        <div class="modal-location-row">
          <p>📍 ${student.location}</p>
          ${isOwn ? `<button id="quick-edit-loc" class="quick-edit-btn" title="Edit Location">✏️</button>` : ''}
        </div>
        <div class="modal-tags">
          <span class="tag">School of Technology</span>
          <span class="tag blue">${student.batch} Batch</span>
        </div>
        <a href="${student.portfolio}" target="_blank" class="portfolio-link">🔗 View Portfolio</a>
      </div>
    </div>
    <div class="modal-details">
      <div class="detail-section">
        <h3>About</h3>
        <p>${student.about}</p>
      </div>
      <div class="detail-section">
        <h3>Key Achievements</h3>
        <div class="achievements-section">
          ${student.achievements.map(a => `<div class="achievement-badge">🏆 ${a}</div>`).join('')}
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-item"><span class="detail-label">Campus</span><span class="detail-value">${student.campus}</span></div>
        <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">Active</span></div>
      </div>
      ${isOwn ? `<button id="inline-edit-btn" class="btn-edit-profile">✏️ Edit My Profile</button>` : ''}
    </div>
  `;

  if (isOwn) {
    document.getElementById('quick-edit-loc').onclick = () => {
      studentModal.classList.remove('active');
      editProfileTrigger.click();
    };
    document.getElementById('inline-edit-btn').onclick = () => {
      studentModal.classList.remove('active');
      editProfileTrigger.click();
    };
  }

  studentModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

document.getElementById('modal-close').onclick = () => {
  studentModal.classList.remove('active');
  document.body.style.overflow = '';
};

// Intersection Observer
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Filtering & UI Updates
const campuses = ['Bengaluru', 'Pune', 'Hyderabad', 'All'];
const batches = ['2023', '2024', '2025', 'All'];

function renderFilters() {
  filtersContainer.innerHTML = `
    <div class="filter-group">
      <div class="filter-label">📍 Select Campus</div>
      <div class="pills-container">
        ${campuses.map(c => `<button class="pill ${activeCampus === c ? 'active' : ''}" onclick="setCampus('${c}')">${c}</button>`).join('')}
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-label">🎓 Select Batch</div>
      <div class="pills-container">
        ${batches.map(b => `<button class="pill blue ${activeBatch === b ? 'active' : ''}" onclick="setBatch('${b}')">${b}</button>`).join('')}
      </div>
    </div>
  `;
}

window.setCampus = async (c) => {
  activeCampus = c;
  currentPage = 1;
  await loadAndRenderStudents();
};

window.setBatch = async (b) => {
  activeBatch = b;
  currentPage = 1;
  await loadAndRenderStudents();
};

async function loadAndRenderStudents() {
  students = await fetchStudents(activeCampus, activeBatch);
  renderFilters();
  renderStudents();
}

function renderStudents() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = students.slice(start, start + ITEMS_PER_PAGE);

  if (paginated.length === 0) {
    studentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No students found matching these filters.</div>`;
    resultsText.innerText = `No students found`;
    paginationContainer.innerHTML = '';
    return;
  }

  studentGrid.innerHTML = paginated.map((student, index) => {
    const isOwn = currentUser && currentUser._id === student._id;
    return `
      <div class="student-card animate-on-scroll" style="transition-delay: ${(index % 12) * 50}ms" onclick="openProfile('${student._id}')">
        ${isOwn ? '<div class="card-edit-badge">✏️ YOUR PROFILE</div>' : ''}
        <img src="${student.avatar}" alt="${student.name}" class="student-avatar" loading="lazy">
        <h3 class="student-name">${student.name}</h3>
        <div class="student-location">📍 ${student.location}</div>
      </div>
    `;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(card => cardObserver.observe(card));
  }, 100);

  resultsText.innerText = `Showing all ${students.length} students from ${activeCampus} - ${activeBatch}`;
  renderPagination(students.length);
}

function renderPagination(total) {
  const pages = Math.ceil(total / ITEMS_PER_PAGE);
  if (pages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let html = `<button class="page-nav" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← Prev</button>`;

  // Show a limited number of pages if many
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  html += `<button class="page-nav" ${currentPage === pages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next →</button>`;
  paginationContainer.innerHTML = html;
}

window.changePage = (p) => {
  currentPage = p;
  renderStudents();
  window.scrollTo({ top: filtersContainer.offsetTop - 100, behavior: 'smooth' });
};

// Close modals when clicking outside
window.onclick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Init
console.log("%c[SYSTEM] INITIALIZING HACKER_PROTOCOL_VOX", "color: #10b981; font-weight: bold; font-size: 1.2rem;");
console.log("%c[STATUS] UPLINK_ESTABLISHED", "color: #06b6d4;");
console.log("%c[API] Connecting to backend...", "color: #f59e0b;");

initTheme();
updateAuthUI();
loadAndRenderStudents();

// Hacker Typing Effect for Title
const title = document.querySelector('.hero h1');
if (title) {
  const original = title.innerText;
  title.onmouseover = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      title.innerText = title.innerText.split("").map((letter, index) => {
        if (index < iterations) return original[index];
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }).join("");
      if (iterations >= original.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  };
}
