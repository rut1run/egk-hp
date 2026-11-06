'use client'
import {useEffect,useState} from 'react'
import {LivePanel} from './live-panel'
import {useI18n} from '@/components/providers/i18n-provider'
import type {LiveFeedState,Tournament} from '@/lib/types'
export function LiveUpdates({tournament,initial}:{tournament:Tournament;initial:LiveFeedState}){
 const [feed,setFeed]=useState(initial),{t,locale}=useI18n()
 useEffect(()=>{let active=true;const update=async()=>{try{const r=await fetch(`/api/tournaments/${tournament.slug}/live`,{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('feed');const value=await r.json() as LiveFeedState;if(active)setFeed(value)}catch{if(active)setFeed(previous=>previous.connection==='not_connected'?previous:{...previous,connection:'stale'})}};const timer=setInterval(update,15000);return ()=>{active=false;clearInterval(timer)}},[tournament.slug])
 return <LivePanel tournament={tournament} feed={feed} t={t} locale={locale}/>
}
