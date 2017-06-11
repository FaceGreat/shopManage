/**
 * Created by Administrator on 2017/5/10.
 */

const purchaseMapSql = {
  //保存收银单的商品信息
  saveCommodityOfBill : 'insert into bill_info(infoId, billId, commodityId, commodityNum) values ?',
  //保存收银单的额外信息
  saveBillOfOther : 'insert into bill_list(billId, memberId, billUserId, totalMoney,  totalNum, systemTime, billTime) values(?, ?, ?, ?, ?, ?, ?)',
  //更新收银单中购买商品实际库存数量
  updateBillToStore : 'update store set FactStoreNum=FactStoreNum-? where commodityId=?',

  //获取指定员工指定页数的收银单管理信息
  findBillByEmployeeAndPage : 'SELECT bl.*, m.`name`, (SELECT e.`name` FROM employee e where bl.billUserId=e.employeeId) as billUserName,(SELECT d.discount FROM discount d WHERE d.discountId = m.discountId ) AS discountValue FROM bill_list bl LEFT JOIN member m ON bl.memberId = m.memberId WHERE bl.billUserId =?',

  //获取指定页数的收银单
  findBillByPage : 'SELECT bl.*, m.`name`, (SELECT e.`name` FROM employee e where bl.billUserId=e.employeeId) as billUserName,(SELECT d.discount FROM discount d WHERE d.discountId = m.discountId ) AS discountValue FROM bill_list bl LEFT JOIN member m ON bl.memberId = m.memberId',

  //通过收银单号查询指定收银清单信息
  findCommodityByBillId : 'SELECT bl.*, bi.commodityId,	bi.commodityNum, (SELECT e.`name` FROM employee e WHERE bl.billUserId = e.employeeId) AS billUserName, m.`name` AS memberName, d.discount, c.barcode, c.name, c.costPrice, c.retailPrice, (SELECT u.`name` FROM unit u WHERE c.unitId = u.unitId) as unitName FROM bill_list bl LEFT JOIN bill_info bi ON bl.billId = bi.billId LEFT JOIN member m ON bl.memberId = m.memberId LEFT JOIN discount d ON d.discountId = m.discountId LEFT JOIN commodity c ON bi.commodityId = c.commodityId WHERE bl.billId = ?',

  //获取指定页数的收银单商品信息
  findAllCommodityByEmployeeAndPage : 'SELECT bl.*, bi.commodityId, bi.commodityNum, ( SELECT e.`name` FROM employee e WHERE bl.billUserId = e.employeeId ) AS billUserName, m.`name` AS memberName, d.discount, c.barcode, c. name, c.costPrice, c.retailPrice, c.format, ( SELECT u.`name` FROM unit u WHERE c.unitId = u.unitId ) AS unitName, ( SELECT s.FactStoreNum FROM store s WHERE c.commodityId = s.commodityId ) AS factStoreNum FROM bill_list bl LEFT JOIN bill_info bi ON bl.billId = bi.billId LEFT JOIN member m ON bl.memberId = m.memberId LEFT JOIN discount d ON d.discountId = m.discountId LEFT JOIN commodity c ON bi.commodityId = c.commodityId WHERE bl.billUserId = ?',
  //管理员获取指定页数收银单商品信息
  findAllCommodityByAdminAndPage : 'SELECT bl.*, bi.commodityId, bi.commodityNum, ( SELECT e.`name` FROM employee e WHERE bl.billUserId = e.employeeId ) AS billUserName, m.`name` AS memberName, d.discount, c.barcode, c.name, c.costPrice, c.retailPrice, c.format, ( SELECT u.`name` FROM unit u WHERE c.unitId = u.unitId ) AS unitName, ( SELECT s.FactStoreNum FROM store s WHERE c.commodityId = s.commodityId ) AS factStoreNum FROM bill_list bl LEFT JOIN bill_info bi ON bl.billId = bi.billId LEFT JOIN member m ON bl.memberId = m.memberId LEFT JOIN discount d ON d.discountId = m.discountId LEFT JOIN commodity c ON bi.commodityId = c.commodityId',

  //获取收银单中商品信息的总数（管理员）
  findBillCommodityCountByAdmin : 'SELECT count(bi.infoId) AS count FROM bill_info bi, bill_list bl, commodity c WHERE bi.billId = bl.billId AND c.commodityId = bi.commodityId',
  //获取收银单中商品信息的总数（收银员）
  findBillCommodityCountByEmployee : 'SELECT count(bi.infoId) AS count FROM bill_info bi, bill_list bl, commodity c WHERE bl.billUserId = ? AND bi.billId = bl.billId AND c.commodityId = bi.commodityId ',

  //获取收银单的总数(收银员)
  findBillCountByEmployee : 'SELECT count(bl.billId) AS count FROM bill_list bl WHERE bl.billUserId = ?',
  //获取收银单的总数(管理员)
  findBillCountByAdmin : 'SELECT count(bl.billId) AS count FROM bill_list bl',

  //删除指定收银单
  deleteBillByBillId : 'delete from bill_list where billId=?',
  //删除指定收银单商品信息
  deleteBillCommodityByBillId : 'delete from bill_info where billId=?'

};

module.exports = purchaseMapSql;
