/**
 * Created by Administrator on 2017/5/1.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/commodityMapImpl');


/**
 * 添加一个商品类型
 */
router.post('/addSort', (req, res, next) => {
  $sql.saveSort(req, res, next);
});

/**
 * 添加一个商品单位
 */
router.post('/addUnit', (req, res, next) => {
  $sql.saveUnit(req, res, next);
});

router.post('/addCommodity', (req, res, next) => {
  $sql.saveCommodity(req, res, next);
});


/**
 * 获取指定页数的商品类型
 */
router.get('/findSortByPage', (req, res, next) => {
  $sql.findSortByPage(req, res, next);
});

/**
 * 获取指定页数的商品单位
 */
router.get('/findUnitByPage', (req, res, next) => {
  $sql.findUnitByPage(req, res, next);
});

/**
 * 获取指定页数的商品资料信息
 */
router.get('/findCommodityByPage', (req, res, next) => {
  $sql.findCommodityByPage(req, res, next);
});
/**
 * 获取所有商品指定信息
 */
router.get('/getSelectCommodityList', (req, res, next) =>{
  $sql.getSelectCommodityList(req, res, next);
});
/**
 * 获取所有的商品类型
 */
router.get('/findAllSort', (req, res, next) => {
  $sql.findAllSort(req, res, next);
});

/**
 * 获取所有的商品单位
 */
router.get('/findAllUnit', (req, res, next) => {
  $sql.findAllUnit(req, res, next);
});


/**
 * 更新指定商品类型
 */
router.put('/updateSortById', (req, res, next) => {
  $sql.updateSortById(req, res, next);
});

/**
 * 更新指定商品单位
 */
router.put('/updateUnitById', (req, res, next) => {
  $sql.updateUnitById(req, res, next);
});

/**
 * 更新指定商品资料的状态
 */
router.put('/updateCommodityStatusById', (req, res, next) => {
  $sql.updateCommodityStatusById(req, res, next);
});

/**
 * 更新指定商品资料的状态
 */
router.put('/updateCommodityById', (req, res, next) => {
  $sql.updateCommodityById(req, res, next);
});


/**
 * 删除指定商品类型
 */
router.delete('/deleteSortById/:categoryId', (req, res, next) => {
  $sql.deleteSortById(req, res, next);
});

/**
 * 删除指定商品单位
 */
router.delete('/deleteUnitById/:unitId', (req, res, next) => {
  $sql.deleteUnitById(req, res, next);
});

/**
 * 删除指定商品的信息
 */
router.put('/deleteCommodityById',(req, res, next) => {
  $sql.deleteCommodityById(req, res, next);
});

/**
 * 模糊查询商品信息
 */
router.get('/findLikeCommodity', (req, res, next) => {
  $sql.findLikeCommodity(req, res, next);
});


module.exports = router;
