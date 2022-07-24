const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
exports.handler = async(event, context) => {
    try {
        const request = JSON.parse(event.body);
        const items = request["items"]
        const bookingID =  request["bookingID"]
        const data = await getDetils(bookingID)
        console.log("data", data)
        if(Object.keys(data).length === 0)
          await createItem(items,bookingID)
        else
        await updateFoodDetails(items,bookingID,data["Item"]["food_order_details"])
        for (let i=0; i<items.length; i++) {
            console.log("updating inventory" , items[i]["itemID"])
            const params = {
                TableName: "foodMenu",
                Key: {
                    "itemID": items[i]["itemID"]
                },
                UpdateExpression: "set quantity = quantity - :num",
                ExpressionAttributeValues: {
                    ":num": 1,
                },
                ReturnValues:"UPDATED_NEW"
            };
            await ddb.update(params).promise();
        }
        const allFoodOrders = await getDetils(bookingID)
        return allFoodOrders["Item"]["food_order_details"]
    }
    catch (err) {
        console.error(err);
    }
};

async function updateFoodDetails(items, bookingID,foodDetails)
{
    console.log("foodDetails" , foodDetails)
    const foodDetailsInfo = [
            ...foodDetails,
            ...items
        ];
        const params = {
        TableName: "user_food_orders",
            Key: {
        "booking_ID": bookingID
        },
        UpdateExpression: "SET food_order_details = :value",
        ExpressionAttributeValues: {
            ":value": [...foodDetailsInfo]
        }
    }
    return ddb.update(params).promise();
    
}

async function createItem(items, bookingID)
{
   const params = {
    TableName : 'user_food_orders',
    Item: {
     food_order_details: [...items],
     booking_ID :bookingID
  }
}
try {      
    await ddb.put(params).promise();
  } catch (err) {
    return err;
  }
    
}

async function getDetils(emailID){
  try {
         const params = {
        TableName: "user_food_orders",
            Key: {
        "booking_ID": emailID
    }
 }
 const data = await ddb.get(params).promise()
    return data
  } catch (err) {
    return err
  }
}