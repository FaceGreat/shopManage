/**
 * Created by Administrator on 2017/4/26.
 */

const userSqlMap = {
  //角色
  role : {
    //添加一个用户角色
    saveRole: 'insert into role(name) values(?)',
    //更新指定角色信息
    updateRoleById : 'update role set name=? where roleId=?',
    //获取指定页数角色信息
    getAllRoleByPage : 'select * from role',
    //获取角色总数据count
    findRoleCount : 'SELECT count(r.roleId) as count FROM role r',
    //获取所有角色信息，用于下拉选择
    getRoleBySelect : 'select * from role',
    //删除指定角色信息
    deleteRoleId : 'delete from role where roleId=?'
  },
  //员工
  employee : {
    //登录
    login : 'select * from employee where employeeId=? and password=?',
    //保存新增员工信息
    saveEmployee : 'insert into employee values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //更新指定员工信息
    updateEmployeeById : 'update employee set name=?, roleId=?, position=?, contactPhone=?, contactAddress=?, IdCard=?, entryTime=?, sex=?, Status=? where employeeId=?',
    //更新指定的员工的状态
    updateEmployeeStatusById : 'update employee set Status=? where employeeId=?',
    /*//模糊查询不带部门
    fuzzyQueryByPage : 'select e.*, r.name as roleName from employee e, role r where e.roleId = r.roleId AND e.Status != -2 AND concat(e.employeeId, e.name, r.name, e.position, e.contactPhone, e.contactAddress, e.IdCard, e.sex, e.Status) like "%"?"%"',
    //模糊查询带部门
    fuzzyQueryByPageAndRoleId : 'select e.*, r.name as roleName from employee e, role r where e.roleId = r.roleId AND e.Status != -2 AND e.roleId=? AND concat(e.employeeId, e.name, r.name, e.position, e.contactPhone, e.contactAddress, e.IdCard, e.sex, e.Status) like "%"?"%"',*/
    //不指定部门查询
    getEmployeeByPage : 'select e.*, r.name as roleName from employee e, role r where e.roleId = r.roleId and e.Status != -2',
    //获取员工的总数
    findEmployeeCount : 'SELECT count(e.employeeId) as count FROM employee e, role r WHERE e.roleId = r.roleId AND  e.Status != -2 ',
    // 通过员工号获取员工信息
    getEmployeeById : 'select e.employeeId, e.name from employee e where employeeId=?',
    /*//获取指定页数的员工信息
    getEmployeeByPageAndRoleId : 'select e.*, r.name as roleName from employee e, role r where e.roleId = r.roleId and e.Status != -2 and  ',*/

    //删除指定员工信息，暂时未用
    deleteEmployeeById : 'delete from employee where employeeId=?',
  },
  //供应商
  provide : {
    //新增一个供应商信息
    saveProvide : 'insert into provide(provideId, name, contactPerson, contactPhone, contactAddress, contactEmail, categoryId, Status, remark) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    //获取指定id的供应商信息
    getProvideById : 'select * from provide where provideId=?',
    //获取所有供应商的信息
    getProvideByPage : 'select p.*, c.`name` as categoryName from provide p, category c where p.categoryId = c.categoryId',
    //获取指定供货类型的供应商
    getProvideByPageAndCategoryId : 'select p.*, c.`name` as categoryName from provide p, category c where p.categoryId = c.categoryId',
    //获取所有供应商信息，用于选择框的选择
    getProvideBySelect : 'select provideId, name from provide',
    //更新指定id的供应商信息
    updateProvideById : 'update provide set name=?, contactPerson=?, contactPhone=?, contactAddress=?, contactEmail=?, categoryId=?, Status=?, remark=? where provideId=?',
    //更新指定id的供应商的状态
    updateProvideStatusById : 'update provide set Status=? where provideId=?',

    //指定查询添加下的供应商信息
    findProvideCount : 'SELECT count(p.provideId) AS count FROM provide p',

    //删除指定供应商信息
    deleteProvideById : 'delete from provide where provideId=?'
  },
  //会员
  member　: {
    //增加一个会员类型
    saveMemberDiscount : 'insert into discount(name, discount, timesLimit, costLimit) values(?, ?, ?, ?)',
    //修改一个会员类型
    updateMemberDiscountById  : 'update discount set name=?, discount=?, timesLimit=?, costLimit=? where discountId=?',
    //删除一个会员类型
    deleteMemberDiscountById : 'delete from discount where discountId=?',
    //获取指定页数的会员类型
    getMemberDiscountByPage :  'select * from discount',
    //获取会员类型的数据数量
    findMemberDiscountCount : 'SELECT count(d.discountId) as count FROM discount d',

    //获取所有会员类型（下拉）
    getAllMemberDiscount : 'select discountId, name from discount',

    //增加会员信息
    saveMember : 'insert into member(memberId, name, memberPhone, discountId, consumeTimes,  consumeCost, Status, regDate) values(?, ?, ?, ?, ?, ?, ?, ?)',
    //更新会员信息
    updateMemberById : 'update member set name=?, memberPhone=?, discountId=? where memberId=?',
    //更新会员状态信息
    updateMemberStatus : 'update member set Status=-Status, remark=?  where memberId=?',
    //更新会员消费次数和累计消费金额
    updateMemberConsume : 'update member set consumeTimes = consumeTimes+1, consumeCost=consumeCost+?  where memberId=?',
    //删除指定会员信息
    deleteMemberById : 'delete from member where memberId=?',
    //清除禁用的会员信息
    removeMemberByStatus : 'delete from  member where Status=-1',
    //获取指定页数的会员信息
    getMemberByPage : 'select m.*,d.discount,d.`name` as discountName from member m, discount d where m.discountId=d.discountId',

    //获取指定条件下员工的数据总数
    findMemberCount : 'SELECT count(m.memberId) as count FROM member m',

    //获取未禁用的会员信息
    findAllBillMember : 'select m.*,d.discount,d.`name` as discountName from member m, discount d where m.discountId=d.discountId and m.Status = 1',
    findMemberCountToBill : 'SELECT count(m.memberId) as count FROM member m where m.Status = 1',
    //获取所有用户禁用状态的描述
    getMemberRemark  : 'select m.remark from member m where m.Status=-1',
    //获取指定会类型指定页数的会员信息
    getMemberByTypeAndPage : 'select m.*,d.discount,d.`name` as discountName from member m, discount d where m.discountId=? and m.discountId=d.discountId',
    //获取指定卡号的会员信息
    getMemberById : 'select m.memberId, m.name, m.`Status`,m.remark, d.discount  from member m, discount d where memberId=? and m.discountId = d.discountId',
  }
};



module.exports = userSqlMap;
