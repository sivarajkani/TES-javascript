// Save Proposal Information
	
// assign events for affected loads popup
$(document).ready(function() {
		
	$("#loadsConfirm").click(function() {
		checkLoads = false;
		saveProposal();
		$.fancybox.close();
	});
	
	$("#loadsCancel").click(function(e) {
		$.fancybox.close();
		//$("#saveRates").removeClass("disabled");
		$("#propMessageSpinner").css("display", "none");
		$("#propMessage").hide();
	});
});

function saveProposal (callback){
	var errMessage = false;
	var error = false;
	var success = false;
	var i = -1;
	var url;
	var numOtherLoads = 0;
	var okToSaveAnalytics = true;
	
	var postXML = quote_forSave_xml();			
	
    // Dump Analytics retrieval if it is still running and prevent
    // attempt to save analytics
    if(getAnalyticsXHR && getAnalyticsXHR.readyState != 4){
        getAnalyticsXHR.abort();
        okToSaveAnalytics = false;
    }
    
    // Disable new lane button while save is running
    $("#laneNavPlus").addClass("laneDisabled");
    
	// Build URL to Validate and Retrieve Proposal
	url = "PQxml.pgm?Func=QuoteRequest&Action=SAVE"; 
    
	$.ajax({
		type: "POST",
		url: url,
		data: postXML,
		dataType: "xml",
		success: function(xml) {
			
		    // Check for Success
			success = ($(xml).find('success').text() === 'true'); // parse to boolean
			
			$("#propMessageSpinner").css("display", "none");
			if (success) {
				
				errMessage = $(xml).find('Error').attr('message');
				if (errMessage){
			    	alert (errMessage); 
					error = true;
					
					$("#propMessage").hide();
					// Re-enable Save
					$("#saveRates").removeClass("disabled");
				} else {
					
					// Show "Saved" message
					$("#propMessage > span").html("Saved");
					
					setTimeout(function() {
						$("#propMessage").fadeOut();
					}, 1500);
						
					// Move Header into variables
					idpqheader = $(xml).find('header').attr("idpqheader");
					quotenum = $(xml).find('header').attr("quotenum");
					
					// Move New Proposal into HTML Element
					$('#proposalNumber span').html(quotenum);
         
				    // Move Lane detail into variables
					idpqlandtl = $(xml).find('detail').attr("idpqlandtl");
					lanenumber = $(xml).find('detail').attr("lanenumber");
					
					// Move Lane Geography into variable Geo array
					$(xml).find('geography').each(function(){
						i++;
						geo[i].idpqlangeo = $(this).attr("idpqlangeo");
						geo[i].sequence = $(this).attr("sequence");
					});
					
					// Move Lane Condition into variable Cond array
					i = -1;
					$(xml).find('condition').each(function(){
						i++;
						cond[i].idpqcond = $(this).attr("idpqcond");
					});
					
					// Move Lane Charges into variable Chrg array
					i = -1;
					$(xml).find('charge').each(function(){
						i++;
						chrg[i].idpqlanchr = $(this).attr("recordid");
						chrg[i].sequence = $(this).attr("sequence");
					});		
					
					// Move Notes into variable Notes array
					notes.length = 0;
					i = -1;
					$(xml).find('notes').each(function(){
						i++;
						var n = (notes[i] = {});
						notes[i].cmtkey = $(this).attr("cmtkey");
						notes[i].cmtseq = $(this).attr("cmtseq");
						notes[i].cmtkeytyp = $(this).attr("cmtkeytyp");
						notes[i].cmtaplcod = $(this).attr("cmtaplcod");
						notes[i].cmttype = $(this).attr("cmttype");
						notes[i].comment = $(this).attr("comment");
						notes[i].commentlength = $(this).attr("commentlength");
						notes[i].entusr = $(this).attr("entusr");
						notes[i].enttim = $(this).attr("enttim");
						notes[i].entdat = $(this).attr("entdat");
						notes[i].chgusr = $(this).attr("chgusr");
						notes[i].chgtim = $(this).attr("chgtim");
						notes[i].chgdat = $(this).attr("chgdat");
					});	

					// Enable the EMAIL only when user is Authorized
			        if (emailAuthorized == true){
			        	$("#emailButton").removeClass("disabled");
			        };
					
					// Switch new lane button back on
					$("#laneNavPlus").removeClass("close");
					
					
					
				}
				
			} else { // success = false, some loads were affected
				
				// look for loads from the xml and store them in loads global array
				i = 0
				loads.length = 0;
				$(xml).find('loads').each(function(){
					loads[i] = {};
					loads[i].loadno = $(this).attr("loadno");
					loads[i].printedorrrated = $(this).attr("printedorrated");
					i++;
				});	
				
				if (i > 0){
					// calculate number of loads past 10
					//if (loads.length > 10) {
					//	numOtherLoads = loads.length - 10;
					//} else {
					//	numOtherLoads = 0;
					//}

					// display affected loads to the user
					$("#viewLoads").fancybox({
						onReady: function() {
							$("#loadsList").empty();
							// Display All Loads affected by the SPOT Change
							for (i = 0; i < loads.length; i++) {
								if (loads[i] != undefined) {
									$("#loadsList").append("<li> " + loads[i].loadno + "  " +  loads[i].printedorrrated + " </li>");
								} else {
									break;
								}	
							}

							// display the number of other loads (past 10)
							//$("#loadsOther").html("+" + numOtherLoads + " Others");
						},
						helpers   : { 
							overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox 
						},
						closeBtn: false
					});
					$("#viewLoads").click(); // open the loads fancybox
				} else {
					errMessage = $(xml).find('Error').attr('message');
					if (errMessage){
						alert (errMessage); 
						error = true;

						$("#propMessage").hide();
						// Re-enable Save
						$("#saveRates").removeClass("disabled");
					}
				}
			}
			
			if (callback) {
				callback();
			}
		},
		
		complete: function() {
			// Retrieve Proposal Only if Saved
			if ((checkLoads && loads.length == 0) || !checkLoads){
                if (okToSaveAnalytics) {
                    saveAnalytics(quotenum, function(){
                        // Why are we doing this? //
                        //retrieveProposal(quotenum, lanenumber);
                        //retrieveLog();
                        //getLanes();
                        //rebuildLaneNav();
                        // ---------------------- //
                    });
                }
                
                retrieveProposal(quotenum, lanenumber, function(){
                    //$("#laneNavPlus").removeClass("laneDisabled");
                    getLanes();
                });
                
				
				// Clear Affected Loads 
				loads.length = 0;
			
                // This is more uselessness
                /* 
                getLanes();
                lockQuote(quotenum);
				//document.title = quotenum + "-" + lanenumber;
				//$("#laneNavNum, #laneNavSpinner").val(lanenumber);
				
				if ($("#laneNavNew").hasClass("laneDisabled")) {
					$("#laneNavNew").removeClass("laneDisabled");
				}
				if ($("#laneNavPlus").hasClass("laneDisabled")) {
					$("#laneNavPlus").removeClass("laneDisabled");
				} */
			}
		},
		
		error: function() {
			alert('Could not Save Data');
		   
			$("#propMessageSpinner").css("display", "none");
			$("#propMessage").hide();
		
			// Re-enable Save
			$("#saveRates").removeClass("disabled");
			$("#emailButton").addClass("disabled");
		}
	});
}

