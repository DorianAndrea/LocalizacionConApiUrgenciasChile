from flask_app import app
from flask_app.controllers import regiones_comunas
from flask_app.controllers import users
from flask_app.controllers import center_address
from flask_app.models.user import User

if __name__=="__main__":
    app.run(debug=True, port=5173) 
