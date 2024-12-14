const express =require('express')
const morgan=require('morgan')
const app=express()

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



app.use(express.json())
app.use(morgan('tiny'))  



app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
})

app.get('/api/persons/:id',(req,res)=>{
    const id=req.params.id
    const person=persons.find(p=>p.id===id)
    if(!person){
        res.status(404).end()
    }else{
        res.json(person)
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id=req.params.id
    persons=persons.filter(p=>p.id!==id)
    res.status(204).end()
})

const generateId=()=>{
    const MAX=100
    const MIN=persons.length>0
    ?Math.max(...persons.map(p=>p.id))
    :0
    const id=Math.floor(Math.random()*(MAX-MIN+1)*MIN)
    return id
}

app.post('/api/persons',(req,res)=>{
    const body=req.body
    if(!body.name){
        return res.status(400).json({error:'Name  missing'})
    }
    if(!body.number){
        return res.status(400).json({error:'Number  missing'})
    }
    if(persons.find(p=>p.name===body.name)){
        return res.status(400).json({error:'Name must be unique'})
    }
    const person={
        name:body.name,
        number:body.number,
        id:generateId(),
    }

    persons=persons.concat(person)
    res.json(person)
})



const PORT=3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})