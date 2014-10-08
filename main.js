function loadDrive(){
	console.log("hi");
	
	googlejs.clientId = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
	googlejs.appId = '953350323460';
	googlejs.developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
	
	googlejs.isLoggedIn(function(res,err){
		if(res === false){
			googlejs.login(true, function(){
				
				googlejs.loadDrive(function(){
					googlejs.getInfo(function(res){
						console.log(res);
					});
				});
				
			}, "https://codeyourcloud.com/googlejs")
		}
		else{
			googlejs.loadDrive(function(){
				googlejs.getInfo(function(res){
					console.log(res);
				});
				
				googlejs.pickFolder(function(res){
					console.log(res);
				});
			});
		}
	});
	
	
}