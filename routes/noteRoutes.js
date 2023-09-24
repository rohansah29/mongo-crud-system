const express=require("express")
const { NoteModel } = require("../models/noteModel")
const {auth}=require("../middlewares/auth.middleware")

const noteRouter=express.Router()

//Creating a new notes
noteRouter.post("/create",auth,async(req,res)=>{
    try {
        const note=new NoteModel(req.body)
        await note.save()
        res.send({"msg":"A new note has been added"})
    } catch (error) {
        res.send({"error":error})
    }
})

//reading the notes
noteRouter.get("/",auth,async(req,res)=>{
    try {
        const note=await NoteModel.find({userID:req.body.userID})
        res.send(note)
    } catch (error) {
        res.send({"error":error})
    }
})

//updating the notes
noteRouter.patch("/update/:noteID",auth,async(req,res)=>{
    const {noteID}=req.params
    const note=await NoteModel.findOne({_id:noteID})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"You are not authorized"})
        }else{
            await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.send({"msg":`Note with ID:${noteID} has been updated`})
        }
    } catch (error) {
        res.send({"error":error})
    }
})


noteRouter.delete("/delete/:noteID",auth,async(req,res)=>{
    const {noteID}=req.params
    const note=await NoteModel.findOne({_id:noteID})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"You are not authorized"})
        }else{
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.send({"msg":`Note with ID:${noteID} has been deleted`})
        }
    } catch (error) {
        res.send({"error":error})
    }
})


module.exports={
    noteRouter
}