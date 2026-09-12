/*
  Beginner JavaScript guide:
  - An object stores related information using name: value pairs.
  - An array stores a list of objects.
  - A function is a reusable recipe.
  - addEventListener says: "when this happens, run this function."

  This demo keeps users in the browser so you can read the rules.
  A real school would move passwords to a secure server and database.
*/
const schools = {
  brightpath: { name: 'Brightpath Academy', story: 'Brightpath Academy helps curious learners grow with confidence, kindness, and purpose.' },
  riverstone: { name: 'Riverstone College', story: 'Riverstone College connects strong academics with creativity, leadership, and community service.' },
  horizon: { name: 'Horizon Learning Centre', story: 'Horizon Learning Centre gives every learner a patient, practical path toward a brighter future.' }
};

// Each account has one role. A role cannot use another role's password.
const users = [
  { school: 'brightpath', name: 'Amina Yusuf', role: 'student', password: 'bright123', marks: { Mathematics: 84, English: 78, Science: 91, History: 68 } },
  { school: 'brightpath', name: 'Mr. Patel', role: 'teacher', password: 'teach123', subjects: ['Science'], marks: { Science: 91 } },
  { school: 'brightpath', name: 'Amina Yusuf parent', role: 'parent', password: 'parent456', child: 'Amina Yusuf', marks: { Mathematics: 84, English: 78, Science: 91, History: 68 } },
  { school: 'riverstone', name: 'Daniel Kim', role: 'student', password: 'river123', marks: { Mathematics: 73, Art: 88, Biology: 81 } },
  { school: 'horizon', name: 'Visitor', role: 'visitor', password: 'visit' }
];

const roleText = {
  student: { title: 'Your learning snapshot', subtitle: 'Your latest marks by subject' },
  teacher: { title: 'Your teaching workspace', subtitle: 'Only subjects assigned to you are visible' },
  parent: { title: "Your child's progress", subtitle: 'Private results for your linked child' },
  visitor: { title: 'Discover this school', subtitle: 'Public information only' }
};

const statsGrid = document.querySelector('#statsGrid');
const subjectList = document.querySelector('#subjectList');
const dashboardTitle = document.querySelector('#dashboardTitle');
const progressSubtitle = document.querySelector('#progressSubtitle');
const toast = document.querySelector('#toast');
let currentUser = null;

function gradeFor(mark) {
  if (mark >= 80) return 'A';
  if (mark >= 70) return 'B';
  if (mark >= 60) return 'C';
  if (mark >= 50) return 'D';
  return 'F';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function renderDashboard(user) {
  const marks = user.marks || {};
  const values = Object.values(marks);
  const average = values.length ? Math.round(values.reduce((sum, mark) => sum + mark, 0) / values.length) : 0;
  const passing = values.filter(mark => mark >= 50).length;
  const title = roleText[user.role];

  dashboardTitle.textContent = title.title;
  progressSubtitle.textContent = title.subtitle;
  statsGrid.innerHTML = `
    <div class="stat"><strong>${average}%</strong><small>Overall average <span class="trend">+4%</span></small></div>
    <div class="stat"><strong>${values.length}</strong><small>Subjects ${user.role === 'teacher' ? 'assigned' : 'tracked'}</small></div>
    <div class="stat"><strong>${passing}/${values.length || 0}</strong><small>Subjects passed</small></div>
    <div class="stat"><strong>${gradeFor(average)}</strong><small>Current grade</small></div>`;

  subjectList.innerHTML = Object.entries(marks).map(([subject, mark]) => `
    <div class="subject-row"><span>${subject}</span><div class="bar"><span style="width:${mark}%"></span></div><span>${mark}% (${gradeFor(mark)})</span></div>`).join('');

  document.querySelector('.avatar').textContent = user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  document.querySelector('.welcome-note strong').textContent = `Welcome, ${user.name.split(' ')[0]}`;
  showToast(`${roleText[user.role].title} loaded for ${schools[user.school].name}.`);
}

function updatePublicSchool() {
  const school = schools[document.querySelector('#schoolSelect').value];
  document.querySelector('#schoolStory').textContent = school.story;
}

document.querySelector('#schoolSelect').addEventListener('change', updatePublicSchool);

document.querySelector('#loginRole').addEventListener('change', event => {
  const password = document.querySelector('#passwordInput');
  password.placeholder = event.target.value === 'teacher' ? 'Try: teach123' : event.target.value === 'parent' ? 'Try: parent456' : event.target.value === 'visitor' ? 'Try: visit' : 'Try: bright123';
});

document.querySelector('#loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const school = document.querySelector('#schoolSelect').value;
  const role = document.querySelector('#loginRole').value;
  const password = document.querySelector('#passwordInput').value;
  const user = users.find(account => account.school === school && account.role === role && account.password === password);

  if (!user) {
    showToast('That password, role, or school does not match. Access refused.');
    return;
  }

  currentUser = user;
  document.querySelector('#loginPanel').classList.add('is-hidden');
  document.querySelector('#publicInfo').classList.toggle('is-hidden', role !== 'visitor');
  document.querySelector('#roleGrid').classList.toggle('is-hidden', role === 'visitor');
  renderDashboard(user);
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('.role-card').forEach(card => card.addEventListener('click', () => {
  if (!currentUser) {
    showToast('Sign in first so we can protect each person’s information.');
    return;
  }
  if (card.dataset.role !== currentUser.role) {
    showToast(`You are signed in as a ${currentUser.role}; this account cannot open ${card.dataset.role} tools.`);
    return;
  }
  document.querySelectorAll('.role-card').forEach(item => item.classList.remove('selected'));
  card.classList.add('selected');
}));

document.querySelector('#viewResultsButton').addEventListener('click', () => document.querySelector('#results').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('#tourButton').addEventListener('click', () => showToast('Choose a school, select your role, then sign in to see your private view.'));
document.querySelector('#bellButton').addEventListener('click', () => showToast('No new security alerts.'));
document.querySelector('#helpButton').addEventListener('click', () => showToast('The school office can help with account access.'));
document.querySelector('#messageButton').addEventListener('click', () => showToast('Messages are available after signing in.'));
document.querySelector('#calendarButton').addEventListener('click', () => showToast('Calendar access is available to signed-in school members.'));

updatePublicSchool();
