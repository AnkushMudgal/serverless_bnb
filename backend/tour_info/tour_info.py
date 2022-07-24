from google.cloud import language_v1
from google.cloud import storage
import csv
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore



def hello_world(request):
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    
    
    try:
        cred = credentials.Certificate("./credentials.json")
        firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://robotic-insight-340814.firebaseio.com'
        })
        print("in try block")
    except:
        print("in exception")
    

    
    

    request=request.get_json()
    
    user=request.get('userId')
    
    db = firestore.client()
    users_ref = db.collection(u'tourInfo')
    docs = users_ref.stream()

    tourList=[]
    for blob in docs:
        
        print("iterating over docs")
        userId=blob.get('userId')

        if userId==user:
            tourId=blob.get('tourId')
            tourName=blob.get('tourName')
            startTime=blob.get('currentTime')
            endTime=blob.get('endTime')
            tourList.append({"tourId":tourId,"tourName":tourName,"userId":userId ,"startTime":startTime,"endTime":endTime})
       
        
       
    return ({"response" : tourList}, 200, headers)
