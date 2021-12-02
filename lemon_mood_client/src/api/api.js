const api = function () {
};

api.host = () => {
  return 'http://localhost:19090/'
};

api.host_server = () => {
  return 'http://106.13.41.192:19090/'
};

api.sys_upload = () => {
  return '/my_api_proxy/sys/upload'
};

api.sys_weather = () => {
  return '/sys/weather'
};

api.user_register_pre = () => {
  return '/user/register_pre'
};

api.user_register = () => {
  return '/user/register'
};

api.user_login = () => {
  return '/user/login'
};

api.user_resetpwd = () => {
  return '/user/resetpwd'
};

api.user_findpwd = () => {
  return '/user/findpwd'
};

api.user_update = () => {
  return '/user/update'
};

api.biz_type_list = () => {
  return '/biz/type_list'
};

api.biz_mood_upload = () => {
  return '/my_api_proxy/biz/mood_upload'
};

api.biz_mood_no_upload = () => {
  return '/biz/mood_no_upload'
};

api.biz_lemon_list = () => {
  return '/biz/lemon_list'
};

api.post = (vue, url, params) => {
  return vue.$axios.post(url, params).then(res => res.data);
};

export default api;
