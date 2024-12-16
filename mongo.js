const mongoose=require(`mongoose`)

const password=process.argv[2]

const url=`mongodb+srv://wwy880703:${password}@cluster0.nyjq2.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

//strictQuery true is default
mongoose.set("strictQuery",false)

mongoose.connect(url)

const phonebookSchema=new mongoose.Schema({
    name:String,
    number:String,
})

const Person=mongoose.model('Person',phonebookSchema)

const person=new Person({
    name:process.argv[3],
    number:process.argv[4],
})
person.save().then(result=>{
    console.log(`added +${result.name} to phonebook`)
})

Person
    .find({})
    .then(result=>{
        result.forEach(person=>{
            console.log(person)
        })
        mongoose.connection.close()
    })