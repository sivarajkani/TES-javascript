
var emailTo;
var emailSubject;
var emailBody;
var lanesToEmail = [];

$(document).ready( function () {
	
	// set up Fancybox with the email form
	$("#emailButton").fancybox( {
		'beforeClose': function () {
			$("#emailTo").val("");
			$("#emailSubject").val("");
			$("#emailBody").val("");
			$("#emailCc").val("");
			$("#emailBcc").val("");
			$("#emailAttachments option").removeAttr("selected");
		},
		'beforeLoad': function () {
			if ($("#emailButton").hasClass("disabled") ||
				$("#emailButton").hasClass("lockDisable")){
				$.fancybox.cancel();
			} 
			
			// get the lane numbers of the lanes to email.
			// cannot email more than 10 lanes
			lanesToEmail.length = 0;
			
			if (inLaneListMode) {
				$("#laneListTable tr.selected").each(function() {
					lanesToEmail.push($(this).find("td:first-child").html());
				});
				
				if (lanesToEmail.length == 0) {
					lanesToEmail.push(lanenumber);
				}
			} else {
				lanesToEmail.push(lanenumber);
			}
			
			if (lanesToEmail.length > 10) {
				$.fancybox.cancel();
				alert("You cannot email more than 10 lanes");
			}
		},
		'afterLoad': function () {
			
			// display a save & continue dialog box
			if (!$("#saveRates").hasClass("disabled")){
				$("body").append("<div id=\"saveContinue\" style=\"display: none\">" +
				"The proposal must be saved before you can send an email.</div");
				
				$("#saveContinue").dialog({
					title: "Save & Continue",
					buttons: { 
						"Save & Continue": function () {
							// Cancel any rating in progress
							if(rmsRateXHR && rmsRateXHR.readyState != 4){
								rmsRateXHR.abort();
							}
							
							$("#saveRates").click();
							$("#saveContinue").dialog("close");
						}, 
						"Cancel": function () {
							$("#saveContinue").dialog("close");
							$.fancybox.close();
						}
					},
					position: "center",
					close: function () {
						$("#emailTo").focus();
					},
					open: function () {
						$(".ui-dialog-titlebar-close").hide();
					}
					
				});
			}
			$("#emailLaneCount span").html(lanesToEmail.length);
		}
	});
	
	retrieveAttachments(); 
	
	$("#emailButton").click( function() {
		$("#emailSubject").val("Contract Freighters, Inc. Quote # " + quotenum);
		$("#emailTo").val($("#contactEmail").text());
	});

	// cancel sending the email
	$("#cancelEmail").click( function() {
		$.fancybox.close();
		
		// clear text fields
		$("#emailTo").val("");
		$("#emailSubject").val("");
		$("#emailBody").val("");
	});
	
	// send the email
	$("#sendEmail").click( function() {
		
		emailTo = $("#emailTo").val();
		emailSubject = $("#emailSubject").val();
		//emailBody = encodeURIComponent($("#emailBody").val());
		emailBody = $("#emailBody").val();
		emailCc = $("#emailCc").val();
		emailBcc = $("#emailBcc").val();
		
		// clean up the email address list
		emailTo = emailTo.replace(/ /g,'');	// remove whitespace
		if (emailTo.substr(emailTo.length - 1) != ";") {
			emailTo += ";"; 
		}
		if (emailCc.substr(emailCc.length - 1) != ";") {
			emailCc += ";"; 
		}
		if (emailBcc.substr(emailBcc.length - 1) != ";") {
			emailBcc += ";"; 
		}
		
		sendEmail();
		
		$.fancybox.close();
	});
	
});
	
