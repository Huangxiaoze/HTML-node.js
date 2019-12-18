var checkPurcharse = (purid, cid, eid, pid, qty, ptime, total_price)=>{
	purid = String(purid)
	return {continue:true}
}


const savePurcharse = (req, res) =>{
	purid = req.body.purid 
	cid = req.body.cid 
	eid = req.body.eid 
	pid = req.body.pid 
	qty = req.body.qty 
	ptime = req.body.ptime 
	total_price = req.body.total_price

	check_res = checkPurcharse(purid, cid, eid, pid, qty, ptime, total_price)
	if (!check_res.continue) {
		res.send(check_res.tip)
		return null
	} 

	sql = 'insert into purchases(pur, cid, eid, pid, qty, ptime, total_price) values(?,?,?,?,?,?,?)'
	params = [Number(purid), cid, eid, pid, Number(qty), new Date(ptime), Number(total_price)]
	return {sql:sql, params:params}
}

const updatePurcharse = (req, res) => {
		purid = req.body.purid 
		cid = req.body.cid 
		eid = req.body.eid 
		pid = req.body.pid 
		qty = req.body.qty 
		ptime = req.body.ptime 
		total_price = req.body.total_price

		check_res = checkPurcharse(purid, cid, eid, pid, qty, ptime, total_price)
		if (!check_res.continue) {
			res.send(check_res.tip)
			return null
		}
		sql = 'update purchases set cid=?, eid =?, pid=?, qty=?, ptime=?, total_price=? where pur = ?'
		param = [cid, eid, pid, Number(qty), new Date(ptime), Number(total_price), Number(purid)]
		
		return {sql:sql, param:param}
}

var add_to_car = (cid, eid, pid,ptime,conn)=>{
	return new Promise(function(resolve, reject){
	conn.query('select * from purchases where cid=? and eid=? and pid=? and qty=?',[cid, eid, pid, 0], function(err2, res2){
		if(err2){
			reject({err:true, tip:err2})
		}else if(res2.length!=0){
			reject({err:true, tip:'商品已在购物车啦,快去清空吧 !^_^'})
		}else{
			conn.query('select * from purchases',function(err1, res1){
				size = res1.length
				purid = res1[size-1].pur+1
				conn.query("insert into purchases(pur,cid, eid, pid, qty, ptime, total_price) values(?,?,?,?,0,?,0)",
					[purid,cid, eid, pid,new Date(ptime)], 
					function(err, res){
						if(err){
							reject({err:true,tip:err})
						}else{
							resolve({res:res, err:false})
						}
				})	
			})			
		}

	})	

	
	})
}

var getCar = (cid, conn)=>{
	return new Promise(function(resolve, reject){
		conn.query('select a.*, b.* from purchases a right join products b on a.pid=b.pid   where cid=? and qty=0',[cid],function(err, res){
			if(err){
				reject({err:true})
			}else {
				resolve({res:res, err:false})
			}
		})
	})
}

var getHisBuy = (cid, conn) => {
	return new Promise(function(resolve, reject){
		conn.query('select a.*, b.* from purchases a right join products b on a.pid=b.pid   where cid=? and qty!=0',[cid],function(err, res){
			if(err){
				reject({err:true})
			}else {
				resolve({res:res, err:false})
			}
		})
	})	
}

var buy = (data, conn)=>{
	return new Promise(function(resolve, reject){
		for(let i=0;i!=data.length;i++){
			purid = data[i].purid 
			qty = data[i].qty 
			original_price = data[i].original_price
			discnt_rate = data[i].discnt_rate
			total_price = qty*original_price*(1 - discnt_rate)
			conn.query("update purchases set qty=?, total_price=?,ptime = ? where pur=?",[qty,Number(total_price.toFixed(2)),new Date() ,purid],function(err, res){
				if(err){
					console.log(err)
					reject({err:true,tip:err})
				}else{
					resolve({err:false})
				}
			})
		}
	})

}

var report_monthly_sale = ( month,pid,sid, conn)=>{
	return new Promise(function(resolve, reject){
		sql = 'select year(now()) "year", month(now()) "month",  sum(qty) "total_qty", sum(total_price) "total_dollar", round(sum(total_price)/sum(qty),2) "avg_sale_price" from purchases P right join products B on P.pid=B.pid   where month(ptime)=? and P.pid=? and B.sid=?'
		conn.query(sql,[month,pid,sid],function(err, res){
			if(err){
				reject({err:true,tip:err})
			}else{
				resolve({err:false, res:res})
			}
		})
	})
}

module.exports = {
	savePurcharse:savePurcharse,
	updatePurcharse:updatePurcharse,
	add_to_car:add_to_car,
	getCar:getCar,
	buy:buy,
	getHisBuy:getHisBuy,
	report_monthly_sale:report_monthly_sale,
}