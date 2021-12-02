module.exports = app => {
    const sys = require("../controllers/sys.controller.js");
    const user = require("../controllers/user.controller.js");
    const biz = require("../controllers/biz.controller.js");

    let multer = require('multer');
    let upload = multer({dest: 'uploads/'});

    app.post("/sys/upload", upload.single('file'), sys.upload);

    app.post("/sys/weather", sys.weather);



    app.post("/user/register_pre", user.register_pre);

    app.post("/user/register", user.register);

    app.post("/user/login", user.login);

    app.post("/user/resetpwd", user.resetpwd);

    app.post("/user/findpwd", user.findpwd);

    app.post("/user/update", user.update);



    app.post("/biz/mood_upload", upload.single('file'), biz.mood_upload);

    app.post("/biz/mood_no_upload", biz.mood_no_upload);

    app.post("/biz/type_list", biz.type_list);

    app.post("/biz/lemon_list", biz.lemon_list)

};
