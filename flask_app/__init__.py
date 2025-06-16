from flask import Flask
from flask_cors import CORS
import os


app = Flask(__name__)
app.secret_key = "shhhhhh"
frontend_url = os.getenv("FRONTEND_URL", "https://dorianandrea.github.io")


CORS(app, resources={r"/api/*": {"origins": frontend_url}})
DATABASE_URL = os.getenv("DATABASE_URL")