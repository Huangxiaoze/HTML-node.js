var checkLogs = (logid, who, time, table_name, operation, key_value)=>{
		logid = String(logid)
		if (logid.length>3){
			return {'tip':'Error, logid is too long.','continue':false}
		} else if(who.length>10 ) {
			return {'tip':'Error, ename is too long.','continue':false}
		} else if(table_name.length>20) {
			return {'tip':'Error, table_name is too long.','continue':false}
		} else if(operation.length>6) {
			return {'tip':'Error, operation is too long.','continue':false}
		} else if(key_value.length>4) {
			return {'tip':'Error, key_value is too long.','continue':false}
		} else if( logid == ''){
			return {'tip':'Error, logid is null.','continue':false}
		} else if (who == ''){
			return {'tip':'Error, who is null.','continue':false}
		} else if (table_name == ''){
			return {'tip':'Error, table_name is null.','continue':false}
		} else if (operation == '') {
			return {'tip':'Error, operation is null.','continue':false}
		} else if (time == '') {
			return {'tip':'Error, time is null.','continue':false}
		}
		return {'continue':true}	
}

var saveLog = (req, res) =>{
	logid = req.body.logid
	who = req.body.who
	time = req.body.time 
	table_name = req.body.table_name
	operation = req.body.operation
	key_value = req.body.key_value
	check_res = checkLogs(logid, who, time, table_name, operation, key_value)
	if(!check_res.continue){
		res.send(check_res.tip)
		return null
	} 
	sql = 'insert into logs(logid, who, time, table_name, operation, key_value) values(?,?,?,?,?,?)'
	params = [Number(logid), who, new Date(time), table_name, operation, key_value]
	return {sql:sql, params:params}
}

var updateLog = (req, res) => {
	logid = req.body.logid
	who = req.body.who
	time = req.body.time 
	table_name = req.body.table_name
	operation = req.body.operation
	key_value = req.body.key_value
	check_res = checkLogs(logid, who, time, table_name, operation, key_value)
	if(!check_res.continue){
		res.send(check_res.tip)
		return null
	}
	sql = 'update logs set who = ?, time = ?, table_name = ?, operation = ?, key_value = ? where logid = ?'
	param = [who, new Date(time), table_name, operation, key_value, Number(logid)]
	return {sql:sql, param:param}
}

module.exports = {
	saveLog:saveLog,
	updateLog:updateLog,
}