const mongoose = require('mongoose');
const redis=require('redis');
const { promisify } =require('util');
const exec=mongoose.Query.prototype.exec;
const client = redis.createClient({ url:process.env.redis_url });
const hget=promisify( client.hGet );
mongoose.Query.prototype.cache=function(hashKey,name){
    this.useCache=true;
    this.hashKey=hashKey;
    this.name=name;
    return this;
};
mongoose.Query.prototype.exec=async function(){
    if ( ! this.useCache ){
        return exec.apply(this, arguments);
    };
    const query={ ... this.getQuery() , name:this.name };
    const key=JSON.stringify(query);
    const cache=await hget(this.hashKey,key);
    if ( cache ){
        const data=JSON.parse( cache );
        if ( Array.isArray( data ) ){
            console.log(data);
            return data.map( (doc) => new this.model(doc) );
        }else {
            return new this.model(data);
        };
    };
    const result=await exec.apply(this, arguments);
    client.hSet(this.hashKey,key,JSON.stringify(result));
    return result;
};