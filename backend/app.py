from datetime import date

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate

try:
    # When imported as part of the 'backend' package (e.g. FLASK_APP=backend.app)
    from .models import Goal, Transaction, User, db
except ImportError:  # pragma: no cover - fallback for running app.py directly
    # When running as a plain script from the backend directory (FLASK_APP=app or python app.py)
    from models import Goal, Transaction, User, db


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False

    # Basic configuration – SQLite database in project root
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///savings.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Allow local frontend (e.g. Vite on port 5173) to talk to backend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    db.init_app(app)
    Migrate(app, db)

    register_routes(app)

    with app.app_context():
        db.create_all()

    return app


def register_routes(app: Flask):
    # --- Auth routes ---
    @app.route("/api/auth/register", methods=["POST", "OPTIONS"])
    def register():
        if request.method == "OPTIONS":
            return "", 200

        data = request.get_json(silent=True) or {}
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "name, email and password are required"}), 400

        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({"error": "A user with that email already exists"}), 400

        user = User(name=name.strip(), email=email.strip())
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return jsonify({"user": user.to_dict()}), 201

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        # In a real app you would issue a JWT or session here.
        return jsonify({"user": user.to_dict()}), 200

    # --- Goal routes ---
    @app.route("/api/goals", methods=["GET"])
    def get_goals():
        goals = Goal.query.all()
        total_savings = sum(g.current_amount for g in goals)
        return jsonify(
            {
                "total_savings": total_savings,
                "goals": [g.to_dict() for g in goals],
            }
        )

    @app.route("/api/goals", methods=["POST"])
    def create_goal():
        data = request.get_json() or {}
        name = data.get("name")
        target_amount = data.get("target_amount")
        start_date_str = data.get("start_date")
        target_date_str = data.get("target_date")

        if not name or target_amount is None:
            return jsonify({"error": "name and target_amount are required"}), 400

        try:
            target_amount = float(target_amount)
        except (TypeError, ValueError):
            return jsonify({"error": "target_amount must be a number"}), 400

        start_date_value = None
        target_date_value = None
        if start_date_str:
            try:
                year, month, day = map(int, start_date_str.split("-"))
                start_date_value = date(year, month, day)
            except Exception:
                return jsonify({"error": "start_date must be in YYYY-MM-DD format"}), 400

        if target_date_str:
            try:
                year, month, day = map(int, target_date_str.split("-"))
                target_date_value = date(year, month, day)
            except Exception:
                return jsonify({"error": "target_date must be in YYYY-MM-DD format"}), 400

        goal = Goal(
            name=name,
            target_amount=target_amount,
            current_amount=0.0,
            start_date=start_date_value,
            target_date=target_date_value,
        )
        db.session.add(goal)
        db.session.commit()

        return jsonify(goal.to_dict()), 201

    @app.route("/api/goals/<int:goal_id>/deposit", methods=["POST"])
    def add_deposit(goal_id: int):
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
            return jsonify({"error": "amount must be positive"}), 400

        txn = Transaction(amount=amount, goal=goal)
        goal.current_amount += amount

        db.session.add(txn)
        db.session.add(goal)
        db.session.commit()

        return jsonify(
            {
                "goal": goal.to_dict(),
                "transaction": txn.to_dict(),
            }
        ), 201


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

