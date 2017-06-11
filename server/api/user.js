/**
 * Created by Administrator on 2017/4/26.
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../dao/impl/userMapImpl');

/**
 * 登录
 */
router.get('/employee/login', (req, res, next) =>{
  $sql.employee.login(req, res, next);
});

router.get('/employee/logout', (req, res, next) => {
  req.session.destroy();
  res.json({
    result : {
      code : true,
      msg : '已退出系统'
    }
  });
});

router.get('/employee/loginUserMessage' , (req, res, next) => {
  let result = {};
  if(req.session.user) {
    result = {
      code : true,
      result : req.session.user
    }
  }else{
    result = {
      code : false,
      msg : '未登录，请重新登录'
    }
  }
  res.json({
    result : result
  });
});



/**
 * 添加角色
 */
router.post('/role/addRole', (req, res, next) => {
  $sql.role.saveRole(req, res,next);
});

/**
 * 添加员工信息
 */
router.post('/employee/addEmployee', (req, res, next) => {
  $sql.employee.saveEmployee(req, res, next);
});

/**
 * 添加供应商信息
 */
router.post('/provide/addProvide', (req, res, next) => {
  $sql.provide.saveProvide(req, res, next);
});


/**
 * 获取指定页数的所属部门信息
 */
router.get('/role/getRoleByPage', (req, res, next) => {
  $sql.role.getAllRoleByPage(req, res, next);
});

/**
 * 获取指定页数的员工信息
 */
router.get('/employee/getEmployeeByPage', (req, res, next) => {
  $sql.employee.getEmployeeByPage(req, res, next);
});

/**
 * 获取指定员工号的员工信息
 */
router.get('/employee/getEmployeeById', (req, res, next) => {
  $sql.employee.getEmployeeById(req, res, next);
});

/**
 * 获取指定页数的供应商信息
 */
router.get('/provide/getProvideByPage', (req, res, next) => {
  $sql.provide.getProvideByPage(req, res, next);
});

/**
 * 获取所有角色信息，用于选择
 */
router.get('/role/getRoleBySelect', (req, res, next) => {
  $sql.role.getRoleBySelect(req, res, next);
});

/**
 * 获取所有供应商信息（用于下拉选择）
 */
router.get('/provide/getProvideBySelect', (req, res, next) => {
  $sql.provide.getProvideBySelect(req, res, next);
});




/**
 * 更新一条部门信息
 */
router.put('/role/updateRoleById', (req, res, next) => {
  $sql.role.updateRoleById(req, res, next);
});

/**
 * 更新一条员工信息
 */
router.put('/employee/updateEmployeeById', (req, res, next) => {
  $sql.employee.updateEmployeeById(req, res, next);
});

/**
 * 更新员工使用状态
 */
router.put('/employee/updateEmployeeStatusById', (req, res, next) => {
  $sql.employee.updateEmployeeStatusById(req, res, next);
});


/**
 * 更新一条供应商信息
 */
router.put('/provide/updateProvideById', (req, res, next) => {
  $sql.provide.updateProvideById(req, res, next);
});

/**
 * 更新指定id的供应商状态
 */
router.put('/provide/updateProvideStatusById', (req, res, next) => {
  $sql.provide.updateProvideStatusById(req, res, next);
});

/**
 * 删除一个部门信息
 */
router.delete('/role/deleteRoleId/:roleId', (req, res, next) => {
  $sql.role.deleteRoleId(req, res, next);
});

/**
 * 删除一个员工信息
 */
router.delete('/employee/deleteEmployeeById/:employeeId', (req, res, next) =>{
  $sql.employee.deleteEmployeeById(req, res, next);
});

/**
 * 删除一条供应商信息
 */
router.delete('/provide/deleteProvideById/:provideId', (req, res, next) => {
    $sql.provide.deleteProvideById(req, res, next);
});


/***
 * ***********************    会员信息    ************************
 */

/**
 * 保存一个会员类型
 */
router.post('/saveMemberDiscount', (req, res, next) => {
  $sql.member.saveMemberDiscount(req, res, next);
});

/**
 * 更新一个会员类型信息
 */
router.put('/updateMemberDiscountById', (req, res, next) => {
  $sql.member.updateMemberDiscountById(req, res, next);
});

/**
 * 删除一个会员类型
 */
router.delete('/deleteMemberDiscountById/:discountId', (req, res, next) => {
  $sql.member.deleteMemberDiscountById(req, res, next);
});

/**
 * 获取指定页数的会员类型
 */
router.get('/getMemberDiscountByPage', (req, res, next) => {
  $sql.member.getMemberDiscountByPage(req, res, next);
});

/**
 * 获取所有会员类型，用户选择
 */
router.get('/getAllMemberDiscount', (req, res, next) => {
  $sql.member.getAllMemberDiscount(req, res, next);
});

/**
 * 获取禁用会员的禁用描述
 */
router.get('/getMemberRemark', (req, res, next) => {
  $sql.member.getMemberRemark(req, res, next);
});

/**
 * 获取指定类型的指定用户
 */
router.get('/getMemberByTypeAndPage', (req, res, next) =>{
  $sql.member.getMemberByTypeAndPage(req, res, next);
});

/**
 * 保存一个会员信息
 */
router.post('/saveMember', (req, res, next) => {
  $sql.member.saveMember(req, res, next);
});

/**
 * 更新指定会员个人信息
 */
router.put('/updateMemberById', (req, res, next) => {
  $sql.member.updateMemberById(req, res, next);
});



/**
 * 更新指定会员的状态
 */
router.put('/updateMemberStatus', (req, res, next) => {
  $sql.member.updateMemberStatus(req, res, next);
});

/**
 * 删除指定会员信息
 */
router.delete('/deleteMemberById/:memberId', (req, res, next) => {
  $sql.member.deleteMemberById(req, res, next);
});

/**
 * 清除禁用状态的会员信息
 */
router.delete('/removeMemberByStatus', (req, res, next) => {
  $sql.member.removeMemberByStatus(req, res, next);
});

/**
 * 获取指定页数的会员信息
 */
router.get('/getMemberByPage', (req, res, next) => {
  $sql.member.getMemberByPage(req, res, next);
});

/**
 * 获取可以使用的会员信息
 */
router.get('/findAllBillMember', (req, res, next) => {
  $sql.member.findAllBillMember(req, res, next);
});


/**
 * 获取指定卡号的会员信息
 */
router.get('/getMemberById', (req, res, next) => {
  $sql.member.getMemberById(req, res, next);
});

module.exports = router;
