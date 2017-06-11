/**
 * Created by Administrator on 2017/5/1.
 */


const commoditySqlMap = {
  //添加一个新的商品类型
  saveSort : 'insert into category(name) values(?)',
  //获取指定页数的商品类型
  findSortByPage : 'select * from category',

  //获取全部商品类型
  findSortCount : 'SELECT  COUNT(c.categoryId) AS count from category c',

  //获取所有的商品类型
  findAllSort : 'select * from category',
  //更新指定id的商品类型信息
  updateSortById : 'update category set name=? where categoryId=?',
  //删除指定id的商品类型
  deleteSortById : 'delete from category where categoryId=?',

  //添加一个新的商品单位
  saveUnit : 'insert into unit(name) values(?)',
  //获取指定页数的商品单位
  findUnitByPage : 'select * from unit',
  //获取商品单位的总数
  findUnitCount : 'SELECT count(u.unitId) AS count FROM unit u',
  //更新指定id的商品单位信息
  updateUnitById : 'update unit set name=? where unitId=?',
  //删除指定id的商品单位
  deleteUnitById : 'delete from unit where unitId=?',
  //获取所有指定的商品单位
  findAllUnit : 'select * from unit',

  //添加一个新的商品资料信息
  saveCommodity : 'insert into commodity(commodityId, categoryId, barcode, name, format, unitId, retailPrice, costPrice, quantityUpperLimit, quantityLowerLimit, createDate, provideId, Status, remark) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  //获取指定页数的商品资料信息
  findCommodityByPage  : 'select c.*, s.FactStoreNum as factNum, p.name as provideName, g.name as categoryName, u.name as unitName FROM commodity c,store s, category g, provide p, unit u WHERE c.categoryId = g.categoryId and c.Status != -2 and c.provideId = p.provideId and c.unitId = u.unitId and c.commodityId = s.commodityId',
  //获取全部商品资料信息的总数
  findCommodityCount : 'SELECT count(c.commodityId) AS count FROM commodity c, category g, unit u, store s WHERE c.categoryId = g.categoryId AND c.unitId = u.unitId AND c.`Status` != - 2 and c.commodityId = s.commodityId',

  //获取指定字段的商品资料信息，用于进货选择,指定商品类型
  /*getSelectCommodityListByPageAndCategoryId : 'SELECT c.commodityId, c.barcode, c.name, c.format,u.name as unitName, c.costPrice, c.retailPrice, s.FactStoreNum, (c.quantityUpperLimit-s.FactStoreNum) as limitNum FROM commodity c, unit u, store s where c.commodityId =s.commodityId and c.Status != -2 and c.unitId = u.unitId and c.categoryId=?',*/
  //获取指定字段的商品资料信息，用于进货选择,全部
  getSelectCommodityListByPage : 'SELECT c.commodityId, c.barcode, c.name, c.format,u.name as unitName, c.costPrice, c.retailPrice,s.FactStoreNum, (c.quantityUpperLimit-s.FactStoreNum) as limitNum FROM commodity c, unit u, store s where c.commodityId =s.commodityId and c.Status != -2 and c.unitId = u.unitId AND s.FactStoreNum !=0',
  //获取指定类型的商品资料信息
  /*findCommodityByPageAndCategoryId: 'select c.*, s.FactStoreNum as factNum, p.name as provideName, g.name as categoryName, u.name as unitName FROM commodity c,store s, category g, provide p, unit u WHERE c.categoryId=? and c.categoryId = g.categoryId and c.Status != -2 and c.provideId = p.provideId and c.unitId = u.unitId and c.commodityId = s.commodityId',*/
  //切换商品的状态
  updateCommodityStatusById : 'update commodity set Status=? where commodityId=?',
  //更新指定产品信息
  updateCommodityById : 'update commodity set categoryId=?, barcode=?, name=?, format=?, unitId=?, retailPrice=?, costPrice=?, quantityUpperLimit=?, quantityLowerLimit=?, provideId=?, Status=?, remark=? where commodityId=?',
  //删除指定id的商品信息
  deleteCommodityById : 'delete from commodity where commodityId=?',
  //模糊查询，在收银清单中模糊查询编号或条形码匹配的商品
  findLikeCommodity : 'SELECT c.commodityId, c.barcode, c.name, c.format,u.name as unitName, c.costPrice, c.retailPrice,s.FactStoreNum, (c.quantityUpperLimit-s.FactStoreNum) as limitNum FROM commodity c, unit u, store s where c.commodityId =s.commodityId and c.Status != -2 and s.FactStoreNum != 0 and c.unitId = u.unitId AND concat(c.commodityId, c.barcode) LIKE "%"?"%"',

  //创建一个新的商品库存信息
  createOneStore : 'insert into store(infoId, commodityId, FactStoreNum) values(?, ?, ?)',



};


module.exports = commoditySqlMap;
