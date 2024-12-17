const Person=require('./models/person')
const express =require('express')
const morgan=require('morgan')
const cors= require('cors')

const app=express()
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny'))  
app.use(express.json())


let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons',(req,res)=>{
    Person.find({})
        .then(result=>res.json(result))    
})

app.get('/info',(req,res)=>{
    Person.countDocuments({})
    .then(count=>
        res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`)
    )
    .catch(error=>{
        res.status(500).send({error:'problem handing counting doc'})
    })
})

app.get('/api/persons/:id',(req,res,next)=>{
    const id=req.params.id
    Person.findById(id)
        .then(p=>{
            if(p){
                res.json(p)
            }else{
                res.status(404).end()
            }
        })
        .catch(error=>next(error))
})

app.delete('/api/persons/:id',(req,res,next)=>{
    const id=req.params.id 
    Person.findByIdAndDelete(id)
        .then(result=>res.status(204).end())
        .catch(error=>next(error))
})

const generateId=()=>{
    const MAX=100
    const MIN=persons.length>0
    ?Math.max(...persons.map(p=>p.id))
    :0
    const id=Math.floor(Math.random()*(MAX-MIN+1)*MIN)
    return id
}

app.post('/api/persons',(req,res,next)=>{
    const body=req.body
    if(!body.name){
        return res.status(400).json({error:'Name  missing'})
    }
    if(!body.number){
        return res.status(400).json({error:'Number  missing'})
    }

    Person.findOne({name:body.name})
        .then(existingP=>{
            if(existingP){
                console.log(`${body.name} exist`);
                
                const id=existingP.id
                const p={
                    name:body.name,
                    number:body.number
                }
                Person.findByIdAndUpdate(
                    id,
                    p,
                    {new:true, runValidators:true, context:'query'})
                    .then(updatedP=>res.json(updatedP))
                    .catch(error=>next(error))
            }else{
                const person=new Person({
                    name:body.name,
                    number:body.number,
                })
                person.save()
                    .then(savedPerson=>res.json(savedPerson))
                    .catch(error=>next(error))
            }   
        })
})

// app.put('/api/persons/',(req,res,next)=>{
//     const{name,number}=req.body
//     Person.findOne({name:name})
//         .then(existingP=>{
//             if(existingP){
//                 const id=existingP.id
//                 const updatedPerson={name,number}
//                 Person.findByIdAndUpdate(
//                     id,
//                     {number},
//                     {new:true}
//                     )
//                     .then(p=>res.json(p))
//                     .catch(error=>next(error))
//             }
//         })
// })

const errorhandler=(error,req,res,next)=>{
    console.error(error.message)
    if(error.name==='CastError'){
        return res.status(400).json({error:'malformatted id'})
    }else if(error.name==='ValidationError'){
        return res.status(400).json({error:error.message})
    }
    next(error)
}
app.use(errorhandler)


const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})