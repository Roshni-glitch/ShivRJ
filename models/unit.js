const mongoose=require('mongoose');
const { Schema } = mongoose;
const Bhk=require('./bhk');


const unitSchema=new mongoose.Schema({
    projectname:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    img:[
        {
            url:String,
            filename:String
        },
    ],
     types:[
        {
            type: Schema.Types.ObjectId,
            ref:"Bhk"
        }
     ],
     for:{
        type:String
     }
});

unitSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Bhk.deleteMany({
            _id:{
                $in:doc.types
            }
        })
    }
})

const Unit=mongoose.model('Unit',unitSchema);

module.exports=Unit;