var PythonShell = require('python-shell')
  , request = require('request');

const API_URL = "http://localhost:8888/";


PythonShell.run('sensor-temperature.py', function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  try {
    var obj = JSON.parse(results[0]);

    //将数据传到服务器里
    request.post({
      url: API_URL + 'os', formData: {
        key: 'sensor',
        value: {
          temperature: obj.temperature,
          humidity: obj.humidity
        }
      }
    }, function optionalCallback(err, httpResponse, body) {
      console.log(body);
    });

    console.log("温度", obj.temperature);
    console.log("湿度", obj.humidity);
  } catch (ex) {

  }
  console.log('results: %j', results);
});
