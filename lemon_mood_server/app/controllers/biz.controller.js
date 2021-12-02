const Util = require("../utils/util.js");
const ResBody = require("../utils/resbody.js");
const SysFile = require("../models/sys.file.model.js");
const Biz = require("../models/biz.model.js");
const fs = require('fs');


//type_list
exports.type_list = (req, res) => {
    Biz.type_list(req.body, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else
            res.send(ResBody.succ(data));
    });
};

//mood_list
exports.lemon_list = (req, res) => {
    if (!req.body.user_id) {
        res.send(ResBody.fail('Incomplete parameters(user_id)!'));
        return;
    }
    let ddate = null;
    if (req.body.ddate) {
        ddate = Util.date(new Date(req.body.ddate).getTime());
        ddate.setHours(0, 0, 0, 0);
    }

    let limit = null;
    if (req.body.limit) {
        limit = parseInt(req.body.limit);
    }

    Biz.lemon_list({user_id: req.body.user_id, ddate: ddate, limit: limit}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else
            res.send(ResBody.succ(data));
    });
};

//mood_no_upload
exports.mood_no_upload = (req, res) => {
    if (!req.body.user_id || !req.body.ddate || !req.body.mood || !req.body.doing) {
        res.send(ResBody.fail('Incomplete parameters(user_id,ddate,mood,sleep,doing)!'));
        return;
    }

    let ddate = Util.date(new Date(req.body.ddate).getTime());
    let doing = req.body.doing;
    let activity = doing.toString();
    ddate.setHours(0, 0, 0, 0);

    const biz = new Biz({
        id: Util.guid(),
        ddate: ddate,
        mood: req.body.mood,
        sleep: req.body.sleep,
        note: req.body.note,
        photo: req.body.photo,
        user_id: req.body.user_id,
        activity: activity,
        create_at: Util.date(),
    });


    Biz.lemon_list({user_id: biz.user_id, ddate: biz.ddate}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (data.length) {
                biz.id = data[0].id;
                Biz.update_lemon(biz.id, biz, (err, data) => {
                    if (err)
                        res.send(ResBody.fail(err.message));
                    else {
                        Biz.clear_activity(biz.id);
                        if (doing) {
                            for (let i in doing) {
                                const act = {id: Util.guid(), activity: doing[i], lemon_id: biz.id};
                                Biz.create_activity(act);
                            }
                        }
                        res.send(ResBody.succ(data));
                    }
                });

            } else {

                Biz.create_lemon(biz, (err, data) => {
                    if (err)
                        res.send(ResBody.fail(err.message));
                    else {
                        if (doing) {
                            for (let i in doing) {
                                const act = {id: Util.guid(), activity: doing[i], lemon_id: biz.id};
                                Biz.create_activity(act);
                            }
                        }
                        res.send(ResBody.succ(data));
                    }
                });

            }
        }
    });
};

//mood_upload
exports.mood_upload = (req, res) => {
    if (!req.file && !req.body.user_id || !req.body.ddate || !req.body.mood || !req.body.doing) {
        res.send(ResBody.fail('Incomplete parameters(user_id,ddate,mood,sleep,doing)!'));
        return;
    }

    let ddate = Util.date(new Date(req.body.ddate).getTime());
    let activity = req.body.doing;
    let doing = activity.split(',');
    ddate.setHours(0, 0, 0, 0);

    const biz = new Biz({
        id: Util.guid(),
        ddate: ddate,
        mood: req.body.mood,
        sleep: req.body.sleep,
        note: req.body.note,
        photo: null,
        user_id: req.body.user_id,
        activity: activity,
        create_at: Util.date(),
    });


    Biz.lemon_list({user_id: biz.user_id, ddate: biz.ddate}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (data.length) {

                var file = req.file;
                if (file) {
                    var fileNameArr = file.originalname.split('.');
                    var suffix = fileNameArr[fileNameArr.length - 1];
                    //文件重命名
                    fs.renameSync('./uploads/' + file.filename, `./uploads/${file.filename}.${suffix}`);
                    file['newfilename'] = `${file.filename}.${suffix}`;
                }
                const sysfile = new SysFile({
                    id: file.filename,
                    file_name: file.newfilename,
                    file_orig_name: file.originalname,
                    file_type: file.mimetype,
                    file_size: file.size,
                    file_url: file.newfilename,
                    file_path: '/uploads/' + file.newfilename,
                    file_date: Util.date()
                });

                SysFile.create(sysfile);
                biz.photo = sysfile.file_name;

                biz.id = data[0].id;
                Biz.update_lemon(biz.id, biz, (err, data) => {
                    if (err)
                        res.send(ResBody.fail(err.message));
                    else {
                        Biz.clear_activity(biz.id);
                        if (doing) {
                            for (let i in doing) {
                                const act = {id: Util.guid(), activity: doing[i], lemon_id: biz.id};
                                Biz.create_activity(act);
                            }
                        }
                        res.send(ResBody.succ(data));
                    }
                });
            } else {

                var file = req.file;
                if (file) {
                    var fileNameArr = file.originalname.split('.');
                    var suffix = fileNameArr[fileNameArr.length - 1];
                    //文件重命名
                    fs.renameSync('./uploads/' + file.filename, `./uploads/${file.filename}.${suffix}`);
                    file['newfilename'] = `${file.filename}.${suffix}`;
                }
                const sysfile = new SysFile({
                    id: file.filename,
                    file_name: file.newfilename,
                    file_orig_name: file.originalname,
                    file_type: file.mimetype,
                    file_size: file.size,
                    file_url: file.newfilename,
                    file_path: '/uploads/' + file.newfilename,
                    file_date: Util.date()
                });

                SysFile.create(sysfile);
                biz.photo = sysfile.file_name;

                Biz.create_lemon(biz, (err, data) => {
                    if (err)
                        res.send(ResBody.fail(err.message));
                    else {
                        if (doing) {
                            for (let i in doing) {
                                const act = {id: Util.guid(), activity: doing[i], lemon_id: biz.id};
                                Biz.create_activity(act);
                            }
                        }
                        res.send(ResBody.succ(data));
                    }
                });

            }
        }
    });


};
