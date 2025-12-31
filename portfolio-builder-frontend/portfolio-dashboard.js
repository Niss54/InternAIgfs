// --- Publish Feature ---
const publishBtn = document.getElementById('publishBtn');
const publishResult = document.getElementById('publishResult');

async function checkUsernameAvailable(username) {
	if (!username) return false;
	try {
		const res = await fetch(`http://localhost:3001/api/check-username/${encodeURIComponent(username)}`);
		const data = await res.json();
		return data.available;
	} catch {
		return false;
	}
}

async function publishPortfolio() {
	const data = getFormData();
	const username = (data.name || '').trim().toLowerCase().replace(/\s+/g, '');
	if (!username) {
		publishResult.style.display = 'block';
		publishResult.style.color = '#ff4444';
		publishResult.textContent = 'Please enter your name (username) before publishing.';
		return;
	}
	// Check username availability
	const available = await checkUsernameAvailable(username);
	if (!available) {
		publishResult.style.display = 'block';
		publishResult.style.color = '#ff4444';
		publishResult.textContent = 'This username is already taken. Please choose another.';
		return;
	}
	// Mark as pending approval
	data.username = username;
	data.status = 'pending';
	try {
		await fetch('http://localhost:3001/api/portfolio', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		publishResult.style.display = 'block';
		publishResult.style.color = '#00e6ff';
		publishResult.innerHTML = `Portfolio submitted for review!<br>Future public URL:<br><b>internai.com/portfolio/${username}</b><br><span style='color:#aaa'>(Pending approval)</span>`;
	} catch {
		publishResult.style.display = 'block';
		publishResult.style.color = '#ff4444';
		publishResult.textContent = 'Error publishing portfolio. Please try again.';
	}
}

if (publishBtn) publishBtn.onclick = publishPortfolio;
// --- Save and Preview System ---
const form = document.getElementById('portfolioForm');
const saveBtn = document.getElementById('saveBtn');
const previewBtn = document.getElementById('previewBtn');
const previewModal = document.getElementById('portfolioPreviewModal');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const previewArea = document.getElementById('previewArea');

function getFormData() {
	// Basic fields
	const data = {
		name: document.getElementById('userName').value,
		title: document.getElementById('userTitle').value,
		bio: document.getElementById('userBio').value,
		social: document.getElementById('userSocial').value,
		about: document.getElementById('aboutText').value,
		email: document.getElementById('contactEmail').value,
		phone: document.getElementById('contactPhone').value,
		location: document.getElementById('contactLocation').value,
		skills: [],
		services: [],
		projects: [],
		reviews: [],
		achievements: [],
		certifications: [],
		profileImage: '',
		theme: document.getElementById('themeSelect')?.value || 'neon',
	};
	// Profile image (base64)
	if (profileImagePreview && profileImagePreview.src && profileImagePreview.style.display !== 'none') {
		data.profileImage = profileImagePreview.src;
	}
	// Dynamic lists
	function getListValues(listId, fields) {
		const list = document.getElementById(listId);
		if (!list) return [];
		return Array.from(list.children).map(card => {
			const obj = {};
			let i = 0;
			for (const f of fields) {
				const el = card.querySelector(f.type === 'textarea' ? 'textarea' : 'input[type="'+f.type+'"]');
				obj[f.key] = el ? el.value : '';
				i++;
			}
			return obj;
		});
	}
	data.skills = getListValues('skillsList', [
		{type:'text',key:'name'},{type:'text',key:'percent'}
	]);
	data.services = getListValues('servicesList', [
		{type:'text',key:'title'},{type:'textarea',key:'desc'}
	]);
	data.projects = getListValues('projectsList', [
		{type:'text',key:'title'},{type:'textarea',key:'desc'},{type:'file',key:'img'},{type:'text',key:'tags'},{type:'text',key:'demo'},{type:'text',key:'code'}
	]);
	data.reviews = getListValues('reviewsList', [
		{type:'text',key:'name'},{type:'textarea',key:'text'},{type:'text',key:'stars'}
	]);
	data.achievements = getListValues('achievementsList', [
		{type:'text',key:'title'},{type:'text',key:'label'}
	]);
	data.certifications = getListValues('certificationsList', [
		{type:'file',key:'img'},{type:'text',key:'title'}
	]);
	return data;
}

function setFormData(data) {
	if (!data) return;
	document.getElementById('userName').value = data.name || '';
	document.getElementById('userTitle').value = data.title || '';
	document.getElementById('userBio').value = data.bio || '';
	document.getElementById('userSocial').value = data.social || '';
	document.getElementById('aboutText').value = data.about || '';
	document.getElementById('contactEmail').value = data.email || '';
	document.getElementById('contactPhone').value = data.phone || '';
	document.getElementById('contactLocation').value = data.location || '';
	if (data.profileImage && profileImagePreview) {
		profileImagePreview.src = data.profileImage;
		profileImagePreview.style.display = 'block';
	}
	// Dynamic lists
	function setListValues(listId, fields, values) {
		const list = document.getElementById(listId);
		if (!list) return;
		list.innerHTML = '';
		for (const v of values || []) {
			const card = document.createElement('div');
			card.className = 'section-block';
			card.style.background = 'rgba(20,30,60,0.35)';
			card.style.marginBottom = '1rem';
			fields.forEach(f => {
				let el;
				if (f.type === 'textarea') {
					el = document.createElement('textarea');
					el.placeholder = f.key;
					el.className = 'input-block';
					el.value = v[f.key] || '';
				} else if (f.type === 'file') {
					el = document.createElement('input');
					el.type = 'file';
					el.accept = f.accept || '';
				} else {
					el = document.createElement('input');
					el.type = f.type;
					el.placeholder = f.key;
					el.className = 'input-block';
					el.value = v[f.key] || '';
				}
				card.appendChild(el);
			});
			const removeBtn = document.createElement('button');
			removeBtn.type = 'button';
			removeBtn.className = 'add-btn';
			removeBtn.style.background = '#222';
			removeBtn.style.color = '#00e6ff';
			removeBtn.textContent = 'Remove';
			removeBtn.onclick = () => card.remove();
			card.appendChild(removeBtn);
			list.appendChild(card);
		}
	}
	setListValues('skillsList', [
		{type:'text',key:'name'},{type:'text',key:'percent'}
	], data.skills);
	setListValues('servicesList', [
		{type:'text',key:'title'},{type:'textarea',key:'desc'}
	], data.services);
	setListValues('projectsList', [
		{type:'text',key:'title'},{type:'textarea',key:'desc'},{type:'file',key:'img'},{type:'text',key:'tags'},{type:'text',key:'demo'},{type:'text',key:'code'}
	], data.projects);
	setListValues('reviewsList', [
		{type:'text',key:'name'},{type:'textarea',key:'text'},{type:'text',key:'stars'}
	], data.reviews);
	setListValues('achievementsList', [
		{type:'text',key:'title'},{type:'text',key:'label'}
	], data.achievements);
	setListValues('certificationsList', [
		{type:'file',key:'img'},{type:'text',key:'title'}
	], data.certifications);
	if (document.getElementById('themeSelect')) {
		document.getElementById('themeSelect').value = data.theme || 'neon';
		setTheme(data.theme || 'neon');
	}
}

function savePortfolio() {
	const data = getFormData();
	localStorage.setItem('portfolioDraft', JSON.stringify(data));
	alert('Portfolio saved! (Not published)');
}

function loadPortfolio() {
	const data = localStorage.getItem('portfolioDraft');
	if (data) setFormData(JSON.parse(data));
}

function showPreview() {
	const data = getFormData();
	let html = '';
	html += `<div style="text-align:center;margin-bottom:1.5em;">
		${data.profileImage ? `<img src="${data.profileImage}" style="max-width:100px;border-radius:50%;margin-bottom:1em;" />` : ''}
		<h2 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};font-size:2em;">${data.name || ''}</h2>
		<h3 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};font-size:1.2em;">${data.title || ''}</h3>
		<p style="color:#e0e6f8;">${data.bio || ''}</p>
		<div style="margin:1em 0;">${data.social ? `<a href="${data.social}" target="_blank" style="color:#00e6ff;">${data.social}</a>` : ''}</div>
	</div>`;
	html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">About</h4><p>${data.about || ''}</p>`;
	if (data.skills && data.skills.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Skills</h4><ul>`;
		data.skills.forEach(s => html += `<li>${s.name || ''} (${s.percent || ''}%)</li>`);
		html += `</ul>`;
	}
	if (data.services && data.services.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Services</h4><ul>`;
		data.services.forEach(s => html += `<li><b>${s.title || ''}</b>: ${s.desc || ''}</li>`);
		html += `</ul>`;
	}
	if (data.projects && data.projects.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Portfolio</h4><ul>`;
		data.projects.forEach(p => html += `<li><b>${p.title || ''}</b>: ${p.desc || ''}</li>`);
		html += `</ul>`;
	}
	if (data.reviews && data.reviews.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Reviews</h4><ul>`;
		data.reviews.forEach(r => html += `<li><b>${r.name || ''}</b>: ${r.text || ''} (${r.stars || ''} stars)</li>`);
		html += `</ul>`;
	}
	if (data.achievements && data.achievements.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Achievements</h4><ul>`;
		data.achievements.forEach(a => html += `<li><b>${a.title || ''}</b>: ${a.label || ''}</li>`);
		html += `</ul>`;
	}
	if (data.certifications && data.certifications.length) {
		html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Certifications</h4><ul>`;
		data.certifications.forEach(c => html += `<li>${c.title || ''}</li>`);
		html += `</ul>`;
	}
	html += `<h4 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary-accent')};margin-top:1em;">Contact</h4><ul>`;
	html += `<li>Email: ${data.email || ''}</li>`;
	html += `<li>Phone: ${data.phone || ''}</li>`;
	html += `<li>Location: ${data.location || ''}</li>`;
	html += `</ul>`;
	previewArea.innerHTML = html;
	previewModal.style.display = 'flex';
}

if (saveBtn) saveBtn.onclick = savePortfolio;
if (previewBtn) previewBtn.onclick = showPreview;
if (closePreviewBtn) closePreviewBtn.onclick = () => { previewModal.style.display = 'none'; };

window.addEventListener('DOMContentLoaded', loadPortfolio);

// Theme switching
const themeSelect = document.getElementById('themeSelect');
const htmlRoot = document.documentElement;
function setTheme(theme) {
	htmlRoot.classList.remove('theme-neon', 'theme-classic');
	if (theme === 'classic') {
		htmlRoot.classList.add('theme-classic');
	} else {
		htmlRoot.classList.add('theme-neon');
	}
}
if (themeSelect) {
	themeSelect.addEventListener('change', (e) => {
		setTheme(e.target.value);
	});
	// Default to Neon Blue
	setTheme(themeSelect.value);
}

// Image preview for profile
const profileImageInput = document.getElementById('profileImageInput');
const profileImagePreview = document.getElementById('profileImagePreview');
if (profileImageInput && profileImagePreview) {
	profileImageInput.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				profileImagePreview.src = ev.target.result;
				profileImagePreview.style.display = 'block';
			};
			reader.readAsDataURL(file);
		}
	});
}

