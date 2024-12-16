require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
const url=process.env.MONGODB_URI



mongoose.connect(url)
    .then(result=>{
        console.log(`Connected to MongoDB`)
       
        
    })
    .catch(error=>{
        console.log('error:',error);
        
    })

const personSchema=new mongoose.Schema({
    name:String,
    number:String,
})

personSchema.set('toJSON',{
    transform:(document,returnedObj)=>{
        returnedObj.id=returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports=mongoose.model('Person',personSchema)