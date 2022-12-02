const util = require('../utils/common');
const db = require('../models');
const { sequelize, collectionModel, nftModel, dealModel } = require('../models');
const { Op } = require('@sequelize/core');

const CollectionModel = db.collectionModel;
const NftModel = db.nftModel;
const DealModel = db.dealModel;

/**
 * 전체 판매 Volume
 * @param {*} param 
 * @returns 
 */
exports.selectCollectionTotalVolume = async ( param ) => {
    
    try {

        const result = await DealModel.sum('deal_price', {
            raw : true,
            where : {
                collection_id : param.collection_id,
                deal_type : 1
            }
        });
        return result;

    } catch ( error ) {

        return error.message;

    }
}

/**
 * NFT 소유주 전체 수
 * @param {*} param 
 */
exports.selectCollectionTotalOwner = async ( param ) => {

    try {

        const result = await nftModel.count({
            raw : true,
            where : {
                collection_id : param.collection_id,
                wallet_id : {
                    [Op.ne]: null  
                } 
            }
        });
        return result;

    } catch ( error ) {
        return error.message;
    }
}

/**
 * NFT 전체 발행 수
 * @param {*} param 
 */
exports.selectCollectionTotalItem = async ( param ) => {

    try {

        const result = await nftModel.count({
            raw : true,
            where : {
                collection_id : param.collection_id,
            }
        });
        return result;

    } catch ( error ) {
        return error.message;
    }
}

/**
 * 컬랙션별 바닥가격
 * @param {*} param 
 * @returns 
 */
exports.selectCollectionFloorPrice = async ( param ) => {

    try {

        const result = await dealModel.findOne({
            raw : true,
            attributes : ['deal_price'],
            where : {
                collection_id : param.collection_id,
                deal_type : 1
            },
            order : [['deal_price', 'ASC']],
            limit : 1
        });
        return result.deal_price || 0;

    } catch ( error ) {

        return error.message;
    }
}

/**
 * 컬렉션 정보 update
 * @param {*} param 
 * @returns 
 */
exports.updateCollection = async ( param ) => {

    try {

        const result = await collectionModel.update({
            col_volume : param.volume,
            col_floor_price : param.floor,
            col_items : param.item,
            col_owner : param.owner
        }, {
            where : {
                collection_id : param.collection_id
            }
        });
        return result;

    } catch ( error ) {

        return error.message;
    }
}