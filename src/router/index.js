
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from  '@/components/common/Home'
import DashBoard from  '@/components/common/dashBoard'

//菜单管理
import menuManage from '@/components/menu/menuManage'//菜单管理
import AllocMenu from '@/components/menu/allocMenu' //分配菜单

//商品管理
import SortManage from  '@/components/commodity/sortManage'//分类管理
import UnitManage from  '@/components/commodity/unitManage'//单位管理
import MaterialManage from '@/components/commodity/materialManage' //商品资料管理
import MaterialMessageForm from '@/components/commodity/materialMessageForm' //商品资料填写或修改

//用户管理
import ProvideManage from '@/components/user/provide/provideManage'//供应商管理
import ProvideMessageForm from '@/components/user/provide/provideMessageForm' //供应商资料填写或修改
import MemberManage from '@/components/user/member/memberManage'//会员信息管理
import MemberDiscount from '@/components/user/member/memberDiscount' //会员折扣管理
import EmployeeManage from '@/components/user/employee/employeeManage.vue' //员工信息管理
import SectionMange from '@/components/user/employee/SectionMange.vue' //员工所属部门管理
import EmployeeMessageForm from '@/components/user/employee/employeeMessageForm.vue' //员工信息添加

//进货管理
import AddPurchaseList from '@/components/purchase/addPurchaseList' //添加进货单
import PurchaseManage from '@/components/purchase/purchaseManage' //进货单管理
import PurchaseListInfo from '@/components/purchase/purchaseListInfo' //进货单清单
import MyPurchaseList from '@/components/purchase/myPurchaseList' //我的进货单

//库存管理
import AddInventoryList from '@/components/inventory/addInventoryList' //添加盘点单
import InventoryManage from '@/components/inventory/inventoryManage' //盘点单管理
import InventoryListInfo from '@/components/inventory/inventoryListInfo' //盘点单清单
import MyInventoryList from '@/components/inventory/myInventoryList' //我的盘点单

//销售管理
import CashRegister from  '@/components/sales/cashRegister' //前台收银
import CashRegisterManage from '@/components/sales/cashRegisterManage' //销售管理
import CashRegisterList from '@/components/sales/cashRegisterList' //收银清单
import MyCashRegister from  '@/components/sales/myCashRegister'//我的销售管理


Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path : '/home',
      component: Home,
      children : [
        {
          path : '',
          name : 'home',
          component : DashBoard
        },
        //菜单管理
        {
          path : '/home/menuManage',
          name : 'menuManage',
          component : menuManage
        },
        //菜单分配
        {
          path : '/home/allocMenu',
          name : 'allocMenu',
          component : AllocMenu
        },
        //商品单位管理
        {
          path : '/home/sort',
          name : 'sortManage',
          component : SortManage
        },
        //商品分类管理
        {
          path  : '/home/unit',
          name : 'unitManage',
          component : UnitManage
        },
        //商品资料管理
        {
          path : '/home/material',
          name : 'materialManage',
          component : MaterialManage
        },
        //商品资料添加
        {
          path : '/home/material/addMaterialMessage',
          name : 'addMaterialMessage',
          component : MaterialMessageForm
        },
        //商品资料修改
        {
          path : '/home/material/updateMaterialMessage',
          name : 'updateMaterialMessage',
          component : MaterialMessageForm
        },
        //添加进货单
        {
          path : '/home/addPurchaseList',
          name : 'addPurchaseList',
          component : AddPurchaseList
        },
        //进货单信息
        {
          path : '/home/purchaseListMessage',
          name : 'purchaseListMessage',
          component : AddPurchaseList
        },
        //添加盘点单
        {
          path : '/home/InventoryListMessage',
          name : 'InventoryListMessage',
          component : AddInventoryList
        },
        //盘点单信息
        {
          path : '/home/addInventory',
          name : 'addInventory',
          component : AddInventoryList
        },
        //审核进货单信息
        {
          path : '/home/reviewPurchaseList',
          name : 'reviewPurchaseList',
          component : AddPurchaseList
        },
        //审核盘点单信息
        {
          path : '/home/reviewInventory',
          name : 'reviewInventory',
          component : AddInventoryList
        },
        //进货单明细
        {
          path : '/home/purchaseManage',
          name : 'purchaseManage',
          component : PurchaseManage
        },
        //盘点单管理
        {
          path : '/home/inventoryManage',
          name : 'inventoryManage',
          component : InventoryManage
        },
        //进货单管理
        {
          path : '/home/purchaseListInfo',
          name : 'purchaseListInfo',
          component : PurchaseListInfo
        },
        //盘点单明细
        {
          path : '/home/inventoryListInfo',
          name : 'inventoryListInfo',
          component : InventoryListInfo
        },
        //我的进货单
        {
          path : '/home/myPurchaseList',
          name : 'myPurchaseList',
          component : MyPurchaseList
        },
        //我的盘点单
        {
          path : '/home/myInventory',
          name : 'myInventory',
          component : MyInventoryList
        },
        //供应商资料管理
        {
          path : '/home/provideManage',
          name : 'provideManage',
          component : ProvideManage
        },
        //供应商资料填写或修改
        {
          path : '/home/provideManage/addProvide',
          name : 'addProvide',
          component : ProvideMessageForm
        },
        //更新供货商信息
        {
          path : '/home/provideManage/updateProvide',
          name : 'updateProvide',
          component : ProvideMessageForm
        },
        //前台收银
        {
          path : '/home/sales/cashRegister',
          name : 'cashRegister',
          component : CashRegister
        },
        //前台收银
        {
          path : '/home/sales/cashRegisterMessage',
          name : 'cashRegisterMessage',
          component : CashRegister
        },
        //销售管理
        {
          path : '/home/sales/cashRegisterManage',
          name : 'cashRegisterManage',
          component : CashRegisterManage
        },
        //销售清单
        {
          path : '/home/sales/cashRegisterList',
          name : 'cashRegisterList',
          component : CashRegisterList
        },
        //我的销售管理
        {
          path : '/home/sales/myCashRegister',
          name : 'myCashRegister',
          component : MyCashRegister
        },
        //会员信息管理
        {
          path : '/home/memberManage',
          name : 'memberManage',
          component : MemberManage
        },
        //会员折扣
        {
          path : '/home/memberDiscount',
          name : 'memberDiscount',
          component : MemberDiscount
        },
        //员工管理
        {
          path : '/home/employeeManage',
          name : 'employeeManage',
          component : EmployeeManage
        },
        //员工信息填写
        {
          path : '/home/employee/addEmployee',
          name : 'addEmployee',
          component : EmployeeMessageForm
        },
        //更新员工信息
        {
          path : '/home/employee/updateEmployee',
          name : 'updateEmployee',
          component : EmployeeMessageForm
        },
        //员工所属部门信息管理
        {
          path : '/home/employee/sectionMange',
          name : 'sectionMange',
          component : SectionMange
        }
      ]
    }
  ]
})
