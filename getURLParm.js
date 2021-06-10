//-------------------------------------------------------------------------------
// Get parameters from URL
//-------------------------------------------------------------------------------
function getURLParm(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results) {
   		return decodeURIComponent(results[1]) || "error";
	} else {
		return "error";
	}
}