import os

# Establecer la variable de entorno usando barras invertidas dobles
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\ashis\\OneDrive\\Escritorio\\app-python\\credentials\\my_project_key.json"
print("Variable de entorno GOOGLE_APPLICATION_CREDENTIALS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

# Verificar si el archivo existe
if os.path.isfile(os.getenv("GOOGLE_APPLICATION_CREDENTIALS")):
    print("Archivo encontrado:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
else:
    print("Archivo NO encontrado:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
