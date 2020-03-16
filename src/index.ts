import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB, AWSError } from 'aws-sdk';

const DynamoDBClient = new DynamoDB.DocumentClient();
const DBTable = "prod-eventLogs";

/**
 * puts the data into Dynamo DB
 * @param eventLog  - stringified JSON data object
 */
const putDataIntoDynamoDB = async(eventLog:any) => {
  return await DynamoDBClient.put({
    TableName: DBTable,
    Item: eventLog
  }).promise()
}

/**
 * Lambda Function Handler
 * @param event - input data. Required Params: eventLog:string
 * @param context - context
 * @param callback - function callback
 */
const handler: Handler = (event: any, context: Context, callback: Callback) => {
  
  // check if income params are provided
  if(!event.eventLog) { callback(new Error("Please provide a value for eventLog parameter")); return; }
  try{ 
    // parse income eventLog into JSON
    const eventLog = JSON.parse(event.eventLog); 

    putDataIntoDynamoDB(eventLog).then((data:DynamoDB.DocumentClient.PutItemOutput) => { 
      callback(undefined,data); 
    }).catch((err:AWSError) => {
      callback(err);
    })

  }catch(e){ callback(new Error("eventLog parameter has to be a stringified JSON object")); return; }

};

export { handler }