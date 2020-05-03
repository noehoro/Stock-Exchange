import json
import urllib.request as urllib
from flask import Flask, render_template, abort, session, redirect, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stockInfo.db'
db = SQLAlchemy(app)


class Tickers(db.Model):
    symbol = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)


db.create_all()


@app.route("/")
def homepage():
    return render_template("homepage.html")


@app.route("/company/<ticker>")
def test(ticker):
    return render_template("company.html", ticker=ticker)


@app.route("/API/profile/<ticker>")
def returnProfile(ticker):
    results = fetch(
        f"https://financialmodelingprep.com/api/v3/company/profile/{ticker}")
    return results


@app.route("/API/prices/<ticker>")
def returnPrices(ticker):
    results = fetch(
        f"https://financialmodelingprep.com/api/v3/historical-price-full/{ticker}?serietype=line")
    return results


@app.route("/API/search/<ticker>")
def returnSearch(ticker):
    search_results = search(ticker)
    results = []
    for stock in search_results:
        results.append({"name": stock.name, "symbol": stock.symbol})
    results = jsonify(results)
    return results


@app.route("/API/display/")
def returnDisplay():
    results = fetch(
        f"https://financialmodelingprep.com/api/v3/company/stock/list")
    return results


@app.route('/data')
def data():
    args = request.args
    return args


def fetch(link):
    with urllib.urlopen(link) as url:
        s = url.read()
        return s



def search(query):
    results = Tickers.query.filter(or_(Tickers.name.like(
        f"%{query}%"), Tickers.symbol.like(f"%{query}%"))).limit(10).all()
    return results


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
