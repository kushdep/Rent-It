const Joi = require('joi')

module.exports.rentLocationSchema = Joi.object({
    rentloc:Joi.object({
        title:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required(),
        image:Joi.string().required(),
        description:Joi.string().required()
    }).required()
});








