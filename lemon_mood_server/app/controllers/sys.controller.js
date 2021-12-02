const Util = require("../utils/util.js");
const ResBody = require("../utils/resbody.js");
const SysFile = require("../models/sys.file.model.js");
const SysWeather = require("../models/sys.weather.model.js");
const fs = require('fs');
const https = require("https");

exports.upload = (req, res) => {
    if (!req.file) {
        res.send(ResBody.fail('Please select a file!'));
        return;
    }
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

    SysFile.create(sysfile, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else
            res.send(ResBody.succ(sysfile));
    });
};

exports.weather = (req, res) => {
    let city;
    if (!req.body.city) {
        city = 'London';
    } else {
        city = req.body.city;
    }
    let ak = "282ec998089726f2309fa9853665ae61";
    let units = "metric";
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + ak + "&units=" + units;

    SysWeather.weather_list({city: city, ddate: Util.date(), limit: 1}, (err, data) => {
        if (err)
            res.send(ResBody.fail(err.message));
        else {
            if (data && data.length > 0) {
                let id = data[0].id;
                https.get(url, (response) => {
                    if (response.statusCode === 200) {
                        response.on("data", (data) => {
                            let wdata = JSON.parse(data);

                            let temp = wdata.main.temp;
                            let weather = wdata.weather[0].main;
                            let weather_img = "http://openweathermap.org/img/wn/" + wdata.weather[0].icon + "@4x.png";
                            let newWeather = {
                                create_at: Util.date(),
                                temp: temp,
                                weather: weather,
                                weather_img: weather_img
                            };
                            SysWeather.update(id,newWeather)
                        })
                    }
                });
                res.send(ResBody.succ(data[0]));
            } else {
                https.get(url, (response) => {
                    if (response.statusCode === 200) {
                        response.on("data", (data) => {
                            let wdata = JSON.parse(data);

                            let temp = wdata.main.temp;
                            let weather = wdata.weather[0].main;
                            let weather_img = "http://openweathermap.org/img/wn/" + wdata.weather[0].icon + "@4x.png";
                            let country = wdata.sys.country;
                            let newWeather = {
                                id: Util.guid(),
                                ddate: Util.date(),
                                create_at: Util.date(),
                                city: city,
                                country: country,
                                temp: temp,
                                weather: weather,
                                weather_img: weather_img
                            };
                            SysWeather.create(newWeather)
                            res.send(ResBody.succ(newWeather));
                        })
                    } else {
                        res.send(ResBody.fail('Can not get weather data.'));
                    }
                });
            }
        }
    });
};
