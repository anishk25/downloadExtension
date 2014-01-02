$(document).ready(function(){	
	load();	
				
	$(document).on('click', '.dltbtn', function(event){					
		var table_row = $(this).closest('tr');	
		var url_name = table_row.find(".url_col").text();
		table_row.remove();      
		localStorage.removeItem(url_name);
		localStorage.setItem('table', mytable.innerHTML);	
		
		return false;
	});		

	$(document).on('click', '#clearLocal', function(event){					
		localStorage.clear();
		mytable.innerHTML = '<tr><td>URLS</td><td>Filepath</td></tr>';		
		return false;
	});	
				
				
	$('#addrow').click(function(){
		var urlName = document.getElementById("urlBox").value;
		var folder = document.getElementById("folderBox").value;
		if(urlName == null || urlName == "" || folder == null || folder == ""){
			alert("Must fill out website and folder name");
			return false;
		}
		
		// storing url and folder in local storage
		var filePath = folder.replace("\\","\\\\");
		localStorage.setItem(urlName,filePath);	

		// adding row in table
		$('#mytable').append('<tr><td class = "url_col">' + urlName + '</td><td class = "folder_col">' + folder + '</td><td><button class = "dltbtn">delete</button></td></tr>');
		localStorage.setItem('table', mytable.innerHTML);		
		return false;
	});
	
	function load() {
		// when the page loads
		if ( localStorage.getItem('table')) {
			mytable.innerHTML = localStorage.getItem('table'); 			
		}		
	}
	
});