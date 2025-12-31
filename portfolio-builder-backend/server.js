const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());

// Use a JSON file to store portfolios (for demo, in-memory array)
const DATA_FILE = path.join(__dirname, 'portfolios.json');
let portfolios = [];

// Load portfolios from file if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    portfolios = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    portfolios = [];
  }
}

// Save portfolios to file
function savePortfolios() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(portfolios, null, 2));
}

// Username availability check
app.get('/api/check-username/:username', (req, res) => {
  const username = req.params.username.trim().toLowerCase();
  const exists = portfolios.some(p => p.username === username);
  res.json({ available: !exists });
});

// Add or update a portfolio (for demo, not full publish logic)
app.post('/api/portfolio', (req, res) => {
  const { username, ...data } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const uname = username.trim().toLowerCase();
  const idx = portfolios.findIndex(p => p.username === uname);
  if (idx > -1) portfolios[idx] = { username: uname, ...data };
  else portfolios.push({ username: uname, ...data });
  savePortfolios();
  res.json({ success: true });
});

// Admin: Get all portfolios
app.get('/api/all-portfolios', (req, res) => {
  res.json(portfolios);
});

// Admin: Update portfolio status (approve/reject)
app.post('/api/portfolio-status', (req, res) => {
  const { username, status } = req.body;
  if (!username || !status) return res.status(400).json({ error: 'Username and status required' });
  const uname = username.trim().toLowerCase();
  const idx = portfolios.findIndex(p => p.username === uname);
  if (idx === -1) return res.status(404).json({ error: 'Portfolio not found' });
  portfolios[idx].status = status;
  savePortfolios();
  res.json({ success: true });
});

// Public portfolio route
app.get('/portfolio/:username', (req, res) => {
  const username = req.params.username.trim().toLowerCase();
  const portfolio = portfolios.find(p => p.username === username);
  if (!portfolio) {
    return res.status(404).send('<h2>Portfolio not found</h2>');
  }
  if (portfolio.status !== 'approved') {
    return res.send('<h2>Portfolio Pending Approval</h2><p>This portfolio is not yet public. Please check back later.</p>');
  }
  // Render a simple HTML page for the approved portfolio
  res.send(`
    <html>
      <head>
        <title>${portfolio.displayName || username}'s Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: Arial, sans-serif; background: #0a192f; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 40px auto; background: rgba(20,30,60,0.85); border-radius: 16px; box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37); padding: 32px; }
          h1 { color: #64ffda; }
          .section { margin-bottom: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${portfolio.displayName || username}'s Portfolio</h1>
          <div class="section"><strong>Bio:</strong><br>${portfolio.bio || ''}</div>
          <div class="section"><strong>Skills:</strong><br>${(portfolio.skills || []).join(', ')}</div>
          <div class="section"><strong>Projects:</strong><br>${(portfolio.projects || []).map(p => `<div><b>${p.title}</b>: ${p.description}</div>`).join('')}</div>
          <div class="section"><strong>Contact:</strong><br>${portfolio.contact || ''}</div>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Portfolio Builder backend running on http://localhost:${PORT}`);
});
