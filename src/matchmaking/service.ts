import { Context, Callback } from 'aws-lambda';
import {GameLift, AWSError} from 'aws-sdk';

const GameLiftClient = new GameLift();
const MatchmakingConfigName="free-for-all-config"

export function startMatchmaking(event: any, context: Context, callback: Callback){
    if(!event.players) { callback(new Error("Please provide 'players' array parameter")); return; }

    const players = JSON.parse(event.players);

    
    const params: GameLift.StartMatchmakingInput = {
        ConfigurationName: MatchmakingConfigName, /* required */
        Players: players
    }

    GameLiftClient.startMatchmaking(params).promise().then((data:any)=>{
        const response = {
            TicketId: data.MatchmakingTicket.TicketId,
            Status: data.MatchmakingTicket.Status,
            DataString: JSON.stringify(data)
        }
        callback(undefined, response);
    }).catch( (err:AWSError) => { callback(err); })
}

export function describeMatchmaking(event: any, context: Context, callback: Callback){
    
    if(!event.playerID) { callback(new Error("Please provide 'playerID' parameter")); return; }
    if(!event.matchmakingTicketID) { callback(new Error("Please provide 'matchmakingTicketID' parameter")); return; }

    const params: GameLift.DescribeMatchmakingInput = {
        TicketIds:[event.matchmakingTicketID]
    }

    GameLiftClient.describeMatchmaking(params).promise().then((data:any)=>{
        const response = {
            TicketId: data.TicketList.length ? data.TicketList[0].TicketId : '',
            Status: data.TicketList.length ? data.TicketList[0].Status : '',
            IpAddress: '',
            Port: '',
            PlayerSessionID:'',
            DataString: JSON.stringify(data)
        }
        if(data.TicketList[0].GameSessionConnectionInfo){
            response.IpAddress = data.TicketList[0].GameSessionConnectionInfo.IpAddress
            response.Port = String(data.TicketList[0].GameSessionConnectionInfo.Port)
            response.PlayerSessionID = data.TicketList[0].GameSessionConnectionInfo.MatchedPlayerSessions.find((item:GameLift.MatchedPlayerSession)=>item.PlayerId === event.playerID).PlayerSessionId
        } 
        callback(undefined, response);
    }).catch( (err:AWSError) => { callback(err); })
}

export function cancelMatchmaking(event: any, context: Context, callback: Callback){

    if(!event.matchmakingTicketID) { callback(new Error("Please provide 'matchmakingTicketID' parameter")); return; }

    const params: GameLift.StopMatchmakingInput = {
        TicketId:event.matchmakingTicketID
    }

    GameLiftClient.stopMatchmaking(params).promise().then((data:any)=>{
        const response = {
            Status: 'OK'
        }
        callback(undefined, response);
    }).catch( (err:AWSError) => { callback(err); })
}