const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


async function getDetils(bookingID){
  try {
         const params = {
        TableName: "user_food_orders",
            Key: {
        "booking_ID": bookingID
    }
  }
    const data = await docClient.get(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  
 try {
    const request = JSON.parse(event.body);
    const bookingID = request["bookingID"]
     const foodDetails = await getDetils(bookingID)
     if(Object.keys(foodDetails).length === 0)
      return {}
      return foodDetails["Item"]["food_order_details"]
  } catch (err) {
    return { error: err }
  }
}