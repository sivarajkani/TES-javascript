// Retrieve RMS Rating Information
	function retrieveMatchedQuotes (){
		
		var errMessage;
		var error = false;
		var i = -1;
		var url;
		var postXML;
		var matchCount = 0;
		
		
		// Build Quote XML includes Header, Detail and Geo
		postXML = quote_forMatching_xml();
		
		duplicateCount = 0;
		
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
								
								switch ($(this).attr("quotetype")){
									case "B":
										m["quotetype"] = "Bid";
										break;
									case "I":
										m["quotetype"] = "Inq";
										break;
									case "P":
										m["quotetype"] = "Prop";
										break;
									case "R":
										m["quotetype"] = "Revw";
										break;
									case "S":
										m["quotetype"] = "Spot";
										break;
									default:
										m["quotetype"] = "Inq";
										break;
								}
								//m["quotetype"] = $(this).attr("quotetype");
								m["status"] = $(this).attr("status");
								m["quotenum"] = $(this).attr("quotenum");
								m["lanenumber"] = $(this).attr("lanenumber");
								m["custnumber"] = $(this).attr("custnumber");
								m["custname"] = $(this).attr("custname");
								m["origin"] = $(this).attr("origin");
								m["destination"] = $(this).attr("destination");
								m["effdate"] = $(this).attr("effdate");
								m["expdate"] = $(this).attr("expdate");
								m["exactmtch"] = $(this).attr("exactmtch");
								m["rp"] = ($(this).attr("rp") === "true"); // parse to bool
								
								matchCount++;
								
								if (m["exactmtch"] == "true") {
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
							
							$("#matchIndicator").fadeIn("fast").css("display", "inline-block");
							
							if ($("#matchBox").css("display") == "none"){
								// Allow matchBox on layout to size properly
								$("#matchBox").css("visibility", "hidden");
								$("#matchBox").css("display", "block");
								
								rebuildMatchedList();
								
								// Remove again
								$("#matchBox").css("display", "none");
								$("#matchBox").css("visibility", "visible");
							} else {
								rebuildMatchedList();
							}
							
							if (duplicateCount > 0){
								$("#matchIndicator .duplicateCount").fadeIn().css("display", "inline-block");
								
								// Disable save button if there are duplicate exact matches and quote type is SPOT
								if (quotetype == 'S'){
									$("#saveRates").addClass("disabled");
								} else { 
									// Disable SPOT in Lane Type Select 
									$(".laneType option:contains('Spot')").attr('disabled','disabled');
								}
								
							} else {
								if (quotetype == 'P'){
									// Enable SPOT in Lane Type Select Only if Authorized to SPOT
									if (authorizedQuoteType("S")){
										$(".laneType option:contains('Spot')").removeAttr('disabled')
									}
								}
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
		
		if (matchTable === undefined){
			matchTable = $('#matchTable').DataTable( {
				data: match,
				columns: [
					{ "title": "Type", "data": "quotetype" },
					{ "title": "Number", "data": "quotenum" },
					{ "title": "Customer", "data": "custnumber" },
					{ "title": "Customer Name", "data": "custname" },
					{ "title": "Origin", "data": "origin" },
					{ "title": "Destination", "data": "destination" },
					{ "title": "Effective", "data": "effdate" },
					{ "title": "Expires", "data": "expdate" },
				],
				//ordering: false,
				paging: false,
				//responsive: true,
				rowCallback: function(row, data) {
					if (data.exactmtch == "true") {
						$('td', row).css('background-color', '#FF9966');
					}
					
					if (data.rp) { // part of old rate proposal system
						$(row).addClass("oldRatePropSystem");
					}
				},
				drawCallback: function( settings ) {
				//	var colCount = $("#matchTable > tbody > tr:first-child td").length;
				//	var $newButton = 
				//		$("<tr><td class='newLikeThis' colspan='" + colCount + "'>Test</td></tr>");
				//	$("#matchTable tbody").append($newButton);
					//$('#matchTable').DataTable().fnAdjustColumnSizing();
				},
				scrollY: 300,
				scrollCollapse: true,
				searching: false,
				
				

			});
			
					
			// Open match on click
			$('#matchTable').on('click', 'td', function(event) {
				var mCell = matchTable.cell(this)[0][0];
				var d = matchTable.row(mCell.row).data();
				var viewProposalURL = "pricingcgi.pgm?quotenum=" + d.quotenum +
				"&lane=" + d.lanenumber;
				
				// Only open link if clicking on proposal number
				if (mCell.column == 1 && !d.rp){
					window.open(viewProposalURL);
				}
				

			});
			
			//$(document).click(function(e){
//				if ((e.target.id != "matchIndicator") && $(e.target).parents("#matchBox").length == 0){
//					$("#matchBox").hide();
//				}
//			});
			
		} else {
			matchTable.clear();
			matchTable.rows.add(match);
			matchTable.draw();
		}
	}	
