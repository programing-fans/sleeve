const config = {
  appkey: '',
  clientkey: '',
  apiBaseUrl: 'http://localhost:8088/v1/'
}

const getConfig = function () {
  return {
    api_base_url: config.apiBaseUrl,
    appkey: config.appkey,
    clientkey: config.clientkey
  }
}

export {
  config,
  getConfig
}
