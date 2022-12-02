const Joi = require('joi');
const util = require('./utils/common');
const tokenService = require('./services/tokenService');

/**
 * access token으로 로그인 체크
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authChecker = async (req, res, next) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().min(10).required()
    }).unknown();

    try {

        await schema.validateAsync(param);

        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            //req.token = bearerToken;
            const where = {};
            where.token = bearerToken;
            where.wallet_id = param.wallet_id;
            const dbResult = await tokenService.selectAccessToken(where);
            if(util.isEmpty(dbResult.token) == false) {
                if(dbResult.cache == 'db') {
                    await tokenService.updateAccessToken(dbResult);
                }
                console.log('::OK::');
                next();
            } else {
                return res.status(401).json({ code : 401, message : 'Token값이 정확하지 않거나 만료기간이 지난 Token', error : 'token' });    
            }
            
        } else {
            return res.status(401).json({ code : 401, message : 'Token값이 존재하지 않습니다.', error : 'token' });
        }

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ code: 400, message : '지갑주소의 정보가 존재하지 않습니다.', error : 'wallet_id'});
    }
    

}
