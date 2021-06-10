
// Global variables
var quoteLockedByOther;

//$(window).unload(function() {
window.onunload = function(){
	if (quotenum.length == 11 && !isNaN(quotenum)) {
		unlockQuote(quotenum);
	}
};

// FOR DEBUGGING PURPOSES
//$(window).bind("beforeunload", function() {
//	unlockQuote(quotenum);
//	console.log("debug: quote has been unlocked");
//});

function lockQuote(quote) {
	
	var $response;
	var action;
	var success;
	var message;
	var user;
	
	var url = "pqxml.pgm?func=quotelock&quotenum=" + quote + "&lane=" + lanenumber;
	
	// Abort active lock request if one is in progress
	if(lockXHR && lockXHR.readyState != 4){
		lockXHR.abort();
	}
	
	lockXHR = 
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			success: function(response) {
				
				$response = $(response).find("response");
				
				action = $response.find("action").text();
				success = $response.find("success").text();
				message = $response.find("message").text();
				
				if (success == "true") {
					quoteLockedByOther = false;
					
					$("#propMessage").removeClass("locked");
					setTimeout(function() {
						$("#propMessage").fadeOut();
					}, 1500);
					
					if ($("#saveRates").hasClass("lockDisable")) {
						$("#saveRates").removeClass("lockDisable");
					}
					if ($("#emailButton").hasClass("lockDisable")) {
						$("#emailButton").removeClass("lockDisable");
					}
                    // Set Authorized Action Buttons and Do Not Fade In
                    setAuthorizedActions(false);
                    
					//if ($("#massUpdateButton").hasClass("disabled")) {
					//	$("#massUpdateButton").removeClass("disabled");
					//}
					//if ($("#publishButton").hasClass("disabled") && publishAuthorized == true) {
					//	$("#publishButton").removeClass("disabled");
					//}
					//if ($("#auditButton").hasClass("disabled")) {
					//	$("#auditButton").removeClass("disabled");
					//}
					//if ($("#downloadButton").hasClass("disabled")) {
					//	$("#downloadButton").removeClass("disabled");
					//}
				} else {
					quoteLockedByOther = true;
					
					// display the locked message to the user
					$("#propMessage").addClass("locked");
					$("#propMessage").css("display", "inline-block");
					$("#propMessage > span").html(message);
					
					// make the buttons locked disabled & do Not Fade Out
                    disableActions(false);
					$("#saveRates").addClass("lockDisable");
					$("#emailButton").addClass("lockDisable");
					//$("#massUpdateButton").addClass("disabled");
					//$("#publishButton").addClass("disabled");
					//$("#auditButton").addClass("disabled");
					// Locked by Batch - Disable the Download Button
					//if (message.search("BATCH") > 0){
					//	$("#downloadButton").addClass("disabled");
					//}
				}
			},
		
			complete: function(jqXHR, completeStatus) {
			
			},
						
			error: function(jqXHR, errorStatus, errorMessage) {
				if (errorStatus != "abort"){
				}
			}
		});	
}

function unlockQuote(quote) {
	
	var url = "pqxml.pgm?func=quoteunlock&quotenum=" + quote + "&lane=" + lanenumber;
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		cache: false,
		async: false,
		success: function(response) {},
		complete: function(jqXHR, completeStatus) {},			
		error: function(jqXHR, errorStatus, errorMessage) {}
	});	
}

function quoteLockedByBatch(quote) {
	
	// Determine if any lanes of the Quote are Locked by Batch User
	var lockedByBatch = false;
	var url = "pqxml.pgm?func=lockedbybatch&quotenum=" + quote;
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		cache: false,
		async: false,
		success: function(response) {
			if ($(response).find('success').text() == "true"){
				lockedByBatch = true;
			};	

		},
		complete: function() {
			
		},			
		error: function() {
          alert('Errors during lockedByBatch');			
		}
	});	
	
	return lockedByBatch;
	
}