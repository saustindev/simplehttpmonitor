import Chart from 'chart.js/auto'

(async function() {
    $.ajax({
		url:"/api/info", 
		success:function(data) {	
			const rawcpudata = data.cpuUsage
			const rawtempdata = data.cpuTemp
			const rawmemdata = data.memUsage
			const rawnetdata = data.netUsage
			const rawdiskdata = data.diskUsage
			var cpudata = []
			var tempdata = []
			var memdata = []
			var netdata = []
			var diskdata = []
			var index = 0;
			rawcpudata.forEach(function(i) {
				var obj = new Object();
				obj.data = i;
				obj.index = index++;
				cpudata.push(obj);
			});
			index = 0;
			rawtempdata.forEach(function(i) {
				var obj = new Object();
				obj.data = i;
				obj.index = index++;
				tempdata.push(obj);
			});
			index = 0;
			rawmemdata.forEach(function(i) {
				var obj = new Object();
				obj.data = i;
				obj.index = index++;
				memdata.push(obj);
			});
			index = 0;
			rawnetdata.forEach(function(i) {
				var obj = new Object();
				obj.data = i;
				obj.index = index++;
				netdata.push(obj);
			});
			index = 0;
			rawdiskdata.forEach(function(i) {
				var obj = new Object();
				obj.data = i;
				obj.index = index++;
				diskdata.push(obj);
			});

			new Chart(
				document.getElementById('cpu'),
				{
					type: 'line',
					data: {
						labels: cpudata.map(row => row.index),
						datasets: [
							{
								label: 'Acquisitions by year',
								data: cpudata.map(row => row.data)
							}
						]
					}
				}
			);
			new Chart(
				document.getElementById('temp'),
				{
					type: 'line',
					data: {
						labels: tempdata.map(row => row.index),
						datasets: [
							{
								label: 'Acquisitions by year',
								data: tempdata.map(row => row.data)
							}
						]
					}
				}
			);
			new Chart(
				document.getElementById('mem'),
				{
					type: 'line',
					data: {
						labels: memdata.map(row => row.index),
						datasets: [
							{
								label: 'Acquisitions by year',
								data: memdata.map(row => row.data)
							}
						]
					}
				}
			);
			new Chart(
				document.getElementById('net'),
				{
					type: 'line',
					data: {
						labels: netdata.map(row => row.index),
						datasets: [
							{
								label: 'Acquisitions by year',
								data: netdata.map(row => row.data)
							}
						]
					}
				}
			);
			new Chart(
				document.getElementById('disk'),
				{
					type: 'line',
					data: {
						labels: diskdata.map(row => row.index),
						datasets: [
							{
								label: 'Acquisitions by year',
								data: diskdata.map(row => row.data)
							}
						]
					}
				}
			);
		}
	});
    
})();
