GoogleJS
======
Google APIs made easy

###Getting Started###
```html
<script src="main.js"></script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=loadDrive"></script>
<script src="googlejs.js"></script>
```

> NOTE: you MUST DO THE FOLLOWING STEPS!
> otherwise, it won't work!

You'll neeed to [get started](get_started.md) with the Google API.

###Things to Know###
By default, the function `loadDrive()` will be called. This is a good place to set the information that you got earlier

```javascript
function loadDrive(){
	//this function is called once the API is loaded
	
	googlejs.clientId = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
	googlejs.appId = '953350323460';
	googlejs.developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
}
```

Each Google Drive file, folder, and user has a unique id. You can find the id of a file or folder by using the `pickFile()` or `pickerFolder()` methods. These will return an object, which can be parsed for the id.

Each user also has a root folder (the highest level folder in your Google Drive file tree). This is stored under `googlejs.rootFolderId` once the `googlejs.loadDrive()` method is called and executed.

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

###Logging User In###
There are two ways to log the user in. One is to redirect the user to a specific url, which then redirects the user again, once the authorization is complete to another (`redirect_url`). This url must be specified in the Google Developer console's "credidentials" section.

```javascript
googlejs.login(true, function(){
	//the user will be redirected via window.location.href
},"https://example/blahblahblah");
```
![](images/with.gif)

The other way creates a popup that authorizes the user.

```javascript
googlejs.login(false, function(){
	
},"");
```

![](images/without.gif)

###Loading Drive###
```javascript
googlejs.loadDrive(function(){
	
});
```

###Getting User Info###
<b>Before you can get user information, you must load Google Drive (see above)</b>

Knowing information such as the email and storage space of a user is important. The `googlejs.getInfo()` method will return this information as an object.

```javascript
googlejs.getInfo(function(res){
	console.log(res);
});
```


###Picking Files/Folders###
Once Google Drive is loaded using the `googlejs.loadDrive()` method, you can pick a file or folder. The information about the picked objects is returned via the callback.

![](images/file_picker.png)

For a file:
```javascript
googlejs.pickFile(function(data){
	console.log(data);
});
```

For a folder:
```javascript
googlejs.pickFolder(function(data){
	console.log(data);
});
```

The most important piece of information that the callback will give you is the id of the selected object. This can be found by looking through the returned object.

###Uploading a File###
The file will be uploaded to the folder selected by the user, and the object, including the id of the new file, will be returned.

```javascript
googlejs.upload(function(data){
	console.log(data);
});
```

###Sharing a File###
Once you have the id of a file, you can use it to show the share dialog.

![](images/share_dialog.png)

```javascript
googlejs.showShare("0ACWSHHBN-zyoUk9PVA");
```

If you want to manually get the sharing permissions for a file:
```javascript
googlejs.getPermissions("0ACWSHHBN-zyoUk9PVA", function(data){
	console.log(data);
});
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
