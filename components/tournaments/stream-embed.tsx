'use client'
import {useEffect,useState} from 'react'
import type {StreamLink} from '@/lib/types'
export function StreamEmbed({stream}:{stream:StreamLink}){
 const [host,setHost]=useState('');useEffect(()=>setHost(location.hostname),[])
 let src='';try{const u=new URL(stream.url);if(stream.platform==='youtube'&&['youtube.com','www.youtube.com','youtu.be'].includes(u.hostname)){const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')??u.pathname.match(/^\/(?:live|embed)\/([\w-]+)/)?.[1]??'';if(/^[\w-]{11}$/.test(id))src=`https://www.youtube.com/embed/${id}`}if(stream.platform==='twitch'&&host&&['twitch.tv','www.twitch.tv'].includes(u.hostname)){const channel=u.pathname.slice(1);if(/^[a-zA-Z0-9_]{3,25}$/.test(channel))src=`https://player.twitch.tv/?channel=${channel}&parent=${encodeURIComponent(host)}&autoplay=false`}}catch{}
 return src?<iframe className="aspect-video w-full border" src={src} title={stream.label} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:null
}
