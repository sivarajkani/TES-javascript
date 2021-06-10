var auditMode = false;

// Set Click event to Audit Lanes

$(function(){
	$("#auditButton").click(function(){	
		if (! $(this).hasClass("disabled")){
			if ($("#auditPanel").css("display") == "none"){
				showAuditForm();
			} else {
				hideAuditForm();
			}
		}
	});
	
	$("#auditSelectedButton").click(function(){
		var lanesToAuditType = "selected";
		selectLanesToAudit();
		if (lanesToUpdate.length == 0){
			alert ("Published Lanes have not been selected to audit");
		} else {
			auditLanes(lanesToAuditType);
			
		}
	});
	
	$("#auditFailedButton").click(function(){
		var lanesToAuditType = "failed";
		auditLanes(lanesToAuditType);
		
	});
	
	$("#auditBadge").click(function(){
		auditSingleLane();
	});
	
	
				
});

function showAuditForm(){
	auditMode = true;
	
    // Disable All Actions - Do Not Fade Out
    disableActions(false);
    // Enable Only Audit Update Button
    $("#auditButton").removeClass("disabled");
    
	//$("#downloadButton").addClass("disabled");
	//$("#massUpdateButton").addClass("disabled");
	//$("#publishButton").addClass("disabled");
	//$("#saveRates").addClass("disabled");		
	//$("#emailButton").addClass("disabled");
	
	$("#auditPanel").show("drop", {direction: "up"}, "fast");
	$("#auditPanel").css("display", "block");
	
}

function hideAuditForm(immediately){
	auditMode = false;
    
    // Set Authorized Action Buttons and Do Not FadeIn
    setAuthorizedActions(false);
    
	//$("#downloadButton").removeClass("disabled");
	//$("#massUpdateButton").removeClass("disabled");
    //if (publishAuthorized == true) {
    //$("#publishButton").removeClass("disabled");
//} 
	//$("#emailButton").removeClass("disabled");
	
	$("#auditPanel").hide("drop", {direction: "down"}, "fast");

}
function selectLanesToAudit(){
	lanesToUpdate.length = 0;
	// Build Selected Lanes for Audit 
	$("#laneListTable tr.selected").each(function() {
		var selectedLane = ($(this).find("td:first-child").html());
		for (i = 0; i < lanes.length; i++) { 
           	if (lanes[i].lanenumber == selectedLane && lanes[i].workflowstatus == 'Pub'){ 
           		lanesToUpdate.push(lanes[i].idpqlandtl);
           		break;
          	};
        }
			
	});
	
}

function auditLanes(auditType){
	var typeToAudit="F";
	var postXML = '';
	var lanesXML = '';
	var errMessage;
	
	if (auditType == "selected"){
		typeToAudit = "S";
		for (var i = 0; i < lanesToUpdate.length; i++) {
			lanesXML += '<lane>' +
			 lanesToUpdate[i] + 
			'</lane>';
		};
	} else {
//		lanesXML = "<lane></lane>";
        lanesXML = "";
	}
	
	postXML = '<AuditInfo audittype="' + typeToAudit + '" >'
		+ lanesXML + '</AuditInfo>';
	
		
	// Build URL to Validate and Retrieve Proposal
	url = "PQxml.pgm?Func=QuoteRequest&Action=AUDIT&quotenum=" + quotenum; 
    
	$.ajax({
		type: "POST",
		url: url,
		data: postXML,
		dataType: "xml",
		success: function(xml) {
			
			// Check for Errors during Submit
			errMessage = $(xml).find('Error').attr('message');
			if (errMessage){
				alert('Error when submitting Audit. ' + errMessage);
			} else {
				// Show "Submitted" message
				$("#propMessage > span").html("Audit Submitted").show();
			    $("#propMessage").css("display", "inline-block");
				$("#propMessage").show();
				setTimeout(function() {
					$("#propMessage").fadeOut();
					
					}, 1500);
			}
			
		    
		},
		
		complete: function() {
			  	
			hideAuditForm();
			
		},
		
		error: function() {
			alert('Could not Submit Audit Job.');
		   
			
		}
	});
	
	
}
function auditSingleLane(){	
	var errMessage;
	var url;
	

	$("#auditPass, #auditFail").fadeOut("fast");

	// Show "Submitted" message
	$("#propMessage > span").html("Audit Submitted").show();
	$("#propMessage").css("display", "inline-block");
	$("#propMessage").show();
	setTimeout(function() {
		$("#propMessage").fadeOut();

	}, 1500);
	
		// Build URL to Audit Proposal
	url = "PQxml.pgm?Func=AUDIT&quotenum=" + quotenum + "&lane=" + lanenumber; 
		
	$.ajax({
		type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
				
		   	success: function(xml){
		   		// Check for Errors ($(xml).find('meformattednumber').text())
				errMessage = $(xml).find('message').text();
				if (errMessage){
					alert('Error during single lane audit. ' + errMessage);
				} else {
					
			   		auditreslt = $(xml).find('response').attr("auditreslt");
			   		auditdate = $(xml).find('response').attr("auditdate");
			   		// Audit Results 
			   		switch (auditreslt){
			   		// Pass 
			   		case "P":
			   			$("#auditPass").fadeIn("fast");
						break;
			   		// Fail
						case "F":
						$("#auditFail").fadeIn("fast");
			   			break;
			   		}	
				}
		   	},
	
	
		   	complete: function() {
		   		retrieveLog();
		   	},
		   	error: function() {
				alert('Error during call of Single Audit Function.');
				$("#auditFail").fadeIn("fast");
		   					
			}
	});
	
}



