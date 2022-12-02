const util = require('../utils/common');
const Joi = require('joi');
const nftService = require('../services/nftService');
const dealService = require('../services/dealService');
const ownerService = require('../services/ownerService');
const { sequelize } = require('../models');

/**
 * 나의 보유 NFT 리스트
 * @param  req 
 * @param  res 
 * @returns json
 */
exports.getMyItemList = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().required(),
        page : Joi.number().min(1).required()
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await nftService.selectMyItemList(param);

        return res.status(200).json({
            code : 200,
            message : 'OK',
            error : '',
            count : dbResult.count,
            list : dbResult.rows,
            page : parseInt(param.page)
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
 * 나의 보유 NFT 판매 등록
 * @param  req 
 * @param  res 
 * @returns json
 */
exports.setMyItem = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().alphanum().required(),
        nft_token_id : Joi.number().min(1).required(),
        nft_price : Joi.number().min(1).required(),
        nft_duration_date : Joi.number().integer().min(1000000000).max(20000000000).required()
    });
    
    try {

        await schema.validateAsync(param);
        const nft = await nftService.selectItemDetail(param.nft_token_id);

        if(util.isEmpty(nft) == false)
        {
            if(nft.wallet_id != param.wallet_id) {
                return res.status(500).json({ code : 500, message : '본인 NFT가 아닙니다.', error : 'wallet_id' });
            }

            const t = await sequelize.transaction();                // transaction start
            try {

                param.collection_id = nft.collection_id;
                param.nft_chain = nft.nft_chain;
                param.nft_flag = 2;
                param.deal_type = 2;
                await nftService.updateMyItemSell(t, param);        // NFT 상태값, 시작,종료 일시 설정
                await dealService.insertHistory(t, param);          // deal history 테이블 저장

                await t.commit();                                   // commit
                return res.status(200).json({
                    code : 200,
                    message : 'OK',
                    error: '',
                });

            } catch (dbError) {

                await t.rollback();                                 // rollback
                return res.status(500).json({
                    code : 500,
                    message : dbError.message,
                    error: 'database error',
                });

            }
        }

        return res.status(500).json({ code : 500, message : 'NFT 정보가 없습니다.', error : 'nft_token_id' });

    } catch ( error ) {

        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }
}

/**
 * 나의 보유 NFT 다른 지갑 주소로 전송
 * @param  req 
 * @param  res 
 * @returns json
 */
exports.setTransferItem = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().alphanum().required(),
        nft_token_id : Joi.number().min(1).required(),
        deal_to_wallet : Joi.string().alphanum().required(),
    }).unknown();

    try {

        await schema.validateAsync(param);
        const nft = await nftService.selectItemDetail(param.nft_token_id);
        console.log(nft);
        if(util.isEmpty(nft) == false)
        {
            if(nft.wallet_id != param.wallet_id) {
                return res.status(500).json({ code : 500, message : '본인 NFT가 아닙니다.', error : 'wallet_id' });
            }
            const t = await sequelize.transaction();        // transaction start
            try {
                const field = {
                    nft_token_id : param.nft_token_id,
                    deal_type : 3,
                    wallet_id : param.wallet_id,
                    deal_price : 0,
                    collection_id : nft.collection_id,
                    nft_chain : nft.nft_chain,
                    deal_to_wallet : param.deal_to_wallet
                }
                await dealService.insertHistory(t, field);     // 거래 history 저장
                await nftService.updateItemOwner(t, field);    // NFT 소유주 변경 및 정보 초기화
                await ownerService.insertHistory(t, field);    // NFT 소유주 변경 로그
                
                await t.commit();                           // commit
                return res.status(200).json({
                    code : 200,
                    message : 'OK',
                    error: '',
                });

            } catch (dbError) {

                await t.rollback();                         // rollback
                return res.status(500).json({
                    code : 500,
                    message : dbError.message,
                    error: 'database error',
                });
            }
        }
        return res.status(500).json({ code : 500, message : 'NFT 정보가 없습니다.', error : 'nft_token_id' });

    } catch ( error ) {

        return res.status(400).json({
            code : 400,
            message : error.message,
            error : error.details[0].path[0]
        });
    }
}

/**
 * 나의 NFT 판매 취소
 * @param {*} req 
 * @param {*} res 
 */
exports.setMyItemCancelListing = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().alphanum().required(),
        nft_token_id : Joi.number().min(1).required(),
    }).unknown();

    try {

        await schema.validateAsync(param);
        const dbResult = await nftService.updateItemCancel(param);

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