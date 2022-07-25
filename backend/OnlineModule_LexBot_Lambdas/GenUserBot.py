import json
import boto3

client = boto3.client('dynamodb')

def check_value(res):
    
    output = {}
    
    for i in range(len(res)-1):
        key = res['Items'][i]['Room_Type']['S']
       
        if key == 'King':
            output['King'] = res['Items'][i]['Current']['N'] + ' Rooms'
        elif key == 'Queen':
            output['Queen'] =  res['Items'][i]['Current']['N'] + ' Rooms'
        elif key == 'Deluxe':
            output['Deluxe'] =  res['Items'][i]['Current']['N'] + ' Rooms'
            
    
    print(output)
    return output
    
    
def resolveLinks(res):
    output = {}
    
    for i in range(0,len(res['Items'])):
        key = res['Items'][i]['Destination']['S']
        link = res['Items'][i]['Link']['S']
        output[key] = link
        
    
    print(output) 
    return output
            
            
def close(message):
        return {
            "sessionState": {
                "sessionAttributes": {
                  "string": "string"
                },
                "dialogAction": {
                  "type": "Close"
                },
                "intent": {
                  "confirmationState": "Confirmed",
                  "name": "Get_Avail",
                  "state": "Fulfilled"
                }
              },
              "messages": [
                {
                  "contentType": "PlainText",
                  "content": message
                }
              ]
            }
            

def lambda_handler(event, context):
    
    print(event)
    
    intent =  event['sessionState']['intent']['name']
    print(intent)
    
    if intent == 'Get_Avail':
        res = client.scan(TableName="RoomAvailability")
        message = check_value(res)
        availability = "The current availability is " + "King Sized rooms : " + message['King'] + " \n, Queen sized rooms : " + message['Queen'] + "\n  ,and Deluxe sized rooms : " + message['Deluxe']
        return close(availability)
    elif intent == 'Navigation':
        res = client.scan(TableName='NavigationLinks')
        print(res)
        message =  resolveLinks(res)
        navigation = "Please open these links for accessing the specific service : " 
        for (key, value) in message.items():
            navigation = navigation + "<a href=\"" + value + "\">" + key + "</a>" + "   \n"
        return close(navigation)
