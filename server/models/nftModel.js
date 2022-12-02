
module.exports = function(sequelize, Sequelize){

    const nft = sequelize.define('nft', {
        nft_no : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        
        nft_token_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT Token ID'
        },

        collection_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '컬렉션 ID'
        },

        nft_chain : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '네트워크 체인(1:ethereum, mammoth)'
        },

        nft_round : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'round 회차'
        },

        nft_flag : {
            type : Sequelize.TINYINT(2),
            defaultValue : 0,
            comment : '상태값 (0:미보유, 1:보유, 2:판매중)'
        },

        wallet_id :  {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : '소유주 지갑 주소'
        },

        nft_title : {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : 'NFT 아이템 명'
        },

        nft_price : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT 판매 가격'
        },

        nft_sell_best : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'nft 가장 비싸게 팔린 가격'
        },

        nft_img_src : {
            type : Sequelize.STRING(200),
            allowNull : true,
            comment : 'NFT 이미지 경로'
        },

        nft_category : {
            type : Sequelize.STRING(30),
            allowNull : true,
            comment : 'NFT 카테고리'
        },

        creator_fee_percent : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '창작자 수수료 퍼센트'
        },

        creator_fee_wallet : {
            type : Sequelize.STRING(100),
            allowNull : true,
            comment : '창작자 수수료 지갑 주소'
        },

        nft_sell_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '판매 시작일'
        },

        nft_duration_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '판매 종료일'
        },

        nft_create_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT 생성일'
        }


    }, {
        tableName : 'ed_nft_item',
        timestamps : true,
    });

    nft.associate = function(models) {

    };

    return nft;
}