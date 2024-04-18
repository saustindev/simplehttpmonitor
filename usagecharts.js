import Chart from 'chart.js/auto'

var chart1, chart2, chart3, chart4, chart5;

var setCharts = async function() {
    $.ajax({
		url:"/api/info", 
		success:function(data) {	
			const rawcpudata = data.cpuUsage
			const rawtempdata = data.cpuTemp
			const rawmemdata = data.ramUsage
			const rawnetdata = data.netUsage
			const rawdiskdata = data.diskUsage
			const timedata = data.times
			var cpudata = []
			var tempdata = []
			var memdata = []
			var netdata = []
			var diskdata = []
			var index = 0;
			
			document.getElementById('basicinfo').innerHTML = "<h3>" + data.hostname + "</h3><br>" + data.cpuData + "<br>" + data.os;
			
			if(rawcpudata != undefined) {
				rawcpudata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.time = timedata[index];
					obj.index = index++;
					
					cpudata.push(obj);
				});
				
				if(chart1 != undefined) {
					chart1.destroy()
				}
				
				chart1 = new Chart(
					document.getElementById('cpu'),
					{
						type: 'line',
						data: {
							labels: cpudata.map(row => new Date(row.time).toTimeString().substring(0,9)),
							datasets: [
								{
									label: 'CPU Utilization / %',
									data: cpudata.map(row => row.data)
								}
							]
						},
						animation: {
							duration: 0
						}
					}
				);
			}
			
			index = 0;
			if(rawtempdata != undefined) {
				rawtempdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.time = timedata[index];
					obj.index = index++;
					tempdata.push(obj);
				});
				if(chart2 != undefined) {
					chart2.destroy()
				}
				chart2 = new Chart(
					document.getElementById('temp'),
					{
						type: 'line',
						data: {
							labels: tempdata.map(row => new Date(row.time).toTimeString().substring(0,9)),
							datasets: [
								{
									label: 'CPU Temperature / C',
									data: tempdata.map(row => row.data)
								}
							]
						},
						animation: {
							duration: 0
						}
					}
				);
			}
			
			index = 0;
			if(rawmemdata != undefined) {
				rawmemdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.time = timedata[index];
					obj.index = index++;
					memdata.push(obj);
				});
				document.getElementById('memblurb').innerHTML = data.currentRam
				if(chart3 != undefined) {
					chart3.destroy()
				}
				chart3 = new Chart(
					document.getElementById('mem'),
					{
						type: 'line',
						data: {
							labels: memdata.map(row => new Date(row.time).toTimeString().substring(0,9)),
							datasets: [
								{
									label: 'Memory Utilization / %',
									data: memdata.map(row => row.data)
								}
							]
						},
						animation: {
							duration: 0
						}
					}
				);
			}
			
			index = 0;
			
			if(rawnetdata != undefined) {
				rawnetdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.time = timedata[index];
					obj.index = index++;
					netdata.push(obj);
				});
				if(chart4 != undefined) {
					chart4.destroy()
				}
				chart4 = new Chart(
					document.getElementById('net'),
					{
						type: 'line',
						data: {
							labels: netdata.map(row => new Date(row.time).toTimeString().substring(0,9)),
							datasets: [
								{
									label: 'Network Usage / s',
									data: netdata.map(row => row.data)
								}
							]
						},
						animation: {
							duration: 0
						}
					}
				);
			}
			
			index = 0;
			
			if(rawdiskdata != undefined) {
				
				rawdiskdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.time = timedata[index];
					obj.index = index++;
					diskdata.push(obj);
				});
				if(chart5 != undefined) {
					chart5.destroy()
				}
				chart5 = new Chart(
					document.getElementById('disk'),
					{
						type: 'line',
						data: {
							labels: diskdata.map(row => new Date(row.time).toTimeString().substring(0,9)),
							datasets: [
								{
									label: 'Disk Usage / s',
									data: diskdata.map(row => row.data)
								}
							]
						},
						animation: {
							duration: 0
						}
					}
				);
			}	
			
			chart1.options.transitions.active.animation.duration = 0;
			chart2.options.transitions.active.animation.duration = 0;
			chart3.options.transitions.active.animation.duration = 0;
			chart4.options.transitions.active.animation.duration = 0;
			chart5.options.transitions.active.animation.duration = 0;
			
			setTimeout(setCharts, data.interval*1000);	
		}
	});
    
}
setCharts();

