var googlejs = {
	clientId :"",
	scopes : ["https://www.googleapis.com/auth/drive.install","https://www.googleapis.com/auth/drive"],
	
	rootFolderId: "",
	email: "",
	userName :"",
	pictureUrl :"",
	userId :"",
	totalStorage :"",
	usedStorage :"",
	percentStorageUsed :"",
	fileId :"",
	
	isLoggedIn: function(callback){
		gapi.auth.authorize({'client_id': this.clientId, 'scope': this.scopes.join(' '), 'immediate': true},function(result){
		
			var logged_in = false;
		
			if (!result.error) {
				logged_in = true;
			} 
			else if(result.error_subtype === "access_denied"){
				logged_in = false;
			}
			
			callback(logged_in, result.error);
		});
	},
	
	login: function(redirect, callback, redirect_url){
		var s = this.scopes;
		var c = this.clientId;
	
		gapi.auth.authorize({'client_id': this.clientId, 'scope': this.scopes.join(' '), 'immediate': redirect},function(result){
		
		
			if (!result.error) {
				//already logged in
				callback()
			} 
			else if(result.error_subtype === "access_denied"){
				//not yet, and must be a redirect
				if(redirect === true){
					//change window.location
					
					var url = "?scope=" + s.join(" + ") + "&state=%2Fprofile" + "&redirect_uri=" + redirect_url + "&response_type=token" + "&client_id=" + c;
					
					url = url.split(":").join("%3A").split("/").join("%2F");
					url = "https://accounts.google.com/o/oauth2/auth" + url;
					
					window.location.href = url;
				}
			}
		});
	},
	
	loadDrive: function(callback){
		gapi.client.load('drive', 'v2', callback);
	},
	
	getInfo: function(callback){
		var request = gapi.client.drive.about.get();
		request.execute(function(resp) {
        	this.rootFolderId = resp.rootFolderId;
        	this.email = resp.user.emailAddress;
			this.userName = resp.name;
        
            this.userUrl = resp.user.picture.url;

       
            this.userId = resp.user.permissionId;
            
			this.totalStorage = resp.quotaBytesTotal;
			this.usedStorage = resp.quotaBytesUsedAggregate;
			this.percentStorageUsed = Math.round(this.usedStorage/this.totalStorage * 100);
			
			callback({
				rootFolderId: this.rootFolderId,
				email: this.email,
				userName: this.userName,
				userUrl: this.userUrl,
				userId: this.userId,
				totalStorage: this.totalStorage,
				usedStorage: this.usedStorage
			})
		});
	}
};