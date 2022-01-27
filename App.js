const express=require('express');
const http=require('http')
const PORT=9999;
const app=express();
const connectDB=require('./config/db')
const httpServer=http.createServer(app);
const {Server}=require("socket.io")
const io=new Server(httpServer)
const postSchema=require('./db/postSchema')
connectDB()
app.get('/',(req,res)=>{
    
    res.sendFile(__dirname+'/index.html')
})
io.on('connection',(socket)=>{
    postSchema.find({},(err,data)=>{
        socket.emit('get post',data)
    })
    console.log("A user Conneted");
    socket.on('message',(mesg)=>{
        const date=new Date();
        let data=new postSchema({post:mesg,date:date})
        data.save((err)=>{
            if(err){
                console.log(err);
            }
            else{
                 let data1={mesg:mesg,date:date}
                io.emit('chat message',data1)
            }
            
        })
    })
 
})
httpServer.listen(PORT,(err)=>{
    if(err) throw err;
    else{
        console.log(`Work on ${PORT}`);
    }
})
