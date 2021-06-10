// Retrieve RMS Rating Information
	function retrieveMatchedQuotes (){
		
		var errMessage;
		var error = false;
		var i = -1;
		var url;
		var postXML;
		var matchCount = 0;
		var duplicateCount = 0;
		
		
		// Build Quote XML includes Header, Detail and Geo
		postXML = quote_forMatching_xml();
		
		match.length = 0;
		// Build URL to Retrieve Matching Quotes
		url = "PQxml.pgm?" +
              "Func=QuoteRequest&Action=MATCH"; 	
	
		$.ajax({
				type: "POST",
					url: url,
					data: postXML,
					dataType: "xml",
					cache: false,
					
					success: function(xml) {
						
						// Check for Error Messages
						errMessage = $(xml).find('Error').attr('message');
						if (errMessage){
							alert (errMessage); 
							error = true;
						} else {
							// Move Matched Lanes into variable Match array
							$(xml).find('match').each(function(){
								i++;
								var m = (match[i] = {});
								m["quotetype"] = $(this).attr("quotetype");
								m["status"] = $(this).attr("status");
								m["quotenum"] = $(this).attr("quotenum");
								m["lanenumber"] = $(this).attr("lanenumber");
								m["custnumber"] = $(this).attr("custnumber");
								m["custname"] = $(this).attr("custname");
								m["orgcityname"] = $(this).attr("orgcityname");
								m["orgcountry"] = $(this).attr("orgcountry");
								m["orgcityname"] = $(this).attr("orgcityname");
								m["orgstate"] = $(this).attr("orgstate");
								m["orgcounty"] = $(this).attr("orgcounty");
								m["orgzip"] = $(this).attr("orgzip");
								m["dstcityname"] = $(this).attr("dstcityname");
								m["dstcountry"] = $(this).attr("dstcountry");
								m["dstcityname"] = $(this).attr("dstcityname");
								m["dststate"] = $(this).attr("dststate");
								m["dstcounty"] = $(this).attr("dstcounty");
								m["dstzip"] = $(this).attr("dstzip");
								m["effdate"] = $(this).attr("effdate");
								m["expdate"] = $(this).attr("expdate");
								m["exactmtch"] = $(this).attr("exactmtch");
								
								matchCount++;
								
								if (m["exactmtch"] == "true"){
									duplicateCount++;
								}
							});
							
						}
					},
				
					complete: function() {
						$("#matchIndicator .duplicateCount").hide();
						if (matchCount == 0){
							$("#matchIndicator").hide();
						} else {
							if (matchCount == 1){
								$("#matchIndicator .matchCount").html(matchCount + " match");
							} else {
								$("#matchIndicator .matchCount").html(matchCount + " matches");
							}
							
							$("#matchIndicator").fadeIn().css("display", "inline-block");
							
							if (duplicateCount > 0){
								$("#matchIndicator .duplicateCount").fadeIn().css("display", "inline-block");
							}
							
							rebuildMatchedList();
							// Disable save button if there are duplicate exact matches
							for (i = 0; i < match.length; i++){
								if (match[i].exactmtch == 'true') 
								{$("#saveRates").addClass("disabled");}
							}
						}
					},
								
					error: function() {
						alert("Error during Matching Quotes Process");
					}
			});
		
	}
	
	// Rebuild Matching Quotes List 
	function rebuildMatchedList (){
		var matchListUL = $('#matchList');
		var matchLI;
		var quoteTypeDsc;
		
		matchListUL.empty();
		
		// Build Column Headings as a List Entry
		matchLI = $("<li class='matchList'></li>");
		matchLI.append($("<span class='matchQuoteType'>Type</span>"));
		matchLI.append($("<span class='matchQuoteNum'>Number</span>"));
		matchLI.append($("<span class='matchCustNumber'>Customer</span>"));
		matchLI.append($("<span class='matchCustName'>Customer Name</span>"));
		matchLI.append($("<span class='matchCityName'>Origin City</span>"));
		matchLI.append($("<span class='matchState'>State</span>"));
		matchLI.append($("<span class='matchCounty'>County</span>"));
		matchLI.append($("<span class='matchZip'>Zip</span>"));
		matchLI.append($("<span class='matchCityName'>Destination City</span>"));
		matchLI.append($("<span class='matchState'>State</span>"));
		matchLI.append($("<span class='matchCounty'>County</span>"));
		matchLI.append($("<span class='matchZip'>Zip</span>"));
		matchLI.append($("<span class='matchDate'>Effective</span>"));
		matchLI.append($("<span class='matchDate'>Expires</span>"));
		matchListUL.append(matchLI);
		
		
		for (i = 0; i < match.length; i++){
											
			matchLI = $("<li class='matchList'></li>");
			
			switch (match[i].quotetype){
			case "B":
				matchLI.append($("<span class='matchQuoteType'>Bid</span>"));
				break;
			case "I":
				matchLI.append($("<span class='matchQuoteType'>Inq</span>"));
				break;
			case "R":
				matchLI.append($("<span class='matchQuoteType'>Revw</span>"));
				break;
			case "S":
				matchLI.append($("<span class='matchQuoteType'>Spot</span>"));
				break;
			case "P":
				matchLI.append($("<span class='matchQuoteType'>Prop</span>"));
				break;
			default:
				matchLI.append($("<span class='matchQuoteType'>Inq</span>"));
				break;
			}
			
			matchLI.append($("<span class='matchQuoteNum'>"+match[i].quotenum+"</span>"));
			matchLI.append($("<span class='matchCustNumber'>"+match[i].custnumber+"</span>"));
			matchLI.append($("<span class='matchCustName'>"+match[i].custname+"</span>"));
			matchLI.append($("<span class='matchCityName'>"+match[i].orgcityname+"</span>"));
			matchLI.append($("<span class='matchState'>"+match[i].orgstate+"</span>"));
			matchLI.append($("<span class='matchCounty'>"+match[i].orgcounty+"</span>"));
			matchLI.append($("<span class='matchZip'>"+match[i].orgzip+"</span>"));
			matchLI.append($("<span class='matchCityName'>"+match[i].dstcityname+"</span>"));
			matchLI.append($("<span class='matchState'>"+match[i].dststate+"</span>"));
			matchLI.append($("<span class='matchCounty'>"+match[i].dstcounty+"</span>"));
			matchLI.append($("<span class='matchZip'>"+match[i].dstzip+"</span>"));
			matchLI.append($("<span class='matchDate'>"+match[i].effdate+"</span>"));
			matchLI.append($("<span class='matchDate'>"+match[i].expdate+"</span>"));
						
			matchListUL.append(matchLI);
		};
		
		// Display Selected Matched Quote in a new window List
		$("#matchList li").click(function(){
			viewProposalURL = "pricingcgi.pgm?quotenum=" + $(this).children(".matchQuoteNum").html();
			window.open(viewProposalURL);


		});
		
	}	
