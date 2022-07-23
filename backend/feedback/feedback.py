from google.cloud import language_v1
from google.cloud import storage
import csv
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """

    cred = credentials.Certificate("./service-account-file.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://robotic-insight-340814.firebaseio.com'
    })


    db = firestore.client()
    users_ref = db.collection(u'feedback')
    docs = users_ref.stream()

        
    storage_client = storage.Client()
    blobs_list = storage_client.list_blobs(bucket_or_name='feedback_pool')

    
    bucket = storage_client.get_bucket('feedback_pool')
    
    count = dict()
    blobs = bucket.list_blobs()
    room_sentiment_dict=dict()
    sentiment_dict=dict()
    
    overall_feedback_score=0
    for blob in docs:
        
        # content = json.loads(blob.download_as_string())
        print("iterating over docs")
        
    
        room=blob.get('rooms')
        text_content=blob.get('feedback')

        
        
        # get count of rooms
        if(room in count):
            count[room] += 1
        else:
            count[room] = 1
        
       
        client = language_v1.LanguageServiceClient()

        # Available types: PLAIN_TEXT, HTML
        type_ = language_v1.Document.Type.PLAIN_TEXT

        
        language = "en"
        document = {"content": text_content, "type_": type_, "language": language}

        # Available values: NONE, UTF8, UTF16, UTF32
        encoding_type = language_v1.EncodingType.UTF8

        response = client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})
        # Get overall sentiment of the input document

        feedback_score=response.document_sentiment.score
        # print(u"feedback score: {}".format(feedback_score))
        
        if(room in room_sentiment_dict):
            score=room_sentiment_dict[room]
            room_sentiment_dict[room]= score+feedback_score
        else:
            room_sentiment_dict[room]= feedback_score
        
        
    for key in room_sentiment_dict:
        score=room_sentiment_dict[key]
        avg=score/count[key]
        room_sentiment_dict[key]=avg
    
    # avg_feedback_score=overall_feedback_score/count
    # sentiment_dict[1]=avg_feedback_score
    # print(u"avg feedback score: {}".format(avg_feedback_score))
    
    header = ['RoomNo', 'SentimentScore']
    new_csv_filename='/tmp/sentiments.csv'
    with open(new_csv_filename, 'w', newline='') as file: #opening the file in write mode
            writer = csv.writer(file)
            writer.writerow(header)
            for x in room_sentiment_dict:
                # print(x)
                # print(room_sentiment_dict[x])
                row_ele=[x,room_sentiment_dict[x]]
                writer.writerow(row_ele)

        
    bucket = storage_client.get_bucket('feedback_score')
    blob = bucket.blob(new_csv_filename)
    with open(new_csv_filename, 'rb') as f:  # here we open the file with read bytes option
        blob.upload_from_file(f)   # upload from file is now uploading the file as bytes
    blob.make_public()
    # generate a download url and return it
    # print(blob.public_url)


    
    return f'Hello World!'
