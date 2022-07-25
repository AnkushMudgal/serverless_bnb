import json
import boto3

client = boto3.client('dynamodb')

def check_value(res):
    
    output = {}
    
    for i in range(len(res)-1):
        key = res['Items'][i]['Room_Type']['S']
       
        if key == 'King':
            output['King'] = res['Items'][i]['Current']['N']
        elif key == 'Queen':
            output['Queen'] =  res['Items'][i]['Current']['N']
        elif key == 'Deluxe':
            output['Deluxe'] =  res['Items'][i]['Current']['N']
            
    
    print(output)
    return output
    

def lambda_handler(event, context):
    
    print(event)
    res = client.scan(TableName="RoomAvailability")
    availability = check_value(res)
    
    return {
        'statusCode': 200,
        'body': json.dumps(availability)
    }
