/**
 * Created by Administrator on 2017/5/30.
 */

const inventoryMap = {
  //保存盘点单中的商品信息
  saveInventoryOfCommodity : 'insert into inventory_info(infoId, inventoryId, commodityId, storeNum, inventoryNum) values ?',
  //保存盘点单的额外信息
  saveInventoryOfOther : 'insert into inventory_list(inventoryId, inventoryTime, totalMoney, reviewId, remark) values(?, ?, ?, ?, ?)',
  //保存盘点单的审核信息
  saveInventoryOfReview :　'insert into review(reviewId, systemId, systemTime, reviewPersonId, reviewTime, Status) values(?, ?, ?, ?, ?, ?)',

  //获取指定员工的盘点单（我的盘点单功能）
  findInventoryByEmployeeAndPage : 'SELECT il.*,r.`Status`,r.reviewTime,r.systemTime, (SELECT e. `name` FROM employee e WHERE r.reviewPersonId = e.employeeId AND il.reviewId = r.reviewId ) AS reviewPersonName FROM inventory_list il, review r WHERE r.systemId =? AND il.reviewId = r.reviewId',
  //获取指定用户盘点单总数（指定用户）
  findInventoryCountByEmployee : 'SELECT count(il.inventoryId) AS count FROM inventory_list il, review r WHERE il.reviewId = r.reviewId AND r.systemId = ?',
  //获取所有的盘点单（管理员）
  findInventoryByPage: 'SELECT il.*, r.`Status`,r.reviewTime,r.systemTime, ( SELECT e. `name` FROM employee e WHERE r.systemId = e.employeeId AND il.reviewId = r.reviewId ) AS systemName, ( SELECT e. `name` FROM employee e WHERE r.reviewPersonId = e.employeeId AND il.reviewId = r.reviewId ) AS reviewPersonName FROM inventory_list il, review r WHERE il.reviewId = r.reviewId',
  //获取所有盘点单总数（管理员）
  findInventoryCountByAdmin : 'SELECT count(il.inventoryId) AS count FROM inventory_list il, review r WHERE il.reviewId = r.reviewId ',
  //获取指定页数的盘点单盘点商品信息
  findAllInventoryCommodityByEmployeeAndPage : 'SELECT ii.*, il.remark, c.barcode, `name`, costPrice, retailPrice, format, r.reviewId, r.`Status`, r.systemTime, (SELECT e.`name` from employee e WHERE e.employeeId = r.systemId) AS systemName,( SELECT u. `name` FROM unit u WHERE u.unitId = c.unitId ) AS unitName, ( SELECT p. `name` FROM provide p WHERE p.provideId = c.provideId ) AS provideName FROM inventory_list il, inventory_info ii, commodity c, review r WHERE r.systemId =? AND r.reviewId = il.reviewId AND ii.commodityId = c.commodityId AND il.inventoryId = ii.inventoryId',
  //获取盘点单总数（指定用户）
  findAllInventoryCommodityCountByEmployee :'SELECT count(ii.infoId) AS count FROM inventory_list il, inventory_info ii, review r WHERE r.reviewId = il.reviewId AND il.inventoryId = ii.inventoryId AND  r.systemId=?',
  //获取指定页数的盘点单盘点商品信息（管理员）
  findAllInventoryCommodityByAdminAndPage : 'SELECT ii.*, il.remark, c.barcode, `name`, costPrice, retailPrice, format, r.reviewId, r.`Status`,  r.systemTime, (SELECT e.`name` from employee e WHERE e.employeeId = r.systemId) AS systemName,( SELECT u. `name` FROM unit u WHERE u.unitId = c.unitId ) AS unitName, ( SELECT p. `name` FROM provide p WHERE p.provideId = c.provideId ) AS provideName FROM inventory_list il, inventory_info ii, commodity c, review r WHERE  r.reviewId = il.reviewId AND ii.commodityId = c.commodityId AND il.inventoryId = ii.inventoryId',
  //获取盘点单总数（管理员）
  findAllInventoryCommodityCountByAdmin : 'SELECT count(ii.infoId) AS count FROM inventory_list il, inventory_info ii, review r WHERE r.reviewId = il.reviewId AND il.inventoryId = ii.inventoryId',
  /**
   * 查询一张指定的盘点单
   */
  //通过盘点单查询多个盘点商品信息
  findCommodityByInventoryId : 'SELECT c.commodityId, c.barcode, c.`name`, format, costPrice, retailPrice, 	u.`name` AS unitName, ii.storeNum AS FactStoreNum , ii.inventoryNum AS num FROM inventory_info ii, commodity c, unit u WHERE ii.inventoryId =? AND ii.commodityId = c.commodityId AND c.unitId = u.unitId',
  //通过盘点单的审核号查询指定审核信息
  findInventoryReviewByReviewId: 'SELECT * , (SELECT e.name  from employee e where r.systemId = e.employeeId) as systemName, (SELECT e.name  from employee e where r.reviewPersonId = e.employeeId) as reviewPersonName  FROM review r WHERE r.reviewId=?',
  //查询盘点单的其他信息
  findAllInventoryOtherByInventoryId : 'SELECT * FROM inventory_list il WHERE il.inventoryId = ?',


  /**
   * 盘点单审核
   */
  //更新盘点单对应的商品的信息的实际库存
  updateInventoryToStore : 'update store set  FactStoreNum=FactStoreNum+? where commodityId=?',
  //更新指定盘点单的审核表信息
  updateInventoryToReview : 'update review set reviewPersonId=?, reviewTime=?, Status=2 where reviewId=?',

  /**
   * 删除单据
   */
  //删除指定盘点单对应的商品信息
  deleteInventoryOfCommodity : 'delete from inventory_info where inventoryId=?',
  //删除指定盘点单其他信息
  deleteInventoryOfOther : 'delete from inventory_list where inventoryId=?',
  //删除盘点单据审核信息
  deleteInventoryByReview : 'delete from review where reviewId=?',

};

module.exports = inventoryMap;
