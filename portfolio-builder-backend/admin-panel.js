// admin-panel.js
async function fetchPortfolios() {
  const res = await fetch('/api/all-portfolios');
  return res.json();
}

function renderPortfolios(portfolios) {
  const list = document.getElementById('portfolioList');
  list.innerHTML = '';
  if (!portfolios.length) {
    list.innerHTML = '<p>No portfolios submitted yet.</p>';
    return;
  }
  portfolios.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.innerHTML = `
      <div class="status">
        <b>Status:</b> <span class="${p.status}">${p.status || 'pending'}</span>
      </div>
      <div><b>Username:</b> ${p.username}</div>
      <div><b>Name:</b> ${p.displayName || ''}</div>
      <div><b>Bio:</b> ${p.bio || ''}</div>
      <div><b>Skills:</b> ${(p.skills || []).join(', ')}</div>
      <div><b>Projects:</b> ${(p.projects || []).map(pr => `<div><b>${pr.title}</b>: ${pr.description}</div>`).join('')}</div>
      <div class="actions">
        <button class="approve" onclick="updateStatus('${p.username}', 'approved')" ${p.status==='approved'?'disabled':''}>Approve</button>
        <button class="reject" onclick="updateStatus('${p.username}', 'rejected')" ${p.status==='rejected'?'disabled':''}>Reject</button>
      </div>
    `;
    list.appendChild(card);
  });
}

async function updateStatus(username, status) {
  await fetch('/api/portfolio-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, status })
  });
  loadPortfolios();
}

async function loadPortfolios() {
  const portfolios = await fetchPortfolios();
  renderPortfolios(portfolios);
}

window.onload = loadPortfolios;
