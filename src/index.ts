import { Handler, Context, Callback } from 'aws-lambda';
import {GameLift, AWSError} from 'aws-sdk';

const GameLiftClient = new GameLift();
const FleetId = "fleet-0e5bff56-1fdb-48f2-90f8-2612342d7c3f";

/**
 * Search for available Game Sessions
 */
const searchAvailableGameSessions = async() => {
  return await GameLiftClient.searchGameSessions({
    FleetId,
    FilterExpression:"hasAvailablePlayerSessions=true"
  }).promise()
}

/**
 * creates new game session
 * @param maxPlayers - maximum amount of Players for new game session
 */
const createGameSession = async( maxPlayers:number ) => {
  return await GameLiftClient.createGameSession({
    MaximumPlayerSessionCount:maxPlayers,
    FleetId
  }).promise()
}

/**
 * creates new player session and returns it to the client
 * @param callback - callback
 * @param gameSessionId - gamesession id.
 * @param playerId - player id. If not defined -> will be randomly generated
 */
const createPlayerSessionWithCallback = async( gameSessionId:string, playerId:string, callback: Callback ) => {
  await GameLiftClient.createPlayerSession({
    GameSessionId: gameSessionId,
    PlayerId: playerId
  }).promise().then((data:any)=>{
    callback(undefined, data.PlayerSession);
  }).catch( (err:AWSError) => { callback(err); })
}

/**
 * Lambda Function Handler
 * @param event - input data. Required Params: maxPlayers:number & playerID:string
 * @param context - context
 * @param callback - function callback
 */
const handler: Handler = (event: any, context: Context, callback: Callback) => {
  
  // check if income params are provided
  if(!event.maxPlayers) { callback(new Error("Please provide a value for maxPlayers parameter")); return; }
  if(!event.playerID) { callback(new Error("Please provide a value for playerID parameter")); return; }

  // find any game sessions that have available players
  searchAvailableGameSessions().then((data:any) =>{

    // if no available game sessions
    if(!data.GameSessions.length)
      
      // create a new game session
      createGameSession( event.maxPlayers).then((json:any)=>{

        const {GameSessionId} = json;

        // create a player session
        createPlayerSessionWithCallback(GameSessionId, event.playerID, callback)
          
      }).catch( (err:AWSError) => { callback(err); })

    // create a player session
    else {
      const {GameSessionId} = data.GameSessions[0];
      createPlayerSessionWithCallback(GameSessionId, event.playerID, callback)
    }

  }).catch( (err:AWSError) => { callback(err); })

};

export { handler }