var PythonShell = require('python-shell');

PythonShell.run('sensor-temperature.py', function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
 try{
  var obj = JSON.parse(results[0]);
  console.log("温度",obj.temperature);
  console.log("湿度",obj.humidity);
 }catch(ex){

}
  console.log('results: %j', results);
});
