const util = require('../utils/common');
const { Op } = require('@sequelize/core');
const db = require('../models');
const { sequelize, ownerModel } = require('../models');
const OwnerModel = db.ownerModel;

/**
 * 소유주 변경 history
 * @param {*} param 
 * @returns 
 */
exports.insertHistory = async (t , param ) => {

    try {

        const result = await OwnerModel.create({
            nft_token_id : param.nft_token_id,
            oh_price : param.deal_price,
            oh_before_wallet : wallet_id,
            oh_after_wallet : deal_to_wallet,
            oh_create_date : util.unix_timestamp()
        }, {
            transaction : t 
        });

        return result;

    } catch ( error ) {

        return error.message;
    }
}