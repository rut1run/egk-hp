import {z} from 'zod'
const localized=z.object({ja:z.string().min(1).max(300),en:z.string().max(300).optional()})
const n=z.number().int().min(0).max(1000000)
export const resultsSchema=z.discriminatedUnion('game',[
 z.object({game:z.literal('fortnite'),recordedAt:z.string().datetime({offset:true}),standings:z.array(z.object({rank:n.min(1),team:z.string().min(1).max(100),points:n,eliminations:n,matches:n})).max(200)}),
 z.object({game:z.literal('valorant'),recordedAt:z.string().datetime({offset:true}),matches:z.array(z.object({id:z.string().min(1).max(100),round:localized,teamA:z.string().min(1).max(100),teamB:z.string().min(1).max(100),maps:z.array(z.object({name:z.string().min(1).max(100),scoreA:n,scoreB:n})).min(1).max(9),winner:z.enum(['A','B']).optional()})).max(100)})
])
export function parseResults(raw:string,game:string){const value=resultsSchema.parse(JSON.parse(raw));if(value.game!==game)throw Error('game');if(value.game==='fortnite'&&new Set(value.standings.map(x=>x.team)).size!==value.standings.length)throw Error('teams');if(value.game==='valorant'&&new Set(value.matches.map(x=>x.id)).size!==value.matches.length)throw Error('matches');return value}
export function feedState(record:{receivedAt:number;sourceTimestamp:number;results:any}|null,at=Date.now()){
 if(!record)return {connection:'not_connected' as const}
 return {connection:at-record.receivedAt<90000&&at-record.sourceTimestamp<90000?'connected' as const:'stale' as const,lastUpdatedAt:new Date(record.sourceTimestamp).toISOString(),results:record.results}
}
