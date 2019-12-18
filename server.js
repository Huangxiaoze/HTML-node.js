var express = require('express');
var fs = require('fs')
var bodyParser = require('body-parser')
var util = require('util')
var mysql = require('mysql')

const customer_table = require('./tables/customer.js')
const employee_table = require("./tables/employee.js")
const log_table = require("./tables/logs.js")
const product_table = require('./tables/product.js')
const purcharse_table = require("./tables/purcharse.js")
const supplier_table = require('./tables/supplier.js')

const pagePath = __dirname+'\\page'

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'huang0128',
	database:'exp4'
});
connection.connect()

var app = express();
hostname = '172.29.107.77'
// hostname = '127.0.0.1'
port = 8081

app.use(bodyParser.urlencoded({extended:false}))

app.get('/getUser',(req, res)=>{
	table = req.query.table 
	id = req.query.id 
	idname = req.query.idname 
	sql = 'select * from '+table+' where '+ idname +'=?'
	connection.query(sql,[id],(err, res1)=>{
		res.send({res:res1})
	})
})

app.get('/Login',(req, res)=>{
	table = req.query.table 
	id = req.query.id 
	var idname = table=='customers'?'cid':'sid'
	sql = 'select * from '+table+' where '+idname+'=?'
	connection.query(sql,[id],(err, res1)=>{
		if(err||res1.length==0){
			res.send({err:true})
		}else{
			res.send({err:false})
		}
	})
})

app.get('/monthSales',function(req, res){
	pid = req.query.pid
	month = req.query.month 
	sid = req.query.sid 
	console.log(pid, month, sid)
	purcharse_table.report_monthly_sale(month, pid, sid,connection).then((data)=>{res.send(data)}, (err)=>{res.send(err)})
})

app.get('/getSupply',function(req, res){
	sid = req.query.sid 
	supplier_table.getSupply(sid, connection).then((data)=>{res.send(data)},(err)=>{res.send(err)})
})


app.post('/buy',function(req, res){
	data = JSON.parse(req.body.data) 
	purcharse_table.buy(data, connection).then(function(data1){
		res.send(data1)
	},function(err){
		res.send(err)
	})
})

app.get('/getHisBuy',function(req, res){
	cid = req.query.cid 
	purcharse_table.getHisBuy(cid, connection).then(function(data){
		res.send(data)
	},function(err){
		res.send(err)
	})
})

app.get('/getCar', function(req, res){
	cid = req.query.cid 
	purcharse_table.getCar(cid, connection).then(function(data){
		res.send(data)
	},function(err){
		res.send(err)
	})
})

app.post('/add_to_car', function(req, res){
	cid = req.body.cid
	eid = req.body.eid 
	ptime = req.body.ptime 
	pid = req.body.pid 
	purcharse_table.add_to_car(cid, eid, pid,ptime,connection).then(function(data){
		res.send(data)
	},function(err){
		res.send(err)
	})
})
app.get('/search', function(req, res){
	pname = req.query.pname
	product_table.search_product(pname, connection).then(function(data){
		res.send(data)
	},function(err){
		res.send(err)
	})
})

app.get("/show_products",function(req, res){
	product_table.show_products(connection).then(function(data){
		res.send(data)
	},function(err){
		res.send(err)
	})
})


app.post('/register',function(req, res){
	username = req.body.user1
	password = req.body.pass1
	if(username=='' || password==''){
		res.send('error data')
		return
	}

	sql = 'select * from user where username=? and password=?'
	connection.query(sql,[username,password],function(err, resQ){
		if(resQ.length!=0){
			res.send("The user was existed.")
		}else{
			sql = 'insert into user(username, password) values(?,?)'
			connection.query(sql, [username, password])
			res.send("register success!")
		}
	})

})

app.post('/getData',function(req, res){
	table = req.body.table
	sql = 'select * from ' + table
	connection.query(sql, function(err, resQ){
		if(err){
			res.send("<font style='color:red;'>404 Not Found!</font>")
		} else {
			res.send(resQ)
		}
	})
})

