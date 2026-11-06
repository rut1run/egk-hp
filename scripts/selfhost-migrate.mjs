import {readdirSync,readFileSync} from 'node:fs'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import {localDatabase} from '../lib/runtime/storage.mjs'
const {sqlite}=localDatabase()
sqlite.exec('CREATE TABLE IF NOT EXISTS egk_migrations(name TEXT PRIMARY KEY, checksum TEXT NOT NULL)')
for(const name of readdirSync('drizzle').filter(n=>/^\d+.*\.sql$/.test(n)).sort()){
 const sql=readFileSync(join('drizzle',name),'utf8'),checksum=createHash('sha256').update(sql).digest('hex')
 const old=sqlite.prepare('SELECT checksum FROM egk_migrations WHERE name=?').get(name)
 if(old){if(old.checksum!==checksum)throw Error('Applied migration was edited: '+name);continue}
 sqlite.exec('BEGIN IMMEDIATE')
 try{sqlite.exec(sql);sqlite.prepare('INSERT INTO egk_migrations VALUES(?,?)').run(name,checksum);sqlite.exec('COMMIT');console.log('Applied '+name)}
 catch(error){sqlite.exec('ROLLBACK');throw error}
}
sqlite.close()
