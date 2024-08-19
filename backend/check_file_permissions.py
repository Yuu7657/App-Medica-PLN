import os

# Verificar la variable de entorno
json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
print("Variable de entorno GOOGLE_APPLICATION_CREDENTIALS:", json_path)

# Verificar si el archivo existe
if os.path.isfile(json_path):
    print("Archivo encontrado:", json_path)
    
    # Verificar permisos de lectura
    try:
        with open(json_path, 'r') as f:
            print("El archivo se puede leer correctamente.")
    except IOError:
        print("El archivo no tiene permisos de lectura.")
else:
    print("Archivo NO encontrado:", json_path)
