const util = require('../utils/common');
const { Op } = require('@sequelize/core');
const db = require('../models');
const { sequelize, nftModel } = require('../models');
const NftModel = db.nftModel;
const attributes = [
    'nft_token_id',
    'nft_chain',
    'nft_round',
    [sequelize.literal('CASE WHEN (nft_flag = 1) THEN "now" WHEN (nft_flag = 2) THEN "buy" ELSE "ready" END '), 'flag'],
    'nft_title',
    'collection_id',
    'wallet_id',
    'nft_price',
    'nft_img_src',
    'nft_description',
    'nft_sell_date',
    'nft_duration_date'
];

/**
 * NFT 아이템 리스트
 * @param param : object 
 */
exports.selectItemList = async (param) => {
    
    try {

        const where = {};
        const limit = 30;
        const offset = 0 + (param.page - 1) * limit;
        let orderby = '';

        // 판매 가격 검색
        if(param.start_price >= 0 && param.end_price > 0) {
            where.nft_price = {
                [Op.gte]: param.start_price, // nft_price >= start_price
                [Op.lte]: param.end_price,  // nft_price <= end_price
            }
        }

        // nft 타이틀 like 검색
        if(param.keyword){
            where.nft_title = {
                [Op.substring]: param.keyword,
            }
        }

        // 상태값 1:now, 2:buy
        if(param.status) {
            let status = (param.status == 'buy' ? 2 : 1);
            where.nft_flag = status;
        }

        // round 회차
        if(param.property > 0) {
            where.nft_round = param.property;
        }

        // 정렬
        if(param.orderby) {
            let search_orderby = (param.orderby == 'price_low' ? 'ASC' : 'DESC');
            orderby = [['nft_price', search_orderby]];
        } else {
            orderby = [['nft_flag', 'DESC'], ['nft_no', 'DESC']];   // 판매중, 등록순 DESC
        }

        // 컬렉션 ID
        where.collection_id = param.collection_id;
        where.nft_flag = {
            [Op.gt]: 0
        }
        const { count, rows } = await NftModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            order : orderby,
            where : where,
            limit : limit,
            offset : offset
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {

        return error.message;
    }
}

/**
 * NFT 아이템 개별
 * @param nft_token_id : int 
 */
exports.selectItemDetail = async (nft_token_id) => {

    try {

        const result = await nftModel.findOne({
            raw : true,
            attributes : attributes,
            where : { nft_token_id : nft_token_id }
        });
        return result;

    } catch ( error ) {

        return error.message;
    }
}

/**
 * 나의 NFT 아이템 리스트
 * @param param : any
 */
exports.selectMyItemList = async ( param ) => {

    try {

        const where = {};
        const limit = 30;
        const offset = 0 + (param.page - 1) * limit;

        where.wallet_id = param.wallet_id;
        where.nft_flag = {
            [Op.gt]: 0
        }
        const { count, rows } = await NftModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            order : [['nft_no', 'DESC']],
            where : where,
            limit : limit,
            offset : offset
        });
        const result = { count : count, rows : rows };
        return result;

    } catch (error) {

        return error.message;
    }
}

/**
 * 나의 NFT 아이템 판매 시작
 * @param param : any
 */
exports.updateMyItemSell = async (t, param ) => {
    
    try {
        
        const result = await NftModel.update({ 
            nft_flag : param.nft_flag,
            nft_sell_date : util.unix_timestamp(),
            nft_duration_date : param.nft_duration_date
        }, {
            where: {
                nft_token_id : param.nft_token_id,
                wallet_id : param.wallet_id
            },
            transaction : t 
        });

        return result;

    } catch (error) {

        return error.message;

    }
}

/**
 * NFT 신청 등록
 * @param {*} param 
 */
exports.insertItemReady = async ( param ) => {

    try {
        const last_id = await NftModel.max('nft_no', {});
        if(last_id > 0) {

            const result = await NftModel.create({
                nft_token_id : parseInt(last_id + 1),
                collection_id : param.collection_id,
                nft_chain : param.nft_chain,
                nft_flag : 3,                               // 상태값 0:미보유, 1:보유, 2:판매중, 3:신청, 4:반려
                wallet_id : param.wallet_id,
                nft_title : param.nft_title,
                nft_img_src : param.nft_img_src,
                creator_fee_percent : param.creator_fee_percent,
                creator_fee_wallet : param.creator_fee_wallet,
                social_web : param.social_web,
                social_twitter : param.social_twitter,
                social_discord : param.social_discord,
                social_telegram : param.social_telegram,
                nft_create_date : util.unix_timestamp(),
            });

            return result;
        }

    } catch (error) {
        
        return error.message;
    }
}

/**
 * NFT 신청 리스트
 * @param {*} param 
 * @returns 
 */
exports.selectItemReadyList = async ( param ) => {
    
    try {

        const where = {};
        const limit = 30;
        const offset = 0 + (param.page - 1) * limit;
        where.nft_flag = param.nft_flag;
        where.wallet_id = param.wallet_id;
        const { count, rows } = await NftModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            order : [['nft_no', 'DESC']],
            where : where,
            limit : limit,
            offset : offset
        });
        const result = { count : count, rows : rows };
        return result;

    } catch (error) {

        return error.message;
    }
}

/**
 * NFT 신청서 삭제
 * @param {*} param 
 * @returns 
 */
exports.deleteReadyItem = async ( param ) => {
    try {

        const result = await NftModel.destroy({
            where :  {
                nft_token_id : param.nft_token_id,
                wallet_id : param.wallet_id
            }
        });
        return result;

    } catch (error) {

        return error.message;

    }
}


/**
 * NFT 소유주 변경
 * @param param : any
 */
 exports.updateItemOwner = async (t, param ) => {
    
    try {
        
        const result = await NftModel.update({ 
            nft_flag : 1,
            nft_sell_date : 0,
            nft_duration_date : 0,
            wallet_id : param.deal_to_wallet,
            nft_price : 0,
            nft_sell_best : 0,

        }, {
            where: {
                nft_token_id : param.nft_token_id,
            },
            transaction : t 
        });

        return result;

    } catch (error) {

        return error.message;

    }
}

/**
 * NFT 판매 취소
 * @param {*} param 
 * @returns 
 */
exports.updateItemCancel = async ( param ) => {

    try {

        const result = await NftModel.update({
            nft_flag : 1,
            nft_price : 0,
            nft_sell_date : 0,
            nft_duration_date : 0,
        }, {
            where : {
                nft_token_id : param.nft_token_id,
                wallet_id : param.wallet_id
            }
        });

        return result;

    } catch (error) {

        return error.message;
    }
}