from flask import Flask, jsonify, request, make_response, send_from_directory
from dotenv import load_dotenv
from werkzeug.security import check_password_hash
import os
from extensions import db
from models import User
from werkzeug.security import generate_password_hash


load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        print("🔁 Received preflight OPTIONS request")
        response = make_response('', 204)
        return response

    print("📥 Received POST login request")
    try:
        data = request.get_json()
        print("📦 Data received:", data)
    except Exception as e:
        print("❌ Failed to parse JSON:", e)
        return jsonify({'error': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("⚠️ Missing email or password")
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(email=email).first()
    print("🔍 Found user:", user.email if user else "None")

    if user and check_password_hash(user.password_hash, password):
        print("✅ Password matched")
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'allergies': user.allergies
        }), 200
    else:
        print("❌ Invalid credentials")
        return jsonify({'error': 'Invalid credentials'}), 401

    


@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        print("🔁 Received preflight OPTIONS request for /register")
        return make_response('', 204)

    print("📥 Received POST register request")
    try:
        data = request.get_json()
        print("📦 Data received:", data)
    except Exception as e:
        print("❌ Failed to parse JSON:", e)
        return jsonify({'error': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password or not username:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/users/<int:user_id>/allergies', methods=['POST'])
def update_allergies(user_id):
    data = request.get_json()
    allergies = data.get('allergies')  

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.allergies = ",".join(allergies)
    db.session.commit()

    return jsonify({'message': 'Allergies updated successfully'})

@app.route('/menu')
def get_menu():
    return send_from_directory('static', 'menu.json')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5050, host='0.0.0.0')
