FROM python:3.11.5-slim
WORKDIR /app

# Install Python dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install Node.js dependencies
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm install

COPY . /app

EXPOSE 3000

