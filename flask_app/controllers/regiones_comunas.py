from flask_app import app
from flask import jsonify, request
from flask_app.models.comuna import Comuna
from flask_app.models.region import Region

@app.route('/api/data')
def get_data():
    comunas = Comuna.get_all_comunas()
    regiones = Region.get_all()
    data = {
        'comunas': [comuna.__dict__ for comuna in comunas],
        'regiones': [region.__dict__ for region in regiones]
    }
    return jsonify(data)

@app.route('/api/comunas')
def get_filtered_comunas():
    region_id = request.args.get('region_id')
    comunas = Comuna.get_comunas_by_region(region_id)
    data = {
        'comunas': [comuna.__dict__ for comuna in comunas]
    }
    return jsonify(data)
