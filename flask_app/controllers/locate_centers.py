from flask_app import app
from flask import jsonify
from flask_cors import cross_origin
import os
import json

@app.route('/api/urgencia')
@cross_origin()
def locate_centers():
    try:
        # Intenta diferentes rutas posibles para el archivo JSON
        posibles_rutas = [
            os.path.join(app.root_path, 'static', 'establecimientos_salud_urgencias_chile.json'),
            os.path.join(app.root_path, '..', 'static', 'establecimientos_salud_urgencias_chile.json'),
            os.path.join(os.getcwd(), 'static', 'establecimientos_salud_urgencias_chile.json'),
            'establecimientos_salud_urgencias_chile.json'
        ]
        
        ruta_json = None
        for ruta in posibles_rutas:
            if os.path.exists(ruta):
                ruta_json = ruta
                break
        
        if not ruta_json:
            print("ERROR: No se encontró el archivo JSON en ninguna de las rutas esperadas")
            print("Rutas verificadas:")
            for ruta in posibles_rutas:
                print(f"  - {ruta} (existe: {os.path.exists(ruta)})")
            return jsonify({"error": "Archivo JSON no encontrado", "centros": []})

        print(f"Cargando datos desde: {ruta_json}")
        
        with open(ruta_json, 'r', encoding='utf-8') as f:
            datos = json.load(f)

        print(f"Total de registros en JSON: {len(datos)}")

        # Normalizar los datos para que frontend pueda leerlos
        centros = []
        for item in datos:
            try:
                # Verificar que los campos requeridos existan
                if not item.get("LATITUD") or not item.get("LONGITUD"):
                    continue
                    
                centro = {
                    "nombre": item.get("NOMBRE", "Sin nombre"),
                    "latitud": float(item.get("LATITUD", 0)),
                    "longitud": float(item.get("LONGITUD", 0)),
                    "tipo": item.get("TIPO", ""),
                    "direccion": item.get("DIRECCION", ""),
                    "telefono": item.get("FONO", ""),
                    "region": item.get("REGION", ""),
                    "comuna": item.get("COMUNA", "")
                }
                
                # Solo agregar si tiene coordenadas válidas
                if centro["latitud"] != 0 and centro["longitud"] != 0:
                    centros.append(centro)
                    
            except (ValueError, TypeError) as e:
                print(f"Error procesando centro: {item.get('NOMBRE', 'Sin nombre')} - {e}")
                continue

        print(f"Centros válidos procesados: {len(centros)}")
        
        # Retornar tanto los centros como información de debug
        return jsonify({
            "centros": centros,
            "total_procesados": len(centros),
            "total_originales": len(datos),
            "ruta_archivo": ruta_json
        })
        
    except Exception as e:
        print(f"ERROR en locate_centers: {e}")
        return jsonify({"error": str(e), "centros": []}), 500