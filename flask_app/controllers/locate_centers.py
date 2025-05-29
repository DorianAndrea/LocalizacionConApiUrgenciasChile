from flask_app import app
from flask import jsonify
from flask_cors import cross_origin
import os
import json

@app.route('/api/urgencia')
@cross_origin()
def locate_centers():
    import os
    ruta_json = os.path.join(app.root_path, 'static', 'establecimientos_salud_urgencias_chile.json')

    try:
        with open(ruta_json, 'r', encoding='utf-8') as f:
            datos = json.load(f)

        centros = []
        for item in datos:
            try:
                if isinstance(item, dict):
                    lat = float(item.get("LATITUD", 0))
                    lng = float(item.get("LONGITUD", 0))
                    if lat and lng:
                        centros.append({
                            "nombre": item.get("NOMBRE", "Sin nombre"),
                            "latitud": lat,
                            "longitud": lng,
                            "tipo": item.get("TIPO", ""),
                            "direccion": item.get("DIRECCION", ""),
                            "telefono": item.get("FONO", ""),
                            "region": item.get("REGION", ""),
                            "comuna": item.get("COMUNA", "")
                        })
            except Exception:
                continue  # salta registros corruptos

        return jsonify({"centros": centros})
    
    except Exception as e:
        return jsonify({"centros": [], "error": str(e)})