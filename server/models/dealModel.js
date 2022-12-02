
module.exports = function(sequelize, Sequelize){

    const deal = sequelize.define('deal', {
        deal_no : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },

        collection_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '컬렉션 ID'
        },
        
        nft_token_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT Token ID'
        },

        deal_transaction : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : '거래 코드',
        },

        deal_type : {
            type : Sequelize.TINYINT(2),
            defaultValue : 1,
            comment : '거래타입 (1:sale, 2:listing, 3:transfer, 4:cancel)',
        },

        deal_price : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '거래된 액수',
        },
        
        deal_from_wallet : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : '보낸 지갑주소'
        },

        deal_to_wallet : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : '받은 지갑주소'
        },
        
        deal_create_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '거래 생성일'
        }


    }, {
        tableName : 'ed_nft_deal_history',
        timestamps : true,
    });

    deal.associate = function(models) {

    };

    return deal;
}