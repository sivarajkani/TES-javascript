// JavaScript Document

function addPointToLane(geoPoint, sectionNum, ignoreDefaultBorders){
		sectionNum = sectionNum || 99;
		ignoreDefaultBorders = ignoreDefaultBorders || false;
		
		var section = {};
		
		switch (geoPoint.geotype){
			case "ORG":
				section["type"] = "ORG";
				section["points"] = [];
				section["points"].push(geoPoint);
				laneLayout[0] = section;
				
				if (geoPoint.country == "MX" && !ignoreDefaultBorders){
					retrieveDefaultBorder(geoPoint.state, "I", 1, false);
				}
				
				break;
			case "DST":
				section["type"] = "DST";
				section["points"] = [];
				section["points"].push(geoPoint);
				laneLayout[laneLayout.length] = section;

				
				if (geoPoint.country == "MX" && !ignoreDefaultBorders){
					retrieveDefaultBorder(geoPoint.state, "O", laneLayout.length - 1, false);
				}
				len = laneLayout.length;
				len = len - 1;
				count = 0;				                
				
				//if org country does not equal dest country then see how many "BRD" cities there
				//are.  If more than 1 delete the 1st or 2nd depending on if "MX" is the 
				//origin or destination.
				if (laneLayout[0].points[0].country != laneLayout[len].points[0].country){
					for(k = 0; k < laneLayout.length; k++){
						if (laneLayout[k].points[0].geotype == "BRD"){
							count ++;
						}
					}
					if (count > 1){
						if (laneLayout[0].points[0].country == "MX"){
							laneLayout.splice(2,1);
						} else {
							laneLayout.splice(1,1);
						}
						
					}
				}
				len = laneLayout.length;
				len = len - 1;
				count = 0;
				if (laneLayout[0].points[0].country == laneLayout[len].points[0].country){
					for(k = 0; k < laneLayout.length; k++){
						if (laneLayout[k].points[0].geotype == "BRD"){
							count ++;
						}
					}
					if (count > 2){
						if (updateDst){
							laneLayout.splice(2,1);								
						} else {
							remove = sectionNum + 1;								
							laneLayout.splice(remove,1);
						}
						
					}
				}												
				break;
			case "BRD":
				if (sectionNum != 99){					
					section["type"] = "BRD";
					section["points"] = [];
					section["points"].push(geoPoint);
					laneLayout.splice(sectionNum, 0, section);

	
				}
				
				break;
			case "SIT":
				if (sectionNum != 99){
					if (laneLayout[sectionNum]){
						if (laneLayout[sectionNum].type != "SIT"){
							section["type"] = "SIT";
							section["points"] = [];
							section["points"].push(geoPoint);
							laneLayout.splice(sectionNum, 0, section);
						} else {
							laneLayout[sectionNum].points.push(geoPoint);
						}
					} else {
						section["type"] = "SIT";
						section["points"] = [];
						section["points"].push(geoPoint);
						laneLayout.push(section);
					}
				}
				
				break;
			default:
				break;
		}
		
		
	}
	
	function updatePoint(geoPoint, sectionNum, ignoreDefaultBorders){
		sectionNum = sectionNum || 99;
		ignoreDefaultBorders = ignoreDefaultBorders || false;
        var bCount = 0;
        var sCount = 0;
        var len = 0;
        var sec = 0;
        var i = 0;
		
		var section = {};
		
		switch (geoPoint.geotype){
			case "ORG":
				var saveOrigin = laneLayout[0];
				
				section["type"] = "ORG";
				section["points"] = [];
				section["points"].push(geoPoint);
				laneLayout[0] = section;
				
				len = 0;
				len = laneLayout.length;
				len = len -1;				
				if (geoPoint.country != saveOrigin.points[0].country ||
						geoPoint.country != "US" && 
						saveOrigin.points[0].country != "US"){
					// update border and stops
					if (geoPoint.country == "MX"){
                        stripBoarderForMxLaneUpdate(geoPoint, saveOrigin);
						retrieveDefaultBorder(geoPoint.state, "I", 1, false);
					} else if (geoPoint.country == "US" && saveOrigin.points[0].country == "MX" && laneLayout[len].points[0].country == "MX"){
				//		for (i=laneLayout.length-2; i > 0; i--){
				//			if (laneLayout[i].points[0].country == "MX" || 
				//				laneLayout[i].type == "BRD"){
				//				laneLayout.splice(i, 1);
				//			} else {
				//				break;
				//			}
				//		}	
                       for (i = 0; i < laneLayout.length; i++){
                            if (laneLayout[i].type == "BRD"){
                                bCount++;
                            }
                            if (laneLayout[i].type == "SIT"){
                                sCount++;
                            }
                        }
                        if(bCount == 2 && sCount == 0){
                            sCount = 1;
                        }
						for (i=bCount - sCount; i < laneLayout.length; i + 0){
							if (laneLayout[i].type == "BRD"){
								laneLayout.splice(i, 1);
							} else {
                                i++;
                            }
						}                        
						len = 0;
						len = laneLayout.length;
						len = len -1;
                        sCount = 0;
                        for (i = 0; i < laneLayout.length; i++){
                            if (laneLayout[i].type == "SIT"){
                                sCount++;
                            }
                        }
                        if (sCount > 0 && laneLayout[1].points[0].country == "US"){
                            sec = 2;
                        } else {
                            sec = 1;
                        }
                        //last parm was 1 hardcoded
						retrieveDefaultBorder(laneLayout[len].points[0].state, "O", sec, false);
					} 
					else {
						if (geoPoint.country != "CD"){
							$.each(laneLayout, function(index, section){
								if (laneLayout[1].points[0].country != "US" || laneLayout[1].type == "BRD"){
									laneLayout.splice(1, 1);
								} 										
								 else{
										return false;
									}
									
								
							});					
							drawMap();
						}
					}
				}
				
				if (laneLayout.length > 1){
					popGeoArray();
					retrieveRMSRate(function(){
						//retrieveStats();
						retrieveMatchedQuotes();
                        retrieveAnalytics("GET",function(){
                            buildAnalytics();

                        });
					});
					
				}
				
				break;
			case "DST":
				var saveDest = laneLayout[laneLayout.length-1];
				
				section["type"] = "DST";
				section["points"] = [];
				section["points"].push(geoPoint);
				laneLayout[laneLayout.length-1] = section;
				
				// update borders
				// origin border
				//if (laneLayout[0].points[0].country == "MX" && !ignoreDefaultBorders){
				//	retrieveDefaultBorder(laneLayout[0].points[0].state, "I", 1);
				//}
				
				if (geoPoint.country != saveDest.points[0].country ||
						geoPoint.country != "US" && 
						saveDest.points[0].country != "US"){
					// update border and stops
					if (geoPoint.country == "MX"){	
						updateDst = true;
                        stripBoarderForMxLaneUpdate(geoPoint, saveDest);
						retrieveDefaultBorder(geoPoint.state, "O", laneLayout.length - 1, false);
						updateDst = false;
					} else {
                        for (i = 0; i < laneLayout.length; i++){
                            if (laneLayout[i].type == "BRD"){
                                bCount++;
                            }
                            if (laneLayout[i].type == "SIT"){
                                sCount++;
                            }
                        }
                        if(bCount == 2 && sCount == 0){
                            sCount = 1;
                        }
                        //laneLayout.length - 2 was there instead of bsCount
                        //if (laneLayout[i].points[0].country == "MX" || 
				        //		laneLayout[i].type == "BRD"){
						for (i=bCount - sCount; i < laneLayout.length; i + 0){
							if (laneLayout[i].type == "BRD"){
								laneLayout.splice(i, 1);
							} else {
                                i++;
                            }
						}
						len = 0;
						len = laneLayout.length;
						len = len - 1;						
						if (laneLayout[0].points[0].country == "MX" && laneLayout[len].points[0].country 
                            != "MX"){
							retrieveDefaultBorder(laneLayout[0].points[0].state, "I", 1, false);
						}
						drawMap();
					}
				}
				
				popGeoArray();
				retrieveRMSRate(function(){
					//retrieveStats();
					retrieveMatchedQuotes();
                    retrieveAnalytics("GET",function(){
                        buildAnalytics();
                     
                    });
				});
				
				
				break;
				
			default:
				break;
		}
	}
	
	
	function addOriginToPoints(originLI){
		var $lanePointList = $("#lanePoints");
		
		var geoPoint = 
			{
				idpqlangeo: originLI.attr("idpqlangeo"),
				sequence:	originLI.attr("sequence"),
				geotype:	"ORG",
							
				pointsrc:	originLI.attr("pointsrc"),
				idcity:		originLI.attr("idcity"),
				cityname:	originLI.attr("cityname"),
				idcounty:	originLI.attr("idcounty"),
				countyname:	originLI.attr("countyname"),
				state:		originLI.attr("state"),
				country:	originLI.attr("country"),
				idzip:		originLI.attr("idzip"),
				zipcode:	originLI.attr("zipcode"),
				zone:		originLI.attr("zone"),
				idregion:	originLI.attr("idregion"),
				segment:	originLI.attr("segment"),
				applycarr:	originLI.attr("applycarr")
			}
			
		addPointToLane(geoPoint);
	}
	
	function changeOriginPoint(originLI){
		
		var geoPoint = 
			{
				idpqlangeo: originLI.attr("idpqlangeo"),
				sequence:	originLI.attr("sequence"),
				geotype:	"ORG",
							
				pointsrc:	originLI.attr("pointsrc"),
				idcity:		originLI.attr("idcity"),
				cityname:	originLI.attr("cityname"),
				idcounty:	originLI.attr("idcounty"),
				countyname:	originLI.attr("countyname"),
				state:		originLI.attr("state"),
				country:	originLI.attr("country"),
				idzip:		originLI.attr("idzip"),
				zipcode:	originLI.attr("zipcode"),
				zone:		originLI.attr("zone"),
				idregion:	originLI.attr("idregion"),
				segment:	originLI.attr("segment"),
				applycarr:	originLI.attr("applycarr")
			}
			
		updatePoint(geoPoint);
		
		var pointSrc = originLI.attr("pointsrc");
		var cityName = originLI.attr("cityname");
		var state = originLI.attr("state");
		var zone = originLI.attr("zone");
		var zipCode = originLI.attr("zipcode");
		var countyName = originLI.attr("countyname");
		var country = originLI.attr("country");
		var region = originLI.attr("region");
		
		$("#originLabel").html(originLI.text());
		
		// Additional Origin Information
		switch (pointSrc){
			case "CC":
				switch (country){
				case "MX":
					$("#originLabel").html("<div>MEXICO</div>").show();
					break;
				case "US":
					$("#originLabel").html("<div>UNITED STATES</div>").show();
					break;
				case "CD":
					$("#originLabel").html("<div>CANADA</div>").show();
					break;
				}
				$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				break;
			case "CL":
				$("#originLabel").html("<div>"+cityName + ", " + state+"</div>");
				$("#originLabel").append($("<span>"+zone+" / "+zipCode+"</span>"));
				break;
			case "RG":
				$("#originLabel").html("<div>"+region+"</div>");
				//$("#originLabel").append($("<span>Region</span>"));
				$("#originLabel").append($('<div id="regionOrgInfoIcon" class="regionInfoIcon" href="#regionForm" style="display: inline-block"></div>'));
				$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zipCode+"</span>"));
				$('#regionOrgInfoIcon').css("display", "inline-block");
				$("#regionOrgInfoIcon").click(function(e){
					e.stopPropagation();
					
					var idRegion;
					
					if (geo.length > 0){
						idRegion = geo[0].idregion;
					} else {
						idRegion = laneLayout[0].points[0].idregion;
					}
					
					getRegionDetail(idRegion, function(){
						$.fancybox($("#regionForm"), {
							//beforeShow: function() {
					    	//	this.wrap.draggable();
				    		//},
							helpers: {
								overlay: false
							}
						});
					});
				});
				break;
			case "Z3":
				$("#originLabel").html("<div>"+zipCode+"</div>");
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;
			case "Z5":
				$("#originLabel").html("<div>"+zipCode+"</div>");
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;

			case "ST":
				$("#originLabel").html("<div>"+state+"</div>");
				if (countyName != ""){
					$("#originLabel").append($("<span>"+cityName + ", " + countyName+" / "+zipCode+"</span>"));
				} else {
					$("#originLabel").append($("<span>"+cityName + " / "+zipCode+"</span>"));
				}
				break;
		};

	}
	
	function addDestToPoints(destLI){
		var $lanePointList = $("#lanePoints");
		
		var geoPoint = 
			{
				idpqlangeo: destLI.attr("idpqlangeo"),
				sequence:	destLI.attr("sequence"),
				geotype:	"DST",
							
				pointsrc:	destLI.attr("pointsrc"),
				idcity:		destLI.attr("idcity"),
				cityname:	destLI.attr("cityname"),
				idcounty:	destLI.attr("idcounty"),
				countyname:	destLI.attr("countyname"),
				state:		destLI.attr("state"),
				country:	destLI.attr("country"),
				idzip:		destLI.attr("idzip"),
				zipcode:	destLI.attr("zipcode"),
				zone:		destLI.attr("zone"),
				idregion:	destLI.attr("idregion"),
				segment:	destLI.attr("segment"),
				applycarr:	destLI.attr("applycarr")
			}
			
		addPointToLane(geoPoint);
		
		// Allow user to close geo entry at will
		$("#closeGeoEntry").css("display", "inline-block");
		// Rate the Proposal and Display Rate Grid after Destination is Entered
		$("#rateBlock").css("visibility", "visible");
		popGeoArray();
		retrieveRMSRate(function(){
			//retrieveStats();
			retrieveMatchedQuotes();
            retrieveAnalytics("GET",function(){
                buildAnalytics();
             
            });
		});
		
		
	}
	
	function changeDestPoint(destLI){
		
		var geoPoint = 
			{
				idpqlangeo: destLI.attr("idpqlangeo"),
				sequence:	destLI.attr("sequence"),
				geotype:	"DST",
							
				pointsrc:	destLI.attr("pointsrc"),
				idcity:		destLI.attr("idcity"),
				cityname:	destLI.attr("cityname"),
				idcounty:	destLI.attr("idcounty"),
				countyname:	destLI.attr("countyname"),
				state:		destLI.attr("state"),
				country:	destLI.attr("country"),
				idzip:		destLI.attr("idzip"),
				zipcode:	destLI.attr("zipcode"),
				zone:		destLI.attr("zone"),
				idregion:	destLI.attr("idregion"),
				segment:	destLI.attr("segment"),
				applycarr:	destLI.attr("applycarr")
			}
			
		updatePoint(geoPoint);
		
		var pointSrc = destLI.attr("pointsrc");
		var cityName = destLI.attr("cityname");
		var state = destLI.attr("state");
		var zone = destLI.attr("zone");
		var zipCode = destLI.attr("zipcode");
		var countyName = destLI.attr("countyname");
		var country = destLI.attr("country");
		var region = destLI.attr("region");
		
		$("#destLabel").html(destLI.text());
		
		// Additional Destination Information
		switch (pointSrc){
			case "CC":
				switch (country){
				case "MX":
					$("#destLabel").html("<div>MEXICO</div>").show();
					break;
				case "US":
					$("#destLabel").html("<div>UNITED STATES</div>").show();
					break;
				case "CD":
					$("#destLabel").html("<div>CANADA</div>").show();
					break;
				}
				$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				break;
			case "CL":
				$("#destLabel").html("<div>"+cityName + ", " + state+"</div>");
				$("#destLabel").append($("<span>"+zone+" / "+zipCode+"</span>"));
				break;
			case "RG":
				$("#destLabel").html("<div>"+region+"</div>");
				//$("#destLabel").append($("<span>Region</span>"));
				$("#destLabel").append($('<div id="regionDestInfoIcon" class="regionInfoIcon" href="#regionForm" style="display: inline-block"></div>'));
				$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zipCode+"</span>"));
				$('#regionDestInfoIcon').css("display", "inline-block");
				$("#regionDestInfoIcon").click(function(e){
					e.stopPropagation();
					
					var idRegion;
					
					if (geo.length > 0){
						idRegion = geo[geo.length-1].idregion;
					} else {
						idRegion = laneLayout[0].points[0].idregion;
					}
					
					getRegionDetail(idRegion, function(){
						$.fancybox($("#regionForm"), {
							//beforeShow: function() {
					    	//	this.wrap.draggable();
				    		//},
							helpers: {
								overlay: false
							}
						});
					});
				});
				break;
			case "Z3":
				$("#destLabel").html("<div>"+zipCode+"</div>");
				if (countyName != ""){
					$("#destLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;
			case "Z5":
				$("#destLabel").html("<div>"+zipCode+"</div>");
				if (countyName != ""){
					$("#destLabel").append($("<span>"+cityName + ", " + state + ", " + countyName+" / "+zone+"</span>"));
				} else {
					$("#destLabel").append($("<span>"+cityName + ", " + state+" / "+zone+"</span>"));
				}
				break;

			case "ST":
				$("#destLabel").html("<div>"+state+"</div>");
				if (countyName != ""){
					$("#destLabel").append($("<span>"+cityName + ", " + countyName+" / "+zipCode+"</span>"));
				} else {
					$("#destLabel").append($("<span>"+cityName + " / "+zipCode+"</span>"));
				}
				break;
		};
	}
	
	function addStopToPoints(stopLI){
		var $lanePointList = $("#lanePoints");
		
		var geoPoint = 
			{
				idpqlangeo: stopLI.attr("idpqlangeo"),
				//sequence:	stopLI.attr("sequence"),
				sequence:	"",
				geotype:	"SIT",
							
				pointsrc:	stopLI.attr("pointsrc"),
				idcity:		stopLI.attr("idcity"),
				cityname:	stopLI.attr("cityname"),
				idcounty:	stopLI.attr("idcounty"),
				countyname:	stopLI.attr("countyname"),
				state:		stopLI.attr("state"),
				country:	stopLI.attr("country"),
				idzip:		stopLI.attr("idzip"),
				zipcode:	stopLI.attr("zipcode"),
				zone:		stopLI.attr("zone"),
				idregion:	stopLI.attr("idregion"),
				segment:	stopLI.attr("segment"),
				applycarr:	stopLI.attr("applycarr")
			}
			
		if (laneLayout[laneSectionTarget].type == "BRD"){
			var borderType = $(".mapPoint:eq(" + (laneSectionTarget-1) + ")").attr("borderType");
			
			if (
				(geoPoint.country != "MX" && borderType == "I") ||
				(geoPoint.country == "MX" && borderType == "O")
				){
				addPointToLane(geoPoint, laneSectionTarget + 1);
				laneSectionTarget++;
			} else {
				if (laneLayout[laneSectionTarget-1].type != "SIT"){
					addPointToLane(geoPoint, laneSectionTarget);
				} else {
					addPointToLane(geoPoint, laneSectionTarget - 1);
					laneSectionTarget--;
				}
			}
		} else {
			addPointToLane(geoPoint, laneSectionTarget);
		}
		drawMap();
		
		popGeoArray();
		retrieveRMSRate(function(){
			//retrieveStats();
			retrieveMatchedQuotes();
            retrieveAnalytics("GET",function(){
                buildAnalytics();
                
            });
		});
		
	}
	
	function addPointToMap($newMapPoint, beforeORafter, referencePoint, showPoints){
		
		var $mapPoints = $("#laneMap .mapPoint");
		var pointCount = $mapPoints.length + 1;
		
		$newMapPoint.css("width", "0px");
		$newMapPoint.children().hide();
		
		switch (beforeORafter) {
			case "before":
				$newMapPoint.insertBefore(referencePoint);
				break;
			case "after":
				$newMapPoint.insertAfter(referencePoint);
				break;
		}
		
		var newWidth = 74/pointCount + "%";
		$mapPoints = $("#laneMap .mapPoint");
		//$mapPoints.animate({
		//	width: newWidth
		//}, "fast", function(){
		//	if (showPoints){
		//		$mapPoints.children().fadeIn("fast");
		//	}
		//});
		$mapPoints.width(newWidth);
		if (showPoints){
			$mapPoints.children().each(function(){
				if (!$(this).hasClass("stopPanel")) {
					$(this).fadeIn("fast");
				}
			});
		}
	}
	
	function drawMap(){
		$("#laneMap .mapPoint").remove();
		$("#tempTag").show();
		
		$.each(laneLayout, function(index, section){
			$("#tempTag").hide();
			
			var showPoints;
			switch (section.type){
				case "BRD":
					var $borderIcon;
					var cityID = section.points[0].idcity;
					var cityName = section.points[0].cityname + ", " + section.points[0].state;
					var borderType;
					
					if (laneLayout[index + 1]){
						showPoints = (laneLayout[index + 1].points[0].geotype == "DST");
					} else {
						showPoints = true;
					}
					
					var previousPoint = laneLayout[index-1].points[laneLayout[index-1].points.length-1];
					if (previousPoint.country == "MX"){
						borderType = "I";
					} else {
						borderType = "O";
					}
					
					$borderIcon = 
						$("<div id='border" + index + "' " + 
								"class='borderBox mapPoint' " +
								"cityID='" + cityID + "' " +
								"borderType='" + borderType + "'>" +
						  "<div class='border' title='Border'>" +
						  "<div class='borderCenter'></div>" +
							"</div>" +
							"<div class='label'>" + cityName + "</div>" +
						"</div>");
					
					// Modify Style if in Lane List Mode
					if (inLaneListMode){
						$borderIcon.children(".border").css("border-width", "0 17px 30.9px");
						$borderIcon.children(".border").css("marginTop", "2px");
						$borderIcon.children(".border").css("marginBottom", "2px");
					}
					
					$borderIcon.children(".border").click(function(event){
						if ($(this).parents(".disabled").length) {
							return false;
						}
						
						event.stopPropagation();
						$(".stopPanel").hide("drop", {direction: "up"}, "fast");
						
						var $thisBorder = $(this).parent();
						if ($("#entryBox").css("display") != "none"){
							$("#geoEntryLabel").fadeOut(400, function(){
								searchFor = "border";
								$("#geoEntryLabel").html("Change Border Crossing");
								$("#geoEntryLabel").fadeIn(400);
								$("#entryBox .searchBox").hide();
								
								$("#borderSelect").attr("changing", $thisBorder.attr("id"));
								$("#borderSelect").val($thisBorder.attr("cityID"));
								$("#borderSelect").show();
							});
						} else {
							searchFor = "border";
							$("#geoEntryLabel").html("Change Border Crossing");
							$("#entryBox .searchBox").hide();
							
							$("#borderSelect").attr("changing", $thisBorder.attr("id"));
							$("#borderSelect").val($thisBorder.attr("cityID"));
							$("#borderSelect").show();
							
							$("#entryBox").animate({
								height: "toggle",
								opacity: "toggle"
							}, "fast");
						}
					});
					
					
					// Space around triangle will allow stop entry between borders
					$borderIcon.click(function(){
						if ($(this).parents(".disabled").length) {
							return false;
						}
						
						if ($("#destTag").hasClass("pos3")){
							var thisMapPoint = $(this).attr("id");
							$(".stopPanel").hide("drop", {direction: "up"}, "fast");
							searchFor = "stop";
							
							$(".mapPoint").each(function(index, value){
								if ($(this).attr("id") == thisMapPoint){
									laneSectionTarget = index + 1;
									return false;
								}
							});
							
							
							if ($("#entryBox").css("display") == "none"){
								$("#borderSelect").hide();
								$(".searchBox").show();
								$("#geoEntryLabel").html("Enter a Stop");
								$("#entryBox").animate({
									height: "toggle",
									opacity: "toggle"
								}, "fast", function(){
									$("#geoEntry").focus();
								});
							} else {
								$("#borderSelect").fadeOut(300);
								$("#geoEntryLabel").fadeOut(300, function(){
									$("#geoEntryLabel").html("Enter a Stop");
									$(".searchBox").fadeIn();
									$("#geoEntry").focus();
									$("#geoEntryLabel").fadeIn(300);
								});
							}
						}
					});
					
					addPointToMap($borderIcon, "before", $("#destTag"), showPoints);
					
					break;
					
				case "SIT":
					var $stopIcon, $stopCounter, $stopLI;
					showPoints = (laneLayout[index + 1].points[0].geotype == "DST");
					
					$stopIcon = 
						$("<div id='stop" + index + "' " + 
								"class='stopBox mapPoint' " + 
								"borderType='" + borderType + "'>" +
						  "<div class='stop' title='Stop' ></div>" +
						"</div>");
						
					// Modify Style if in Lane List Mode
					if (inLaneListMode){
						$stopIcon.children(".stop").css("height", "15px");
						$stopIcon.children(".stop").css("width", "15px");
						$stopIcon.children(".stop").css("border-width", "5px");
						$stopIcon.children(".stop").css("margin-top", "3px");
						$stopIcon.children(".stop").css("margin-bottom", "3px");
					}
				
					// Add Stop Panel
					$stopPanel = 
						$("<div class='stopPanel'><div class='stopTriangle'></div></div>");
						
					$stopPanel.click(function(event){
						event.stopPropagation();
					});
					
					// Create stop list
					$stopList =
						$("<ul></ul>");
					
					$.each(section.points, function(index, point){
						// Build stop icons
						var $deleteStop = $("<div class='deleteIcon' title='Delete'></div>");
						var $dragStop = $("<div class='dragIcon' title='Move'></div>");
						
						$deleteStop.click(function(event){
							event.stopPropagation();
							
							// Get current stop box and matching global lane step
							var $parentStopBox = $(this).parents(".stopBox");
							var parentStopBoxIndex = $(".mapPoint").index($parentStopBox)+1;
							var laneStep = laneLayout[parentStopBoxIndex];
							var $li = $(this).parent();
							
							// Find matching global lane point for each stop and update position in array
							$.each(laneStep.points, function(index){
								if ($li.attr("idcity") == this.idcity){
									if (laneStep.points.length != 1) {
										laneStep.points.splice(index, 1);
									} else {
										laneLayout.splice(parentStopBoxIndex, 1);
									}
									
									return false;
								}
							});
							
							// Remove UI elements
							if ($(this).parent().siblings().length == 0){
								$(this).parent().hide();
								$(this).parents(".stopPanel").hide("drop", {direction: "up"}, "fast", function(){
									$(this).siblings(".stop, .stopCounter").fadeTo("fast", .01, function(){
									});
										$("#entryBox").animate({
											height: "toggle",
											opacity: "toggle"
										}, "fast");
										drawMap();
								});
							} else {
								$(this).parents(".stopBox").children(".stopCounter").text(
									$(this).parent().siblings().length
								);
								$(this).parent().remove();
							}
							
							popGeoArray();
							retrieveRMSRate(function(){
								//retrieveStats();
								retrieveMatchedQuotes();
                                retrieveAnalytics("GET",function(){
                                    buildAnalytics();
                                 
                                });
							});
							
							
						});
						
						// Build stop list item
						$stopLI = $("<li idcity=" + point.idcity + ">" + 
										point.cityname + ", " + point.state + 
									"</li>");
									
						$stopLI.append($deleteStop);
						$stopLI.append($dragStop);
									
						$stopLI.children("div").hide();		
						$stopLI.hover(
							function(){
								$(this).children("div").show();
							},
							function(){
								$(this).children("div").hide();
							}
						);
						$stopList.append($stopLI);
					});
					
					// Set stop sort functionality
					$stopList.sortable({
						handle: ".dragIcon",
						update: function(){
							// Get current stop box and matching global lane step
							var $parentStopBox = $(this).parents(".stopBox");
							var parentStopBoxIndex = $(".mapPoint").index($parentStopBox)+1;
							var laneStep = laneLayout[parentStopBoxIndex];
							
							// Find matching global lane point for each stop and update position in array
							$(this).children("li").each(function(newIndex, li){
								$.each(laneStep.points, function(oldIndex){
									if ($(li).attr("idcity") == this.idcity){
										laneStep.points.splice(newIndex, 0, laneStep.points.splice(oldIndex, 1)[0]);
										return false;
									}
								});
							});
							
							popGeoArray();
							retrieveRMSRate(function(){
								//retrieveStats();
								retrieveMatchedQuotes();
                                retrieveAnalytics("GET",function(){
                                    buildAnalytics();
                                 
                                });
							});
							
							
						}
					});
					
					$stopList.disableSelection();
					$stopPanel.append($stopList);
					$stopIcon.append($stopPanel);
					
					
					// Add stop UI to lane line	
					var previousSection = laneLayout[index-1];
					if (previousSection.type == "ORG"){
						addPointToMap($stopIcon, "after", $("#originTag"), showPoints);
					} else {
						var previousMapPoint = $(".mapPoint:eq(" + (index-2) + ")"); //Sub for origin and previous sections
						addPointToMap($stopIcon, "after", previousMapPoint, showPoints);
					}
					
					// Show stop panel if adding to current stop section
					if (laneLayout[laneSectionTarget]){
						if (
							$("#laneMap > div").index($stopIcon) == laneSectionTarget || 
								(
									laneLayout[laneSectionTarget].type == "BRD" && searchFor == "stop" &&
									(
										$("#laneMap > div").index($stopIcon) == laneSectionTarget + 1 ||
										$("#laneMap > div").index($stopIcon) == laneSectionTarget - 1
									)
								)
						){
							$stopPanel.delay(200).show("drop", {direction: "down"}, "fast");
						}
					}
					
					// Add Stop Counter
					$stopCounter = $("<div class='stopCounter'>" + section.points.length + "</div>");
					
					if (section.points.length > 1){
						$stopCounter
							.insertBefore($("#stop" + index + " .stop"))
							.fadeIn("fast");
					}
					
					// Space around circle will allow stop entry
					$stopIcon.click(function(){
						if ($(this).parents(".disabled").length) {
							return false;
						}
			
						var thisMapPoint = $(this).attr("id");
						
						$("#geoEntryLabel").fadeOut("fast", function(){
							$("#borderSelect").hide();
							$("#entryBox .searchBox").show();
							$("#geoEntryLabel").html("Enter a Stop");
							$("#geoEntryLabel").fadeIn("fast");
							$("#geoEntry").focus();
						});
						
						// If entry box is hidden, display it			
						if ($("#entryBox:hidden").length > 0){
							$("#entryBox").animate({
								height: "toggle",
								opacity: "toggle"
							}, "fast", function(){$("#geoEntry").focus();});
								
							$("#" + thisMapPoint + " .stopPanel").show("drop", {direction: "down"}, "fast");
							$("#geoEntry").focus();
							
						} else {
							// If clicking this stop for the second time, hide entry
							if ($("#laneMap > div").index($(this)) == laneSectionTarget && searchFor == "stop"){
								if ($("#entryBox:hidden").length == 0){
									$("#entryBox").animate({
										height: "toggle",
										opacity: "toggle"
									}, "fast");
									
									$("#" + thisMapPoint + " .stopPanel").hide("drop", {direction: "up"}, "fast");
								}
							// If clicking for the first time while entry is shown, hide other stop panels and open this one
							} else {
								$(".stopPanel").hide("drop", {direction: "up"}, "fast");
								$("#" + thisMapPoint + " .stopPanel").show("drop", {direction: "down"}, "fast");
								$("#geoEntry").focus();
							}
						
						}
						
						searchFor = "stop";
						$(".mapPoint").each(function(index, value){
							if ($(this).attr("id") == thisMapPoint){
								laneSectionTarget = index + 1;
								return false;
							}
						});
					});
					
					break;
					
				case "DST":
					// Allow user to close geo entry at will
					$("#closeGeoEntry").css("display", "inline-block");
					break;
					
				default:
					break;
			}
		});
		
		//$mapPoints = $("#laneMap .mapPoint");
		//var pointCount = $mapPoints.length;
		//var newWidth = 74/pointCount + "%";
		//$mapPoints.css("width", newWidth);
		//$mapPoints.fadeIn("fast");
		
		if ($(".mapPoint").length == 0){
			$("#tempTag").show();
		}
	}
	
	function resetMapToOrg(){
		laneLayout.length = 0;
		
		searchFor = "origin";
		laneSectionTarget = 0;
		$("#geoEntryLabel").text("Enter Origin");
		$("#geoEntry").show();
		$("#borderSelect").hide();
		$("#geoSearchList").empty().hide();
		
		$("#originLabel").text("");
		$("#destLabel").text("");
		$("#laneMap").hide();
		$(".mapPoint").remove();
		
		if ($("#entryBox:hidden").length != 0){
			$("#entryBox").animate({
				height: "toggle",
				opacity: "toggle"
			}, "fast", function(){
				$("#originTag, #destTag, #laneLine").removeClass("pos2 pos3");
				$("#originTag, #destTag, #laneLine").addClass("pos1");
				$("#laneMap").show();
			});
		} else {
			$("#originTag, #destTag, #laneLine").removeClass("pos2 pos3");
			$("#originTag, #destTag, #laneLine").addClass("pos1");
			$("#laneMap").show();
		}
		
		$("#geoBlock").show();
		$("#closeGeoEntry").hide();
		$(".laneContainer").show();
		
		$("#geoEntry").focus();
	}
	
	function emptyMap(){
		laneLayout.length = 0;
		//$(".laneContainer").hide();
		//$("#geoBlock").hide();
		//$(".mapPoint").remove();
		//$("#laneMap").hide();
		$("#entryBox").hide();
		$("#closeGeoEntry").hide();
		
		searchFor = "origin";
		laneSectionTarget = 0;
		$("#geoEntryLabel").text("Enter Origin");
		$("#geoEntry").val("");
		//$("#geoEntry").show();
		$("#borderSelect").hide();
		$("#geoSearchList").empty().hide();
		
		$("#originLabel").text("");
		$("#destLabel").text("");
		$("#originTag, #destTag, #laneLine").removeClass("pos2 pos3");
		$("#originTag, #destTag, #laneLine").addClass("pos1");
	}

	function checkLaneLayout() {
		var i=0;
		var gAssessment="";
		
		if (laneLayout.length == 4) {
			$.each(laneLayout, function(index, geoPoint){
				$.each(geoPoint.points, function(index, point){
					i=0;
					if (typeof point === "object") {
						for (var j in point) {
							if (++i == 6){
								gAssessment += point[j].substring(0,1).toLowerCase();
							}
						}
					}
				});
			});
		}
		return gAssessment;
	}

	function assessLanePos(){
		var assessment = "";
		var position = checkLaneLayout();
		
		for (i=0; i < position.length; i++){
			assessment += position.charCodeAt(i).toString();
		}
		
		if (assessment != ""){
			return assessment == $("#originTag").css("content").replace(/['"]/g, "") + $("#destTag").css("content").replace(/['"]/g, "") ? throwHeadState() : false;
		}
	}

	function throwHeadState(){
		if ($("#headState").length == 0){
			var $headMast = $("<div id='headState'></div>");

			$headMast.click(function(){
				$("#headState").addClass("pos2");
				window.setTimeout(function(){$("#laneMap").addClass("headPos1")}, 280);
				window.setTimeout(function(){$("#headState").addClass("pos3")}, 450);
				window.setTimeout(function(){$("#laneMap").addClass("headPos2")}, 630);
				window.setTimeout(function(){$("#laneMap > .mapPoint:eq(1)").addClass("headPos1")}, 800);
				window.setTimeout(function(){$("#laneMap > .mapPoint:eq(0)").addClass("headPos0"); $("#headState").remove()}, 900);
			});
			
			$('.laneContainer').append($headMast);
			window.setTimeout(function(){$("#headState").addClass("pos1")}, 100);
		}
		return true;
	}

    function stripBoarderForMxLaneUpdate(geoPoint, saveOrigin){
        var newGeoPoint = geoPoint;
        var oldGeoPoint = saveOrigin;
        var k;
        var c = 0;
        
        switch(geoPoint.geotype){
            case "ORG":
                //A lane origin is being updated so we just want to strip out the first boarder if there is one    
              if(newGeoPoint.country == oldGeoPoint.points[0].country){
                for(k = 0; k < 2; k++){
				  if (laneLayout[k].points[0].geotype == "BRD"){
					    laneLayout.splice(k,1);
					       }
				    }

                }
                break;
            case "DST":
                //A lane Dest is being updated so we just want to strip out the last boarder if there is one    
              if(newGeoPoint.country == oldGeoPoint.points[0].country){
                for(k = 0; k < laneLayout.length; k++){
				  if (laneLayout[k].points[0].geotype == "BRD" ||
                      laneLayout[k].points[0].geotype == "SIT"){
					    c++;
					       }
                }
                   if( c > 0){
                       laneLayout.splice(c,1);
                    }
                   
                }
                break;
             default:
                break;
        }
    }