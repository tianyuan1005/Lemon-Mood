const sql = require("../config/db.js");

const SysVcode = function(vcode){
	this.id = vcode.id;
	this.user_code = vcode.user_code;
	this.vcode = vcode.vcode;
	this.create_at = vcode.create_at;
};


SysVcode.create = (newVcode, result) => {
    sql.query("INSERT INTO sys_vcode SET ?", newVcode, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res.affectedRows);
    });
};


SysVcode.vcode_list = (params, result) => {
    let sqlstr = `SELECT * FROM sys_vcode WHERE 1=1 `;
    if (params) {
        if (params.user_code)
            sqlstr += ` AND user_code = '${params.user_code}'`;
        if (params.vcode)
            sqlstr += ` AND vcode = '${params.vcode}'`;
    }
    sqlstr = sqlstr+ ` ORDER BY create_at DESC `;
    if (params&&params.limit){
        sqlstr += ` limit ${params.limit}`;
    }
    sql.query(sqlstr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res);
        return;
    });
};


module.exports = SysVcode;