// send email information to the server so the server
// can send an email
function sendEmail() {

	var url;
	var response;
	
	var xml = genXml();
		
	url = "PQXML.pgm?" +
    "Func=SendEmail&Action=POST&QuoteNum=" + quotenum + "&Lane=" + lanenumber;
		 			
	$.ajax({
		type: "POST",
		url: url,
		data: xml,
		dataType: "xml",
		cache: false,
		success: function(xml) {
			response = $(xml).find('success').html();
			if (response == "false") {
				alert("The server had a problem sending the email");
			} else {
				
				// Set the propMessage box to the correct message
				$("#propMessage > span").text("Email Sent");
				
				// Show success message
				$("#propMessage")
					.fadeIn()
					.css("display","inline-block")
					.delay(2000)
					.fadeOut();
			}
			
		},
		complete: function() {
			retrieveLog();
		},
		error: function() {
			alert("There was an error with the AJAX request");
		}
	});
}

//*************************
//get standard attachments
//*************************
function retrieveAttachments (customer){
	var errMessage;
	var error = false;
	var url;
	var extension;
	var fileName;
	var filePath;
	var $files;
	
	// standard attachment url	
	url = "dirGetList.pgm?dir=/qntc/vm00052.cfi.int/deptdata/" +
	      "Revenue Management/Controlled/Pricing System/" +
	      "standard Email Attachments/&alldocs=true";	 			

	// standard attachment request
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {
			
		    // Check for Error Messages
			errMessage = $(xml).find('Error').attr('message');
			if (errMessage){
		    	alert (errMessage); 
				error = true;
			} else {
				$files = $(xml).find('file');
				
				$files.each(function () {
					
					fileName = $(this).attr('name');
					filePath = $(this).attr('path');
					
					extension = fileName.substring(fileName.lastIndexOf('.') + 1); 
					if (extension == "pdf") {
						$("#emailAttachments").append("<option disabled value=\"" + filePath +
							"\">" + fileName + "</option>");
					}
					
				});
			}
		},
		
		complete: function() {   // optional attachments are retrieved AFTER the standard attachments
			getOptionalDocs();   // so they will be in order in the HTML
		},
		
		error: function() {
			alert('Cannot find Customer data');
		}
	});
}

//*************************
//get optional attachments
//*************************
function getOptionalDocs() {
	var errMessage;
	var error = false;
	var url;
	var extension;
	var fileName;
	
	// optional attachment url	
	url = "dirGetList.pgm?dir=/qntc/vm00052.cfi.int/deptdata/" +
	      "Revenue Management/Controlled/Pricing System/" +
	      "optional Email Attachments/&alldocs=true";	 			

	// optional attachment request
	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		success: function(xml) {
			
		    // Check for Error Messages
			errMessage = $(xml).find('Error').attr('message');
			if (errMessage){
		    	alert (errMessage); 
				error = true;
			} else {
				$files = $(xml).find('file');
				
				$files.each(function () {
					
					fileName = $(this).attr('name');
					filePath = $(this).attr('path');
					
					extension = fileName.substring(fileName.lastIndexOf('.') + 1); 
					if (extension == "pdf") {
						$("#emailAttachments").append("<option value=\"" + filePath +
						    "\">" + fileName + "</option>");
					}
					
				});
			}
		},
		
		complete: function() {
			
		},
		
		error: function() {
			alert('Cannot find Customer data');
		}
	});
}

//generate the XML which will be sent to the server
function genXml() {
	var path; 
	
	var xml = '<email>' +
			  '<to>'      + emailTo      + '</to>'      +
			  '<cc>'      + emailCc      + '</cc>'      +
			  '<bcc>'     + emailBcc     + '</bcc>'     +
			  '<subject>' + encodeURIComponent(emailSubject) + '</subject>' +
			  '<body>'    + encodeURIComponent(emailBody)    + '</body>';

	// standard attachments
	var $standard = $("#emailAttachments").find(":disabled");
	
	$standard.each( function() {
		path = $(this).val();
		xml += "<attachment>" + path + "</attachment>";
	});
	
	// optional attachments
	var $optional = $("#emailAttachments").find(":selected");
	
	$optional.each( function() {
		if ($(this).attr('disabled') != true) {
			path = $(this).val();
			xml += "<attachment>" + path + "</attachment>";
		}
	});
	
	for (var i = 0; i < lanesToEmail.length; i++) {
		xml += "<lane>" + lanesToEmail[i] + "</lane>";
	}
	
	xml += '</email>';
	
	return xml;
}