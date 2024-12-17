require('dotenv').config()
const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
const url=process.env.MONGODB_URI



mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error:',error)
  })

const personSchema=new mongoose.Schema({
  name:{
    type:String,
    minLength:3,
    required:true
  },
  number:{
    type:String,
    validate:{
      validator:function(v){
        return /^\d{2,3}-\d{5,}$/.test(v)
      }
    },
    required:true
  }
})

personSchema.set('toJSON',{
  transform:(document,returnedObj) => {
    returnedObj.id=returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports=mongoose.model('Person',personSchema)