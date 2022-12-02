const Joi = require('joi');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const util = require('../utils/common');
const cache = require('node-file-cache').create({file : './token/access_token.json'});

/**
 * 회원 지갑 주소 로그인 체크 후 빈값이면 가입
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.login = async (req, res) => {

    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().min(10).required()
    }).unknown();

    try {
        await schema.validateAsync(param);
        const dbResul = await userService.getUserWallet(param.wallet_id);
        const token = util.createRandomString(20);                          // access token
        param.token = token;
        await tokenService.deleteAccessToken(param);
        await tokenService.insertAccessToken(param);

        
        cache.expire(param.wallet_id);  // removes item with particular key
        
        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            wallet_id : dbResul[0].wallet_id,
            access_token : token
        });

    } catch (error) {
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }
}