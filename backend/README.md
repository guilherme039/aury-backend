# Backend Python para Análise de Imagens

Este diretório contém o servidor Python local para análise de imagens de comida.

## Instalação

```bash
cd backend
pip install -r requirements.txt
```

## Executar o Servidor

```bash
python server.py
```

O servidor estará disponível em `http://localhost:8000`

## Endpoints

- `GET /` - Status do servidor
- `POST /analisar-imagem/` - Análise de imagem de comida

## Desenvolvimento

O servidor atualmente retorna dados mock simulados. Para implementar análise real com IA:

1. Adicione TensorFlow ou PyTorch ao `requirements.txt`
2. Baixe um modelo pré-treinado (ex: Food-101)
3. Implemente a lógica de análise em `server.py`
