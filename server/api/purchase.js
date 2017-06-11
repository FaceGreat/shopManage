/**
 * Created by Administrator on 2017/5/10.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/purchaseMapImpl');


/**
 * 保存一张进货单
 */
router.post('/savePurchase', (req, res, next) => {
  $sql.savePurchase(req, res, next);
});

/**
 * 获取指定员工指定页数的进货单数据
 */
router.get('/findPurchaseByEmployeeAndPage', (req, res, next) => {
    $sql.findPurchaseByEmployeeAndPage(req, res, next);
});

/**
 * 获取所有进货单指定页数（管理员）
 */
router.get('/findPurchaseByPage', (req, res, next) => {
  $sql.findPurchaseByPage(req, res, next);
});


/**
 * 获取操作进货单信息
 */
router.get('/findPurchaseListMessage', (req, res, next) => {
  $sql.findPurchaseListMessage(req, res, next);
});

/**
 * 获取指定员工所制单的商品信息
 */
router.get('/findAllPurchaseByEmployeeAndPage', (req, res, next) => {
  $sql.findAllPurchaseByEmployeeAndPage(req, res, next);
});

/**
 * 审核进货单
 */
router.put('/reviewPurchase', (req, res, next) => {
  $sql.reviewPurchase(req, res, next);
});

/**
 * 删除指定进货单
 */
router.delete('/deletePurchaseById/:serialId/:reviewId', (req, res, next) =>{
  $sql.deletePurchaseById(req, res, next);
});


module.exports = router;