//Save lanes after import
function saveImport (){
	var errMessage = false;
	var error = false;
	var importXML;
	var url;
	
	//Build Import XML includes header, detail and Lanes
	importXML = quote_forImport_xml();
	
	url = "PQxml.pgm?Func=SaveImport"; 	
	
	$.ajax({
		type: "POST",
			url: url,
			data: importXML,
			dataType: "xml",
			cache: false,
			
			success: function(xml) {
				$("#propMessageSpinner").css("display", "none");
				
				// Check for Error Messages
				errMessage = $(xml).find('Error').attr('message');
				if (errMessage){
					alert (errMessage); 
					error = true;
					
					// Re-enable Save
					$("#saveRates").removeClass("disabled");
					
				} else {
					
					// Show "Saved" message
					$("#propMessage > span").html("Saved");
					
					setTimeout(function() {
						if (!$("#propMessage").hasClass("locked")){
							$("#propMessage").fadeOut();
						}
					}, 1500);
					
					// If global quotenum is empty put the returned quotenum in it
					$(xml).find('quotenum').each(function(){
						if (quotenum == ""){
							quotenum = $(this).attr("num");
							// Move New Proposal into HTML Element
							$('#proposalNumber span').html(quotenum);
						}
					});
					
                    // Set Authorized Action Buttons and Don't Fade In
                    setAuthorizedActions(false);
					// Enable the EMAIL only when user is Authorized
			        //if (emailAuthorized == true){
			        //	$("#emailButton").removeClass("disabled");
			        //};
			        //if (saveAuthorized == true){
					//	$("#massUpdateButton").removeClass("disabled");
					//}
                    //$("#downloadButton").removeClass("disabled");
                    
					$("#listDropIcon").removeClass("close");
					
					
					importMode = false;
					lanenumber = 1;
					
					// Bring back mini lane line
					$("#laneListDropDown").animate({
						height: "80%"
					}, "fast", function(){
						$("#geoBlock").fadeIn("fast");
					});
					$("#laneListTable_wrapper > .dataTables_scroll > .dataTables_scrollBody").animate({
						height:"440px"
					}, "fast");
					
					retrieveProposal(quotenum, lanenumber);
					// Get Lanes calls rebuildLaneListDatatable
					lanes.length = 0;
					getLanes();
					//rebuildLaneListDatatable();
					clearLoadedRow();
					setLoadedRow(lanenumber);
			        
				}
				
			},
					
			complete: function() {
				
				
			},
					
			error: function() {
				alert('Could not Save Data');
				   
				$("#propMessageSpinner").css("display", "none");
				$("#propMessage").hide();
			
				// Re-enable Save
				$("#saveRates").removeClass("disabled");
				$("#emailButton").addClass("disabled");
			}
	});
		
	
}

function saveCustomerLane (laneid,headerid,custrefno){
	var success;
	var error = false;
	var url;
	
	url = "PQxml.pgm?Func=UPDATECUSTLANE&laneid=" + laneid + "&headerid=" + headerid + "&custrefno=" + custrefno; 	
	
	$.ajax({
		type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			
			success: function(xml) {
				// Check for Successful Save
				success = $(xml).find('response').attr('success');
				if (success == "false"){
					alert('Could not Save Customer Lane Data');
					error = true;
				}
			},
					
			complete: function() {
				
				
			},
					
			error: function() {
				alert('Could not Save Customer Lane Data');
							
			}
	});
		
}

function updateLanesArray(){
	if (lanes.length > 0) {
		$.each(lanes, function(idx, lane){
			if (lane.lanenumber == lanenumber){
			}
		});
	}
}