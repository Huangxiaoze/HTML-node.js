var checkSupplier = (sid, sname, city, telephone_no) => {
	if(sid.length >2){
		return {'tip':'Error, sid is too long.','continue':false}
	} else if(sname.length>15){
		return {'tip':'Error, sname is too long.','continue':false}
	} else if(city.length>15) {
		return {'tip':'Error, city is too long.','continue':false}
	} else if(telephone_no.length>10) {
		return {'tip':'Error, telephone_no is too long.','continue':false}
	} else if(sid == ''){
		return {'tip':'Error, sid is null.','continue':false}
	} else if(sname == ''){
		return {'tip':'Error, sname is null.','continue':false}
	}
	return {continue:true}
}

const saveSupplier = (req, res) => {
	sid = req.body.sid 
	sname = req.body.sname 
	city = req.body.city 
	telephone_no = req.body.telephone_no 

	check_res = checkSupplier(sid, sname, city, telephone_no)
	if(!check_res.continue){
		res.send(check_res.tip)
		return null
	}

	sql = 'insert into suppliers(sid, sname, city, telephone_no) values(?,?,?,?)'
	params = [sid, sname, city, telephone_no]

	return {sql:sql, params:params}
}

const updateSupplier = (req, res) => {
	sid = req.body.sid 
	sname = req.body.sname 
	city = req.body.city 
	telephone_no = req.body.telephone_no 

	check_res = checkSupplier(sid, sname, city, telephone_no)
	if(!check_res.continue){
		res.send(check_res.tip)
		return null
	}

	sql = 'update suppliers set sname=?, city=?, telephone_no=? where sid = ?'
	param = [sname, city, telephone_no, sid]

	return {sql:sql, param:param}	
}

var getSupply = (sid, conn)=>{
	return new Promise(function(resolve, reject){
		conn.query('select s.*, b.* from suppliers s right join products b on s.sid=b.sid  where s.sid=?',[sid],function(err, res){
			if(err){
				reject({err:true})
			}else {
				console.log(res)
				resolve({res:res, err:false})
			}
		})
	})	
}

module.exports = {
	saveSupplier:saveSupplier,
	updateSupplier:updateSupplier,
	getSupply:getSupply,
}