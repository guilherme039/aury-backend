@echo off
echo ========================================
echo   Iniciando Backend Python - Aury App
echo ========================================
echo.

cd backend

echo Verificando dependencias...
pip install -r requirements.txt

echo.
echo Iniciando servidor FastAPI...
echo O backend local roda em: http://localhost:8000
echo MAS o frontend esta configurado para usar: https://aury-backend.onrender.com
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python main.py
