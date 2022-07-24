const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


async function getItem(params){
  try {
    const data = await docClient.get(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
      const request = JSON.parse(event.body);
     const params = {
  TableName : 'users',
  Key: {
    email_id: request['email_id']
  }
}
    const data = await getItem(params)
    const securityDetails = data["Item"]["security_details"]
    //return {body: event}
    const question1 = securityDetails.find((sercurityDetail)=>{
        return request['security_details'][0]['securityQuestion'] === sercurityDetail['securityQuestion'];
    });
    if (question1 && question1['securityAnswer'] === request['security_details'][0]['securityAnswer']) {
        const question2 = securityDetails.find((sercurityDetail)=>{
            return request['security_details'][1]['securityQuestion'] === sercurityDetail['securityQuestion'];
        });
        if (question2 && question2['securityAnswer'] === request['security_details'][1]['securityAnswer']) {
            const question3 = securityDetails.find((sercurityDetail)=>{
                return request['security_details'][2]['securityQuestion'] === sercurityDetail['securityQuestion'];
            });
            if (question3 && question3['securityAnswer'] === request['security_details'][2]['securityAnswer']) {
                return {
                    message: 'success',
                    status: 200,
                    valid: true,
                    key:data["Item"]['cipher']
                }
            } else {
                return {
                    message: 'failed',
                    status: 200,
                    valid: false
                }
            }
        } else {
            return {
                message: 'failed',
                status: 200,
                valid: false
            }
        }
    } else {
        return {
            message: 'failed',
            status: 200,
            valid: false
    }
}
  } catch (err) {
    return { error: err }
  }
}