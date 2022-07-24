import boto3
import json
def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table("customer_security_data")
    user_data = json.loads(event['body'])
    email = user_data['email_id']
    res = table.get_item(Key={'email_id': email})
    if "Item" in res:
        return({
         "status": bool(1)  
        })
    else:
        return({
         "status": bool(0)   
        })