import {getTournament,getLiveFeed} from '@/lib/data'
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params,t=await getTournament(slug);if(!t)return new Response('Not found',{status:404});return Response.json(await getLiveFeed(t),{headers:{'Cache-Control':'no-store'}})}
