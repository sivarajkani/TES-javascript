// Get Load Information XML File 
function validateLoad(loadNumber, callback) {
	
	var loadvalid;
	var url;
	
	url = "xmlload.pgm?" +
	"load=" + loadNumber;
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {
			
		    // Check for Success
			loadvalid = $(xml).find('valid').text();

		},
		
		complete: function() {
			// Run callback function if passed	
			if (callback){
				callback(loadvalid);
			}
			
			if (loadvalid == 'true') {
				return true;
			} else {
				return false;
			};

		},
			
		error: function() {
			return false;		
		}
		
	});
	
}
