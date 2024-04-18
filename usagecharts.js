import Chart from 'chart.js/auto'

(async function() {
    $.ajax({
		url:"/api/info", 
		success:function(data) {	
			const rawcpudata = data.cpuUsage
			const rawtempdata = data.cpuTemp
			const rawmemdata = data.ramUsage
			const rawnetdata = data.netUsage
			const rawdiskdata = data.diskUsage
			var cpudata = []
			var tempdata = []
			var memdata = []
			var netdata = []
			var diskdata = []
			var index = 0;
			
			document.getElementById('basicinfo').innerHTML = "<h3>" + data.hostname + "</h3><br>" + data.cpuData + "<br>" + data.osInfo;
			
			if(rawcpudata != undefined) {
				rawcpudata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.index = index++;
					cpudata.push(obj);
				});
				
				new Chart(
					document.getElementById('cpu'),
					{
						type: 'line',
						data: {
							labels: cpudata.map(row => row.index),
							datasets: [
								{
									label: 'CPU Utilization / %',
									data: cpudata.map(row => row.data)
								}
							]
						}
					}
				);
			}
			
			index = 0;
			if(rawtempdata != undefined) {
				rawtempdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.index = index++;
					tempdata.push(obj);
				});
				new Chart(
					document.getElementById('temp'),
					{
						type: 'line',
						data: {
							labels: tempdata.map(row => row.index),
							datasets: [
								{
									label: 'CPU Temperature / C',
									data: tempdata.map(row => row.data)
								}
							]
						}
					}
				);
			}
			
			index = 0;
			if(rawmemdata != undefined) {
				rawmemdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.index = index++;
					memdata.push(obj);
				});
				document.getElementById('memblurb').innerHTML = data.currentRam
				new Chart(
					document.getElementById('mem'),
					{
						type: 'line',
						data: {
							labels: memdata.map(row => row.index),
							datasets: [
								{
									label: 'Memory Utilization / %',
									data: memdata.map(row => row.data)
								}
							]
						}
					}
				);
			}
			
			index = 0;
			
			if(rawnetdata != undefined) {
				rawnetdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.index = index++;
					netdata.push(obj);
				});
				new Chart(
					document.getElementById('net'),
					{
						type: 'line',
						data: {
							labels: netdata.map(row => row.index),
							datasets: [
								{
									label: 'Network Usage / s',
									data: netdata.map(row => row.data)
								}
							]
						}
					}
				);
			}
			
			index = 0;
			
			if(rawdiskdata != undefined) {
				
				rawdiskdata.forEach(function(i) {
					var obj = new Object();
					obj.data = i;
					obj.index = index++;
					diskdata.push(obj);
				});
				new Chart(
					document.getElementById('disk'),
					{
						type: 'line',
						data: {
							labels: diskdata.map(row => row.index),
							datasets: [
								{
									label: 'Disk Usage / s',
									data: diskdata.map(row => row.data)
								}
							]
						}
					}
				);
			}	
				
		}
	});
    
})();
