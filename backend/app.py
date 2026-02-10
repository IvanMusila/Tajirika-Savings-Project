from datetime import datetime

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Basic configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///savings.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


class Goal(db.Model):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, nullable=False, default=0.0)
    target_date = db.Column(db.Date, nullable=True)

    transactions = db.relationship("Transaction", backref="goal", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "target_date": self.target_date.isoformat() if self.target_date else None,
        }


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    goal_id = db.Column(db.Integer, db.ForeignKey("goals.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "date": self.date.isoformat(),
            "goal_id": self.goal_id,
        }


@app.before_first_request
def create_tables():
    db.create_all()


@app.route("/api/goals", methods=["GET"])
def get_goals():
    goals = Goal.query.all()
    return jsonify([g.to_dict() for g in goals])


@app.route("/api/goals", methods=["POST"])
def create_goal():
    data = request.get_json() or {}
    name = data.get("name")
    target_amount = data.get("target_amount")
    target_date_raw = data.get("target_date")

    if not name or target_amount is None:
        return jsonify({"error": "name and target_amount are required"}), 400

    try:
        target_amount = float(target_amount)
    except (TypeError, ValueError):
        return jsonify({"error": "target_amount must be a number"}), 400

    target_date = None
    if target_date_raw:
        try:
            target_date = datetime.fromisoformat(target_date_raw).date()
        except ValueError:
            return jsonify({"error": "target_date must be ISO date string"}), 400

    goal = Goal(
        name=name,
        target_amount=target_amount,
        current_amount=0.0,
        target_date=target_date,
    )
    db.session.add(goal)
    db.session.commit()

    return jsonify(goal.to_dict()), 201


@app.route("/api/goals/<int:goal_id>/deposit", methods=["POST"])
def deposit_to_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    data = request.get_json() or {}
    amount = data.get("amount")

    if amount is None:
        return jsonify({"error": "amount is required"}), 400

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "amount must be a number"}), 400

    if amount <= 0:
        return jsonify({"error": "amount must be greater than zero"}), 400

    transaction = Transaction(amount=amount, goal=goal)
    goal.current_amount = (goal.current_amount or 0.0) + amount

    db.session.add(transaction)
    db.session.add(goal)
    db.session.commit()

    return jsonify(
        {
            "goal": goal.to_dict(),
            "transaction": transaction.to_dict(),
        }
    ), 201


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True)

