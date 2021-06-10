
function retrieveStats() {
	
	var errMessage;
	var error = false;
	var i = -1;
	var url;
	var postXml;
	var begDateMoment;
	var endDateMoment;
	
	postXml = getStatsPostXml();
	
	url = "PQxml.pgm?Func=GetStats"; 	
	
	$.ajax({
		type: "POST",
		url: url,
		data: postXml,
		dataType: "xml",
		cache: false,
		success: function(xml) {
			
			if ($("#stats").hasClass("placeholder")) {
				$("#stats").removeClass("placeholder");
				$("#stats").html("<ul></ul>");
			}
			
			// get the statinfo from the xml response
			$statInfo = $(xml).find('statinfo');
			statorig = $statInfo.attr('originzone');
			statdest = $statInfo.attr('destinzone');
			
			begDateMoment = new moment($statInfo.attr('begdate'), 'YYYY-MM-DD');
			endDateMoment = new moment($statInfo.attr('enddate'), 'YYYY-MM-DD');
			
			statbegdt = begDateMoment.format("YYYY-MM-DD");
			statenddt = endDateMoment.format("YYYY-MM-DD");
			
			// read the stats into the stat array
			$stats = $(xml).find('statistic');
			
			//$statsDiv = $("#stats > ul");
			
			//$statsDiv.empty();
			
			var i = 0;
			$stats.each( function () {
				
				stat[i] = {};
				
				stat[i].idPqStsMst = $(this).attr('idpqstsmst');
				stat[i].priGroup = $(this).attr('prigroup');
				stat[i].pgmKey = $(this).attr('pgmkey');
				stat[i].sort1 = $(this).attr('sort1');
				stat[i].sort2 = $(this).attr('sort2');
				stat[i].shortDesc = $(this).attr('shortdesc');
				stat[i].dataType = $(this).attr('datatype');	
				stat[i].decPrec = $(this).attr("decprec");
				stat[i].fullDesc = $(this).attr('fulldesc');
				stat[i].statValue = $(this).attr('statvalue');	
				// Determine Stat Type for Tabs
				if (stat[i].priGroup.indexOf("Rate Record Cost") != -1) {
					stat[i].buttonType = "rate";
				} else {
					if (stat[i].priGroup.indexOf("Zone to Zone") != -1) {
						stat[i].buttonType = "zone";
					} else {
						stat[i].buttonType = "all";
						}
					};
			
				i++;
			});
			statToggle = "zone";
			$("#zoneButton").addClass("tabButtonFocus");
			$("#zoneButton").removeClass("tabButtonBlur");
			$("#rateRecordButton").addClass("tabButtonBlur");
			$("#rateRecordButton").removeClass("tabButtonFocus");
			rebuildStats();
						
		},
	
		complete: function(jqXHR, completeStatus) {
			
		},
					
		error: function(jqXHR, errorStatus, errorMessage) {
			
		}
	});
}

function getStatsPostXml() {

	var xml = "";

	xml += "<lane>";
	
	for (i = 0; i < geo.length; i++) {
		switch (geo[i]["geotype"]) {
			case 'ORG':
				xml += "<origCity>";
				xml += geo[i]["idcity"];
				xml += "</origCity>";
				xml += "<origCounty>";
				xml += geo[i]["idcounty"];
				xml += "</origCounty>";
				xml += "<OrigZipcode>";
				xml += geo[i]["zipcode"];				
				xml += "</OrigZipcode>";
				xml += "<OrigPointSrc>";
				xml += geo[i]["pointsrc"];	
				xml += "</OrigPointSrc>";
				break;
			case 'DST':
				xml += "<destCity>";
				xml += geo[i]["idcity"];
				xml += "</destCity>";
				xml += "<destCounty>";
				xml += geo[i]["idcounty"];
				xml += "</destCounty>";
				xml += "<destZipcode>";
				xml += geo[i]["zipcode"];				
				xml += "</destZipcode>";
				xml += "<destPointSrc>";
				xml += geo[i]["pointsrc"];	
				xml += "</destPointSrc>";				
				break;
			case 'PEN':
				xml += "<EntPortCity>";
				xml += geo[i]["idcity"];
				xml += "</EntPortCity>";
				xml += "<EntPortCounty>";
				xml += geo[i]["idcounty"];
				xml += "</EntPortCounty>";				
				break;
			case 'PEX':
				xml += "<ExtPortCity>";
				xml += geo[i]["idcity"];
				xml += "</ExtPortCity>";
				xml += "<ExtPortCounty>";
				xml += geo[i]["idcounty"];
				xml += "</ExtPortCounty>";						
				break;					
		}
	}
	
	xml += "<Rateid>";
	if (chrg.length != 0){
		xml += chrg[0]["pricingid"];
	} else {
		xml += "0";
	}
	xml += "</Rateid>";
	
	xml += "<TransitMiles>";
	if (chrg.length != 0){
		xml += chrg[0]["rmsqty"];
	} else {
		xml += "0";
	}
	xml += "</TransitMiles>";
	
	
	xml += "</lane>";
	
	return xml;
}

//Rebuild Stats Tab List 
function rebuildStats (){
	var statsListUL = $('#statsList');
	var statsDtl;
	var statsUL;
	var statsLI;
	var saveGroup;
	var statBegDtMoment;
	var statEndDtMoment;
	
	initToolTipster();
	
	statsListUL.empty();
	
	if (stat.length == 0){
		statsDtl = $("<li class='groupSection'></li>");
		statsDtl.append($("<div class='statsEmpty'>Statistics not Available</div>"));
		statsListUL.append(statsDtl);
	}
	
	
	for (i = 0; i < stat.length; i++){
		if ( (stat[i].buttonType == "zone" && statToggle == "zone") || 
			 (stat[i].buttonType == "rate" && statToggle == "rate") ||
			 (stat[i].buttonType == "all") ){
			if (stat[i].priGroup != saveGroup){
				statsDtl = $("<li class='groupSection'></li>");
				statsDtl.append($("<div class='statsGroup'>"+ stat[i].priGroup + "</div>"));
				statsListUL.append(statsDtl);
				statsUL = $("<ul class='stats'></ul>");
				statsListUL.append(statsDtl);
				saveGroup = stat[i].priGroup;
			}
			
			statsLI = $("<li class='stats'></li>");
			statsLI.append($("<span class='shortDesc' title='" + stat[i].fullDesc +"'>"+stat[i].shortDesc+"</span>"));
			statsLI.append($("<span class='statValue'>"+stat[i].statValue+"</span>"));
					
			statsUL.append(statsLI);
			statsDtl.append(statsUL);
			statsListUL.append(statsDtl);
		}
	};
	
	statBegDtMoment = new moment(statbegdt, "YYYY-MM-DD");
	statEndDtMoment = new moment(statenddt, "YYYY-MM-DD");
	
	$("#statBDate").html(statBegDtMoment.format("MM/YY"));
	$("#statEDate").html(statEndDtMoment.format("MM/YY"));
	$("#statOZone").html(statorig);
	$("#statDZone").html(statdest);
	
	if (statbegdt != "0001-01-01" ||
		statenddt != "0001-01-01" ||
		statorig != "" ||
		statdest != "") {
		$("#statInfo").css("display", "block");
	}
		
	
}
