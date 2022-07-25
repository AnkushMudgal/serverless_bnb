import json
import boto3
from datetime import datetime
from botocore.vendored import requests

client = boto3.client('dynamodb')
lambda_client = boto3.client('lambda')

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
    
def validateuser(user_id):
    request_packet = {"email_id":"kexor30989@agrolivana.com"}
    headers = {"Content-Type": "application/json; charset=utf-8"}
    res = requests.post(url="https://d6qscqxq3zclad34qqpd7qhhzq0qmhhg.lambda-url.us-east-1.on.aws/", data=json.dumps(request_packet), headers=headers)
    status = json.loads(res.text)
    print(status['status'] == True)
    
    return status['status']
    
    
def validate_boooking(bookingId, user_id):
    request_packet = {"BookingId": bookingId.upper() }
    print(request_packet)
    headers = {"Content-Type": "application/json; charset=utf-8"}
    print("Making Booking ID valid call")
    res = requests.post(url="https://tlxhvrbotm4szlczxsgien72ki0pqack.lambda-url.us-east-1.on.aws/", data=json.dumps(request_packet), headers=headers)
    print("call made")
    print(res)
    status = json.loads(res.text)
    print(status)
    
    if len(status):
        test_id = status['BookingId']['S']
        test_id = test_id.lower()
        test_user = status['UserId']['S']
        print(test_id + " " + test_user)
        print(bookingId + " " + user_id)
        if bookingId == test_id and user_id == test_user:
            return True
        else:
            return False
    else:
        return False
    
    
    
    
def get_day_difference(later_date, earlier_date):
    later_datetime = dateutil.parser.parse(later_date).date()
    earlier_datetime = dateutil.parser.parse(earlier_date).date()
    return abs(later_datetime - earlier_datetime).days
    
    
def close(message, intent):
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
                  "name": intent,
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
            
            
def book_room(event, intent, user_id):
    slots =  event['sessionState']['intent']['slots']
    checkin_date = slots['CheckInDate']['value']['resolvedValues'][0]
    checkin_time = slots['CheckInTime']['value']['resolvedValues'][0]
    room_type = slots['RoomType']['value']['resolvedValues'][0]
    checkout_date = slots['CheckOutDate']['value']['resolvedValues'][0]
    
    checkin_date_format = datetime.strptime(checkin_date, '%Y-%m-%d')
    checkout_date_format = datetime.strptime(checkout_date, '%Y-%m-%d')
    print(checkin_date_format)
    print(checkout_date_format)
    print(checkout_date_format > checkin_date_format)
    print(checkin_date_format > checkout_date_format)
    print(room_type)
        
    res = client.scan(TableName="RoomAvailability")
    avail = check_value(res)
    room_avail = avail[room_type]
    print(room_avail)
    
    if int(room_avail) > 0  and checkout_date_format > checkin_date_format:
        item = {}
        dateTimeObj = datetime.now()
        dateObj = dateTimeObj.date()
        timeObj = dateTimeObj.time()
        bookingId = "BB" + str(timeObj.minute) + str(dateObj.day) + str(dateObj.month) + str(dateObj.year)
        print(bookingId)
        item['BookingId'] = {'S' : bookingId}
        item['CheckInDate'] = {'S': checkin_date}
        item['CheckInTime'] = {'S' : checkin_time}
        item['RoomType'] = {'S': room_type}
        item['UserId'] = {'S': user_id}
        item['CheckOutDate'] = {'S' : checkout_date}
        response = client.put_item(TableName='RoomBookings', Item= item)
        
        
        
        if int(response['ResponseMetadata']['HTTPStatusCode']) == 200:
            update_item = {}
            update_item['Room_Type'] = {'S': room_type}
            avail_val = int(room_avail)
            update_item['Current'] = {'N': str( avail_val - 1)}
            if room_type == 'Deluxe':
                update_item['Max'] = {'N': '5'}
            else:
                update_item['Max'] = {'N' : '10'}
        
            updated = client.put_item(TableName='RoomAvailability', Item=update_item)

        return close("Booked with Booking ID : " + bookingId, intent)
    
    else:
        return close("Booking Failed: Either the dates are in valid or the rooms requested are not available." , intent)
        
      
      
def order_food(event, intent, user_id):
    
    slots =  event['sessionState']['intent']['slots']
    bookingId = slots['BookingId']['value']['resolvedValues'][0]
    
    validId = validate_boooking(bookingId, user_id)
    if validId:
        print("Request is Valid")
    else:
        return close("Booking Failed : Given Booking ID does not match the given User.", intent)
    
    food = []
    
    foodItems = slots['FoodItems']['values']
    
    for i in foodItems:
        if len(i['value']['resolvedValues']):
            food.append(i['value']['resolvedValues'][0])

    
    print(food)
    
    headers = {"Content-Type": "application/json; charset=utf-8"}
    response = requests.get(url="https://behncx2zg3xztvkq7jqwjq5ou40nuwsy.lambda-url.us-east-1.on.aws/", headers=headers)
    
    available = json.loads(response.content)
    print(available['body'])
    
    order_items= []
    
    for i in range(len(available['body'])):
        item = available['body'][i]
        name = item['name']
        price = item['price']
        item_id = item['itemID']
        quantity = item['quantity']
        print(item)
        if name in food and int(quantity) > 0:
            order_item = {}
            order_item['itemID'] = item_id
            order_item['itemName'] = name
            order_item['price'] = price
            order_items.append(order_item)
            
        
        
    final_order = {}
    final_order['bookingID'] =bookingId
    final_order['items'] = order_items
    
    print(json.dumps(final_order))
    
    
    res = requests.post(url='https://hwadzlt7fjy6kqinqunbxilm3a0skdda.lambda-url.us-east-1.on.aws/', data=json.dumps(final_order), headers=headers)
    status = json.loads(res.text)
    print(status)
    
    if len(status) > 0:
        message = "Your order for food items "
        for i in status:
            message = message + i['itemName'] + " ,"
        
        message = message +  " is successfully placed. Other requested items may not have been available."
        return close(message, intent)
    else:
        return close("Booking Failed: Food items are not available." , intent)
    
    

def lambda_handler(event, context):
    
    print(event)
    validateuser('testid')
    
    intent =  event['sessionState']['intent']['name']
    user_id = event['sessionState']['intent']['slots']['UserId']['value']['resolvedValues'][0]
    
    print(intent)
    
    valid = validateuser(user_id)
    
    if intent == 'BookRoom' and valid == True:
        return book_room(event, intent, user_id)
    elif intent == 'OrderFood' and valid == True:
        return order_food(event, intent, user_id)
            
    
    return close("Something")