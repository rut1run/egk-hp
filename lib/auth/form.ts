/** Limit actual streamed bytes, including requests without Content-Length. */
export async function boundedForm(request: Request, maxBytes: number): Promise<FormData> {
 if(Number(request.headers.get('content-length')??0)>maxBytes)throw new Error('Request too large')
 const reader=request.body?.getReader();if(!reader)return new FormData()
 const chunks:Uint8Array[]=[];let size=0
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('Request too large')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0
 for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
 return new Response(bytes,{headers:{'Content-Type':request.headers.get('content-type')??'application/x-www-form-urlencoded'}}).formData()
}
