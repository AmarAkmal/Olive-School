class BaseConfig(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'secret'
    # DATABASE_URI = 'sqlite://:memory:'
    # SQLALCHEMY_DATABASE_URI ='sqlite:///test.db'
    UPLOAD_FOLDER = 'static/uploads'  # changed to relative path
    # CELERY_BROKER_URL = 'redis://:madi0122146026@192.168.5.30:6379'
    # CELERY_BACKEND = 'redis://:madi0122146026@192.168.5.30:6379'
    VERSION = 'V2'
    HOSTNAME = 'https://theolivetrees.edu.my/management/'


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/olive'
    DEBUG = True


class TestingConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@192.168.5.13/testdb'
    TESTING = True
    WTF_CSRF_ENABLED = False
    PRESERVE_CONTEXT_ON_EXCEPTION = False


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/olive'
    DEBUG = True


config_setting = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": ProductionConfig
}
