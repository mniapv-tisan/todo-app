const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const { authmiddleware } = require("./middleware")
const { userModel , todoModel } = require("./model")

app.use(express.json());

app.post("/signup",async function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username
    });

    if(userExists){
        res.status(403).json({
            message:"username is taken"
        })
        return;
    }
    
    const newUser = await userModel.create({
        username: username,
        password:password
    })

    res.json({
        id:newUser._id
    })

})

app.post("/signin",async function(req,res){

   const username = req.body.username;
   const password = req.body.password;

   const findUser = await userModel.findOne({
    username,
    password
   });

   if(!findUser){
       res.json({
        message:"Wrong username or password"
       })
       return
   }

   const token = jwt.sign({
       userId:findUser._id
   },"helloworld123")


   res.json({
     token:token
   });

})

app.post("/todos",authmiddleware,async function(req,res){
     const userId = req.userId
     const title = req.body.title;
     const description = req.body.description;

     await todoModel.create({
        userId,
        title,
        description
     })

     res.status(200).json({
        message:"Todo posted successfully"
     })
})


app.delete("/todo:todoId",authmiddleware,async function(req,res){
    const userId = req.userId;
    const todoId = req.params.todoId;

    const result = await todoModel.deleteOne({ 
        _id: todoId, 
        userId 
    });

    if (result.deletedCount === 0) {
        res.status(404).json({ message: "Todo not found" });
        return;
    }

    res.json({ 
        message: "Todo deleted" 
    });


})


app.get("/todos",authmiddleware,async function(req,res){
   const userId = req.userId;
   
   const todos = await todoModel.find({
    userId
   });

   res.json({
    todos
   })
})


app.listen(3000);