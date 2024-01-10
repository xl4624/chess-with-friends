import os
from datetime import timedelta
import secrets


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    SECRET_KEY = secrets.token_urlsafe(16)


class DevelopmentConfig(Config):
    debug = True
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:postgres@localhost:5432/flask_api"
    EXPLAIN_TEMPLATE_LOADING = True


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{os.getenv('DATABASE_USER')}:{os.getenv('DATABASE_PASSWORD')}"
        f"@{os.getenv('DATABASE_HOST')}/{os.getenv('DATABASE_NAME')}"
    )


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:postgres@localhost:5432/flask_api"
