from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/menu')
def get_menu():
    with open(os.path.join(os.path.dirname(__file__), 'menu.json')) as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