app.post('/delete', function(req, res){
	table = req.body.table
	id = req.body.id
	key = req.body.key
	sql = "delete from "+ table + " where " + key + '=?'
	connection.query(sql,[id], (err, resQ)=>{
		if(err){
			res.send(err.sqlMessage)
		} else {
			res.send('Ok')
		}
	})
})
app.post('/save',function(req, res){
	table = req.body.table
	if (table == 'customers'){
		Param = customer_table.saveCustomer(req, res)
	} else if (table == 'employees') {
		console.log('employees')
		Param = employee_table.saveEmployee(req, res)
	} else if (table == 'logs') {
		console.log('logs')
		Param = log_table.saveLog(req, res)
	}else if (table == 'products'){
		console.log("products")
		Param = product_table.saveProduct(req, res)

	} else if (table == 'purchases') {
		console.log('purchases')
		Param = purcharse_table.savePurcharse(req, res)
	} else if (table == 'suppliers') {
		console.log('suppliers')
		Param = supplier_table.saveSupplier(req, res)
	}	
	if(Param == null){
		return
	}
	connection.query(Param.sql,Param.params, (err, resQ)=>{
		if(err){
			res.send(err.sqlMessage)
		}else{
			res.send('Ok')
		}
	})
})


app.post('/update', function(req, res){
	table = req.body.table
	if (table == 'customers') {
		console.log('customers')
		Param = customer_table.updateCustomer(req, res)
	} else if (table == 'employees') {
		console.log('employees')
		Param = employee_table.updateEmployee(req, res)
	} else if(table == 'logs') {
		console.log("logs")
		Param = log_table.updateLog(req, res)
	} else if (table == 'products') {
		console.log('products')
		Param = product_table.updateProduct(req, res)
 
 	} else if (table == 'purchares') {
 		console.log('purchares')
 		Param = purcharse_table.updatePurcharse(req, res)

	} else if(table == 'suppliers') {
		console.log('suppliers')
		Param = supplier_table.updateSupplier(req, res)
	}

	console.log(Param)
	if(Param == null){
		return
	}
	connection.query(sql,param,(err, resQ)=>{
		if(err){
			console.log('Err')
			console.log(err)
			res.send(err.sqlMessage)
		} else {
			console.log(resQ)
			res.send('Ok')
		}
	})

})

app.get('/login.html', function (req, res) {
	console.log("get login.html"	)
	res.sendFile(pagePath+'login.html')
})
app.post('/checkLogin',function(req, res){
	console.log('check_Login')
	console.log(req.body)
	username = req.body.user1
	password = req.body.pass1
	sql = 'select * from user where username=? and password = ?'
	connection.query(sql,[username, password],function(err, resQ){
		console.log(resQ)
		if(resQ.length == 0){
			res.send('the user was not existed.')
		} else {
			res.send('ok')
		}
	})

})
app.get('/index.html',function(req, res){
	console.log("get index.html")
	username = req.query.user1
	password = req.query.pass1
	sql = util.format('select * from user where username="%s" and password="%s"',username, password)
	connection.query(sql,function(err, resQ){
		if(err){
			res.send("<font style='color:red;'>404 Not Found!</font>")
			console.log(err.message)
		}else{
			console.log(resQ)
			if (resQ.length!=0){
				res.sendFile(pagePath+'index.html')				
			} else {
				res.send("<font style='color:red;'>user is not found, please register!</font>")
			}
		}
	})
})
app.all('*',function(req, res){
	var path = null
	if(req.url=='/login4.html'||
		req.url=='/cIndex.html'||
		req.url=='/car.html'||
		req.url=='/hisBuy.html'||
		req.url=='/sIndex.html'){
		path = pagePath
	}else{
		path = __dirname
	}	
	
	res.sendFile(path+req.url)
})


var server = app.listen(port,hostname, function () {
 
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})