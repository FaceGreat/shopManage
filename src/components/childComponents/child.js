/**
 * Created by Administrator on 2017/5/17.
 */
let MemberForm = require('components/childComponents/memberForm');//添加会员信息
let CommodityTable = require('components/childComponents/commodityTable');//商品信息选择
let SelectCashier = require('components/childComponents/entryCashier'); //选择收银员
let ToggleMemberStatus = require('components/childComponents/toggleMemberStatus'); //选择或输入禁用会员状态原因
let MemberToBillTable = require('components/childComponents/memberToBillTable');//收银单会员查找


module.exports = {
  memberForm : MemberForm,
  commodityTable : CommodityTable,
  selectCashier :SelectCashier,
  toggleMemberStatus : ToggleMemberStatus,
  memberToBillTable : MemberToBillTable
};
