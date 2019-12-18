
var checkProducts = (pid, pname, qoh, qoh_threshold, original_price, discnt_rate, sid)=>{
	if(pid.length>4) {
		return {'tip':'Error, pid is too long.','continue':false}
	} else if(pname.length>15){
		return {'tip':'Error, pname is too long.','continue':false}
	} else if(sid.length>2){
		return {'tip':'Error, sid is too long.','continue':false}
	} else if(pid == '') {
		return {'tip':'Error, pid is null.','continue':false}
	} else if(pname == ''){
		return {'tip':'Error, pname is null.','continue':false}
	} else if(String(qoh) == '') {
		return {'tip':'Error, qoh is null.','continue':false}
	} else if(String(qoh_threshold) == ''){
		return {'tip':'Error, qoh_threshold is null.','continue':false}
	} else if(String(original_price) == ''){
		return {'tip':'Error, original_price is null.','continue':false}
	} else if(String(discnt_rate) == ''){
		return {'tip':'Error, discnt_rate is null.','continue':false}
	} else if(sid == ''){
		return {'tip':'Error, sid is null.','continue':false}
	}
	return {'continue':true}
}

const saveProduct = (req, res) => {
	pid = req.body.pid 
	pname = req.body.pname 
	qoh = req.body.qoh 
	qoh_threshold = req.body.qoh_threshold
	original_price = req.body.original_price
	discnt_rate = req.body.discnt_rate
	sid = req.body.sid 

	check_res = checkProducts(pid, pname, qoh, qoh_threshold, original_price, discnt_rate, sid)
	if (!check_res.continue) {
		res.send(check_res.tip)
		return null
	}	

	sql = 'insert into products(pid, pname, qoh, qoh_threshold, original_price, discnt_rate, sid) values(?,?,?,?,?,?,?)'
	params = [pid, pname, Number(qoh), Number(qoh_threshold), Number(original_price), Number(discnt_rate), sid ]
	return {sql:sql, params:params}
}

const updateProduct = (req, res) => {
	pid = req.body.pid 
	pname = req.body.pname 
	qoh = req.body.qoh 
	qoh_threshold = req.body.qoh_threshold
	original_price = req.body.original_price
	discnt_rate = req.body.discnt_rate
	sid = req.body.sid 

	check_res = checkProducts(pid, pname, qoh, qoh_threshold, original_price, discnt_rate, sid)
	if (!check_res.continue) {
		res.send(check_res.tip)
		return null
	}
	sql = 'update products set pname=?, qoh=?, qoh_threshold=?, original_price=?, discnt_rate=?, sid=? where pid = ?'
	param = [pname, Number(qoh), Number(qoh_threshold), Number(original_price), Number(discnt_rate), sid,pid]
	return {sql:sql, param:param}
}

var show_products = function(conn){
	return new Promise(function(resolve, reject){
		conn.query("select * from products", function(err, res){
			if(err){
				reject({err:true})
			}else{
				resolve({res:res, err:false})
			}
		})		
	})

}

var search_product = function(pname, conn) {
	return new Promise(function(resolve, reject){
		conn.query("select * from products where pname=?",[pname],function(err, res){
			if(err || res.length == 0) {
				reject({err:true})
			} else {
				resolve({res:res,err:false})
			}
		})
	})

}

module.exports = {
	saveProduct:saveProduct,
	updateProduct:updateProduct,
	show_products:show_products,
	search_product:search_product,
}