import json
import boto3

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    input = json.loads(event['body'])
    print(input)
    
    userId = input['UserId']
    response = client.scan(TableName="RoomBookings")
    output = {}
    bookings  = []
    
    for i in range(len(response['Items'])):
        id = response['Items'][i]['UserId']['S']
        print(id)
        if id == userId:
            bookings.append(response['Items'][i])
            print(response['Items'][i])
    
    output[userId] = bookings
    
    print(output)
    
    
    
    return {
        'statusCode': 200,
        'body': json.dumps(output)
    }