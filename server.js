const express = require('express');
const cors = require('cors');
const db = require('./database');
const { predictTaskScore } = require('./ai');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CREATE TASK ================= */
app.post('/tasks', (req, res) => {
  const { title, priority, deadline, estimated_time } = req.body;

  db.run(
    `INSERT INTO tasks (title, priority, deadline, estimated_time, completed)
     VALUES (?, ?, ?, ?, 0)`,
    [title, priority, deadline, estimated_time],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

/* ================= GET TASKS (AI POWERED) ================= */
app.get('/tasks', (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) return res.status(500).json(err);

    const enriched = rows.map(task => ({
      ...task,
      ai_score: predictTaskScore(task)
    }));

    enriched.sort((a, b) => b.ai_score - a.ai_score);

    res.json(enriched);
  });
});

/* ================= DELETE ================= */
app.delete('/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id=?`, [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

/* ================= COMPLETE ================= */
app.put('/tasks/complete/:id', (req, res) => {
  db.run(
    `UPDATE tasks SET completed=1 WHERE id=?`,
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.listen(5000, () => console.log("AI Task System running on 5000"));