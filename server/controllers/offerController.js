const util = require('../utils/common');
const Joi = require('joi');
const { sequelize, dealModel } = require('../models');
const offerService = require('../services/offerService');
const dealService = require('../services/dealService');
const nftService = require('../services/nftService');
const ownerService = require('../services/ownerService');

/**
 * Offer 리스트
 * @param  req 
 * @param  res 
 * @returns 
 */
exports.getList = async (req, res) => {
    const param = req.params;
    const schema = Joi.object().keys({
        nft_token_id : Joi.number().required()
    }).unknown();

    try {

        await schema.validateAsync(param);

        const dbResult = await offerService.selectList(param.nft_token_id);

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
 * Offer 넣기
 * @param  req 
 * @param  res 
 * @returns json
 */
exports.setOffer = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().required(),                // 지갑 주소
        offer_price : Joi.number().min(1).required(),       // 입찰 가격
        nft_token_id : Joi.number().required(),             // NFT Token Id
        transaction : Joi.string().required()               // 트랜잭션 코드
    }).unknown();

    try {

        await schema.validateAsync(param);

        const nft = await nftService.selectItemDetail(param.nft_token_id);
        console.log(nft);

        const t = await sequelize.transaction();            // transaction start
        try {

            const dbResult = await offerService.insertOffer(t, param);

            const history = {};
            history.nft_token_id = param.nft_token_id;
            history.deal_type = 5;                          // 1:sale, 2:listing, 3:transfer, 4:cancel, 5:offer, 6:offer cancel
            history.deal_from_wallet = nft.wallet_id;
            history.deal_to_wallet = param.wallet_id;
            history.deal_price = param.offer_price;
            history.nft_chain = nft.nft_chain;
            history.collection_id = nft.nft_collection_id;
            await dealService.insertHistory(t, history);
            await ownerService.insertHistory(t, history);    // NFT 소유주 변경 로그

            await t.commit();
            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : '',
                data : dbResult
            });

        } catch (dbError) {
            
            await t.rollback();                             // rollback
            return res.status(500).json({
                code : 500,
                message : dbError.message,
                error: 'database error',
            });
        }
    
        

    } catch ( error ) {
        
        let err_msg = (util.isEmpty(error.details[0].path[0]) == false) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });

    }
}

/**
 * Offer 취소
 * @param  req 
 * @param  res 
 * @returns json
 */
exports.setCancel = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        wallet_id : Joi.string().required(),
        of_no : Joi.number().min(1).required()
    }).unknown();

    try {

        await schema.validateAsync(param);

        const t = await sequelize.transaction();        // transaction start
        try {
            const nft = await nftService.selectItemDetail(param.nft_token_id);

            const del = await offerService.deleteOffer(t, param);
            if(parseInt(del) > 0) {
                const history = {};
                history.nft_token_id = nft.nft_token_id;
                history.deal_type = 5;                          // 1:sale, 2:listing, 3:transfer, 4:cancel, 5:offer, 6:offer cancel
                history.deal_from_wallet = nft.wallet_id;
                history.deal_to_wallet = param.wallet_id;
                history.deal_price = 0;
                history.nft_chain = nft.nft_chain;
                history.collection_id = nft.nft_collection_id;
                await dealService.insertHistory(t, history);
            }

            await t.commit();
            return res.status(200).json({
                code : 200,
                message : 'OK',
                error : ''
            });

        } catch (error) {

            await t.rollback();                         // rollback
            return res.status(500).json({
                code : 500,
                message : error.message,
                error: 'database error',
            });
        }
        

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
 * Offer 승인 처리
 * @param {*} req 
 * @param {*} res 
 */
exports.setAccept = async (req, res) => {
    const param = req.body;
    const schema = Joi.object().keys({
        of_no : Joi.number().min(1).required(),
        transaction : Joi.string().required(),                   // 트랜잭션 코드
        wallet_id : Joi.string().required()
    }).unknown();

    try {

        await schema.validateAsync(param);
        const offer = await offerService.selectNFTOffer(param.of_no);
        
        if(param.wallet_id != offer.wallet_id) {
            return res.status(500).json({ code : 500, message : '본인 Offer 정보가 아닙니다.', error: 'database error' });
        }
        if(util.isEmpty(offer) == false) {

            const t = await sequelize.transaction();

            try {

                param.of_flag = 2;
                await offerService.updateOfferStatus(t, param);    // offer 상태값  변경
                
                const owner = {};
                owner.deal_to_wallet = offer.wallet_id;
                owner.nft_token_id = offer.nft_token_id;
                await nftService.updateItemOwner(t, owner);        // NFT 소유주 변경
                
                const history = {};
                history.nft_token_id = offer.nft_token_id;
                history.deal_type = 1;                              // 1:sale, 2:listing, 3:transfer, 4:cancel, 5:offer, 6:offer cancel
                history.deal_from_wallet = offer.nft.wallet_id;
                history.deal_to_wallet = offer.wallet_id;
                history.deal_price = offer.of_price;
                history.collection_id = offer.nft.collection_id;
                history.nft_chain = offer.nft.nft_chain;
                await dealService.insertHistory(t, history);       // 거래 내역 저장

                await t.commit();
                return res.status(200).json({
                    code : 200,
                    message : 'OK',
                    error : '',
                });

            } catch (error) {

                await t.rollback();                             // rollback
                return res.status(500).json({
                    code : 500,
                    message : error.message,
                    error: 'database error',
                });
            }

        }
        return res.status(500).json({ code : 500, message : 'Offer 정보가 없습니다.', error : 'of_no' });

    } catch ( error ) {
        console.log(error);
        let err_msg = (util.isEmpty(error.details[0].path[0]) == false) ?  '' : error.details[0].path[0];
        return res.status(400).json({
            code : 400,
            message : error.message,
            error : err_msg
        });
    }
}