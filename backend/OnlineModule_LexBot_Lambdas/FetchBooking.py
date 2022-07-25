import json
import boto3

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    
    input = json.loads(event['body'])
    print(input)
    
    bookingId = input['BookingId']
    key = {}
    key['BookingId'] = {'S' : bookingId}
    response = client.get_item(TableName="RoomBookings", Key=key)
    
    print(response)
    
    
    
    return {
        'statusCode': 200,
        'body': json.dumps(response['Item'])
    }
