// Border City Functions


function retrieveDefaultBorder (state, borderDirection, sectionNum, fromSearchScreen){
		var defaultCity;
		var defaultCityId;
		var defaultCityName;
		var defaultCountyId;
		var defaultState;
		var defaultZipCode;
		var defaultZipId;
		var errMessage;
		var error = false;
		var geoPoint;
		var url;
		
		sectionNum = sectionNum || 99;
		
		
		// Build URL to Retrieve Default Border City
		url = "PQxml.pgm?" +
              "Func=GetDefaultBorderCrossing&State=" + state + 
              "&Direction=" + borderDirection;	
		
		$.ajax({
			type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				async:false,
				success: function(xml) {
				
					// Check for Error Messages
					errMessage = $(xml).find('Error').attr('message');
					if (errMessage){
						alert (errMessage); 
						error = true;
					} else {
				
						// Move default border into variables
						defaultCountyId = "1";
						defaultState = $(xml).find('bordercrossing').attr("state");
						defaultCityId = $(xml).find('bordercrossing').attr("cityid");
						defaultCityName = $(xml).find('bordercrossing').attr("cityname");
						defaultZipId = $(xml).find('bordercrossing').attr("zipid");
						defaultZipCode = $(xml).find('bordercrossing').attr("zipcode");
						defaultCity = defaultCityName + ", " + defaultState;
					}
				},
			
				complete: function() {
					if (! fromSearchScreen){
						var $borderLI = 
							$("<li class='border'" + 
								"idcounty='" + defaultCountyId + "' " +
								"state='" + defaultState + "' " +
								"cityid='" + defaultCityId + "' " +
								"cityname='" + defaultCityName + "' " +
								"idzip='" + defaultZipId + "' " +
								"zipcode='" + defaultZipCode + "'>" +
									defaultCity +
								"</li>");
					}
							
										
					geoPoint = 
						{
							idpqlangeo: "0",
							sequence:	"",
							geotype:	"BRD",
										
							pointsrc:	"CL",
							idcity:		defaultCityId,
							cityname:	defaultCityName,
							idcounty:	defaultCountyId,
							countyname:	"",
							state:		defaultState,
							country:	"US",
							idzip:		defaultZipId,
							zipcode:	defaultZipCode,
							zone:		"",
							idregion:	"0",
							region:     "",
							segment:	"0",
							applycarr:	"0"
						}
					if (! fromSearchScreen){
						addPointToLane(geoPoint, sectionNum, true);
						drawMap();
					}
				},
			
				error: function() {
					alert('Cannot find Default Border City');		
				
				}
		});
		
		if (fromSearchScreen){
			return geoPoint;
		}
		
	}

	function retrieveBorderCities (borderSelect){
		var citystate;
		var errMessage;
		var error = false;
		var i = -1;
		var j = 0;
		//var borderSelect = $('#borderSelect');
		
		var url;
		
		
		// Build URL to Retrieve Border Cities
		url = "PQxml.pgm?" +
		      "Func=GetAllBorderCrossings";	 			
	
		$.ajax({
			type: "GET",
		    	url: url,
		    	dataType: "xml",
		    	cache: false,
		    	success: function(xml){
		    		var i=0;
					$(xml).find('bordercrossing').each(function(){
						
						var cityname = $(this).attr('cityname');
						var state = $(this).attr('state');
						var country = $(this).attr('country');
						var cityid = $(this).attr('cityid');
						var countyid = $(this).attr('countyid');
						var zipid = $(this).attr('zipid');
						var zipcode = $(this).attr('zipcode');
						citystate = cityname + ", " + state;
						
						borderSelect.append(
							"<option value='"+ cityid + 
								"' idpqlangeo='0" +
								"' state='"+ state +
								"' cityname='"+ cityname +
								"' country='"+ country +
								"' idcounty='"+ countyid +
								"' idzip='"+ zipid +
								"' zipcode='"+ zipcode +
							"'>"+citystate+"</option>");
						
					 });
				
		    	},
			
				complete: function() {
				
				},
			
				error: function() {
					alert('Cannot find Border Cities');
			   					
				}
		});
	}
	