const Util = require("../utils/util.js");
const SendEmail = require("../utils/sendemail.js");
const ResBody = require("../utils/resbody.js");
const User = require("../models/user.model.js");
const SysVcode = require("../models/sys.vcode.model.js");
//register_pre
exports.register_pre = (req, res) => {
    if (!req.body || !req.body.user_code || !req.body.user_pwd || !req.body.user_pwd_confirm) {
        res.send(ResBody.fail('Incomplete parameters(user_code,user_pwd,user_pwd_confirm)!'));
        return;
    }

    if (req.body.user_pwd !== req.body.user_pwd_confirm) {
        res.send(ResBody.fail('Password and confirm password are different!'));
        return;
    }

    const user = new User({
        id: Util.guid(),
        user_code: req.body.user_code,
        user_pwd: Util.md5(req.body.user_pwd),
        user_type: 'user',
        user_name: req.body.user_code,
        safe_email: req.body.user_code,
        register_date: Util.date(),
        login_date: Util.date(),
    });

    User.list({user_code: req.body.user_code}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (data.length) {
                res.send(ResBody.fail('This account has been registered!'));
            } else {
                //gen vcode
                let vcode = new SysVcode({
                    id: Util.guid(),
                    vcode: Util.vcode(),
                    user_code: user.user_code,
                    create_at: Util.date(),
                });
                //send vcode
                SendEmail.send(vcode.user_code, vcode.vcode, null,null);
                SysVcode.create(vcode);
                res.send(ResBody.succ());
            }
        }
    });
};

//register
exports.register = (req, res) => {
    if (!req.body || !req.body.user_code || !req.body.user_pwd || !req.body.user_pwd_confirm || !req.body.vcode) {
        res.send(ResBody.fail('Incomplete parameters(user_code,user_pwd,user_pwd_confirm,vcode)!'));
        return;
    }

    if (req.body.user_pwd !== req.body.user_pwd_confirm) {
        res.send(ResBody.fail('Password and confirm password are different!'));
        return;
    }

    const user = new User({
        id: Util.guid(),
        user_code: req.body.user_code,
        user_pwd: Util.md5(req.body.user_pwd),
        user_type: 'user',
        user_name: req.body.user_code,
        safe_email: req.body.user_code,
        register_date: Util.date(),
        login_date: Util.date(),
    });

    SysVcode.vcode_list({user_code: user.user_code, vcode: req.body.vcode}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (data.length) {
                User.list({user_code: req.body.user_code}, (err, data) => {
                    if (err)
                        res.send(ResBody.fail(err.message));
                    else {
                        if (data.length) {
                            res.send(ResBody.fail('This account has been registered!'));
                        } else {
                            User.create(user, (err, data) => {
                                if (err)
                                    res.send(ResBody.fail(err.message));
                                else
                                    res.send(ResBody.succ(data));
                            });
                        }
                    }
                });
            } else {
                res.send(ResBody.fail('Incorrect verification code!'));
            }
        }
    });

};

//login
exports.login = (req, res) => {
    if (!req.body || !req.body.user_code || !req.body.user_pwd) {
        res.send(ResBody.fail('Incomplete parameters(user_code,user_pwd)!'));
        return;
    }

    const user = new User({
        user_code: req.body.user_code,
        user_pwd: Util.md5(req.body.user_pwd),
    });

    User.list(user, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (!data.length) {
                res.send(ResBody.fail('Incorrect username or password!'));
            } else {
                let token = Util.guid();
                data[0].token = token;
                //update login_date and token
                User.update(data[0].id, {
                    login_date: Util.date(),
                    token: token
                }, null);
                res.send(ResBody.succ(data[0]));
            }
        }
    });
};

//resetpwd
exports.resetpwd = (req, res) => {
    if (!req.body || !req.body.id || !req.body.user_pwd || !req.body.user_pwd_new) {
        res.send(ResBody.fail('Incomplete parameters(id,user_pwd,user_pwd_new)!'));
        return;
    }

    const user = new User({
        id: req.body.id,
        user_pwd: Util.md5(req.body.user_pwd),
    });

    User.list(user, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (!data.length) {
                res.send(ResBody.fail('Old password is incorrect!'));
            } else {
                User.update(data[0].id, {
                    user_pwd: Util.md5(req.body.user_pwd_new)
                }, null);
                res.send(ResBody.succ());
            }
        }
    });
};

//findpwd
exports.findpwd = (req, res) => {
    if (!req.body || !req.body.user_code) {
        res.send(ResBody.fail('Incomplete parameters(user_code)!'));
        return;
    }

    const user = new User({
        user_code: req.body.user_code,
    });

    User.list(user, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (!data.length) {
                res.send(ResBody.fail('The account is not registered!'));
            } else {
                //gen vcode
                let vcode = Util.vcode();
                //text
                let text = '[Lemon Mood]Your login password has been reset to ' + vcode + ', please change your password after logging in.';
                //send vcode
                SendEmail.send(data[0].user_code, vcode, text, null);
                //update user_pwd as vcode
                User.update(data[0].id, {
                    user_pwd: Util.md5(vcode)
                }, null);

                res.send(ResBody.succ('We have sent a system email to your mailbox, please check it in your mailbox.'));
            }
        }
    });
};

//update
exports.update = (req, res) => {
    if (!req.body || !req.body.id) {
        res.send(ResBody.fail('Incomplete parameters(id,user_name,user_head)!'));
        return;
    }

    const user = new User({
        id: req.body.id,
        user_name: req.body.user_name,
        user_head: req.body.user_head,
        location: req.body.location,
    });

    User.update(user.id, user, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            res.send(ResBody.succ());
        }
    });
};

//list
exports.list = (req, res) => {
    User.list(req.body, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else
            res.send(ResBody.succ(data));
    });
};
