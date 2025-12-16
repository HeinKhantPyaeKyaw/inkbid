FROM python:3.11
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY ./services /app/services
COPY ./app.py /app/
EXPOSE 5050
CMD ["python", "app.py"]

