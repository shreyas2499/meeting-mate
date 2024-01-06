from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import json
import jwt
# from datetime import datetime, timedelta
import hashlib
import numpy as np
import pandas as pd
import datetime
import os.path
from calendar_events import get_events
from send_email import gmail_send_message


app = Flask(__name__)
CORS(app, resources={r"/*" : {"origins":"*"}})


@app.route("/events", methods=["GET"])
def get_calendar_events():
    events, user_creds = get_events()
    return jsonify({"data": events, "user": user_creds}), 200


@app.route('/sendEmail', methods=["POST"])
def send_email():
    data = json.loads(request.data)
    email = data["email"]
    date = data["dateTime"].split(" ")[0]
    time = data["dateTime"].split(" ")[1]
    link = data["link"]
    loggedUser = data["loggedUser"]

    message, user_creds = gmail_send_message(email, date, time, link, loggedUser)

    return jsonify({"data": message, "user": user_creds})



@app.route('/logout', methods=["POST"])
def logout():
    try:
        os.remove("token.json")
    except Exception as e:
        pass
    return jsonify({"message": "User logout"}, 200)

if __name__ == "__main__":
    # To run the Flask app
    app.run(port=8000, debug=True)
