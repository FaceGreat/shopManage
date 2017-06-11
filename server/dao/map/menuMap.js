/**
 * Created by Administrator on 2017/4/29.
 */


const menuSqlMap = {
    //添加菜单项
    insert :  'insert into menu(name, url, fatherMenuId, icon, level) values(?, ?, ?, ?, ?)',
    //查询所有菜单
    findAllMenu : 'select * from menu',
    //更新菜单项信息
    update : 'update menu set name=?, url=?, fatherMenuId=?, icon=? where menuId=?',
    //删除指定id的菜单项
    deleteMenuById : 'delete from menu where menuId=?',
    //获取指定角色菜单
    getAllMenuByBar : 'select * from menu',
    //获取指定菜单已经授权的菜单
    //getAlreadyOwnByRole : 'SELECT m.* FROM menu m where m.menuId in (SELECT rm.menuId FROM role_menu rm where rm.roleId=?)',
    getAlreadyOwnByRole : 'SELECT m.*, rms.role_menu_id as rmi FROM menu m, role_menu rms where rms.menuId =m.menuId and rms.roleId =? and  m.menuId in (SELECT rm.menuId FROM role_menu rm where rm.roleId=?)',
    //获取指定菜单未授权的菜单
    getNotOwnByRole : 'SELECT m.* FROM menu m where m.menuId NOT in (SELECT rm.menuId FROM role_menu rm where rm.roleId=?)',
    //添加指定角色的授权菜单
    saveEmployeePermission : 'insert into role_menu(roleId, menuId) values ?',
    //删除指定角色的授权菜单
    deleteEmployeePermission : 'delete from role_menu where role_menu_id in (?)',
};



module.exports = menuSqlMap;
