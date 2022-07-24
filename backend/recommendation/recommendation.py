from google.cloud import bigquery,storage

import json
import math
storage_client =storage.Client()
client = bigquery.Client()


def make_prediction(request):
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

  # Construct a BigQuery client object.

    request=request.get_json()
    
    days=request.get('days')
    people=request.get('people')
    rooms=request.get('rooms')


    sql = """
        SELECT
        *
        FROM
        ML.PREDICT(MODEL `tour_recommendation.output`,
            (
            SELECT
            *
            FROM
            `tour_recommendation.train`
            WHERE
            prediction IS NOT NULL
            AND days = {d} AND people={p} AND rooms={r}))
        """.format(d=days,p=people,r=rooms)

    # Start the query, passing in the extra configuration.
    query_job = client.query(sql)  # Make an API request.
    query_job.result()  # Wait for the job to complete.
    

    result=""
    for row in query_job:
        print(row)
        result=row

    responseBody=[]

    description={"3":"A safari is the most famous and sought-after type of holiday in Africa. Going on safari is widely considered the ultimate 'thing to do' in Africa. Usually, a safari in Africa implies a wildlife safari. ","2":" This mesmerizing Night Safari Package is available every day! From witnessing zebras, elephants, and giraffes interacting with each other. Don't miss the opportunity to watch the king of the jungle and fierce tigers roaming freely and approaching you as they please.","1":"It’s easy to knit this charming, fun mini safari park, with animals from tigers to tapirs and penguins to pandas. There’s a knitted mat to put all the creatures on, an arched gateway and an off-toad vehicle and a camper van to visit the park."}
    tours = {"3": "Safari", "2": "Night Safari", "1": "Mini Safari"}

    prediction = round(result['predicted_prediction'])

    print (prediction, result)

    for i in range(prediction, 0, -1):
        responseBody.append({"tourId": i, "tourName": tours[str(i)], "tourDescription":description[str(i)]})

    return ({"response" : responseBody}, 200, headers)

    
   


