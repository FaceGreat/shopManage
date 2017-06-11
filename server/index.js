/**
 * Created by Administrator on 2017/4/26.
 */
const fs  = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//定义session
app.use(cookieParser());
//配置session
app.use(session({
  secret : 'userStore',
  cookie :{maxAge : 600000000000000},
  resave :false,
  saveUninitialized : true
}));

//定义后端路由参数
const users = require('./api/user');
const menus = require('./api/menu');
const commodity = require('./api/commodity');
const purchases = require('./api/purchase');
const bills = require('./api/bill');
const inventory = require('./api/inventory');
//后端路由
app.use('/api/user', users);
app.use('/api/menu', menus);
app.use('/api/commodity', commodity);
app.use('/api/purchase', purchases);
app.use('/api/bill', bills);
app.use('/api/inventory', inventory);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');
