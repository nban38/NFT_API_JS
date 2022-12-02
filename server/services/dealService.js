const util = require('../utils/common');
const moment = require('moment');
const { Op } = require('@sequelize/core');
const db = require('../models');
const { sequelize, dealModel } = require('../models');
const { Transaction } = require('sequelize');
const DealModel = db.dealModel;
const attributes = [
    'deal_no',
    'collection_id',
    'nft_token_id',
    'nft_chain',
    'deal_transaction',
    'deal_type',
    'deal_price',
    'deal_from_wallet',
    'deal_to_wallet',
    'deal_create_date'
];

/**
 * 거래 내역 리스트
 * @param param : object 
 */
exports.selectHistoryList = async (param) => {
    
    try {

        const limit = 30;
        const offset = 0 + (param.page - 1) * limit;
        const { count, rows } = await DealModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            where : { nft_token_id : param.nft_token_id },
            limit : limit,
            offset : offset,
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {

        return error.message;

    }
}

/**
 * 전체 거래 내역
 * @param {*} param 
 * @returns 
 */
exports.selectAllHistoryList = async (param) => {
    
    try {
        const where = {};
        const limit = 30;
        const offset = 0 + (param.page - 1) * limit;
        if(param.deal_type > 0) {
            where.deal_type = param.deal_type;
        }
        const { count, rows } = await DealModel.findAndCountAll({
            raw : true,
            attributes : attributes,
            where : where,
            limit : limit,
            offset : offset,
        });
        const result = { count : count, rows : rows };
        return result;

    } catch ( error ) {

        return error.message;
    }
}

/**
 * 거래 내역 저장
 * @param param : object 
 */
exports.insertHistory = async (t, param) => {

    try {

        const result = await DealModel.create({
            nft_token_id : param.nft_token_id,
            deal_type : param.deal_type,
            deal_from_wallet : param.wallet_id,
            deal_to_wallet : param.deal_to_wallet || '',
            deal_price : param.nft_price,
            collection_id : param.collection_id,
            nft_chain : param.nft_chain,
            deal_create_date : util.unix_timestamp()
        },
        { 
            transaction : t 
        });

        return result;

    } catch (error) {
        return error.message;
    }
}

/**
 * 조건에 해당 하는 날짜 거래액
 * @param param 
 * @returns 
 */
exports.selectLatestVolume = async (param) => {
    
    try {
        const where = {};
        where.collection_id = param.collection_id;
        where.deal_type = 1;
        if(param.day && param.day != 'all') {
            let stDate = moment().subtract(param.day, 'days');  // 검색일 몇일 전
            let stDateInt = parseInt(stDate.format('x').substring(0, 10));
            where.deal_create_date = {
                [Op.gte] : stDateInt
            }
        }
        const result = await DealModel.sum('deal_price', {
            where : where
        });
        console.log(result);
        return result;
    } catch (error) {

        return error.message;
    }
}

/**
 * 조건 날짜에 
 * @param {*} param 
 * @returns 
 */
exports.selectOldVolume = async (param) => {
    try {
        const where = {};
        where.collcation_id = param.collcation_id;
        where.deal_type = 1;
        if(param.day && param.day != 'all') {
            let stDate = moment().subtract(param.day, 'days');
            let stDateInt = parseInt(stDate.format('x').substring(0, 10));
            let endDate = moment().subtract((param.day * 2), 'days');
            where.deal_create_date = {
                [Op.lte] : stDateInt,
                [Op.gte] : endDate
            }
            const result = await DealModel.sum('deal_price', {
                where : where
            });
            console.log(result);
            return result;
        }

    } catch (error) {
        return error.message;
    }
}