// Dynamic add/remove for cards
function addCard(listId, placeholderFields) {
	const list = document.getElementById(listId);
	if (!list) return;
	const card = document.createElement('div');
	card.className = 'section-block';
	card.style.background = 'rgba(20,30,60,0.35)';
	card.style.marginBottom = '1rem';
	placeholderFields.forEach(f => {
		if (f.type === 'textarea') {
			const el = document.createElement('textarea');
			el.placeholder = f.placeholder;
			el.className = 'input-block';
			card.appendChild(el);
		} else if (f.type === 'file') {
			const el = document.createElement('input');
			el.type = 'file';
			el.accept = f.accept || '';
			card.appendChild(el);
		} else {
			const el = document.createElement('input');
			el.type = f.type;
			el.placeholder = f.placeholder;
			el.className = 'input-block';
			card.appendChild(el);
		}
	});
	const removeBtn = document.createElement('button');
	removeBtn.type = 'button';
	removeBtn.className = 'add-btn';
	removeBtn.style.background = '#222';
	removeBtn.style.color = '#00e6ff';
	removeBtn.textContent = 'Remove';
	removeBtn.onclick = () => card.remove();
	card.appendChild(removeBtn);
	list.appendChild(card);
}

document.getElementById('addSkillBtn')?.addEventListener('click', () => {
	addCard('skillsList', [
		{ type: 'text', placeholder: '+ Skill Name' },
		{ type: 'text', placeholder: '+ % Proficiency (e.g. 90)' }
	]);
});
document.getElementById('addServiceBtn')?.addEventListener('click', () => {
	addCard('servicesList', [
		{ type: 'text', placeholder: '+ Service Title' },
		{ type: 'textarea', placeholder: '+ Service Description' }
	]);
});
document.getElementById('addProjectBtn')?.addEventListener('click', () => {
	addCard('projectsList', [
		{ type: 'text', placeholder: '+ Project Title' },
		{ type: 'textarea', placeholder: '+ Project Description' },
		{ type: 'file', accept: 'image/*' },
		{ type: 'text', placeholder: '+ Tech Tags (comma separated)' },
		{ type: 'text', placeholder: '+ Live Demo URL' },
		{ type: 'text', placeholder: '+ Code URL' }
	]);
});
document.getElementById('addReviewBtn')?.addEventListener('click', () => {
	addCard('reviewsList', [
		{ type: 'text', placeholder: '+ Reviewer Name' },
		{ type: 'textarea', placeholder: '+ Review Text' },
		{ type: 'text', placeholder: '+ Star Rating (1-5)' }
	]);
});
document.getElementById('addAchievementBtn')?.addEventListener('click', () => {
	addCard('achievementsList', [
		{ type: 'text', placeholder: '+ Achievement Title' },
		{ type: 'text', placeholder: '+ Number/Label' }
	]);
});
document.getElementById('addCertBtn')?.addEventListener('click', () => {
	addCard('certificationsList', [
		{ type: 'file', accept: 'image/*' },
		{ type: 'text', placeholder: '+ Certificate Title' }
	]);
});
