// JavaScript Document
	function geoSearch($selectedLI){
		if ($selectedLI.length > 0){
			
						
			// INITIAL SEARCH
			// Animate Origin Tag
			if ($("#originTag").hasClass("pos1") && searchFor == "origin"){
				$("#originTag").switchClass("pos1", "pos2", 200, function(){
					$("#originTag").switchClass("pos2", "pos3", 500 );
					$("#laneLine").switchClass("pos1", "pos2", 500, function(){
						$("#originLabel").html("<div>"+$selectedLI.ignore("span").text()+"</div>");
						
						// Additional Origin Information
						addGeoPointInfo($selectedLI, true);

						addOriginToPoints($selectedLI);
					});
					
					$("#geoEntry").val("");
					$("#geoSearchList").hide().empty();
					$("#geoEntryLabel").fadeOut(300, function(){
						searchFor = "dest";
						$("#geoEntryLabel").html("Enter a Destination");
						$("#geoEntryLabel").fadeIn(300);
					});
				} );
			// Animate Dest Tag
			} else if ($("#originTag").hasClass("pos3") &&
					   $("#destTag").hasClass("pos1") &&
					   searchFor == "dest"){
				$("#destTag").switchClass("pos1", "pos3", 200, function() {
					$("#destLabel").html("<div>"+$selectedLI.ignore("span").text()+"</div>");
					
					// Additional Destination Information
					addGeoPointInfo($selectedLI, false);
					
					addDestToPoints($selectedLI);
				});
				
				// Hide search box
				$("#geoEntry").val("");
				$("#geoSearchList").hide().empty();
				$("#entryBox").animate({
					height: "toggle",
					opacity: "toggle"
				}, "fast");
				
				//Show temp click area if necessary
				if ($(".mapPoint").length == 0){
					$("#tempTag").show();
				}
				
			} else if (searchFor == "origin"){
				$("#geoEntry").val("");
				$("#geoSearchList").hide().empty();
				
				changeOriginPoint($selectedLI);
				
				if ($("#destTag").hasClass("pos1")){
					$("#geoEntryLabel").fadeOut(300, function(){
						searchFor = "dest";
						$("#geoEntryLabel").html("Enter a Destination");
						$("#geoEntryLabel").fadeIn(300);
					});
				} else {
					if (!$('#entryBox').is(':animated')){
						$("#entryBox").animate({
							height: "toggle",
							opacity: "toggle"
						}, "fast", function(){
							searchFor = "dest";
							$("#geoEntryLabel").html("Enter a Stop");
							$("#geoEntryLabel").fadeIn(300);
						});
					}
				}
				
			} else if (searchFor == "dest"){
				$("#geoEntry").val("");
				$("#borderSelect").hide();
				$("#entryBox .searchBox").show();
				$("#geoSearchList").hide().empty();
				
				changeDestPoint($selectedLI);
				
				if (!$('#entryBox').is(':animated')){
					$("#entryBox").animate({
						height: "toggle",
						opacity: "toggle"
					}, "fast", function(){
						searchFor = "dest";
						$("#geoEntryLabel").html("Enter a Stop");
					});
				}
				
			} else if (searchFor == "stop"){
				$("#geoEntry").val("");
				$("#geoSearchList").hide().empty();
				
				addStopToPoints($selectedLI);
				
				$("#geoEntry").val("");
				$("#geoSearchList").hide().empty();
				
				//if (!$('#entryBox').is(':animated')){
				//	$("#entryBox").animate({
				//		height: "toggle",
				//		opacity: "toggle"
				//	}, "fast");
				//}
			}
		}
	}
	
	function searchGeography(searchString, $listObj, $inputObj){
		//var $listObj = $("#geoSearchList");
		var sourceName;
		var url = "pqxml.pgm?func=searchgeography&publishcustomer=" + publishcustomer
		          + "&input=" + searchString;
		
		// Abort active geo search if one is in progress
		if(geoSearchXHR && geoSearchXHR.readyState != 4){
			geoSearchXHR.abort();
		}
		
		if (searchString != ""){
			
			
			geoSearchXHR = 
				$.ajax({
					type: "GET",
					url: url,
					dataType: "xml",
					cache: false,
					success: function(xml) {
						//$listObj.empty();
						var $tmpUL = $("<ul></ul>");
						$(xml).find('geography').each(function(){
							// ignore geography results that don't meet country restrictions
							if (laneLayout[laneSectionTarget]) {
								if (laneLayout[laneSectionTarget].points[0].geotype == "SIT"){
									if ((laneLayout[laneSectionTarget].points[0].country != "MX" && 
											$(this).attr("country") == "MX") ||
										(laneLayout[laneSectionTarget].points[0].country == "MX" && 
											$(this).attr("country") != "MX")){
										
										return true;
									}
								}
							}
							
							$listObj.show();
							
							var liStr = "<li" + 
											" idpqlangeo=0" +
											" pointsrc=" + $(this).attr("source") + 
											" idcity='" + $(this).attr("cityid") + "'" +
											" cityname='" + $(this).attr("cityname") + "'" +
											" idcounty='" + $(this).attr("countyid") + "'" +
											" countyname='" + $(this).attr("countyname") + "'" +
											" state='" + $(this).attr("state") + "'" +
											" country='" + $(this).attr("country") + "'" +
											" idzip='" + $(this).attr("zipid") + "'" +
											" zipcode='" + $(this).attr("zipcode") + "'" +
											" zone='" + $(this).attr("zone") + "'" +
											" idregion='" + $(this).attr("idregion") + "'" +
											" region='" + $(this).attr("region") + "'" +
											" segment=0" + 
											" applycarr=0" +
										">";
										
							switch ($(this).attr("source")){
								case "CL":			
									if ($(this).attr("countyname") != ""){
										liStr += ($(this).attr("cityname") + ", " + 
											$(this).attr("state") + ", " + 
											$(this).attr("countyname"));
										   
									} else {
										liStr += ($(this).attr("cityname") + ", " + 
										$(this).attr("state"));
									};
									sourceName = "City/State";
									break;
								case "CC":
									liStr += ($(this).attr("country"));
									sourceName = "Country";
									break;									
								case "RG":
									liStr += ($(this).attr("region"));
									sourceName = "Region";
									break;
								case "ST":
									liStr +=($(this).attr("state") + ", " + $(this).attr("country"));
									sourceName = "State";
									break;
								case "Z3":
									liStr += ($(this).attr("zipcode"));
									sourceName = "Zip3";
									break;
								case "Z5":
									liStr += ($(this).attr("zipcode"));
									sourceName = "Zip Code";
									break;
							};	
							
							liStr += "</li>";
							$liObj = $(liStr);
							$liObj.append($("<span class='searchSourceType'>"+sourceName+"</span>"));
							$tmpUL.append($liObj);
						});
						$listObj.html($tmpUL.children());
						assignGeoListClick($listObj, $inputObj);
					},
					error: function(jqXHR, errorStatus, errorMessage) {
						if (errorStatus != "abort"){
							$listObj.empty();
							$listObj.hide();
							alert("An error occurred trying to contact the server.");
						}
					}
				});
		} else {
			$listObj.empty();
			$listObj.hide();
		}
	}
	
	
		
	// Click events for Search results
	function assignGeoListClick($listObj, $inputObj){
		$listObj.children("li").click(function(){
			var $selectedLI = $(this);
			
			switch ($inputObj.attr("id")){
			
			case "geoEntry":
				geoSearch($selectedLI);
				break;
			// Mass Update Origin
			case "updOrigin":
				$selectedLI.addClass("selected");
				setGeoUpdSelection($inputObj, $selectedLI);
				break;
			// Mass Update Destination
			case "updDestination":
				$selectedLI.addClass("selected");
				setGeoUpdSelection($inputObj, $selectedLI);	
				break;
			default:
				$selectedLI.addClass("selected");
				$inputObj.val($selectedLI.ignore("span").text());
				
				if (laneListEditor){
					laneListEditor.submit();
				}
				break;
			};
			
			if ($(this).attr("pointsrc") == 'CL'){
				updateGeoCount($selectedLI);
			}
			$inputObj.focus();
		});
	}
	
	function spreadsheetGeoValidate(spreadSheet, callback){
				
		doAjax(spreadSheet.origin, true);
		doAjax(spreadSheet.destination, false);
			
			function doAjax(geoPoint, isOrigin){
				var url = "pqxml.pgm?func=searchgeography&publishcustomer=" + publishcustomer +
						  "&input=" + geoPoint + "&exactmatch=true";
				geoSearchXHR = 
					$.ajax({
						type: "GET",
						url: url,
						dataType: "xml",
						cache: false,
						success: function(xml) {
							$(xml).find('geography').each(function(){
						if (isOrigin){		
						 spreadSheet.originValid = $(this).attr("valid"); 
						 spreadSheet.originsource = $(this).attr("source");							 
						 spreadSheet.originidcity =  $(this).attr("cityid");
						 spreadSheet.origincityname = $(this).attr("cityname");
						 spreadSheet.originidcounty = $(this).attr("countyid");
						 spreadSheet.origincountyname = $(this).attr("countyname");
						 spreadSheet.originstate = $(this).attr("state");
						 spreadSheet.origincountry = $(this).attr("country");
						 spreadSheet.originidzip = $(this).attr("zipid");
						 spreadSheet.originzipcode = $(this).attr("zipcode");
						 spreadSheet.originzone = $(this).attr("zone");
						 spreadSheet.originidregion = $(this).attr("idregion");
						} else {
						 spreadSheet.destinationValid = $(this).attr("valid"); 
						 spreadSheet.destinationsource = $(this).attr("source");							 
						 spreadSheet.destinationidcity =  $(this).attr("cityid");
						 spreadSheet.destinationcityname = $(this).attr("cityname");
						 spreadSheet.destinationidcounty = $(this).attr("countyid");
						 spreadSheet.destinationcountyname = $(this).attr("countyname");
						 spreadSheet.destinationstate = $(this).attr("state");
						 spreadSheet.destinationcountry = $(this).attr("country");
						 spreadSheet.destinationidzip = $(this).attr("zipid");
						 spreadSheet.destinationzipcode = $(this).attr("zipcode");
						 spreadSheet.destinationzone = $(this).attr("zone");
						 spreadSheet.destinationidregion = $(this).attr("idregion");
						};
						if (isOrigin && spreadSheet.originValid == ""){
							spreadSheet.originValid = "false";
						}
						if (!isOrigin && spreadSheet.destinationValid == ""){
							spreadSheet.destinationValid = "false";
						}
						
						}
					 )},
						complete: function() {
							
							if (!isOrigin){	
								if (callback) {
									callback();
								}
							};
						},
						error: function(jqXHR, errorStatus, errorMessage) {
							alert ("error");
						//	if (errorStatus != "abort"){
							//	$listObj.empty();
							//	$listObj.hide();
							//	alert("An error occurred trying to contact the server.");
							//}
						}

					});
				}
			}
	    	