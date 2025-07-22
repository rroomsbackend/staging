const Joi = require('joi');

const group = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string()
});

const menu = Joi.object({
    group_id: Joi.number().required(),
    menu_name: Joi.string().required(),
    web_route: Joi.string().required(),
    app_route: Joi.string().required(),
    icon: Joi.string()
});

const moduleConfig = Joi.object({
    property_id: Joi.number().required(),
    property_user_id: Joi.number().required(),
    data: Joi.array().min(1)
        .items({
            group_id: Joi.number().required(),
            active_menu_ids: Joi.array().items(Joi.number().integer()).required()
        }).required(),
});

export default { group, menu, moduleConfig };