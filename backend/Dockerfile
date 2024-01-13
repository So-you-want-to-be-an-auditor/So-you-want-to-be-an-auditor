#
FROM python:3.11

#
WORKDIR /code

#
COPY ./backend/requirements.txt /code/requirements.txt

#
COPY ./ /code

#
RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN pip install fastapi uvicorn

#
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]