let joi=require("joi");

module.exports.UnitSchema=joi.object({

        projectname:joi.string().required(),
        area:joi.string().required(),
        location:joi.string().required(),
        price:joi.string().required(),
        
        
   
});

module.exports.BhkSchema=joi.object({
        type:joi.string().required(),
        price:joi.string().required(),
        for:joi.string().required()
});

module.exports.locationSchema=joi.object({
        name:joi.string().required()
});




