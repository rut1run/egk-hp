import type { ComponentProps } from 'react'

/** Use browser navigation; it also works before client JavaScript has loaded. */
export default function Link({href,prefetch:_prefetch,replace:_replace,scroll:_scroll,...props}:Omit<ComponentProps<'a'>,'href'> & {href:string;prefetch?:boolean|null;replace?:boolean;scroll?:boolean}) {
 return <a href={href} {...props}/>
}
