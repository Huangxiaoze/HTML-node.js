var checkCustomer = function(cid, cname, city, visits_made, last_visit_time){
		if (cid.length>4){
			return {'tip':'Error, cid is too long.','continue':false}
		} else if(cname.length>15 ) {
			return {'tip':'Error, cname is too long.','continue':false}
		} else if(city.length>15) {
			return {'tip':'Error, city is too long.','continue':false}
		} else if(visits_made.length>5) {
			return {'tip':'Error, visits_made is too long.','continue':false}
		} else if( cid== ''){
			return {'tip':'Error, cid is null.','continue':false}
		} else if (cname == ''){
			return {'tip':'Error, cname is null.','continue':false}
		} else if (city == ''){
			return {'tip':'Error, city is null.','continue':false}
		} else if (visits_made == '') {
			return {'tip':'Error, visits_made is null.','continue':false}
		} else if (last_visit_time == '') {
			return {'tip':'Error, last_visit_time is null.','continue':false}
		}
		return {'continue':true}
}

var saveCustomer = (req, res) => {
	cid = req.body.cid
	cname = req.body.cname
	city = req.body.city
	visits_made = req.body.visits_made
	last_visit_time = req.body.last_visit_time

	check_res = checkCustomer(cid, cname, city, visits_made, last_visit_time)
	if (!check_res.continue){
		res.send(check_res.tip)
		return null
	}

	sql = 'insert into customers(cid, cname, city, visits_made, last_visit_time) values(?, ?,?,?,?)'
	params = [cid, cname, city, Number(visits_made), new Date(last_visit_time)]
	return {sql:sql, params:params}
}

var updateCustomer = (req, res) =>{
	cid = req.body.cid
	cname = req.body.cname
	city = req.body.city
	visits_made = req.body.visits_made
	last_visit_time = req.body.last_visit_time

	check_res = checkCustomer(cid, cname, city, visits_made, last_visit_time)
	if(!check_res.continue){
		res.send(check_res.tip)
		return null
	}

	sql = 'update customers set cname=?,city=?,visits_made=?,last_visit_time=? where cid=?'
	param = [cname, city, Number(visits_made), new Date(last_visit_time),cid]

	return {sql:sql, param:param}
}


module.exports = {
	saveCustomer:saveCustomer,
	updateCustomer:updateCustomer,

}