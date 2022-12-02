

// 타임스탬프로 변환
module.exports.unix_timestamp = function() {
    return Math.floor(new Date().getTime() / 1000);
};

// null & undefined & 빈값 체크
module.exports.isEmpty = function(value) {
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ) {
        return true
    } else{
        return false
    }
};

// 랜덤 문자열
module.exports.createRandomString = function(stringLength = 5) {
    const chars = '0123456789abcdefghiklmnopqrstuvwxyz'
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
}