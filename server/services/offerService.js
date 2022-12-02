const util = require('../utils/common');
const { Op } = require('@sequelize/core');
const db = require('../models');
const { sequelize, offerModel, nftModel } = require('../models');
const OfferModel = db.offerModel;
const NftModel = db.nftModel;
const attributes = [
    'of_no',
    'nft_token_id',
    'of_flag',
    'wallet_id',
    'of_price',
    'of_create_date'
];

/**
 * Offer 리스트
 * @param token_id : int 
 */
exports.selectList = async (token_id) => {

    try {

        const { count, rows } = await offerModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            where : { nft_token_id : token_id }
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {

        return error.message;

    }
}

/**
 * Offer 넣기
 * @param param : any
 */
exports.insertOffer = async (t, param ) => {

    try {

        const result = await OfferModel.create({
            nft_token_id : param.token_id,
            of_flag : 1,
            wallet_id : param.wallet_id,
            of_transaction : param.transaction,
            of_price : param.offer_price,
            of_create_date : util.unix_timestamp()
        }, {
            transaction : t
        });

        return result;

    } catch ( error ) {

        return error.message;
    }
}

/**
 * Offer 삭제
 * @param param : any
 */
exports.deleteOffer = async (t, param ) => {

    try {

        const result = await OfferModel.destroy({
            where : {
                wallet_id : param.wallet_id,
                of_no : param.of_no
            },
            transaction : t
        });
        return result;

    } catch ( error ) {

        return error.message;
    }
}
/**
 * Offer 단일 정보 가져오기
 * @param {*} no 
 * @returns 
 */
exports.selectOfferDetail = async ( no ) => {

    try {
        const result = await OfferModel.findOne({
            where : {
                of_no : no
            }
        });
        return result;

    } catch (error) {

        return error.message;
    }
}

/**
 * Offer 상태값 변경
 * @param {*} param 
 */
exports.updateOfferStatus = async (t, param ) => {

    try {
        const result = await OfferModel.update({
            of_flag : param.of_flag
        }, {
            where : {
                of_no : param.of_no
            },
            transaction : t 
        });

    } catch (error) {

        return error.message;
    }
}

/**
 * offer, nft 정보
 * @param {*} of_no 
 * @returns 
 */
exports.selectNFTOffer = async ( of_no ) => {

    try {
        
        NftModel.hasMany(OfferModel);
        OfferModel.belongsTo(NftModel, { foreignKey : 'nft_token_id', targetKey : 'nft_token_id'});

        const result = await OfferModel.findOne({
            //raw : true,
            attributes : attributes,
            include: [{
                model: NftModel,
                //attributes : [collection_id, nft_chain, nft_flag, wallet_id, nft_price],
                required: true
            }],
            where : {
                of_no : of_no
            }
        });
        //console.log(result);
        return result;

    } catch (error) {

        return error.message;
    }
    
}