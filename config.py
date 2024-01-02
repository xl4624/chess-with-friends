import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    debug = True
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{os.getenv('DATABASE_USER')}:{os.getenv('DATABASE_PASSWORD')}"
        f"@{os.getenv('DATABASE_HOST')}/{os.getenv('DATABASE_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SERVER_NAME = "localhost:3000"
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)


class DevelopmentConfig(Config):
    debug = True


class ProductionConfig(Config):
    debug = False


class TestingConfig(Config):
    debug = True
    testing = True

