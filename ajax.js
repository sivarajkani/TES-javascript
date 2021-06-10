// JavaScript Document
	
/////// GETS /////////////
 
    // Retrieve Accessorials 
	function retrieveAccessorials (){
		
		var accessorialDtl;
		var accessorialUL = $('#accessorials');
		
		accessorialUL.empty();
		$("#accessorialsDropdown").show();	
		
		for (x = 0; x < accessorialCodes.length; x++) {
		
				
			accessorialDtl = $("<li></li>");
						
			accessorialCheckbox = $("<input type='checkbox' rpcode='" + accessorialCodes[x].code +
					"' rpctyp='" + accessorialCodes[x].codeType + "'/>");
			accessorialCheckbox.prop('checked', false);
			// Check the Box when the Accessorial Code exists in the Conditions Array
			$.each(cond,function(){
				if (this.code == accessorialCodes[x].code) {
					accessorialCheckbox.prop('checked', true);
				} 
			});
						
		   	accessorialDtl.append(accessorialCheckbox);
		   	accessorialDtl.append($("<span>"+accessorialCodes[x].codeDesc.toLowerCase()+"</span>"));
		 	accessorialUL.append(accessorialDtl);
						
		}								
		 		
			
		$('#accessorials > li > input[type=checkbox]')
			.bind("keyup", function(e){
				switch (e.which) {
					case 27: //Escape
						$("#getAccessorials").click();
						break;
				}
			})
			.change(function () {
				if ($(this).prop("checked")) {
								
					// Add the Accessorial Code to Conditions Array when Checked
					var i = (cond.length-1) + 1;
					var c = (cond[i] = {});
					c["idpqcond"] = 0;
					c["codetype"] = "A";
					c["code"] = $(this).attr("rpcode");
					c["qualifier1"] = "";
					c["qualifier2"] = "";
					c["exclcond"] = "";
							
							
				} else {
					// Remove the Accessorial Code from the Conditions Array when Un-Checked
					var currentCheckbox = $(this);
					$.each(cond,function(index,value){
						if (this.code == currentCheckbox.attr("rpcode")) {
							cond.splice(index,1);
						} 
					})
						
				}
							
				accessorialsChanged = true;
						
			});
					
		// User clicks the checkbox text it will automatically click the checkbox as well
		$("#accessorials > li > span").click(function() {
			$(this).prev().click();
		});
					
	
	}
	
	
	// Retrieve Contact Information by Contact Id#
	function retrieveContact(contactid){
		
		var url = "contxmlctl.pgm?func=getcontact&input=" + contactid;
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function(xml) {
							    						
				// Move Contact Data into HTML variables
				$('.contactNameLabel').html($(xml).find('contact').attr("contactname"));
				$('#contactPhone').html(formatPhone($(xml).find('contact').attr("contactphone")));
				$('#contactEmail').html($(xml).find('contact').attr("contactemail"));
				$('#contactTitle').html($(xml).find('contact').attr("contacttitle"));
				$('#contactDept').html($(xml).find('contact').attr("contactdept"));
				$("#contactName").children("input").hide();
				$("#contactName").children("span").show();	
			
			},
			
			complete: function() {
			},
			
			error: function() {
				alert('Cannot find Contact Information.');
			}
		});		
	}
	
	
	// Retrieve Customer Information
	function retrieveCUST (customer, callback){
		
		var errMessage;
		var error = false;
		var url;
		
		
		// Build URL to Validate and Retrieve Customer Address	
		url = "CUSTxml.pgm?" +
        "custNumber=" + customer;	
			 			
	
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function(xml) {
				
			    // Check for Error Messages
				errMessage = $(xml).find('Error').attr('message');
				if (errMessage){
					$("#customerNumberEdit").addClass("invalidField"); 
					error = true;
				} else {
						
				    // Move customer detail data into html variables
					cusprefix = $(xml).find('prefix').text();
					cusbase = $(xml).find('base').text();
					cussuffix = $(xml).find('suffix').text();
					publishcustomer = $(xml).find('publishcustomer').text();
					
					$('#customerNumberLabel').html($(xml).find('formattednumber').text());
				    $('#customerName').html($(xml).find('name').text());
					$('#custStreet').html($(xml).find('address1').text());
					$('#custCityStZip').html($(xml).find('citystatezip').text());
					
					$('#custMileageSourceCode').html("<a href='#'>"+ $(xml).find('milagesource').text() + "</a><div class='exLink'></div>");
					$('#custCreditStatusCode').html($(xml).find('creditstatus').text());
					
					//var formattedPublishCustomer = publishcustomer.slice(0,1) + "-" + 
					//                               publishcustomer.slice(1,6);
					//if (publishcustomer.slice(6,9) != ""){
					//	formattedPublishCustomer += "-" + publishcustomer.slice(6,9);
					//}
					$('#publishCustomerNumber').html("<a href='#'>"+publishcustomer+ "</a><div class='exLink'></div>");
					
					// Contact Info Pulled from Customer only when Contact Not Entered
					if (contactid == 0 || getPrimaryCustContact){
						contactid = $(xml).find('contactid').text();
						$('.contactNameLabel').html($(xml).find('contact').text());
						$('#contactPhone').html(formatPhone($(xml).find('contactphone').text()));
						$('#contactEmail').html($(xml).find('contactemail').text());
						$('#contactTitle').html($(xml).find('contacttitle').text());
						$("#contactName").children("input").hide();
						$("#contactName").children("span").show();	
					};
					
					$('#custInfoIcon').css("display", "inline-block");
					$('#contInfoIcon').css("display", "inline-block");
					
					// Load Default Customer Users
					custDefaultUsers.length = 0;
					var i = -1;
		    		$(xml).find('User').each(function(){
						i++;
						var u = (custDefaultUsers[i] = {});
						u["userType"] = $(this).find('usertype').text();
						u["userProfile"] = $(this).find('userprofile').text();
					});
		    		
		    		// Set Lane Users to Customer Default for New Quote
		    		if (quotenum == ""){
		    			$("#salesUser").val("");
		    			$("#priceUser").val("");
		    			$("#publishUser").val("");
		    		
		    			for (i = 0; i < custDefaultUsers.length; i++){
		    				switch (custDefaultUsers[i].userType){
		    				case "SALES":
		    					$("#salesUser").val(custDefaultUsers[i].userProfile);
		    					break;
		    				case "PRICING":
		    					$("#priceUser").val(custDefaultUsers[i].userProfile);
		    					break;
		    				case "PUBLISH":
		    					$("#publishUser").val(custDefaultUsers[i].userProfile);
		    					break;
		    				}
		    			}
                        
                        // Set Authorized Workflow 
                        setAuthorizedWorkFlow();
		    		}
					
					if ($("#geoBlock").css("display") == "none") {
						$("#geoBlock").fadeIn(400, function(){
							if ($("#entryBox").css("display") == "none"){
								if (laneLayout.length == 0){
									$("#entryBox").animate({
										height: "toggle",
										opacity: "toggle"
									}, "fast", function(){
										$(".laneContainer").show();
										$("#laneMap").show();
										$("#geoEntry").focus();
									});
								} else {
									$(".laneContainer").show();
									$("#laneMap").show();
									$("#geoEntry").focus();
								}
							} else {
								$(".laneContainer").show();
								$("#laneMap").show();
								$("#geoEntry").focus();
							}
						});
					}
					
					//$('#contMethSelect').css('display', 'inline-block');
					$("#saveRates").css("display", "inline-block");
					$("#newButton").css("display", "inline-block");
					$("#emailButton").css("display", "inline-block");
					$('#tabs').css("display", "inline-block");
					
					// Fetch Customer comments
					getCustComments();
					
					if (callback){
						callback();
					}
				}
			},
			
			complete: function() {
				// Run callback function if passed	
				//if (callback){
				//	callback();
				//} else {
				//	$("#proposalMenu").css("display", "block");
					
				//}
				
				if (!error){
				}
			},
			
			error: function() {
				$("#customerNumberEdit").addClass("invalidField");
			}
		});
	}
	
	// Get Deficits for Dropdown 
	function retrieveDeficitCodes(callback){
		var url = "PQxml.pgm?Func=DEFICITTAB";
	   
	    $.ajax({
	        type: "GET",
	        url: url,
	        cache: false,
	        dataType: "json",

	        success: function (deficits) {
	        	deficitCodes = deficits;
	            if (callback) {
	                callback();
	            }
	        },

	        complete: function () {},

	        error: function () {
	            var errorsGetDeficits = true;

	        }
	    });

	}
	// Get Deficits Charges 
	function retrieveDeficitCharges(action, callback){
		var errMessage;
		var error = false;
		var i = -1;
		var url;
		var postXML;
		
		// Build XML with same elements as Rating
		postXML = quote_forRating_xml();
		
		switch (action){
		case "DEFICIT":
			url = "PQxml.pgm?Func=QuoteRequest&Action=DEFICIT";
			break;
		case "BASEPERCENT":
			url = "PQxml.pgm?Func=QuoteRequest&Action=BASEPERCENT";
			break;
		default: 
			url = "PQxml.pgm?Func=QuoteRequest&Action=DEFICIT";
			break;
		}
					
		$("#emailButton").removeClass("enabled");	
		$("#emailButton").addClass("disabled");
		
		$.ajax({
			type: "POST",
				url: url,
				data: postXML,
				dataType: "xml",
				async: false,
				cache: false,
				success: function(xml) {
					
					// Check for Error Messages
					successVal = $(xml).find('success').text();
					if (successVal == "false"){
						errMessage = $(xml).find('Error').attr('message');
						if (errMessage){
							alert (errMessage);
							error = true;
						}
					} else {
						chrg.length = 0;
						// Move Lane Charges into variable Chrg array
						$(xml).find('charge').each(function(){
							i++;
							var r = (chrg[i] = {});
							r["id"] = "charge_" + i;
							r["idpqlanchr"] = $(this).attr("recordid");
							r["sequence"] = $(this).attr("sequence");
							r["segment"] = $(this).attr("segment");
							r["linecodetype"] = $(this).attr("linecodetype");
							r["linecode"] = $(this).attr("linecode");
							r["description"] = $(this).attr("description");
							r["rmssection"] = $(this).attr("rmssection");
							r["rmsitem"] = $(this).attr("rmsitem");
							r["rmsqty"] = $(this).attr("rmsqty");
							r["rmsuom"] = $(this).attr("rmsuom");
							r["rmsrate"] = $(this).attr("rmsrate");
							r["rmsamount"] = $(this).attr("rmsamount");
							r["rmsminchg"] = $(this).attr("rmsminchg");
							r["rmspubrpm"] = $(this).attr("rmspubrpm");
							r["propqty"] = $(this).attr("propqty");
							r["proprate"] = $(this).attr("proprate");
							r["propuom"] = $(this).attr("propuom");
							r["propamt"] = $(this).attr("propamt");
							r["exclchrg"] = $(this).attr("exclchrg");
							r["adjustpct"] = $(this).attr("adjustpct");
							r["pricedminchr"] = $(this).attr("pricedminchr");
							r["pricingid"] = $(this).attr("pricingid");
							r["puborigin"] = $(this).attr("pricingorig");
							r["pubdest"] = $(this).attr("pricingdest");
							r["scaleqty"] = $(this).attr("scaleqty");
							r["scaleuom"] = $(this).attr("scaleuom");
							r["scalerate"] = $(this).attr("scalerate");
							r["scaleprcid"] = $(this).attr("scaleprcid");
							r["scaleorigin"] = $(this).attr("scaleorig");
							r["scaledest"] = $(this).attr("scaledest");
							r["scaleamt"] = $(this).attr("scaleamt");	
							r["scaleminchr"] = $(this).attr("scaleminchr");
						});
					}
				},
			
				complete: function(jqXHR, completeStatus) {
					if (completeStatus != "abort") {
						rebuildCharges();
						
						// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
				        if (saveAuthorized == true){
				        	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
				        		$("#saveRates").removeClass("disabled");
				        	}
				        }; 
				        // Activate the EMail Button on when Authorized
						if (emailAuthorized == true){
							$("#emailButton").addClass("enabled");
						};
						
						if (callback){
							callback();
						};
					}
								
				},
							
				error: function(jqXHR, errorStatus, errorMessage) {
					if (errorStatus != "abort"){
						alert('Deficits not added to Charges data.');
						
						$("#saveRates").addClass("disabled");
						$("#emailButton").addClass("disabled");
						
//						var r = (chrg[0] = {});
//						r["id"] = "charge_1";
//						r["rmsitem"] = "Error";
//						r["pricingid"] = "Error";
//						r["description"] = "Error";
//						r["rmsqty"] = "Error";
//						r["rmsuom"] = "Error";
//						r["rmsrate"] = "Error";
//						r["rmsamount"] = "Error";
						
						
					}
				}
		});
		
	}
	// Get Deficits Rules 
	function retrieveDeficitRules(callback){
		var url = "PQxml.pgm?Func=DEFICITRULES";
	   
	    $.ajax({
	        type: "GET",
	        url: url,
	        cache: false,
	        dataType: "json",

	        success: function (deficits) {
	        	deficitRules = deficits;
	            if (callback) {
	                callback();
	            }
	        },

	        complete: function () {},

	        error: function () {
	            var errorsGetDeficitsRules = true;

	        }
	    });

	}
	
	// Retrieve Proposal Information
	function retrieveProposal (proposal, lane, callback){
		var errMessage;
		var error = false;
		var i = -1;
		//var proposal = $("#custPropSearch").val();
		var url;
		
			// Abort active prop retrieval if one is in progress
			if(retrievePropXHR && retrievePropXHR.readyState != 4){
				retrievePropXHR.abort();
			}
			
			
			
			// Build URL to Validate and Retrieve Proposal
			// Proposal Number contains a valid quote number or the new quote xml file name
			if (proposal.search(".xml") == -1){ 
				url = "PQxml.pgm?" +
				"Func=QuoteRequest&Action=GET&quotenum=" + proposal + "&lane=" + lane;
				
				// Enable the EMAIL only when user is Authorized
				if (emailAuthorized == true){
					$("#emailButton").removeClass("disabled");
				};
			} else {
				url = "/applications/_globalTemp/" + proposal;
			};
			
			retrievePropXHR = 
				$.ajax({
					type: "GET",
					url: url,
					dataType: "xml",
					async: false,
					success: function(xml) {
						
						// Check for Success
						errMessage = $(xml).find('Error').attr('message');
						if (errMessage){
							$("#emailButton").addClass("disabled");
							$("#proposalNumberEdit").addClass("invalidField");
							error = true;
						} else {
							// Clear Global Variables
							clearGlobalVars();
							
							// Clear Global Arrays
							geo.length = 0;
							cond.length = 0;
							chrg.length = 0;
							
						
							// Deactivate Save
							$("#saveRates").addClass("disabled");
			
							// display the buttons at the top
							$("#saveRates").css("display", "inline-block");
							$("#newButton").css("display", "inline-block");
							$("#emailButton").css("display", "inline-block");
							
							// Move Header into variables
							idpqheader = $(xml).find('header').attr("idpqheader");
							status = $(xml).find('header').attr("status");
							cusprefix = $(xml).find('header').attr("cusprefix");
							cusbase = $(xml).find('header').attr("cusbase");
							cussuffix = $(xml).find('header').attr("cussuffix");
							contactid = $(xml).find('header').attr("contactid");
							custid = $(xml).find('header').attr("custid");
							quotenum = $(xml).find('header').attr("quotenum");
							idpqcontme = $(xml).find('header').attr("idpqcontme");						
							
							
							// Move Lane detail into variables
							idpqlandtl = $(xml).find('detail').attr("idpqlandtl");
							lanenumber = $(xml).find('detail').attr("lanenumber");
							quotetype = $(xml).find('detail').attr("quotetype");
							effdate = $(xml).find('detail').attr("effdate");
							expdate = $(xml).find('detail').attr("expdate");
							rateddate = $(xml).find('detail').attr("rateddate");
							approvdsts = $(xml).find('detail').attr("approvdsts");
							originalWorkFlowStatus = approvdsts;
							approvddat = $(xml).find('detail').attr("approvddat");
							approvdusr = $(xml).find('detail').attr("approvdusr");
							statorig = $(xml).find('detail').attr("statorig");
							statdest = $(xml).find('detail').attr("statdest");
							statbegdt = $(xml).find('detail').attr("statbegdt");
							statenddt = $(xml).find('detail').attr("statenddt");
							custrefno = $(xml).find('detail').attr("custrefno");
							auditdate = $(xml).find('detail').attr("auditdate");
							auditreslt = $(xml).find('detail').attr("auditreslt");
														
							// Move Lane Geography into variable Geo array
							$(xml).find('geography').each(function(){
								i++;
								var g = (geo[i] = {});
								g["idpqlangeo"] = $(this).attr("idpqlangeo");
								g["sequence"] = $(this).attr("sequence");
								g["geotype"] = $(this).attr("geotype");
								
								g["pointsrc"] = $(this).attr("pointsrc");
								g["idcity"] = $(this).attr("idcity");
								g["cityname"] = $(this).attr("cityname");
								g["idcounty"] = $(this).attr("idcounty");
								g["countyname"] = $(this).attr("countyname");
								g["state"] = $(this).attr("state");
								g["country"] = $(this).attr("country");
								g["idzip"] = $(this).attr("idzip");
								g["zipcode"] = $(this).attr("zipcode");
								g["zone"] = $(this).attr("zone");
								g["idregion"] = $(this).attr("idregion");
								g["region"] = $(this).attr("region");
								g["segment"] = $(this).attr("segment");
								g["applycarr"] = $(this).attr("applycarr");
							});
							
							
							// Move Lane Users to laneUsers array
							i=-1;
							$(xml).find('User').each(function(){
								i++;
								var u = (quoteLaneUsers[i] = {});
								u["usertype"] = $(this).attr("usertype");
								u["userprofile"] = $(this).attr("userprofile");
							});	
								
													
							// Move Lane Condition into variable Cond array
							i = -1;
							$(xml).find('condition').each(function(){
								i++;
								var c = (cond[i] = {});
								c["idpqcond"] = $(this).attr("idpqcond");
								c["codetype"] = $(this).attr("codetype");
								c["code"] = $(this).attr("code");
								c["qualifier1"] = $(this).attr("qualifier1");
								c["qualifier2"] = $(this).attr("qualifier2");
								c["exclcond"] = $(this).attr("exclcond");
							});
							
							var condCount = 0;
							$.each(cond, function(index, condition){
								if (condition.code == "DOW" || condition.code == "LOAD"){
									condCount++;
									$(".shipCondAsterisk").css("display","inline-block");
																	
									return false;
								}
							});
							
							if (condCount == 0){
								$(".shipCondAsterisk").css("display","none");
							
							}
							
							// Move Lane Charges into variable Chrg array
							i = -1;
							$(xml).find('charge').each(function(){
								i++;
								var r = (chrg[i] = {});
								r["id"] = "charge_" + i;
								r["idpqlanchr"] = $(this).attr("recordid");
								r["sequence"] = $(this).attr("sequence");
								r["segment"] = $(this).attr("segment");
								r["linecodetype"] = $(this).attr("linecodetype");
								r["linecode"] = $(this).attr("linecode");
								r["description"] = $(this).attr("description");
								r["rmssection"] = $(this).attr("rmssection");
								r["rmsitem"] = $(this).attr("rmsitem");
								r["rmsqty"] = $(this).attr("rmsqty");
								r["rmsuom"] = $(this).attr("rmsuom");
								r["rmsrate"] = $(this).attr("rmsrate");
								r["rmsamount"] = $(this).attr("rmsamount");
								r["rmsminchg"] = $(this).attr("rmsminchg");
								r["rmspubrpm"] = $(this).attr("rmspubrpm");
								r["propqty"] = $(this).attr("propqty");
								r["proprate"] = $(this).attr("proprate");
								r["propuom"] = $(this).attr("propuom");
								r["propamt"] = $(this).attr("propamt");
								r["exclchrg"] = $(this).attr("exclchrg");
								r["adjustpct"] = $(this).attr("adjustpct");
								r["pricedminchr"] = $(this).attr("pricedminchr");
								r["pricingid"] = $(this).attr("pricingid");
								r["puborigin"] = $(this).attr("pricingorig");
								r["pubdest"] = $(this).attr("pricingdest");
								r["scaleqty"] = $(this).attr("scaleqty");
								r["scaleuom"] = $(this).attr("scaleuom");
								r["scalerate"] = $(this).attr("scalerate");
								r["scaleprcid"] = $(this).attr("scaleprcid");
								r["scaleorigin"] = $(this).attr("scaleorig");
								r["scaledest"] = $(this).attr("scaledest");
								r["scaleamt"] = $(this).attr("scaleamt");
								r["scaleminchr"] = $(this).attr("scaleminchr");
							});
							
														
							statToggle = "zone";
							$("#zoneButton").addClass("tabButtonFocus");
							$("#zoneButton").removeClass("tabButtonBlur");
							$("#rateRecordButton").addClass("tabButtonBlur");
							$("#rateRecordButton").removeClass("tabButtonFocus");
							
							// Move Comments into variable Notes array
							i = -1;
							$(xml).find('notes').each(function(){
								i++;
								var n = (notes[i] = {});
								n["cmtkey"] = $(this).attr("cmtkey");
								n["cmtseq"] = $(this).attr("cmtseq");
								n["cmtkeytyp"] = $(this).attr("cmtkeytyp");
								n["cmtaplcod"] = $(this).attr("cmtaplcod");
								n["cmttype"] = $(this).attr("cmttype");
								n["comment"] = $(this).attr("comment");
								n["commentlength"] = $(this).attr("commentlength");
								n["entusr"] = $(this).attr("entusr");
								n["enttim"] = $(this).attr("enttim");
								n["entdat"] = $(this).attr("entdat");
								n["chgusr"] = $(this).attr("chgusr");
								n["chgtim"] = $(this).attr("chgtim");
								n["chgdat"] = $(this).attr("chgdat");
							});	
						}
					},
					
					complete: function() {
                        rebuildScreen();
						retrieveLog();
						rebuildLaneNav();

                        revealTabs("fast");
                        
						if (quotetype == "S"){
							// Set Authorized Quote Date Picker - min and max dates only
							var setExpirationDate = false;
	                        setAuthorizedQuoteDates('S',setExpirationDate);
						}
                        
                        retrieveVolumetrics(proposal, lane, function(){
                            buildVolumetricsChart();
                        });
                        
                        
						if (proposal.search(".xml") == -1){ 
							lockQuote(quotenum);
							// Retrieve Analytics for Existing Quote
                            retrieveAnalytics("GET",function(){
                                buildAnalytics();
                            });
						}
						
						if (proposal.search(".xml") != -1 && geo.length > 1){
							if (geo[geo.length -1].geotype == "DST"){
								$("#getRates").click();
							}
						}
						
						if ($("#laneNavNew").hasClass("laneDisabled")) {
							$("#laneNavNew").removeClass("laneDisabled");
						}
						if ($("#laneNavPlus").hasClass("laneDisabled")) {
							$("#laneNavPlus").removeClass("laneDisabled");
						}
							
						if (callback) {
							callback();
						}
					},
					
					error: function(jqXHR, errorStatus, errorMessage) {
						if (errorStatus != "abort"){
							$("#proposalNumberEdit").addClass("invalidField");		
						}
					}
				});
		}
	
	// Retrieve RMS Rating Information
	function retrieveRMSRate (callback){
		
		var errMessage;
		var error = false;
		var i = -1;
		var url;
		var postXML;
		
		// Prevent rate interactions
		if ($("#sMask").css('display') != "block"){
			$("#sMask").toggle();
			subCL.show();
			$("#sLoading").css('display','block');
		}
		
		$("#emailButton").removeClass("enabled");
		
		
		// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
        if (saveAuthorized == true){
        	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
        		$("#saveRates").removeClass("disabled");
        	}
        };
		$("#emailButton").addClass("disabled");
		
		// Load Minimum Charge Amount for Linehaul into Charge Array 
		if (chrg.length != 0){
			chrg[0].pricedminchr = $("#minChrgPricedRateSpan").text();
		}
		
		// Clear Charges Global Array
		postXML = quote_forRating_xml();
		
		//chrg.length = 0;
		// Build URL to Retrieve RMS Rate Info
		url = "PQxml.pgm?" +
              "Func=QuoteRequest&Action=RATE"; 	
		
		// Abort active rating request if one is in progress
		if(rmsRateXHR && rmsRateXHR.readyState != 4){
            rmsRateXHR.abort();
        }
		
		rmsRateXHR = 
			$.ajax({
				type: "POST",
					url: url,
					data: postXML,
					dataType: "xml",
					cache: false,
					success: function(xml) {
						
						// Check for Error Messages
						successVal = $(xml).find('success').text();
						if (successVal == "false"){
							errMessage = $(xml).find('Error').attr('message');
							if (errMessage){
								alert (errMessage);
								error = true;
							}
						} else {
							chrg.length = 0;
							rateddate = $(xml).find('rateddate').text();
							// Move Lane Charges into variable Chrg array
							$(xml).find('charge').each(function(){
								i++;
								var r = (chrg[i] = {});
								r["id"] = "charge_" + i;
								r["idpqlanchr"] = $(this).attr("recordid");
								r["sequence"] = $(this).attr("sequence");
								r["segment"] = $(this).attr("segment");
								r["linecodetype"] = $(this).attr("linecodetype");
								r["linecode"] = $(this).attr("linecode");
								r["description"] = $(this).attr("description");
								r["rmssection"] = $(this).attr("rmssection");
								r["rmsitem"] = $(this).attr("rmsitem");
								r["rmsqty"] = $(this).attr("rmsqty");
								r["rmsuom"] = $(this).attr("rmsuom");
								r["rmsrate"] = $(this).attr("rmsrate");
								r["rmsamount"] = $(this).attr("rmsamount");
								r["rmsminchg"] = $(this).attr("rmsminchg");
								r["rmspubrpm"] = $(this).attr("rmspubrpm");
								r["propqty"] = $(this).attr("propqty");
								r["proprate"] = $(this).attr("proprate");
								r["propuom"] = $(this).attr("propuom");
								r["propamt"] = $(this).attr("propamt");
								r["exclchrg"] = $(this).attr("exclchrg");
								r["adjustpct"] = $(this).attr("adjustpct");
								r["pricedminchr"] = $(this).attr("pricedminchr");
								r["pricingid"] = $(this).attr("pricingid");
								r["puborigin"] = $(this).attr("pricingorig");
								r["pubdest"] = $(this).attr("pricingdest");
								r["scaleqty"] = $(this).attr("scaleqty");
								r["scaleuom"] = $(this).attr("scaleuom");
								r["scalerate"] = $(this).attr("scalerate");
								r["scaleprcid"] = $(this).attr("scaleprcid");
								r["scaleorigin"] = $(this).attr("scaleorig");
								r["scaledest"] = $(this).attr("scaledest");
								r["scaleamt"] = $(this).attr("scaleamt");	
								r["scaleminchr"] = $(this).attr("scaleminchr");
							});
							// Adjust Extended Amounts based on Rules when Proposed Linehaul Rate Exists
							if (chrg.length != 0){
								if (chrg[0].proprate != '0' ){
									for (var y = 0; y < chrg.length; y++) { 
									
										var rule_qtydefault = 0;
							        	var rule_ratedecimals = 0;
							        	var rule_qtyfield;
							        	var rule_qtyline = 0;
							        	var rule_extratdiv = 1;
							        	var rule_linecodetype = "";
							        	
							        	// Check Rules for RMSAMOUNT
							        	// Find Rate Grid Rules for Line Code and UOM
								        for (i = 0; i < rules.length; i++) { 
								            if (rules[i].linecode == chrg[y].linecode && rules[i].uom == chrg[y].rmsuom
								            		&& rules[i].linecodetype == chrg[y].linecodetype){
								            	rule_qtydefault = rules[i].qtydefault;
								            	rule_ratedecimals = rules[i].ratedecprc;
								            	rule_qtyfield = rules[i].qtysrcfld;
								            	rule_qtyline = rules[i].qtysrcline;
								            	rule_extratdiv = rules[i].extratdiv;
								            	rule_linecodetype = rules[i].linecodetype;
								            	break;
								            }
								         }
								        // Calculate Extended Amount Based on RMS Rate * Extended Amount of Rule Line
							        	if (rule_qtyfield == "RMSAMOUNT"){
							        		// Quantity Source Field and Quantity Source Line Code Determine the Priced Quantity
							        		// Find Line Number in the Chrg Array to Determine the Quantity Value for RMSAmount
							        		for (i = 0; i < chrg.length; i++) { 
							                    if (chrg[i].linecode == rule_qtyline && chrg[i].linecodetype == rule_linecodetype){
							                    	var decimal_mult;
							            	        if (rule_ratedecimals == 0){
							            	        	decimal_mult = 1;
							            	        } else {
							            	        	decimal_mult = Math.pow(10,rule_ratedecimals)
							            	        }
							            	        
							            	        function round(value, decimals) {
														return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
													}
							            	        //chrg[y].propamt =   (((((chrg[y].rmsrate * decimal_mult) * chrg[i].propamt)/decimal_mult)/rule_extratdiv).toFixed(2)) ;
													chrg[y].propamt = round((((chrg[y].rmsrate * decimal_mult) * chrg[i].propamt)/decimal_mult) / rule_extratdiv, 2);
													
														
							    	       			break;
							                    }
							    	      	}
							        	}
									}
								}
							}
						}
					},
				
					complete: function(jqXHR, completeStatus) {
						if (completeStatus != "abort") {
							$(".rateGrid").css("visibility","visible");
							rateDataView.beginUpdate();
							rateDataView.setItems(chrg);
							rateDataView.setFilterArgs({
							    viewDeficits: viewDeficits
							});
							rateDataView.setFilter(filterDeficits);
							rateDataView.endUpdate();
							rateGrid.invalidate();
							rateGrid.render();
							// Sets Focus to the Priced UOM Cell
							rateGrid.gotoCell(0,8, false);
							if (i == -1 && error == false) {
								//$("#rateErrorMessage").html("No records found").css("display","block");
							}
							
							// Update Rate Total
							updateRateTotal();	
							
							// Load Minimum Charge Values
							if (chrg.length != 0){
								$("#minChrgRate span").html(chrg[0].rmsminchg);
								$("#minChrgRPM span").html(chrg[0].rmspubrpm);
								$("#minChrgPricedRateSpan").html(chrg[0].pricedminchr);
								
								$("#miniPubMin").html(chrg[0].rmsminchg);
								$("#miniScale").html(chrg[0].scalerate);
								$("#miniPubRate").html(chrg[0].rmsrate);
							} else {
								$("#minChrgRate span").html(".00");
								$("#minChrgRPM span").html(".0000");
								$("#minChrgPricedRateSpan").html(".00");
								
								$("#miniPubMin").html(".00");
								$("#miniScale").html(".0000");
								$("#miniPubRate").html(".00");
							}
							
							// Enable rate interactions			
							if ($("#sMask").css('display') == "block"){
								$("#sMask").toggle();
								subCL.hide();
								$("#sLoading").css('display','none');
							};
							// Activate the EMail Button on when Authorized
							if (emailAuthorized == true){
								$("#emailButton").addClass("enabled");
							};
                            
                            // Show tabs if hidden
                            revealTabs("slow");
                            
							if (callback){
								callback();
							};
						}
					},
								
					error: function(jqXHR, errorStatus, errorMessage) {
						if (errorStatus != "abort"){
							alert('Cannot find RMS Rate data.');
												   
							var r = (chrg[0] = {});
							r["id"] = "charge_1";
							r["rmsitem"] = "Error";
							r["pricingid"] = "Error";
							r["description"] = "Error";
							r["rmsqty"] = "Error";
							r["rmsuom"] = "Error";
							r["rmsrate"] = "Error";
							r["rmsamount"] = "Error";
							
							if ($("#sMask").css('display') == "block" && checkInitialDone()){
								$("#sMask").toggle();
								subCL.hide();
								$("#sLoading").css('display','none');
							}
						}
					}
			});
		
	}
	 // Retrieve Rate Grid Rules 
	function retrieveRateGridRules (){
		var i;
		var url;
		
		// Build URL to Retrieve Rate Grid Rules
		url = "PQxml.pgm?" +
              "Func=GetGridRules";	
		
		// Clear Rate Grid Rules Global array
		rules.length = 0;
		
			
		$.ajax({
			type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				
		    	success: function(xml){
		    		i = -1;
					$(xml).find('gridrules').each(function(){
						i++;
						var r = (rules[i] = {});
						r["linecode"] = $(this).attr("linecode");
						r["linecodetype"] = $(this).attr("linecodetype");
						r["uom"] = $(this).attr("uom");
						r["qtydefault"] = $(this).attr("qtydefault");
						r["ratedecprc"] = $(this).attr("ratedecprc");
						r["qtysrcfld"] = $(this).attr("qtysrcfld");
						r["qtysrcline"] = $(this).attr("qtysrcline");
						r["updqty"] = $(this).attr("updqty");
						r["extratdiv"] = $(this).attr("extratdiv");
					});
		    		
								
		    	},
			
				complete: function() {
					
				},
			
				error: function(jqXHR, errorStatus, errorMessage) {
					if (errorStatus != "abort"){
						alert('Cannot find Rate Grid Rules.');
					}	
			   					
				}
		});
	}
	
	// Retrieve Shipment Condition Codes 
	function retrieveShipCondCodes (){
		var i;
		var url;
		
		shipCondCodes.length = 0;
		
		// Build URL to Retrieve Shipment Condition Codes
		url = "PQxml.pgm?" +
              "Func=GetAccessorialShipConds&codetype=S&Code=*ALL";
    
		$.ajax({
			type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				
		    	success: function(xml){
		    		i = -1;
		    		$(xml).find('accshpcode').each(function(){
						i++;
						var s = (shipCondCodes[i] = {});
						s["rpctyp"] = $(this).attr("rpctyp");
						s["rpcode"] = $(this).attr('rpcode');
						s["rpcdsc"] = $(this).attr('rpcdsc');
					});
								
		    	},
			
				complete: function() {
					
				},
			
				error: function() {
					alert('Cannot find Shipment Conditions Codes.');
			   					
				}
		});
	}
	/*
	 * This function sends an ajax request to the server
	 * so it will increment the count of the number of 
	 * times a city has been selected. This enables the
	 * city/state dropdown to be sorted by most clicked. 
	 */
	function updateGeoCount($li) {
		
		var response;
		var error = false;
		var url;
		var cityid, countyid;
		
		cityid = $li.attr('idcity');
		countyid = $li.attr('idcounty');
		
		// build the url
		url = "pqxml.pgm?Func=UpdateGeoCount&" +
              "cityid=" + cityid + "&" + "countyid=" + countyid;	
			 			
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function(xml) {
				response = $(xml).find('success');
				if (response == 'false'){
			    	alert ("There was a problem with the UpdateGeoCount function"); 
				}
			},
			complete: function() {
			},
			error: function() {
				alert('There was a problem with the UpdateGeoCount AJAX request');
			}
		});
	}
	
	function retrieveWorkFlowStatus(workFlowSelect, callback){
		
		
		var url;
		
		
		// Build URL to Retrieve Workflow status
		url = "PQxml.pgm?" +
		      "Func=GetWorkFlowStatus";	 			
	
		$.ajax({
			type: "GET",
		    	url: url,
		    	dataType: "xml",
		    	cache: false,
		    	async: false,
		    	success: function(xml){
		    		var i=-1;
					$(xml).find('workflow').each(function(){
						
						var status = $(this).attr('status');
						var sdesc = $(this).attr('sdesc');
						var desc = $(this).attr('desc');
						var sequence = $(this).attr('sequence');

						
						workFlowSelect.append(
								"<option value='"+ status + 
									"' sdesc='"+ sdesc +
									"' desc='"+ desc +
									"' sequence='"+ sequence +
									"'>"+desc+"</option>");
												
						i++;
						var w = (workFlowStatus_values[i] = {});
						w["code"] = status;
						w["sdesc"] = sdesc;
						w["desc"] = desc;
						
					 });
				
		    	},
			
				complete: function() {
					if (callback){
						callback();
					};
				},
			
				error: function() {
					alert('Cannot find Workflow Status');
			   					
				}
		});
	}

	function retrieveCommentTypes(commentType){
		
		
		var url;
		
		
		// Build URL to Retrieve Comment types
		url = "PQxml.pgm?" +
		      "Func=GetCommentTypes";	 			
	
		$.ajax({
			type: "GET",
		    	url: url,
		    	dataType: "xml",
		    	cache: false,
		    	success: function(xml){
		    		var i=0;
					$(xml).find('comments').each(function(){
						
						var appCode = $(this).attr('appcode');
						var commType = $(this).attr('type');
						var commDesc = $(this).attr('commentdesc');

				
						commentType.append(
							"<option value='"+ commType+ 
								"' commType='"+ commType +
								"' commDesc='"+ commDesc +
								"'>"+commType+"</option>");
						
					 });
				
		    	},
			
				complete: function() {
				
				},
			
				error: function() {
					alert('Cannot find Comment Types');
			   					
				}
		});
	}
	
	
////// POSTS ///////////
	
	