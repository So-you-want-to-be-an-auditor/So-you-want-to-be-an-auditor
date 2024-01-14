#
FROM python:3.11

#
WORKDIR /code

#
COPY ./backend /code

#
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install fastapi uvicorn

#
CMD ["hypercorn", "main:app", "--bind", "0.0.0.0:8000"]