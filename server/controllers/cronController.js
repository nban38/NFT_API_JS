const cron = require('node-cron');
const collectionService = require('../services/collectionService');
const cronService = require('../services/cronService');



/**
 * 거래내역에서 볼륨값 추출 후 컬렉션에 추가
 */
exports.startCronTab = async () => {
    cron.schedule('0 */1 * * *', async function() {
        
        //console.log('2분 마다 작업 실행 :', new Date().toString());
        let param = {};
        const dbResult = await collectionService.selectCollectionList(param);
        let count = parseInt(dbResult.count) || 0;

        if(count > 0) {
            for(let i = 0; i < count; i++) {

                let field = {
                    collection_id : dbResult.rows[i].collection_id
                };
                
                const volume = await cronService.selectCollectionTotalVolume(field);      // 전체 볼륨
                const owner = await cronService.selectCollectionTotalOwner(field);        // 소유주 수
                const item = await cronService.selectCollectionTotalItem(field);          // 전체 발행 수
                const floor = await cronService.selectCollectionFloorPrice(field);        // 바닥 가격
                
                field.volume = volume;
                field.floor = floor;
                field.item = item;
                field.owner = owner;
                await cronService.updateCollection(field);

            }
        }
        return true;

    }, null, true, 'UTC');
}