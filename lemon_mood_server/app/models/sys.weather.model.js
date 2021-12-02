const Util = require("../utils/util.js");
const sql = require("../config/db.js");

const SysWeather = function(weather){
	this.id = weather.id;
	this.city = weather.city;
	this.country = weather.country;
	this.temp = weather.temp;
	this.weather = weather.weather;
	this.weather_img = weather.weather_img;
	this.ddate = weather.ddate;
	this.create_at = weather.create_at;
};


SysWeather.create = (newWeather, result) => {
    sql.query("INSERT INTO sys_weather SET ?", newWeather, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res.affectedRows);
    });
};

SysWeather.update = (id, params, result) => {
    let sqlstr = `UPDATE sys_weather SET `;
    let sqlparams = [];
    let flag = false;
    if (params) {
        if (params.temp) {
            sqlstr += (flag ? `,` : ``) + ` temp = ?`;
            flag = true;
            sqlparams.push(params.temp);
        }
        if (params.weather) {
            sqlstr += (flag ? `,` : ``) + ` weather = ?`;
            flag = true;
            sqlparams.push(params.weather);
        }
        if (params.weather_img) {
            sqlstr += (flag ? `,` : ``) + ` weather_img = ?`;
            flag = true;
            sqlparams.push(params.weather_img);
        }
        if (params.create_at) {
            sqlstr += (flag ? `,` : ``) + ` create_at = ?`;
            flag = true;
            sqlparams.push(params.create_at);
        }
        if (params.country) {
            sqlstr += (flag ? `,` : ``) + ` country = ?`;
            flag = true;
            sqlparams.push(params.country);
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

SysWeather.weather_list = (params, result) => {
    let sqlstr = `SELECT * FROM sys_weather WHERE 1=1 `;
    if (params) {
        if (params.ddate)
            sqlstr += ` AND ddate = '${Util.date_format(params.ddate,'YYYY-MM-DD')}'`;
        if (params.city)
            sqlstr += ` AND city = '${params.city}'`;
    }
    sqlstr = sqlstr+ ` ORDER BY ddate DESC `;
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


module.exports = SysWeather;
