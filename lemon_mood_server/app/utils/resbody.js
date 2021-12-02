const ResBody = function(status, message, datas) {
	this.status = status;
	this.message = message;
	this.datas = datas;
};

ResBody.succ = function(datas) {
	return new ResBody(200, null, datas);
};

ResBody.fail = function(message) {
	return new ResBody(500, message, null);
};

module.exports = ResBody;
