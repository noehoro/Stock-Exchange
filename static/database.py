from app import db
import json
from sqlalchemy.ext import mutable

class Tickers(db.Model):
    symbol = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)

class JsonEncodedDict(db.TypeDecorator):
    """Enables JSON storage by encoding and decoding on the fly."""
    impl = db.Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return '{}'
        else:
            return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return {}
        else:
            return json.loads(value)

class Profiles(db.Model):
        symbol = db.Column(db.String, primary_key=True)
        profile = db.Column(JsonEncodedDict)

mutable.MutableDict.associate_with(JsonEncodedDict)

db.create_all()
