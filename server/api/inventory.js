/**
 * Created by Administrator on 2017/5/30.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/inventoryMapImpl');


/**
 * 保存一张盘点单
 */
router.post('/saveInventory', (req, res, next) => {
  $sql.saveInventory(req, res, next);
});

/**
 * 获取指定员工的盘点单（我的盘点单功能）
 */
router.get('/findInventoryByEmployeeAndPage', (req, res, next) => {
  $sql.findInventoryByEmployeeAndPage(req, res, next);
});

/**
 * 获取所有的盘点单（管理员）
 */
router.get('/findInventoryByPage', (req, res, next) => {
  $sql.findInventoryByPage(req, res, next);
});

/**
 * 获取指定员工所制单的商品信息
 */
router.get('/findAllInventoryCommodityByEmployeeAndPage', (req, res, next) => {
  $sql.findAllInventoryCommodityByEmployeeAndPage(req, res, next);
});

/**
 * 获取指定盘点单的详细信息
 */
router.get('/findInventoryListMessage', (req, res, next) => {
  $sql.findInventoryListMessage(req, res, next);
});


/**
 * 审核盘点单
 */
router.put('/updateInventoryByReview', (req, res, next) => {
  $sql.updateInventoryByReview(req, res, next);
});

/**
 * 删除指定盘点单
 */
router.delete('/deleteInventoryById/:inventoryId/:reviewId', (req, res, next) =>{
  $sql.deleteInventoryById(req, res, next);
});

module.exports = router;
