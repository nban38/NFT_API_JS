const Joi = require('joi');
const dealService = require('../services/dealService');
const util = require('../utils/common');

/**
 * GET deal history 리스트
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.getHistoryList = async (req, res) => {
    const param = req.params;
    const schema = Joi.object().keys({
        nft_token_id : Joi.number().min(1).required(),
        page : Joi.number().min(1).required()
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await dealService.selectHistoryList(param);
        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            count : dbResult.count,
            list : dbResult.rows,
            page : parseInt(param.page),
        });
    
    } catch ( error ) {
        
        let err_msg = (util.isEmpty(error.details[0].path[0]) == true) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });
    }
}

/**
 * POST 전체 deal history 리스트
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllHistoryList = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        page : Joi.number().default(1),
        deal_type : Joi.number().allow('')
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await dealService.selectAllHistoryList(param);
        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            count : dbResult.count,
            list : dbResult.rows,
            page : parseInt(param.page),
        });
    
    } catch ( error ) {
        
        let err_msg = (util.isEmpty(error.details[0].path[0]) == true) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });
    }
}
