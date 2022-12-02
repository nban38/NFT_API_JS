
module.exports = function(sequelize, Sequelize){

    const owner = sequelize.define('owner', {
        oh_no : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },

        nft_token_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT Token ID'
        },

        oh_price : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '거래 가격'
        },

        oh_before_wallet : {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : '기존 소유주 지갑주소'
        },

        oh_after_wallet : {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : '기존 소유주 지갑주소'
        },
        

    }, {
        tableName : 'ed_nft_owner_history',
        timestamps : true,
    });

    owner.associate = function(models) {

    };

    return owner;
}