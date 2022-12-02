
module.exports = function(sequelize, Sequelize){

    const collection = sequelize.define('Collection', {
        col_id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },

        collection_id : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '컬렉션 ID'
        },

        col_name : {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : '컬렉션명'
        },

        col_flag : {
            type : Sequelize.TINYINT(2),
            defaultValue : 1,
            comment : '상태값 (0:삭제, 1:신청, 2:승인, 3:거부)'
        },

        col_category : {
            type : Sequelize.STRING(40),
            allowNull : false,
            comment : '컬렉션 카테고리'
        },

        wallet_id : {
            type : Sequelize.STRING(100),
            allowNull : false,
            comment : '지갑 주소'
        },

        col_volume : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '전체 볼륨'
        },

        col_floor_price : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : 'NFT 바닥 가격'
        },

        col_items : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '발행량'
        },

        col_owner : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '소유주 수'
        },

        col_logo_src : {
            type : Sequelize.STRING(200),
            //allowNull : false,
            comment : 'logo 이미지 경로'
        },

        col_featured_src : {
            type : Sequelize.STRING(200),
            allowNull : false,
            comment : '컬렉션 대표 이미지 경로'
        },

        col_create_date : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '컬렉션 생성일자'
        },
    
        

    }, {
        tableName : 'ed_collection',
        timestamps : true,
    });

    collection.associate = function(models) {

    };

    return collection;
}