/**
 * Created by Administrator on 2017/4/29.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/menuMapImpl');

/**
 * 添加菜单项
 */
router.post('/addMenu', (req, res, next) => {
  $sql.add(req, res,next);
});

/**
 * 获取所有菜单项
 */
router.get('/findAllMenu',(req, res, next) => {
  $sql.findAllMenu(req, res, next);
});

/**
 * 更新菜单项内容
 */
router.put('/updateMenu', (req, res, next) => {
  $sql.updateMenu(req, res, next);
});

/**
 * 删除指定菜单项
 */
router.delete('/deleteMenu/:menuId', (req, res, next) =>{
  $sql.deleteMenuById(req, res, next);
});

/**
 * 获取指定角色菜单项
 */
router.get('/getAllMenuByBar', (req, res, next) => {
  $sql.getAllMenuByBar(req, res, next);
});

/**
 * 获取指定角色已经授权好的菜单
 */
router.get('/getAlreadyOwnByRole', (req, res, next) => {
  $sql.getAlreadyOwnByRole(req, res, next);
});

/**
 * 获取指定角色未授权好的菜单
 */
router.get('/getNotOwnByRole', (req, res, next) => {
  $sql.getNotOwnByRole(req, res, next);
});

/**
 * 保存设置角色权限菜单
 */
router.post('/saveEmployeePermission', (req, res, next) =>{
  $sql.saveEmployeePermission(req, res, next);
});

router.delete('/deleteEmployeePermission', (req, res, next) => {
  $sql.deleteEmployeePermission(req, res, next);
});

module.exports = router;
