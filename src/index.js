const express = require('express')
// const total = require('./totalRecords.txt')

const app = express()
const bodyParser = require("body-parser");
const fs = require('fs').promises
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here...

let students=[]


app.get("/api/student",(req,res)=>{
   

    fs.readFile("./InitialData.js","utf8").then((data)=>{
        students = JSON.parse(data)
        res.json(students)
    })
})

app.get("/api/student/:id",(req,res)=>{
    fs.readFile("./InitialData.js").then((data)=>{
        students = JSON.parse(data)
    })
   
    let flag=false
    students.map((student)=>{
        if(student.id == req.params.id){
            flag=true
            res.status(200).json(student)
        }
    })
    if(flag===false){
        res.status(404).send("404: Not Found")
    }
})

let totalR ;
app.post("/api/student",(req,res)=>{
    
    fs.readFile("totalRecords.txt").then((total)=>{
       totalR = Number(total.toString())
    })
    console.log(totalR)

    
    fs.readFile("./InitialData.js").then((data)=>{
        students = JSON.parse(data)
        
    })
setTimeout(()=>{
    let {name,currentClass,division} = req.body
        if(name || currentClass || division){
            students.push({id:totalR+1,name:name,currentClass:currentClass,division:division})
            fs.writeFile("./InitialData.js",JSON.stringify(students)).then(()=>{
                res.json({id:totalR+1})
            })
        }
        else{
            res.status(400).send("id cannot use or this stident id deleted from record")
        }
    let r =totalR+1
    fs.writeFile("totalRecords.txt",JSON.stringify(r))
},1000)
    
})


app.put("/api/student/:id",(req,res)=>{
    let students=[]
    fs.readFile("./InitialData.js").then((data)=>{
        students = JSON.parse(data)
    }).catch((err)=>{
        console.log("ernnr",err)
    })
    let t=0
 setTimeout(()=>{
    students.map((student)=>{
        let reqId = Number(req.params.id)
        if(student.id == reqId){
            if(student.name != req.body.name){
                student.name = req.body.name;
                fs.writeFile("./InitialData.js",JSON.stringify(students)).then(()=>{
                    res.send("updated")
                })
                
            }else{
                t++
            }
        }else{
            t++
        }
        if(t==students.length) res.status(404).send("id not found / something went wrong")
    })

 },1000)
    
})

app.delete("/api/student/:id",(req,res)=>{
    fs.readFile("./InitialData.js").then((data)=>{
        students = JSON.parse(data)
    }).catch((err)=>{
        console.log("ernnr",err)
    })
    let t=0
    setTimeout(()=>{
        students.map((student)=>{
            let reqId = Number(req.params.id)
            if(student.id == reqId){
                let idx = students.indexOf(student)
                students.splice(idx,1)
                fs.writeFile("./InitialData.js",JSON.stringify(students))
                res.send("deleted")
            }else{
                t++
            }
            if(t==students.length) res.status(404).send("id not found / something went wrong")
        })
    },1000)

    // if(flag==true){
        
    // }
})



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   








// if(req.body.id===students.length+1){
//     students.push(req.body)
//     fs.writeFileSync("./InitialData.js",JSON.stringify(students))
//     res.json("record added")
// }
// else{
//     res.status(500).send("id cannot use or this stident id deleted from record")
// }