/**
 * Created by Administrator on 2017/5/10.
 */

const purchaseMapSql = {
  //保存进货单中的商品信息
  savePurchaseOfCommodity : 'insert into purchase_info(infoId, serialId, commodityId, commodityNumber) values ?',
  //保存进货单的额外信息
  savePurchaseOfOther : 'insert into purchase_list(serialId, serialDate, totalMoney, reviewId,  serialDesc) values(?, ?, ?, ?, ?)',
  //保存进货单的审核信息
  savePurchaseOfReview : 'insert into review(reviewId, systemId, systemTime, reviewPersonId, reviewTime, Status) values(?, ?, ?, ?, ?, ?)',

  //获取指定员工指定页数的进货单管理信息
  findPurchaseByEmployeeAndPage : 'SELECT pl.*, r.*,(SELECT e. NAME FROM 	employee e	WHERE	r.systemId = e.employeeId	AND pl.reviewId = r.reviewId) AS systemName,(SELECT	e. NAME	FROM employee e WHERE r.reviewPersonId = e.employeeId AND pl.reviewId = r.reviewId) AS reviewPersonName FROM	purchase_list pl,	review r  WHERE	r.systemId =?  and pl.reviewId = r.reviewId',
  //获取指定用户的进货单总数
  findPurchaseCountByEmployee : 'SELECT count(pl.serialId) AS count FROM purchase_list pl, review r WHERE pl.reviewId = r.reviewId AND r.systemId = ?',

  //获取指定页数的进货单
  findPurchaseByPage : 'SELECT pl.*, r.*,(SELECT e. NAME FROM 	employee e	WHERE	r.systemId = e.employeeId	AND pl.reviewId = r.reviewId) AS systemName,(SELECT	e. NAME	FROM employee e WHERE r.reviewPersonId = e.employeeId AND pl.reviewId = r.reviewId) AS reviewPersonName FROM	purchase_list pl,	review r  WHERE pl.reviewId = r.reviewId',
  //获取管理员查看所有进货单总数
  findPurchaseCountByAdmin : 'SELECT count(pl.serialId) AS count FROM purchase_list pl, review r WHERE pl.reviewId = r.reviewId',



  //通过入库单号查询多个商品信息
  findCommodityByPurchaseId : 'SELECT c.commodityId, c.barcode, c.name, format, costPrice, u.name as unitName, pi.commodityNumber as num FROM purchase_info pi, commodity c, unit u WHERE pi.serialId=? and pi.commodityId = c.commodityId and c.unitId = u.unitId',
  //通过审核号查询指定的审核信息
  findReviewByReviewId : 'SELECT * , (SELECT e.name  from employee e where r.systemId = e.employeeId) as systemName, (SELECT e.name  from employee e where r.reviewPersonId = e.employeeId) as reviewPersonName  FROM review r WHERE r.reviewId=?',
  //获取总的数据
  findPurchaseOtherByPurchaseId : 'SELECT * FROM purchase_list pl WHERE pl.serialId=?',

  //获取指定页数的进货单进货商品信息
  findAllPurchaseByEmployeeAndPage : 'SELECT 	pi.*,pl.serialDate, c.barcode,name,costPrice,format,r.reviewId,r.`Status`, ( SELECT u. name FROM unit u WHERE u.unitId = c.unitId ) AS unitName, ( SELECT p. name FROM provide p WHERE p.provideId = c.provideId ) AS provideName FROM purchase_list pl, purchase_info pi, commodity c, review r WHERE r.systemId =? AND r.reviewId = pl.reviewId AND pi.commodityId = c.commodityId AND pl.serialId = pi.serialId',
  //获取指定页数的进货单进货商品信息总数
  findAllPurchaseCountByEmployee : 'SELECT count(pi.infoId) as count FROM purchase_list pl, purchase_info pi, review r WHERE r.systemId =? AND r.reviewId = pl.reviewId AND pl.serialId = pi.serialId',

  //管理员获取指定页数的进货单进货商品信息
  findAllPurchaseByAdminAndPage : 'SELECT pi.*,pl.serialDate, c.barcode,name,costPrice,format,r.reviewId,r.`Status`, ( SELECT u. name FROM unit u WHERE u.unitId = c.unitId ) AS unitName, ( SELECT p. name FROM provide p WHERE p.provideId = c.provideId ) AS provideName FROM purchase_list pl, purchase_info pi, commodity c, review r WHERE r.reviewId = pl.reviewId AND pi.commodityId = c.commodityId AND pl.serialId = pi.serialId',
  //管理员获取指定页数的进货单进货商品信息总数
  findAllPurchaseCountByAdmin : 'SELECT count(pi.infoId) AS count FROM 	purchase_list pl, purchase_info pi, review r WHERE	r.reviewId = pl.reviewId AND pl.serialId = pi.serialId',

  //审核通过后更新库存表的信息
  updatePurchaseToStore : 'update store set FactStoreNum=FactStoreNum+? where commodityId=?',
  //更新指定进货单的审核表
  updatePurchaseToReview  : 'update review set reviewPersonId=?, reviewTime=?, Status=2 where reviewId=?',


  /**
   * 删除进货单
   */
  //删除指定进货单对应的商品信息
  deletePurchaseOfCommodity : 'delete from purchase_info where serialId=?',
  //删除指定盘点单其他信息
  deletePurchaseOfOther : 'delete from purchase_list where serialId=?',
  //删除盘点单据审核信息
  deletePurchaseByReview : 'delete from review where reviewId=?',
};

module.exports = purchaseMapSql;
