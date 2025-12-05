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
echo Servidor estara disponivel em: http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python main.py
