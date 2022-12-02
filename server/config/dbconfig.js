require('dotenv').config();

module.exports = {
    development : {        
        username : process.env.DB_USER || 'root',
        password : process.env.DB_PASS, // mysql 초기 설정한 비밀번호
        database : process.env.DB_NAME,
        host : process.env.DB_HOST || 'localhost',
        port : process.env.DB_PORT,
        dialect : "mysql",
    }
};