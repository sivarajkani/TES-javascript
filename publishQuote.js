// Publish Quotes Routines

// Global Variables
var publishMode = false;
var ds_TBPLanes = {};
var ds_lanesToCheck = {};

// Set Click event for Publish Lanes
$(function(){
	$("#publishButton").click(function(){	
		if (! $(this).hasClass("disabled")){
			if ($("#publishPanel").css("display") == "none"){
				selectLanesToPublish(function(){
					if (lanesToUpdate.length == 0){
						alert ("Lanes have not been selected to publish");
					} else {
						$("#publishButton").addClass("disabled");
						checkTBPublishLanes(function(){
							$("#publishButton").removeClass("disabled");
							showPublishForm();
						});
					}
				});
				
			} else {
				hidePublishForm();
			}
		}
	});
				
	$("#publishLaneButton").click(function(){
		var isValidAuthority = false;
		isValidAuthority = validPubAuthority();
		var isValidPubDates = false;
		isValidPubDates = validatePubDates();
		
		if (isValidAuthority && isValidPubDates){
			// Moved up to #publishButton - called when user press publishButton
			//selectLanesToPublish();
			//if (lanesToUpdate.length == 0){
			//	alert ("Lanes have not been selected to publish");
			//} else {
				publishLanes();
			//}
		}
				
	});
	
	$("#pubAuthExpDate").bind("keydown", function(e){
		switch (e.which){
				// Retrieve Customer Info on Enter
			case 9: //Tab
				e.preventDefault();

				$("#pubRateAuthority").focus().select();

				break;
		}
	});
	
});

