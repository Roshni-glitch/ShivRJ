const mongoose=require('mongoose');


const bhkSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    for:{
        type:String,
        required:true
    }
    
});

const Bhk=mongoose.model('Bhk',bhkSchema);

module.exports=Bhk;