const express = require('express');
const User = require('../controllers/userController');
const Nft = require('../controllers/nftController');
const Offer = require('../controllers/offerController');
const Deal = require('../controllers/dealController');
const Mypage = require('../controllers/mypageController');
const Collection = require('../controllers/collectionController');
const { authChecker } = require('../auth'); // 로그인 token check

const router = express.Router();

// 전체 라우터
router.all('*', function (req, res, next) {
    console.log(req.body);
    next();
});

// 로그인 & 회원가입
router.post('/user/login', User.login);

// NFT 아이템 리스트
router.get('/nft/getItemList', Nft.getItemList);

// NFT 아이템 상세
router.get('/nft/getItem/:nft_token_id', Nft.getItem);

// Offer 리스트 
router.get('/offer/getList/:nft_token_id', Offer.getList);

// Offer 넣기
router.post('/offer/setOffer', authChecker, Offer.setOffer);

// Offer 취소
router.post('/offer/setCancel', authChecker, Offer.setCancel);

// Offer 승인 처리
router.post('/offer/setAccept', authChecker, Offer.setAccept);

// 거래내역 history
router.get('/deal/getHistoryList/:nft_token_id/:page', Deal.getHistoryList);

// 전체 거래 내역 history
router.post('/deal/getAllHistoryList', Deal.getAllHistoryList);

// 나의 NFT 아이템 리스트
router.post('/mypage/getMyItemList', authChecker, Mypage.getMyItemList);

// 나의 NFT 아이템 판매 등록
router.post('/mypage/setMyItemListing', authChecker, Mypage.setMyItem);

// 나의 NFT 전송
router.post('/mypage/setTransferItem', authChecker, Mypage.setTransferItem);

// 나의 NFT 판매 취소
router.post('/mypage/setMyItemCancelListing', authChecker, Mypage.setMyItemCancelListing);

// 컬렉션 랭킹
router.get('/collection/getRank/:day/:rank/:page', Collection.getRank);

// 컬렉션 리스트 (검색용)
router.get('/collection/getList', Collection.getList);

// 컬렉션 신청서 등록
router.post('/collection/setReady', authChecker, Collection.setReady);

// NFT 신청서 등록
router.post('/nft/setItemReady', authChecker, Nft.setItemReady);

// NFT 신청 리스트
router.post('/nft/getItemReadyList', authChecker, Nft.getItemReadyList);

// NFT 신청서 취소
router.post('/nft/setReadyCancel', authChecker, Nft.setReadyCancel);

module.exports = router;
