const http = require('http')
const fs = require('fs')
const si = require('systeminformation')
const yaml = require('yaml')

const configFile = fs.readFileSync('config.yaml','utf8');
var config = YAML.parse(configFile)

var cpuUsage = []
var ramUsage = []
var netUsage = []
var diskUsage = []
var osInfo = ""
var cpuTemp = []

var updateInfo = function() {
	si.cpu(function(data) {
	})
	si.cpuTemperature(function(data) {
		cpuTemp.append(data/1000);
	})
}
setInterval(updateInfo, config.updateInterval * 1000)

//Use systeminformation to get data based on settings in the config file
//and then put it into a JSON object
var getDataString = function() {
	var obj = new Object()
	
	if(config.showCPUUsage) {
		obj.cpu = cpuUsage
	}
	if(config.showRAMUsage) {
		obj.ram = ramUsage
	}
	if(config.showNetUsage) {
		obj.net = netUsage
	}
	if(config.showDiskUsage) {
		obj.disk = diskUsage
	}
	if(config.showOS) {
		obj.os = osInfo
	}
	if(config.isHub) {
		obj.ips = config.monitorIps
	}
	
	return JSON.stringify(obj)
}

http.createServer(function (req, res) {
	if(req.method == "GET") {
		//Provide system info in JSON format
		if(req.url == "/api/info") {
			var data = getDataString()
			res.writeHead(200, {'Content-Type':'object/json'});
			res.write(data);
			res.end();
		}
		//Provide the HTML webpage that will call the API and format 
		//the data
		else if(req.url == "index.html" || req.url == "/" || req.url == "/dashboard") {
			var data;
			if(config.isHub) {
				data = fs.readFileSync('hubIndex.html', 'utf8');
			}
			else {
				data = fs.readFileSync('index.html', 'utf8');
			}
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		}
		else {
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.end();
			return;
		}
	}
	//No other operations supported
	else {
		res.writeHead(404, {'Content-Type':'text/plain'});
		res.end();
		return;
	}
}).listen(config.port);
