
module.exports = function(sequelize, Sequelize){

    const token = sequelize.define('token', {
        idx : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },

        token : {
            type : Sequelize.STRING(40),
            allowNull : false,
            comment : 'access token 값'
        },

        wallet_id : {
            type : Sequelize.STRING(40),
            allowNull : false,
            comment : '접속 지갑 주소'
        },

        expiredAt : {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            comment : '접속 유지 시간'
        }


    }, {
        tableName : '_access_token_log',
        timestamps : true,
    });

    token.associate = function(models) {

    };

    return token;
}