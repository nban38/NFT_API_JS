const util = require('../utils/common');
const db = require('../models');
const UserModel = db.userModel;

/**
 * 지갑주소 체크 후 없다면 insert
 * @param wallet_id : string 
 */
exports.getUserWallet = async (wallet_id) => {
    
    try {
        
        const result = await UserModel.findOrCreate({
            raw : true,
            where : { wallet_id : wallet_id },
            defaults : {
                em_active : 1,
                wallet_site : 'metamask',
                em_create_date : util.unix_timestamp()
            }
        });
        return result;

    } catch ( error ) {

        return error.message;
    }
}