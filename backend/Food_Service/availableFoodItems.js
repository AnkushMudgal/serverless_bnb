const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


const params = {
  TableName : 'foodMenu'
}

async function listItems(){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  
 try {
    const data = await listItems()
    const allItems = data["Items"]
    const availableItems = allItems.filter(item => item.available)
    return {body : (availableItems) }
  } catch (err) {
    return { error: err }
  }
}