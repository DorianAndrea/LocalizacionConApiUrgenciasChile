from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "shhhhhh"

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}) 

