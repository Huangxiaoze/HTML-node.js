var checkEmployee = function(eid, ename, city){
		if (eid.length>3){
			return {'tip':'Error, eid is too long.','continue':false}
		} else if(ename.length>15 ) {
			return {'tip':'Error, ename is too long.','continue':false}
		} else if(city.length>15) {
			return {'tip':'Error, city is too long.','continue':false}
		} else if( eid== ''){
			return {'tip':'Error, eid is null.','continue':false}
		} else if (ename == ''){
			return {'tip':'Error, ename is null.','continue':false}
		} else if (city == ''){
			return {'tip':'Error, city is null.','continue':false}
		}
		return {'continue':true}
}

var saveEmployee = (req, res)=>{
	eid = req.body.eid 
	ename = req.body.ename 
	city = req.body.city 		
	check_res = checkEmployee(eid, ename, city)
	if (!check_res.continue) {
		res.send(check_res.tip)
		return null
	}
	sql = 'insert into employees(eid, ename, city) values(?,?,?)'
	params = [eid, ename, city]

	return {sql:sql, params:params}

}

var updateEmployee = (req, res) => {
	eid = req.body.eid 
	ename = req.body.ename 
	city = req.body.city 		
	check_res = checkEmployee(eid, ename, city)
	if (!check_res.continue) {
		res.send(check_res.tip)
		return null
	}

	sql = 'update employees set ename = ?, city= ? where eid = ?'
	param = [ename, city,eid]
	return {sql:sql, param:param}
}
module.exports = {
	saveEmployee:saveEmployee,
	updateEmployee:updateEmployee,
}