function showPublishForm(){
	var publishExpUL = $("#publishExpireList");
    var publishExpLI, publishExpCheckBox;
    var rawAmount = 0;
    var pubhlishedRate = 0;
    
    publishMode = true;
    
    // Disable All Actions - Do Not Fade Out
    disableActions(false);
    // Enable Only Publish Button
    $("#publishButton").removeClass("disabled");
      
	$("#publishPanel").show("drop", {direction: "up"}, "fast");
	$("#publishPanel").css("display", "block");

	// Clear Publish Fields
	$("#pubRateAuthority").val("").focus();
	$("#pubPublicationNum").val("");
	$("#pubEffectDate").val("");
	$("#pubAuthExpDate").val("");
	
	$("#publishSelectAll").prop("checked", false);
	$("#publishDeselectAll").prop("checked", false);
	
	// Build Publish Lanes to Expire
	publishExpUL.empty();
	// Build Headings List element
	publishExpLI = $("<li></li>");
	publishExpLI.append($("<span class='pubExpHdr'>Lane</span>"));
	publishExpLI.append($("<span class='pubExpHdr'>Pricing Id</span>"));
	publishExpLI.append($("<span class='pubExpHdr'>Origin</span>"));
	publishExpLI.append($("<span class='pubExpHdr'>Destination</span>"));
	publishExpLI.append($("<span class='pubExpHdr'>Rate</span>"));
	publishExpLI.append($("<span class='pubExpHdr'>Expire</span>"));
	publishExpUL.append(publishExpLI);
	
	// Build Detial List Elements
	if (ds_TBPLanes.length > 0){
		for (var i=0; i < ds_TBPLanes.length; i++){
			publishExpLI = $("<li></li>");
			publishExpLI.append($("<span class='pubExpLane'>" + ds_TBPLanes[i].laneNumber +  "</span>"));
			publishExpLI.append($("<span class='pubExpLane'>" + ds_TBPLanes[i].pricingId +  "</span>"));
			publishExpLI.append($("<span class='pubExpGeo'>" + ds_TBPLanes[i].origin +  "</span>"));
			publishExpLI.append($("<span class='pubExpGeo'>" + ds_TBPLanes[i].destination +  "</span>"));
			// Format Rate to 2 decimals
			rawAmount = Number(ds_TBPLanes[i].rate) * 100;
			publishedRate = (rawAmount/100).toFixed(2),
							{duration:500,
							 animateOpacity:false,
							 intStepDecimals:2,
							 intEndDecimals:2,
							 floatStepDecimals:2,
							 floatEndDecimals:2,
							 showPositive:true};
			
			publishExpLI.append($("<span class='pubExpRate'>" + publishedRate +  "</span>"));
			publishExpCheckBox = $("<input class='pubAutoExpire' type='checkbox' pubExpLaneId='"
					+ ds_TBPLanes[i].laneId + "'/>");
			publishExpCheckBox.prop('checked', false);
			publishExpLI.append(publishExpCheckBox);

			publishExpUL.append(publishExpLI);
		}
		$(".publishExpireLanes").css("display", "block");
		$(".publishSelect").css("display", "block");
	} else {
		$(".publishExpireLanes").css("display", "none");
		$(".publishSelect").css("display", "none");
	}
	
	// Click event for Check Box
	$(".pubAutoExpire"). click(function(){
		// UnCheck the Select/Deselect All Box
		$("#publishSelectAll").prop("checked", false);
		$("#publishDeselectAll").prop("checked", false);
		if ($(this).prop("checked") == true){
		   var laneIdToExpire = $(this).attr("pubExpLaneId");
		  // Update Auto Expire Flag 
		  for (var i=0; i < ds_TBPLanes.length; i++){
			  if (ds_TBPLanes[i].laneId == laneIdToExpire){
				  ds_TBPLanes[i].autoExpire = "Y";
				  break;
			  }
		  }
	  
		}
		else if ($(this).prop("checked") == false){
				var laneIdToExpire = $(this).attr("pubExpLaneId");
				// Update Auto Expire Flag 
				for (var i=0; i < ds_TBPLanes.length; i++){
					if (ds_TBPLanes[i].laneId == laneIdToExpire){
						ds_TBPLanes[i].autoExpire = "N";
						break;
					}
				}
		}
	});
	
	// Select All to Auto Expire
	$("#publishSelectAll").click(function(){
		$("#publishDeselectAll").prop("checked", false);
		// Update All Auto Expire Flag to Y 
		for (var i=0; i < ds_TBPLanes.length; i++){
			ds_TBPLanes[i].autoExpire = "Y";
			// i+2 - skips first li item which is the headings
			$("#publishExpireList li:nth-child(" + (i+2) + ")").children(".pubAutoExpire").prop('checked', true);
		}
		
	});
	
	// Deselect All to Auto Expire
	$("#publishDeselectAll").click(function(){
		$("#publishSelectAll").prop("checked", false);
		// Update All Auto Expire Flag to N 
		for (var i=0; i < ds_TBPLanes.length; i++){
			ds_TBPLanes[i].autoExpire = "N";
			// i+2 - skips first li item which is the headings
			$("#publishExpireList li:nth-child(" + (i+2) + ")").children(".pubAutoExpire").prop('checked', false);
		}
		
	});
}

function selectLanesToPublish(callback){
	lanesToUpdate.length = 0;
	// Build Selected Lanes for Publish and Mark Selected Lanes in Lane List
	$("#laneListTable tr.selected").each(function() {
		var selectedLane = ($(this).find("td:first-child").html());
		for (i = 0; i < lanes.length; i++) { 
           	if (lanes[i].lanenumber == selectedLane && lanes[i].type != 'Inq' 
           		&& lanes[i].type != 'Spot' && lanes[i].proposedrate != '.0000'){
           		lanesToUpdate.push(lanes[i].idpqlandtl);
           		lanes[i].selectedToPublish = true;
           		break;
          	};
        }
			
	});
	
	ds_lanesToCheck.lanes = lanesToUpdate;
	
	if (callback){
		callback();
	}
}

