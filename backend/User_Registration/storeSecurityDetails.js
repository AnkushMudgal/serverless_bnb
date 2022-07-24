const aws = require("aws-sdk");
const dynamodb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
exports.handler = async (event) => {
  try {
    const result = await addRecord(event.body);
    const response = {
      statusCode: "200",
      body: "Success",
    };
    return response;
    
  } catch (error) {
    const response = {
      statusCode: "500",
      body: error.message,
    };
    return response;
  }
};
const addRecord = async (body) => {
  const data = JSON.parse(body)
  try {
    const params = {
      TableName: "customer_security_data",
      Item: {
              "email_id": {
                "S": data.email_id
            },
              "security_details": {
                  "L": [
                    {
                      "M": {
                          "securityQuestion": {
                            "S": data.security_object[0].securityQuestion
                          },
                          "securityAnswer": {
                            "S": data.security_object[0].securityAnswer
                          }
                      }
                    },
                    {
                      "M": {
                          "securityQuestion": {
                            "S": data.security_object[1].securityQuestion
                          },
                          "securityAnswer": {
                            "S": data.security_object[1].securityAnswer
                          }
                      }
                    },
                    {
                      "M": {
                          "securityQuestion": {
                            "S": data.security_object[2].securityQuestion
                          },
                          "securityAnswer": {
                            "S": data.security_object[2].securityAnswer
                          }
                      }
                    }
                  ]
            }
      }
    }
    const result = await dynamodb.putItem(params).promise();
    return result;
  } catch (error) {
    throw error;
  }
}