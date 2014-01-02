var name_read = false;
var state_read = false;
var fileURL;

// when download is created, set the fileURL
chrome.downloads.onCreated.addListener(function (item){	
    read = false;	
	state_read = false;
	fileURL = item.url; 
});


// occurs when any attribute of the file being downloaded changes
chrome.downloads.onChanged.addListener(function (item){		
	var fullFilePath;	
	var fileName;	
	var filetype;

	//set the fileName,filetype and the full file path of the downloaded file
	if(!name_read){		
		fullFilePath = item.filename.current;
		var filePathSplit = fullFilePath.split('\\');
		fileName = filePathSplit[filePathSplit.length - 1];
		var nameSplit = fileName.split('.');
		filetype = splitted2[splitted2.length - 1];		
		name_read= true;
	}
	
	// if the download is complete then find the new path
	if(name_read && !state_read && item.state != null && item.state.current == "complete"){
		var length = localStorage.length;
		var newFilePath;
		var filePathFound = false;
		
		//searching through local storage for the URL keys
		for(var i = 0;i < length; i++){
			if(fileURL.search(localStorage.key(i)) != -1){
				filePathFound = true;
				newFilePath = localStoage.get(localStorage.key(i));
				break;
			}
		}
		
		//if a URL is not found matching the download URL set the new Path
		// to the default download location
		if(!filePathFound){
			var index = fullFilePath.search(fileName);
			var default_folder = fullFilePath.substr(0,index-1);
			newFilePath = default_folder;			
		}		
		state_read = true;
		
		// connect to the native app to organize the downloads
		connectToNativeApp(fullFilePath,newFilePath,fileName,filetype);					
	}
});


//listener simple over writes a download if it already exists
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  suggest({filename: item.filename,
           conflict_action: 'overwrite',
           conflictAction: 'overwrite'});
});

function connectToNativeApp(var oldFilePath, var newFilePath, var fileName, var fileType){
	console.log('connecting to native app');
	var port = chrome.runtime.connectNative("com.google.chrome.example.nativefoldercreator");	
	//sending message to native app in JSON format
	port.postMessage({oldPath:oldFilePath,newPath:newFilePath,type:fileType,name:fileName});	
	port.onDisconnect.addListener(function() {
		console.log("Disconnected");
	});
}

