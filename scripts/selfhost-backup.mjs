import {backup} from 'node:sqlite'
import {mkdirSync,cpSync,existsSync} from 'node:fs'
import {join,resolve} from 'node:path'
import {localDatabase,dataDirectory} from '../lib/runtime/storage.mjs'
const destination=resolve(process.argv[2]||join(dataDirectory(),'backups',new Date().toISOString().replace(/[:.]/g,'-')))
mkdirSync(destination,{recursive:true,mode:0o700})
const db=localDatabase()
try{
 await backup(db.sqlite,join(destination,'egk.sqlite'))
 const media=join(dataDirectory(),'media');if(existsSync(media))cpSync(media,join(destination,'media'),{recursive:true,errorOnExist:true,force:false})
 console.log('Backup saved: '+destination)
}finally{db.close()}
