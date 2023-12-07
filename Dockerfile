FROM python:3.10

WORKDIR /app

COPY req.txt /app/

RUN pip install -r req.txt

COPY . /app

CMD ["python", "app.py"]