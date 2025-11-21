
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { Telegraf, Markup } = require('telegraf');
const cors = require('cors');
const path = require('path');

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3001;
const BOT_TOKEN = process.env.BOT_TOKEN; 
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.warn("⚠️ WARNING: BOT_TOKEN or ADMIN_CHAT_ID is missing in .env file");
}

// --- SETUP EXPRESS ---
const app = express();
app.use(cors());
app.use(express.json());

// --- SETUP DATABASE ---
const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) console.error('Database opening error: ', err);
  else console.log('✅ Connected to SQLite database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- SETUP TELEGRAM BOT ---
const bot = new Telegraf(BOT_TOKEN);

// Handle Button Clicks in Telegram
bot.action(/accept_(\d+)/, (ctx) => {
  const orderId = ctx.match[1];
  db.run("UPDATE orders SET status = 'accepted' WHERE id = ?", [orderId], (err) => {
    if (!err) {
      ctx.editMessageText(`✅ Order #${orderId} ACCEPTED by ${ctx.from.first_name}`);
    }
  });
});

bot.action(/reject_(\d+)/, (ctx) => {
  const orderId = ctx.match[1];
  db.run("UPDATE orders SET status = 'rejected' WHERE id = ?", [orderId], (err) => {
    if (!err) {
      ctx.editMessageText(`❌ Order #${orderId} REJECTED by ${ctx.from.first_name}`);
    }
  });
});

bot.launch().then(() => console.log('🤖 Telegram Bot Started'));

// --- API ROUTES ---

// 1. Create Order
app.post('/api/order', (req, res) => {
  const { name, contact, details } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and Contact are required' });
  }

  const sql = `INSERT INTO orders (name, contact, details) VALUES (?, ?, ?)`;
  
  db.run(sql, [name, contact, details || ''], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    const orderId = this.lastID;
    console.log(`📦 New Order #${orderId} received.`);

    // Send Notification to Telegram
    const message = `
🔥 <b>NEW LEAD DETECTED</b>

🆔 <b>ID:</b> #${orderId}
👤 <b>Name:</b> ${name}
📞 <b>Contact:</b> ${contact}
📝 <b>Details:</b> ${details || 'N/A'}
    `;

    try {
      bot.telegram.sendMessage(ADMIN_CHAT_ID, message, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          Markup.button.callback('✅ Take Project', `accept_${orderId}`),
          Markup.button.callback('❌ Reject', `reject_${orderId}`)
        ])
      });
    } catch (e) {
      console.error("Telegram Error:", e);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Order created', 
      orderId 
    });
  });
});

// 2. Get Orders (Optional - for admin dashboard if you build one later)
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
