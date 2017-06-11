/**
 * Created by Administrator on 2017/5/10.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/billMapImpl');


/**
 * 保存一张收银单
 */
router.post('/saveBill', (req, res, next) => {
  $sql.saveBill(req, res, next);
});

/**
 * 获取指定员工指定页数的进货单数据
 */
router.get('/findBillByEmployeeAndPage', (req, res, next) => {
    $sql.findBillByEmployeeAndPage(req, res, next);
});

/**
 * 获取所有进货单指定页数（管理员）
 */
router.get('/findBillByPage', (req, res, next) => {
  $sql.findBillByPage(req, res, next);
});

/**
 * 获取指定员工的收银信息
 */
router.get('/findAllCommodityByEmployeeAndPage', (req, res, next) => {
  $sql.findAllCommodityByEmployeeAndPage(req, res, next);
});

/***
 * 获取指定收银单号的详细信息
 */
router.get('/findCommodityByBillId', (req, res, next) => {
  $sql.findCommodityByBillId(req, res, next);
});

/**
 * 获取收银单中商品信息的总数
 */
router.get('/findCountByInfo', (req, res, next) => {
  $sql.findCountByInfo(req, res, next);
});

/**
 * 删除指定收银单据
 */
router.delete('/deleteBillByBillId/:billId', (req, res, next) => {
  $sql.deleteBillByBillId(req, res, next);
});


module.exports = router;
