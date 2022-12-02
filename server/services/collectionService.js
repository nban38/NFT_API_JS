const util = require('../utils/common');
const db = require('../models');
const { sequelize, collectionModel } = require('../models');
const { Op } = require('@sequelize/core');

const CollectionModel = db.collectionModel;
const attributes = [
    'collection_id',
    'col_name',
    'col_volume',
    'col_floor_price',
    'col_items',
    'col_owner',
    'col_logo_src',
    'col_featured_src',
    'col_create_date'
];

exports.selectRankVolume = async (param) => {

    try {
        
        const limit = parseInt(param.rank);
        const offset = 0 + (param.page - 1) * limit;
        const { count, rows } = await CollectionModel.findAndCountAll({
            raw : true,
            where : { 
                col_volume : {
                    [Op.gt]: 0                                          // 전체 볼륨 > 0
                },
                col_flag : 2                                            // 승인 컬렉션
            },
            limit : limit,
            offset : offset,
            attributes : attributes,
            order : [['col_volume', 'DESC']]
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {
        return error.message;
    }
}


/**
 * 컬렉션 리스트
 * @param  param 
 */
exports.selectCollectionList = async (param) => {
    
    try {

        const { count, rows } = await CollectionModel.findAndCountAll({
            raw : true,
            where : { 
                col_volume : {
                    [Op.gt]: 0                                          // 전체 볼륨 > 0
                },
                col_flag : 2                                            // 승인 컬렉션
            },
            attributes : attributes,
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {
        return error.message;
    }

}

/**
 * 컬렉션 신청 등록 처리
 * @param {*} param 
 */
exports.insertCollectionReady = async (param) => {
    
    try {

        const last_id = await CollectionModel.max('col_id', {});
        if(last_id > 0) {

            const result = await CollectionModel.create({
                collection_id : parseInt(last_id + 1),
                col_name : param.collection_name,
                col_flag : 1,
                col_category : param.collection_cate,
                wallet_id : param.wallet_id,
                col_log_src : param.logo_src,
                col_featured_src : param.featured_src,
                col_banner_src : param.banner_src,
                col_owner_email : param.owner_email,
                col_create_date : util.unix_timestamp()
            });

            return result;
        }

    } catch (error) {
        
        return error.message;
    }
}