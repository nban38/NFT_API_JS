
module.exports = function(sequelize, Sequelize){

    const offer = sequelize.define('offer', {
        of_no : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        
        nft_token_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT Token Id',
        },

        of_flag : {
            type : Sequelize.TINYINT(2),
            defaultValue : 1,
            comment : '상태값 (1:미낙찰, 2:낙찰)',
        },

        nft_chain : {
            type : Sequelize.TINYINT(2),
            defaultValue : 0,
            comment : '네트워크 채널 (1:ETH, 2:MAM)'
        },

        of_transaction : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : '트랜잭션 코드'
        },

        wallet_id : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : '입찰자 지갑주소',
        },

        of_price : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '입찰 가격',
        },

        of_create_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '입찰 일시',
        }
        
    }, {
        tableName : 'ed_nft_offer',
        timestamps : true,
    });

    offer.associate = function(models) {

        
    };

    return offer;
}