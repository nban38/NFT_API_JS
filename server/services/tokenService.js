const util = require('../utils/common');
const { Op } = require('@sequelize/core');
const db = require('../models');
const moment = require('moment');
const { sequelize, tokenModel } = require('../models');
const TokenModel = db.tokenModel;


/**
 * 로그인 Access Token 기록
 * @param {*} param 
 */
exports.insertAccessToken = async (param) => {

    try {
        let expired = moment().add(1, 'days');  // 하루 후
        let expiredInt = parseInt(expired.format('x').substring(0, 10));
        const result = await TokenModel.create({
            token : param.token,
            wallet_id : param.wallet_id,
            expiredAt : expiredInt
        });
        return result;

    } catch (error) {
        
        return error.message;
    }
}

/**
 * Token 체크
 * @param {*} token 
 * @returns 
 */
exports.selectAccessToken = async (param) => {
    
    const cache = require('node-file-cache').create({file : './token/access_token.json'});
    const key = param.wallet_id;

    const token_cache = cache.get(key);
    if(token_cache) {
        let result = token_cache;
        result.cache = 'file';
        return result;

    } else {

        let result =  await TokenModel.findOne({
            where : {
                token : param.token,
                wallet_id : param.wallet_id,
                expiredAt : {
                    [Op.gte] : util.unix_timestamp(),
                }
            }
        });

        const item = result;
        cache.set(key, item);
        result.cache = 'db';
        return result;
    }

}

/**
 * 한시간 이후 접속시 자동 만료시간 업데이트
 * @param {*} param 
 */
exports.updateAccessToken = async ( param ) => {

    let expired = moment().add(1, 'days');  // 하루 후
    let expiredInt = parseInt(expired.format('x').substring(0, 10));
    const result = await TokenModel.update({
        expiredAt : expiredInt
    },{
        where : {
            token : param.token,
            wallet_id : param.wallet_id
        }
    })
}

exports.deleteAccessToken = async ( param ) => {

    const result = await TokenModel.destroy({
        where : {
            wallet_id : param.wallet_id
        }
    });
    return result;
}