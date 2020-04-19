import { Handler, Context, Callback } from 'aws-lambda';
import * as actions from './service';
/**
 * Lambda Function Handler
 * @param event - input data.
 * @param context - context
 * @param callback - function callback
 */
const handler: Handler = (event: any, context: Context, callback: Callback) => {

    if(!event.action) { callback(new Error("Please provide an action type parameter.")); return; }
  
    try { 
        actions[event.action](event, context, callback)
    }
    catch(err){ 
        callback(err.toString()); 
    }
}
export { handler }