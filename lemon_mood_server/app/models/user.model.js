const sql = require("../config/db.js");

const User = function(user) {
	this.id = user.id;
	this.user_code = user.user_code;
	this.user_pwd = user.user_pwd;
	this.user_type = user.user_type;
	this.user_name = user.user_name;
	this.user_head = user.user_head;
	this.safe_email = user.safe_email;
	this.safe_email_code = user.safe_email_code;
	this.register_date = user.register_date;
	this.login_date = user.login_date;
	this.token = user.token;
	this.location = user.location;
};

User.create = (newUser, result) => {
	sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result && result(err, null);
			return;
		}
		result && result(null, res.affectedRows);
	});
};

User.list = (params, result) => {
	let sqlstr = `SELECT * FROM user WHERE 1=1 `;
	if (params) {
		if (params.id)
			sqlstr += ` AND id = '${params.id}'`;
		if (params.user_code)
			sqlstr += ` AND user_code = '${params.user_code}'`;
		if (params.user_pwd)
			sqlstr += ` AND user_pwd = '${params.user_pwd}'`;
		if (params.token)
			sqlstr += ` AND token = '${params.token}'`;
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


User.update = (id, params, result) => {
	let sqlstr = `UPDATE user SET `;
	let sqlparams = [];
	let flag = false;
	if (params) {
		if (params.user_pwd) {
			sqlstr += (flag ? `,` : ``) + ` user_pwd = ?`;
			flag = true;
			sqlparams.push(params.user_pwd);
		}
		if (params.login_date) {
			sqlstr += (flag ? `,` : ``) + ` login_date = ?`;
			flag = true;
			sqlparams.push(params.login_date);
		}
		if (params.safe_email_code) {
			sqlstr += (flag ? `,` : ``) + ` safe_email_code = ?`;
			flag = true;
			sqlparams.push(params.safe_email_code);
		}
		if (params.token) {
			sqlstr += (flag ? `,` : ``) + ` token = ?`;
			flag = true;
			sqlparams.push(params.token);
		}
		if (params.user_name) {
			sqlstr += (flag ? `,` : ``) + ` user_name = ?`;
			flag = true;
			sqlparams.push(params.user_name);
		}
		if (params.user_head) {
			sqlstr += (flag ? `,` : ``) + ` user_head = ?`;
			flag = true;
			sqlparams.push(params.user_head);
		}
		if (params.location) {
			sqlstr += (flag ? `,` : ``) + ` location = ?`;
			flag = true;
			sqlparams.push(params.location);
		}
	}
	sqlstr += ` WHERE id = ?`;
	sqlparams.push(id);
	sql.query(sqlstr, sqlparams, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result && result(err, null);
			return;
		}
		result && result(null, res.affectedRows);
	});
};

module.exports = User;
