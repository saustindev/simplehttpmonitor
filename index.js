const http = require('http')
const fs = require('fs')
const si = require('systeminformation')
const yaml = require('yaml')

const configFile = fs.readFileSync('config.yaml','utf8');
var config = yaml.parse(configFile)

var maxDataPoints = config.historyLength * 60 / config.updateInterval

var cpuUsage = []
var cpuData = ""
var ramUsage = []
var currentRam = ""
var netUsage = []
var diskUsage = []
var osInfo = ""
var cpuTemp = []
var hostname = ""

var updateInfo = function() {
	si.currentLoad(function(data) {
		cpuUsage.push(data.currentLoad)
		if(cpuUsage.length > maxDataPoints) {
			cpuUsage.splice(0,1)
		}
	})
	si.cpu(function(data) {
		cpuData = data.manufacturer + " " + data.brand + " (" + data.cores + " cores @ " + data.speed + " GHz";
	})
	si.cpuTemperature(function(data) {
		cpuTemp.push(data/1000);
		if(cpuUsage.length > maxDataPoints) {
			cpuUsage.splice(0,1)
		}
	})
	si.mem(function(data) {
		ramUsage.push(data.used/data.total)
		if(ramUsage.length > maxDataPoints) {
			ramUsage.splice(0,1)
		}
		currentRam = data.used/1000000000 + "GB / " + data.total/1000000000 + "GB (" + data.free/1000000000 + "GB free" 
	})
	si.networkStats(function(data) {
		netUsage.push(data[0].tx_sec)
		if(netUsage.length > maxDataPoints) {
			netUsage.splice(0,1)
		}
	})
	si.disksIO(function(data) {
		diskUsage.push(data.tIO_sec)
		if(diskUsage.length > maxDataPoints) {
			diskUsage.splice(0,1)
		}
	})
	si.osInfo(function(data) {
		osInfo = data.platform + " " + data.distro + " " + data.release
		hostname = data.hostname
	})
}
updateInfo()
setInterval(updateInfo, config.updateInterval * 1000)

//Use systeminformation to get data based on settings in the config file
//and then put it into a JSON object
var getDataString = function() {
	var obj = new Object()
	
	if(config.showCPUUsage) {
		obj.cpuUsage = cpuUsage
		obj.cpuTemp = cpuTemp
	}
	if(config.showRAMUsage) {
		obj.ramUsage = ramUsage
		obj.currentRam = currentRam
	}
	if(config.showNetUsage) {
		obj.netUsage = netUsage
	}
	if(config.showDiskUsage) {
		obj.diskUsage = diskUsage
	}
	if(config.showOS) {
		obj.os = osInfo
		obj.cpuData = cpuData
	}
	if(config.isHub) {
		obj.ips = config.monitorIps
	}
	obj.hostname = hostname
	return JSON.stringify(obj)
}

http.createServer(function (req, res) {
	console.log(new Date().toISOString().replace('T', ' ').substr(0, 19) + ": " + req.method + " " + req.url);
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
		else if(req.url == "/output.css") {
			var data = fs.readFileSync('index.html', 'utf8');
			
			res.writeHead(200, {'Content-Type':'text/css'});
			res.write(data);
			res.end();
		}
		else if(req.url == "/usagecharts.js") {
			var data = fs.readFileSync('usagecharts.js', 'utf8');
			
			res.writeHead(200, {'Content-Type':'text/javascript'});
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
