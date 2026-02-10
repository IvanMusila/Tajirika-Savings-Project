# Tajirika Savings Tracker

Full‑stack savings tracker built with **Flask** (SQLite, SQLAlchemy, Flask‑Migrate) and **React (Vite)** with **Tailwind CSS** and **lucide-react**.  
All monetary values are expressed in **Kenyan Shillings (KSh)**.

---

## Backend (Flask)

- **Stack**: Flask, Flask‑SQLAlchemy, Flask‑Migrate, SQLite.
- **Models** (see `backend/models.py`):
  - `Goal`: `id`, `name`, `target_amount`, `current_amount`, `start_date`, `target_date`.
  - `Transaction`: `id`, `amount`, `date`, `goal_id`.
- **API Endpoints** (all JSON):
  - `GET /api/goals`
    - Response: `{ total_savings, goals: [...] }`.
  - `POST /api/goals`
    - Body: `{ name, target_amount, start_date, target_date }`  
      (`start_date` / `target_date` as `YYYY-MM-DD`).
  - `POST /api/goals/<id>/deposit`
    - Body: `{ amount }`.

### Running the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

export FLASK_APP=app.py     # On Windows PowerShell: $env:FLASK_APP="app.py"
flask db init               # first time only
flask db migrate -m "initial"
flask db upgrade

python app.py               # runs on http://localhost:5000
```

---

## Frontend (React + Vite)

- **Stack**: React 18, Vite, Tailwind CSS, lucide-react.
- **Key components**:
  - `Dashboard.jsx`: shows **Total Saved (KSh)** and **Monthly Obligations (KSh/month)** plus all active goals.
  - `GoalCard.jsx`: per-goal card with progress, remaining amount, and **Monthly Requirement** (highlighted in amber if high).
  - `ProgressBar.jsx`: glassmorphism‑styled progress bar.
  - `NewGoalModal.jsx`: blurred glass form to create a new goal.
  - `DepositForm.jsx`: add deposits to a goal.
- The frontend talks to the Flask API at `http://localhost:5000/api`.

### Running the frontend

```bash
cd frontend
npm install
npm run dev      # default: http://localhost:5173
```

Make sure the Flask backend is running so the dashboard can load and update goals.

---

## Monthly Requirement Formula

For each goal, the frontend computes a **Monthly Requirement**:

\[
  \text{Monthly Requirement} =
  \frac{\text{Target Amount} - \text{Current Amount}}{\text{Months Remaining}}
\]

- If this value is high relative to the average pace, it is highlighted in a **warning (amber)** pill on the goal card.
- All computations are purely client‑side and displayed in **KSh**.

