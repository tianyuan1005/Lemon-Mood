const Util = require("../utils/util.js");
const sql = require("../config/db.js");

const Biz = function (lemon) {
    this.id = lemon.id;
    this.ddate = lemon.ddate;
    this.mood = lemon.mood;
    this.sleep = lemon.sleep;
    this.note = lemon.note;
    this.photo = lemon.photo;
    this.user_id = lemon.user_id;
    this.activity = lemon.activity;
    this.create_at = lemon.create_at;
};

Biz.type_list = (params, result) => {
    let sqlstr = `SELECT * FROM type WHERE 1=1 `;
    if (params) {
        if (params.code)
            sqlstr += ` AND code = '${params.code}'`;
        if (params.category)
            sqlstr += ` AND category = '${params.category}'`;
        if (params.name)
            sqlstr += ` AND name = '${params.name}'`;
    }
    sqlstr = sqlstr + ` ORDER BY code ASC `;
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

Biz.lemon_list = (params, result) => {
    let sqlstr = `SELECT id,mood,sleep,note,photo,user_id,activity,date_format(ddate,'%Y-%m-%d') as ddate,date_format(create_at,'%H:%i') as create_at,t.icon as type_icon,t.name as type_name FROM lemon tt left join type t on t.code = tt.mood WHERE 1=1 `;
    if (params) {
        if (params.id)
            sqlstr += ` AND id = '${params.id}'`;
        if (params.ddate)
            sqlstr += ` AND ddate = '${Util.date_format(params.ddate, 'YYYY-MM-DD')}'`;
        if (params.user_id)
            sqlstr += ` AND user_id = '${params.user_id}'`;
    }
    sqlstr = sqlstr + ` ORDER BY ddate DESC `;
    if (params && params.limit) {
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

Biz.create_lemon = (lemon, result) => {
    sql.query("INSERT INTO lemon SET ?", lemon, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res.affectedRows);
    });
};

Biz.update_lemon = (id, params, result) => {
    let sqlstr = `UPDATE lemon SET `;
    let sqlparams = [];
    let flag = false;
    if (params) {
        if (params.mood) {
            sqlstr += (flag ? `,` : ``) + ` mood = ?`;
            flag = true;
            sqlparams.push(params.mood);
        }
        if (params.sleep) {
            sqlstr += (flag ? `,` : ``) + ` sleep = ?`;
            flag = true;
            sqlparams.push(params.sleep);
        }
        if (1 || params.note) {
            sqlstr += (flag ? `,` : ``) + ` note = ?`;
            flag = true;
            sqlparams.push(params.note);
        }
        if (1 || params.photo) {
            sqlstr += (flag ? `,` : ``) + ` photo = ?`;
            flag = true;
            sqlparams.push(params.photo);
        }
        if (params.activity) {
            sqlstr += (flag ? `,` : ``) + ` activity = ?`;
            flag = true;
            sqlparams.push(params.activity);
        }
        if (params.create_at) {
            sqlstr += (flag ? `,` : ``) + ` create_at = ?`;
            flag = true;
            sqlparams.push(params.create_at);
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

Biz.create_activity = (activity, result) => {
    sql.query("INSERT INTO activity SET ?", activity, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res.affectedRows);
    });
};

Biz.clear_activity = (lemon_id, result) => {
    sql.query("DELETE FROM activity WHERE 1=1 AND lemon_id=" + lemon_id, {}, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result && result(err, null);
            return;
        }
        result && result(null, res.affectedRows);
    });
};

module.exports = Biz;
