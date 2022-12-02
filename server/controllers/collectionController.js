const Joi = require('joi');
const collectionService = require('../services/collectionService');
const dealService = require('../services/dealService');

/**
 * GET 컬렉션 랭킹 (전체 볼륨 기준)
 * @param  req
 * @param  res 
 * @returns json
 */
exports.getRank = async (req, res) => {
    const param = req.params;
    const schema = Joi.object().keys({
        day : Joi.string().valid('1', '7', '30', 'all').required(),       // 검색 기준일
        rank : Joi.number().default(40),       // 노출 최대 랭킹
        page : Joi.number().default(1)
    }).unknown();

    try {
        
        await schema.validateAsync(param);
        const dbResult = await collectionService.selectRankVolume(param);
        
        try {
            let field = {};
            let dbRows = {};
            dbRows = dbResult.rows;
            field.day = param.day;
            let count = parseInt(dbResult.count) || 0;
            if(count > 0) {
                
                for(let i = 0; i < count; i++) {
                    field.collection_id = parseInt(dbRows[i].collection_id);
                    let latestVolume = await dealService.selectLatestVolume(field);
                    let oldVolume = await dealService.selectOldVolume(field);
                    dbRows[i].latest_volume = parseInt(latestVolume);
                    dbRows[i].old_volume = parseInt(oldVolume);
                }
            }
            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : '',
                count : dbResult.count,
                list : dbRows,
                page : parseInt(param.page)
            });

        } catch ( error ) {
            return res.status(500).json({ code : 500, message : error.message, error : 'db' });
        }
    
    } catch ( error ) {
        
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }
}

/**
 * GET 컬렉션 리스트 (검색용)
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.getList = async (req, res) => {
    
    const param = req.params;
    const schema = Joi.object().keys({
    
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await collectionService.selectCollectionList(param);
        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            count : dbResult.count,
            list : dbResult.rows
        });

    } catch ( error ) {

        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }

}

/**
 * POST 컬렉션 신청서 등록
 * @param {*} req 
 * @param {*} res 
 */
exports.setReady = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        collection_name : Joi.string().required(),          // 컬렉션 이름
        collection_url : Joi.string().required(),           // 컬렉션 URL
        owner_email : Joi.string().required(),              // 신청 결과 안내 이메일
        logo_src : Joi.string().allow(''),                  // 로고 이미지
        featured_src : Joi.string().allow(''),              // 대표 이미지
        banner_src : Joi.string().allow(''),                // 배너 이미지
        wallet_id : Joi.string().required(),                // 지갑 주소
        collection_cate : Joi.string().required()           // 카테고리
    }).unknown();

    try {

        await schema.validateAsync(param);
        try {

            const result = await collectionService.insertCollectionReady(param);
            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : '',
                data : result
            });

        } catch (res_error) {

            return res.status(500).json({ code : 500, message : 'DB Insert 실패', error : 'DB' });
        }

    } catch ( error ) {

        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }
}