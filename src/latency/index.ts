import { Handler, Context, Callback } from 'aws-lambda';
/**
 * Lambda Function Handler
 * @param event - input data.
 * @param context - context
 * @param callback - function callback
 */
const handler: Handler = (event: any, context: Context, callback: Callback) => {
    try { 
        const response = {
            status: "OK"
        }

        callback(undefined, response);
    }
    catch(err){ 
        callback(err.toString()); 
    }
}
export { handler }