function hidePublishForm(immediately){
	publishMode = false;
	
    // Set Authorized Action Buttons and Do Not FadeIn
    setAuthorizedActions(false);
    
   	for (var x = 0; x < lanes.length; x++) {
		lanes[x].upderror = false;
		lanes[x].updmessage = "";
		lanes[x].selectedToPublish = false;
	}
	
	lanesToUpdate.length = 0;
	
	if ($("#pubRateAuthority").hasClass("invalidField")) {
		$("#pubRateAuthority").removeClass("invalidField");
		$("#pubRateAuthority").removeAttr("title");
	}
	if ($("#pubPublicationNum").hasClass("invalidField")) {
		$("#pubPublicationNum").removeClass("invalidField");
		$("#pubPublicationNum").removeAttr("title");
	}	
	if ($("#pubEffectDate").hasClass("invalidDate")) {
		$("#pubEffectDate").removeClass("invalidDate");
		$("#pubEffectDate").removeAttr("title");
	}
	if ($("#pubAuthExpDate").hasClass("invalidDate")) {
		$("#pubAuthExpDate").removeClass("invalidDate");
		$("#pubAuthExpDate").removeAttr("title");
	}
	
	$("#publishPanel").hide("drop", {direction: "down"}, "fast");
	
	
	
}
function validPubAuthority(){
	var valid = true;
	// Clear Invalid Fields
	if ($("#pubRateAuthority").hasClass("invalidField")) {
		$("#pubRateAuthority").removeClass("invalidField");
		$("#pubRateAuthority").removeAttr("title");
	}
	if ($("#pubPublicationNum").hasClass("invalidField")) {
		$("#pubPublicationNum").removeClass("invalidField");
		$("#pubPublicationNum").removeAttr("title");
	}
	
	var rateAuthority = $("#pubRateAuthority").val();
	if (rateAuthority == ""){
		$("#pubRateAuthority").addClass("invalidField");
		$("#pubRateAuthority").attr("title", "Publish Rate Authority is a Required Field.");
		valid = false;
	}
	var publicationNum = $("#pubPublicationNum").val();
	if (publicationNum == ""){
		$("#pubPublicationNum").addClass("invalidField");
		$("#pubPublicationNum").attr("title", "Publication Number is a Required Field.");
		valid = false;
	}
	if (!valid){
		$("#publishLaneButton").addClass("disabled");
	} else {
		if (! $("#pubEffectDate").hasClass("invalidDate") && ! $("#pubAuthExpDate").hasClass("invalidDate") ){
			$("#publishLaneButton").removeClass("disabled");
		}
	};
	
	return valid;
}
function validatePubDates() {
	
	var effIsValid = true;
	var expIsValid = true;
	
	var effMoment;
	var effString;
	
	var expMoment;
	var expString;
	
	var yearLength;
	
	effString = $("#pubEffectDate").val();
	if (effString != ""){
		if (effString.indexOf("/") != -1) {
			
			yearLength = (effString.length - 1) - effString.lastIndexOf("/");
			
			if (yearLength == 1 || yearLength == 2) {
				effMoment = new moment(effString, "MM-DD-YY");
			} else {
				effMoment = new moment(effString, "MM-DD-YYYY");
			}
		} else {
			if (effString.length == 6) {
				effMoment = new moment(effString, "MM-DD-YY");
			}
			else {
				effMoment = new moment(effString, "MM-DD-YYYY");
			}
		}
		
		// check to see if the effective date is valid
		if (effMoment.isValid()) {
			
			// clear if previously invalid ----Move outside of function, do before calling function
			if ($("#pubEffectDate").hasClass("invalidDate")) {
				$("#pubEffectDate").removeClass("invalidDate");
				$("#pubEffectDate").removeAttr("title");
			}
			
			
			$("#pubEffectDate").val(effMoment.format("MM/DD/YYYY"));
			
		} else {
			$("#pubEffectDate").addClass("invalidDate");
			$("#pubEffectDate").attr("title", "Invalid Date");
			effIsValid = false;
		}
	} else {
		// Date Required
		$("#pubEffectDate").addClass("invalidDate");
		$("#pubEffectDate").attr("title", "Publication Effective Date is a Required Field.");
		effIsValid = false;
		
	}
	

	expString = $("#pubAuthExpDate").val();
	if (expString != ""){
		if (expString.indexOf("/") != -1) {
			
			yearLength = (expString.length - 1) - expString.lastIndexOf("/");
			
			if (yearLength == 1 || yearLength == 2) {
				expMoment = new moment(expString, "MM-DD-YY");
			} else {
				expMoment = new moment(expString, "MM-DD-YYYY");
			}
		} else {
			if (expString.length == 6) {
				expMoment = new moment(expString, "MM-DD-YY");
			}
			else {
				expMoment = new moment(expString, "MM-DD-YYYY");
			}
		}
		
		// check to see if the expiration date is valid
		if (expMoment.isValid()) {
			
			if ($("#pubAuthExpDate").hasClass("invalidDate")) {
				$("#pubAuthExpDate").removeClass("invalidDate");
				$("#pubAuthExpDate").removeAttr("title");
			}
		
			// check to see if expiration date is greater than effective date
			if (effString != ""){
				if (expMoment <= effMoment) {
					$("#pubAuthExpDate").addClass("invalidDate");
					$("#pubAuthExpDate").attr("title", "Expiration date must be after Effective date");
					expIsValid = false;
				} else {
					if ($("#pubAuthExpDate").hasClass("invalidDate")) {
						$("#pubAuthExpDate").removeClass("invalidDate");
						$("#pubAuthExpDate").removeAttr("title");
					}
					
					$("#pubEffectDate").val(effMoment.format("MM/DD/YYYY"));
					$("#pubAuthExpDate").val(expMoment.format("MM/DD/YYYY"));
				}
			} else {
				
				$("#pubAuthExpDate").val(expMoment.format("MM/DD/YYYY"));
			}
			
		} else {
			$("#pubAuthExpDate").addClass("invalidDate");
			$("#pubAuthExpDate").attr("title", "Invalid Date");
			expIsValid = false;
		}					
	} else {
		// Date Required
		$("#pubAuthExpDate").addClass("invalidDate");
		$("#pubAuthExpDate").attr("title", "Publication Expiration Date is a Required Field.");
		effIsValid = false;
		
	} 
	
	if (effIsValid && expIsValid) {
		if (! $("#pubRateAuthority").hasClass("invalidField") && ! $("#pubPublicationNum").hasClass("invalidField") ){
			$("#publishLaneButton").removeClass("disabled");
		}	
		pubEffectiveDate = effMoment.format("YYYY-MM-DD");
		pubExpireDate = expMoment.format("YYYY-MM-DD");
		return true;
	} else {
		$("#publishLaneButton").addClass("disabled");
		return false;
	}
	
	
	
}

