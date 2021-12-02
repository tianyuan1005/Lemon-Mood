var sd = require('silly-datetime');
var crypto = require('crypto');

const Util = function() {};

Util.guid = function() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16).toUpperCase();
	});
};

Util.date = function(timeInMills) {
	let date = timeInMills?new Date(timeInMills):new Date();
	// date.setTime(date.getTime() - 3600 * 1000 * 8);
	return new Date(date.getTime());
};

Util.date_format = function(date,format){
	return sd.format(date, format);
};

Util.md5 = function(content) {
	return crypto.createHash('md5').update(content).digest("hex").toUpperCase();
};

Util.vcode = function() {
	let code = "";
	for (var i = 0; i < 6; i++) {
		var radom = Math.floor(Math.random() * 10);
		code += radom;
	}
	return code;
};

module.exports = Util;
