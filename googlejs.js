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
	appId: "",
	developerKey: "",
	
	isLoggedIn: function(callback){
		gapi.auth.authorize({'client_id': googlejs.clientId, 'scope': googlejs.scopes.join(' '), 'immediate': true},function(result){
		
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
		var s = googlejs.scopes;
		var c = googlejs.clientId;
	
		gapi.auth.authorize({'client_id': googlejs.clientId, 'scope': googlejs.scopes.join(' '), 'immediate': redirect},function(result){
		
		
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
		gapi.client.load('drive', 'v2', function(){
			var temp = googlejs.getInfo(function(data){});
			callback();
		});
	},
	
	getInfo: function(callback){
		var request = gapi.client.drive.about.get();
		request.execute(function(resp) {
        	googlejs.rootFolderId = resp.rootFolderId;
        	googlejs.email = resp.user.emailAddress;
			googlejs.userName = resp.name;
        
            googlejs.userUrl = resp.user.picture.url;

       
            googlejs.userId = resp.user.permissionId;
            
			googlejs.totalStorage = resp.quotaBytesTotal;
			googlejs.usedStorage = resp.quotaBytesUsedAggregate;
			googlejs.percentStorageUsed = Math.round(googlejs.usedStorage/googlejs.totalStorage * 100);
			
			callback({
				rootFolderId: googlejs.rootFolderId,
				email: googlejs.email,
				userName: googlejs.userName,
				userUrl: googlejs.userUrl,
				userId: googlejs.userId,
				totalStorage: googlejs.totalStorage,
				usedStorage: googlejs.usedStorage
			})
		});
	},
	
	pickFile: function(callback){
	
		googlejs.purge();
	
		gapi.load('picker', {'callback': function(){
			var f = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
			f.setParent(googlejs.rootFolderId);
			f.setSelectFolderEnabled(false);
			
			var s  = new google.picker.DocsView();
			s.setSelectFolderEnabled(false);
			s.setOwnedByMe(false);
	
			var picker = new google.picker.PickerBuilder()
				.setOAuthToken(gapi.auth.getToken().access_token)
				.setAppId(googlejs.appId)
				.addViewGroup(f)
		        .addViewGroup(s)
				.addViewGroup(new google.picker.ViewGroup(google.picker.ViewId.RECENTLY_PICKED))
				.setOrigin(window.location.protocol + '//' + window.location.host)
				.setDeveloperKey(googlejs.developerKey)
				.setCallback(function(data){
					callback(data);
				})
				.build(); 
			picker.setVisible(true);
			
			googlejs.purge();
		}});
	
	},
	
	pickFolder: function(callback){
	
		googlejs.purge();
	
		gapi.load('picker', {'callback': function(){
			var docsView = new google.picker.DocsView()
		  .setIncludeFolders(true) 
		  .setMimeTypes('application/vnd.google-apps.folder')
		  .setSelectFolderEnabled(true)
		  .setParent(googlejs.rootFolderId);
		
		var picker = new google.picker.PickerBuilder()
			.setOAuthToken(gapi.auth.getToken().access_token)
			.setAppId(googlejs.appId)
			.addView(docsView)
			.setOrigin(window.location.protocol + '//' + window.location.host)
			.setDeveloperKey(googlejs.developerKey)
			.setCallback(function(data){
				callback(data);
			})
			.build(); 
		picker.setVisible(true);
		googlejs.purge();
		}});
	
	},
	
	upload: function(callback){
	
		googlejs.purge();
	
		gapi.load('picker', {'callback': function(){
			var picker = new google.picker.PickerBuilder()
				.setOAuthToken(gapi.auth.getToken().access_token)
				.enableFeature(google.picker.Feature.NAV_HIDDEN)
				.setAppId(googlejs.appId)
				.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
				.addView(new google.picker.DocsUploadView()
		             .setIncludeFolders(true) 
		         ) 
				.setOrigin(window.location.protocol + '//' + window.location.host)
				.setDeveloperKey(googlejs.developerKey)
				.setCallback(function(data){
					callback(data);
				})
				.build(); 
			picker.setVisible(true);
			googlejs.purge();
		}});
	
	},
	
	showShare: function(file){
		googlejs.purge();
		gapi.load('drive-share', function() {
		    var s = new gapi.drive.share.ShareClient(googlejs.appId);
		    s.setItemIds(file);
		    s.showSettingsDialog();
	        googlejs.purge(); 
		});
		googlejs.purge();
	},
	
	purge: function(){
		var paras = document.getElementsByClassName('dcs-wc-dcs-c-dcs-vc');



		while(paras[0]){
		    paras[0].parentNode.removeChild(paras[0]);
		}
	},
	
	getPermissions: function(file, callback){
		var request = gapi.client.drive.permissions.list({
			'fileId': file
		});
		request.execute(function(resp) {
			callback(resp);
		});
	},
	
	getContent: function(file, callback){
	    gapi.client.request({'path': '/drive/v2/files/'+file,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
	        var myToken = gapi.auth.getToken();
			var myXHR   = new XMLHttpRequest();
	        myXHR.open('GET', theResponseJS.downloadUrl, true );
	        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
	        myXHR.onreadystatechange = function( theProgressEvent ) {
	            if (myXHR.readyState == 4) {
	                if ( myXHR.status == 200 ) {
	                	code = myXHR.response;
	                    
	                    callback(code);
				   	}
	            }
	        }
	        myXHR.send();
	        }
	    });
	},
	
	save: function(file, callback, content){
		var contentArray = new Array(content.length);
		for (var i = 0; i < contentArray.length; i++) {
	    	contentArray[i] = content.charCodeAt(i);
	    }
	    var byteArray = new Uint8Array(contentArray);
		var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
		var request = gapi.client.drive.files.get({'fileId': file});//gets the metadata, which is left alone
	
	        
		request.execute(function(resp) {
			googlejs.updateFile(file,resp,blob,function(){
				callback();
			});
		});
	},
	
	updateFile: function(fileId, fileMetadata, fileData, callback) {
	  const boundary = '-------314159265358979323846';
	  const delimiter = "\r\n--" + boundary + "\r\n";
	  const close_delim = "\r\n--" + boundary + "--";
	
	  var reader = new FileReader();
	  reader.readAsBinaryString(fileData);
	  reader.onload = function(e) {
	    var contentType = fileData.type || 'application/octet-stream';
	    var base64Data = btoa(reader.result);
	
	    var multipartRequestBody =
	        delimiter +
	        'Content-Type: application/json\r\n\r\n' +
	        JSON.stringify(fileMetadata) +
	        delimiter +
	        'Content-Type: ' + contentType + '\r\n' +
	        'Content-Transfer-Encoding: base64\r\n' +
	        '\r\n' +
	        base64Data +
	        close_delim;
	
	    var request = gapi.client.request({
	        'path': '/upload/drive/v2/files/' + fileId,
	        'method': 'PUT',
	        'params': {'uploadType': 'multipart', 'alt': 'json'},
	        'headers': {
	          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
	        },
	        'body': multipartRequestBody});
	    if (!callback) {
	      callback = function(file) {
	      };
	    }
	    request.execute(callback);
	  }
	},
	
	getTitle: function(file, callback){
		var request = gapi.client.drive.files.get({
	    'fileId': file
	  	});
	  	request.execute(function(resp) {
	  		the_title = resp.title;
	  		
	  		callback(the_title);
	  	});
	},
	
	rename: function (file, callback, title) {
	  var body = {'title': title};
	  var request = gapi.client.drive.files.patch({
	    'fileId': file,
	    'resource': body
	  });
	  request.execute(function(resp) {
	  	callback();
	  });
	}
};