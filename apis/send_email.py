import base64
from email.message import EmailMessage

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

import json

SCOPES = ["https://mail.google.com/", "https://www.googleapis.com/auth/calendar.readonly"]

def gmail_send_message(email, date, time, link, loggedUser):
    
    creds = None
    user_creds= None


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
        service = build("gmail", "v1", credentials=creds)
        message = EmailMessage()
        
        message_str = f"""Dear {email}, \nI hope this email finds you well. We are delighted to invite you to our upcoming meeting, where we will be discussing more about the H7 Accelerator Program. Your insights and contributions are highly valued, and we believe your presence will greatly enrich the discussion.
        Meeting Details:
        ----------------------------------------------------------
        Date: {date}
        Time: {time}
        Location: {link}
        ----------------------------------------------------------
        Your participation is crucial to the success of our endeavors, and we look forward to hearing your perspectives. Your engagement will undoubtedly contribute to the overall success of our collaborative efforts. Should you have any questions or need further information, please feel free to reach out. Thank you in advance for your commitment to our shared goals.
        Best regards,
        <Manager Name>
        Program Manager
        investment@h7biocapital.com"""


        message.set_content(message_str)

        message["To"] = email
        message["From"] = loggedUser
        message["Subject"] = "H7 Accelerator Program Meeting Reminder "

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {"raw": encoded_message}
        send_message = (
            service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
        print(f'Message Id: {send_message["id"]}')
    except HttpError as error:
        print(f"An error occurred: {error}")
        send_message = None


    f = open('token.json')
    data = json.load(f)
    user_creds = data

    return send_message, user_creds