// AJAX Routines
function checkTBPublishLanes(callback){
    var post_Lanes,
        url;
    
    // Spinner 
    if ($("#sMaskLanes").css('display') != "block"){
		$("#sMaskLanes").css('display', 'block');
		lanesCL.show();
		$("#sLoadingLanes").css('display','block');
	};
	
    post_Lanes = JSON.stringify(ds_lanesToCheck);
         
    url = "PQxml.pgm?Func=CheckPublishLanes&quotenum=" + quotenum;
    
    //url = "/applications/Pricing/xml/publishCheckTest.json";
  
    $.ajax({
        url: url,
        method: "POST",
        data: post_Lanes,
        processData: false,
        dataType: "json",
        async: true,
        cache: false,
        timeout: 60000,
        success: function(lanes){
            ds_TBPLanes = lanes;
           
            if (callback) {
            callback();
            }
        },

        complete: function() {
                 	
        	if ($("#sMaskLanes").css('display') == "block"){
        		$("#sMaskLanes").css('display', 'none');
        		lanesCL.hide();
        		$("#sLoadingLanes").css('display','none');
        	};
        },

        error: function(errorStatus, errorMessage) {
            if (errorStatus != "abort"){
            	alert ('Error during CheckPublishLanes. Error Status: ' + errorStatusMessage  + ' Message: ' + errorMessage);
            }
        }
    });


}


function publishLanes(){
	
	
	var postXML = quote_forPublish_xml();			
	
	// Build URL to Validate and Retrieve Proposal
	url = "PQxml.pgm?Func=QuoteRequest&Action=PUBLISH&quotenum=" + quotenum; 
    
	$.ajax({
		type: "POST",
		url: url,
		data: postXML,
		dataType: "xml",
		success: function(xml) {
			
			
		    
		},
		
		complete: function() {
			  	
			// Show "Submitted" message
			$("#propMessage > span").html("Publish Submitted").show();
		    $("#propMessage").css("display", "inline-block");
			$("#propMessage").show();
			setTimeout(function() {
				$("#propMessage").fadeOut();
				
				}, 1500);
			hidePublishForm();
			
		},
		
		error: function() {
			alert('Could not Submit Publish Job.');
		   
			
		}
	});
}
