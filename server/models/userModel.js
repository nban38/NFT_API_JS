
module.exports = function(sequelize, Sequelize){

    const user = sequelize.define('user', {
        em_no : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        
        wallet_site : {
            type : Sequelize.STRING(30),
            allowNull : false,
            comment : '지갑 사이트 주소'
        },

        em_active : {
            type : Sequelize.INTEGER(),
            defaultValue : 1,
            comment : '활동 유무'
        },

        em_create_date : {
            type : Sequelize.INTEGER(),
            comment : '생성일자',
        },

        wallet_id : {
            type : Sequelize.STRING(100),
            allowNull: false,
            comment : '지갑 주소'
        },

    }, {
        tableName : 'ed_member',
        timestamps : true,
    });

    user.associate = function(models) {

    };

    return user;
}