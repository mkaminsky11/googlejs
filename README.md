GoogleJS
======
Google APIs made easy

###Getting Started###
```html
<script src="main.js"></script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=loadDrive"></script>
<script src="googlejs.js"></script>
```

You also need to get some information from the Google Developer Console. You will be able to access this information [here](https://console.developers.google.com/project).

You need:
+ the client id
+ the app id
+ the developer key

You also need to add the Google Drive API and Google Drive SDK through the developer console, and to set the javascript origin and redirect urls based on the url you want to use **googlejs** from. For more information, go [here](https://developers.google.com/drive/web/enable-sdk). 

For example,

```javascript
function loadDrive(){
	//this function is called once the API is loaded
	
	googlejs.clientId = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
	googlejs.appId = '953350323460';
	googlejs.developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
}
```

###Things to Know###
Each Google Drive file, folder, and user has a unique id. You can find the id of a file or folder by using the `pickFile()` or `pickerFolder()` methods. These will return an object, which can be parsed for the id.

Each user also has a root folder (the highest level folder in your Google Drive file tree). This is stored under `googlejs.rootFolderId` once the `loadDrive()` method is called and executed.

###Checking Login Status###
One thing that you might want to do is to check if the user is already logged in.

```javascript
function loadDrive(){
	googlejs.clientId = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
	googlejs.appId = '953350323460';
	googlejs.developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
	
	googlejs.isLoggedIn(function(res,err){
		if(res === true){
			//already logged in
		} else {
			//not yet logged in, need to be authorized
		}
	});
	
	
}
```

**Todo**
+ token refresh (done)
+ Google Drive
  + log in (done)
  + log out (done)
  + check if logged in (done)
  + open file dialog (done)
  	+ file (done)
  	+ folder (done)
  + upload dialog (done)
  + share dialog (done)
  + get contents (done)
  + make changes (done)
  + get title (done)
  + rename (done)
  + get file metadata (done)
  + new file (done)
  + add file to folder (done)
  + remove file from folder (done)
  + get stuff
  	+ parents  (done)
  	+ all files (done)
  	+ files in folder (done)
+ Google Realtime
  + detect changes
  + make changes
  + get collaborators
+ info
  + get user info (done)
