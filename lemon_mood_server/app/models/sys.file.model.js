const sql = require("../config/db.js");

const SysFile = function(sysfile) {
	this.id = sysfile.id;
	this.file_name = sysfile.file_name;
	this.file_orig_name = sysfile.file_orig_name;
	this.file_type = sysfile.file_type;
	this.file_size = sysfile.file_size;
	this.file_url = sysfile.file_url;
	this.file_path = sysfile.file_path;
	this.file_date = sysfile.file_date;
	this.remark = sysfile.remark;
};

SysFile.create = (newSysFile, result) => {
	sql.query("INSERT INTO sys_file SET ?", newSysFile, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result && result(err, null);
			return;
		}
		result && result(null, res.affectedRows);
	});
};

module.exports = SysFile;
