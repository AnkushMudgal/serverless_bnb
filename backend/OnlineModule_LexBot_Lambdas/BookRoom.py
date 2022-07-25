import json
import boto3
from datetime import datetime

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
    
    input = json.loads(event['body'])
    print(input)
    
    
    checkin_date =input['CheckInDate']
    checkin_date_format = datetime.strptime(checkin_date, '%Y-%m-%d')
    print(checkin_date_format)
    checkin_time =input['CheckInTime']
    room_type =input['RoomType']
    checkout_date =input['CheckOutDate']
    checkout_date_format = datetime.strptime(checkout_date, '%Y-%m-%d')
    print(checkout_date_format)
    print(checkout_date_format > checkin_date_format)
    user_id =input['UserId']
    
    res = client.scan(TableName="RoomAvailability")
    availability = check_value(res)
    avail = int(availability[room_type])
    
    if avail > 0 and checkout_date_format > checkin_date_format:
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
            update_item['Current'] = {'N': str(avail - 1)}
            if room_type == 'Deluxe':
                update_item['Max'] = {'N': '5'}
            else:
                update_item['Max'] = {'N' : '10'}
            updated = client.put_item(TableName='RoomAvailability', Item=update_item)
    
        success = {'Status' : "Booked", 
                    'BookingId' : bookingId, 
                    'UserId' : user_id, 
                    'CheckInDate' : checkin_date , 
                    'CheckInTime' : checkin_time, 
                    'CheckOutDate': checkout_date, 
                    'RoomType' : room_type
            
        }
        print(success)
    
        return {
            'statusCode': 200,
            'body': json.dumps(success),
            'headers': {'Content-Type': 'application/json'}
        }
        
    else:
        return {
            'statusCode': 400,
            'body': json.dumps("Failed: Either Requested room is not available or the dates are not valid"),
            'headers': {'Content-Type': 'text/plain'}
        }
                
