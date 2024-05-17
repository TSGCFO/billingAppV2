from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig, TestingConfig, ProductionConfig
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Set the configuration from the environment variable or use DevelopmentConfig as default
config_class = os.getenv('FLASK_ENV', 'development').capitalize() + 'Config'
app.config.from_object(globals()[config_class])

db = SQLAlchemy(app)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    companyName = db.Column(db.String(100), nullable=False)
    legalBusinessName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    zip = db.Column(db.String(20))
    country = db.Column(db.String(50))
    businessType = db.Column(db.String(50))

    def __init__(self, companyName, legalBusinessName, email='', phone='', address='', city='', state='', zip='', country='', accountsPayable=None, businessType=''):
        self.companyName = companyName
        self.legalBusinessName = legalBusinessName
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.state = state
        self.zip = zip
        self.country = country
        self.accountsPayable = accountsPayable if accountsPayable is not None else []
        self.businessType = businessType

@app.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    customer_list = [{'id': c.id, 'name': c.companyName} for c in customers]
    return jsonify(customer_list)

@app.route('/customers', methods=['POST'])
def add_customer():
    data = request.get_json()
    new_customer = Customer(
        companyName=data['companyName'],
        legalBusinessName=data['legalBusinessName'],
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        address=data.get('address', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        zip=data.get('zip', ''),
        country=data.get('country', ''),
        accountsPayable=data.get('accountsPayable', []),
        businessType=data.get('businessType', '')
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({'message': 'Customer created successfully'}), 201

if __name__ == '__main__':
    app.run()