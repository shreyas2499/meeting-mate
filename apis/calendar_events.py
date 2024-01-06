from datetime import datetime, timedelta
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import json

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", "https://mail.google.com/"]


def get_events():
  user_creds= None
  creds = None
  
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    with open("token.json", "w") as token:
      token.write(creds.to_json())


  try:
    service = build("calendar", "v3", credentials=creds)

    now = datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
    input_date = datetime.strptime(now, '%Y-%m-%dT%H:%M:%S.%fZ')
    result_date = input_date - timedelta(days=30)

    req_date = result_date.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
  
    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=req_date,
            maxResults=50,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])

    if not events:
      return events, user_creds


    actual_events = []
    for event in events:
      start = event["start"].get("dateTime", event["start"].get("date"))
      if(len(event.get("attendees", [])) > 1):
        actual_events.append(event)


    f = open('token.json')
 
    data = json.load(f)
    user_creds = data
    user_creds['email'] = events_result.get("summary")
    return actual_events, user_creds
    
  except HttpError as error:
    print(f"An error occurred: {error}")


  