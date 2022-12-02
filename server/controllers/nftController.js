const Joi = require('joi');
const nftService = require('../services/nftService');
const util = require('../utils/common');

/**
 * NFT 아이템 리스트
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.getItemList = async (req, res) => {
    const param = req.query;
    const schema = Joi.object().keys({
        status : Joi.string().allow(''),                // 상태값 (buy:파는상품, now: 보유 상품)
        property : Joi.number().allow(''),              // round 회차
        keyword : Joi.string().allow(''),               // NFT 아이템명 검색어
        orderby : Joi.string().allow(''),               // 정렬 (price_low, price_high)
        page : Joi.number().required(),                 // 페이지
        collection_id : Joi.number().required(),        // 컬렉션 ID
        start_price : Joi.number().allow(''),           // 검색 시작가
        end_price : Joi.number().allow('')              // 검색 최대가
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await nftService.selectItemList(param);
        //console.log(dbResult);
        
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
 * NFT 아이템 상세
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.getItem = async (req, res) => {
    const param = req.params;
    const schema = Joi.object().keys({
        nft_token_id : Joi.number().required()
    }).unknown();

    try {
        console.log(param.token_id);
        await schema.validateAsync(param);
        const dbResult = await nftService.selectItemDetail(param.nft_token_id);

        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            nft_token_id : dbResult.nft_token_id,               // NFT Token Id
            nft_chain : dbResult.nft_chain,                     // NFT 네트워크 
            nft_round : dbResult.nft_round,                     // NFT 회차
            flag : dbResult.flag,                               // NFT 상태값
            nft_title : dbResult.nft_title,                     // NFT 아이템명
            wallet_id : dbResult.wallet_id,                     // NFT 소유주 지갑주소
            nft_price : dbResult.nft_price,                     // NFT 판매 금액
            nft_img_src : dbResult.nft_img_src,                 // NFT 이미지 경로
            nft_description : dbResult.nft_description,         // NFT 한줄 설명
            nft_sell_date : dbResult.nft_sell_date,             // NFT 판매 시작일
            nft_duration_date : dbResult.nft_duration_date,     // NFT 판매 종료일
        });

    } catch( error ) {

        let err_msg = (util.isEmpty(error.details[0].path[0]) == false) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });
    }
}

/**
 * NFT 신청서 등록
 * @param {*} req 
 * @param {*} res 
 */
exports.setItemReady = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        collection_id : Joi.number().required(),                // 컬렉션 ID
        nft_chain : Joi.number().required(),                    // NFT 네트워크 1 : ethereum, 2 : mammoth
        wallet_id : Joi.string().required(),                    // 소유주 지갑주소
        nft_title : Joi.string().required(),                     // NFT 타이틀
        nft_img_src : Joi.string().required(),                  // 타이틀 이미지 경로
        creator_fee_percent : Joi.number().max(20).default(0),  // 판매 수수료 퍼센트 max 20%
        creator_fee_wallet : Joi.string().allow(''),            // 판매 수수료 지급 지갑 주소
        social_web : Joi.string().allow(''),                    // 웹 주소
        social_twitter : Joi.string().allow(''),                // 트위터 주소
        social_discord : Joi.string().allow(''),                // 디스코드 주소
        social_telegram : Joi.string().allow(''),               // 텔레그램 주소
    }).unknown();

    try {
        
        await schema.validateAsync(param);
        try {

            const dbResult = await nftService.insertItemReady(param);

            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : '',
                data : dbResult
            });

        } catch (res_error) {

            return res.status(500).json({ code : 500, message : 'DB Insert 실패', error : 'DB' });
        }
        

    } catch( error ) {

        let err_msg = (util.isEmpty(error.details[0].path[0]) == true) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });
    }
}

/**
 * NFT 신청 리스트
 * @param {*} req 
 * @param {*} res 
 */
exports.getItemReadyList = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().required(),
        page : Joi.number().min(1).default(1),
        nft_flag : Joi.number().valid(3,4).default(3)
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await nftService.selectItemReadyList(param);

        if(util.isEmpty(dbResult.count) == false) {
            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : '',
                count : dbResult.count,
                list : dbResult.rows,
                page : param.page
            });
        }

        return res.status(500).json({ code : 500, message : 'DB 건수 0', error : 'count' });

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
 * NFT 신청 취소
 * @param {*} req 
 * @param {*} res 
 */
exports.setReadyCancel = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().required(),
        nft_token_id : Joi.number().required()
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = nftService.deleteReadyItem(param);
        //console.log(dbResult);
        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            data : dbResult
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