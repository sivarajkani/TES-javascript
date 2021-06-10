function searchGeography($input){
	var $listObj = $("#geoSearchList");
	var searchString = $input.val();
	var sourceName;
	var url = "pqxml.pgm?func=searchgeography&input=" + searchString;
	
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
						
						$listObj.insertAfter($input.parents(".selectionFlipper"));
						
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
							case "CC":
								liStr += ($(this).attr("country"));
								sourceName = "Country";
								break;	
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
					assignGeoListClick($input);
					$listObj.show();
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
function assignGeoListClick($target){
	$("#geoSearchList li").click(function(){
		setGeoSelection($target, $(this));
	});
}

function setGeoSelection($target, $li){
	var selectedGeo = $("#geoSearchList li.selected");
	if (selectedGeo.length == 0){
		selectedGeo = $li;
	}
	
	if (selectedGeo){
		var g = {};
		
		if ($target.attr("id") == "searchOrigin"){
			g["geotype"] = "ORG";
		} else {
			g["geotype"] = "DST";
		}
		g["sequence"] = 0;
		g["idpqlangeo"] = selectedGeo.attr("idpqlangeo");
		g["pointsrc"] = selectedGeo.attr("pointsrc");
		g["idcity"] = selectedGeo.attr("idcity");
		g["cityname"] = selectedGeo.attr("cityname");
		g["idcounty"] = selectedGeo.attr("idcounty");
		g["countyname"] = selectedGeo.attr("countyname");
		g["state"] = selectedGeo.attr("state");
		g["country"] = selectedGeo.attr("country");
		g["idzip"] = selectedGeo.attr("idzip");
		g["zipcode"] = selectedGeo.attr("zipcode");
		g["zone"] = selectedGeo.attr("zone");
		g["idregion"] = selectedGeo.attr("idregion");
		g["region"] = selectedGeo.attr("region");
		g["segment"] = selectedGeo.attr("segment");
		g["applycarr"] = selectedGeo.attr("applycarr");
		
		geo.push(g);
		
		// code for handling selection process in search screen
		$target.siblings(".selectedListItem").children("span").text(selectedGeo.ignore("span").text());
		$target.fadeOut("fast", function(){
			$target.siblings(".selectedListItem").animate({
				top: 0
			}, "fast");
			$target.val(selectedGeo.ignore("span").text());
		});
		$("#geoSearchList").empty().hide();
		
		// Set focus to next input box
		if ($target.attr("id") == "searchOrigin"){
			$("#searchDestn").focus();
		} else {
			$("#searchLaneType").focus();
		}
	}
}