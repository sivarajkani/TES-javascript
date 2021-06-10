	var regionTable;
	var regionDetail = [];
	
	
	
	function rebuildRegionDetail (){
		if (regionTable === undefined){
			regionTable = $('#regionDetailTable').DataTable( {
				data: regionDetail,
				columns: [
					{ "title": "Country", "data": "country" },
					{ "title": "State", "data": "state" },
					{ "title": "City", "data": "city" },
					{ "title": "Zip", "data": "zip" },
					{ "title": "SPLC", "data": "splc" },
					{ "title": "Location", "data": "location" },
					{ "title": "Precedence", "data": "precedence" }
				],
				paging: false,
				rowCallback: function(row, data) {
				},
				drawCallback: function( settings ) {
				},
				scrollY: 300,
				scrollCollapse: true,
				searching: false
			});
			
		} else {
			regionTable.clear();
			regionTable.rows.add(regionDetail);
			regionTable.draw();
		}
	}
	
	function getRegionDetail(regionid, callback){
		var url;
		var x = 0;
		
		regionDetail.length = 0;
		
		url = "pqxml.pgm?func=getregioninfo&regionid=" + regionid;
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			success: function(xml){
                $(xml).find('region').each(function(){
                    regionName = $(this).attr("name");
                    regionDesc = $(this).attr("desc");
                    regionEffDate = $(this).attr("effdate");
                    regionClient = $(this).attr("client");
                    regionZone = $(this).attr("zone");
                    regionPrec = $(this).attr("ovrprec");
                    regionCityId = $(this).attr("cityid");
                    regionCityNm = $(this).attr("citynm");
                    regionCntyId = $(this).attr("cntyid");
                    regionCntyNm = $(this).attr("cntyid");
                    regionZipcode = $(this).attr("zipcode");
                });
				$(xml).find('detail').each(function(){
					var r = (regionDetail[x] = {});
					r["country"] = $(this).attr("country");
					r["state"] = $(this).attr("state");
					r["city"] = $(this).attr("city");
					r["zip"] = $(this).attr("zip");
					r["splc"] = $(this).attr("splc");
					r["location"] = $(this).attr("loccodeid");
					r["precedence"] = $(this).attr("preclevel");
					if (regionDetail[x].location == "0"){
						regionDetail[x].location = "";
					}
                    r["zone"] = $(this).attr("zone");
					x++;
				});
			},
			complete: function(){
				// Region Header Table Info 
				$(".regionName").html(regionName);
				// Format Customer Number
				if (regionClient != ""){
					if (regionClient.substring(6,9) == ""){
						$(".regionCust").html(regionClient.substring(0,1)+"-"+regionClient.substring(1,6));
					} else {
						$(".regionCust").html(regionClient.substring(0,1)+"-"+regionClient.substring(1,6)+"-"+regionClient.substring(6,9));
					}
				} else {
					$(".regionCust").html(regionClient);	
				}
				// Format Effective Date
				var effMoment = new moment(regionEffDate, "YYYY-MM-DD");
				$(".regionEffDate").html("Eff: "+effMoment.format("MM-DD-YYYY"));
				
				rebuildRegionDetail();
				callback();
			},
			
			error: function(jqXHR, errorStatus, errorMessage) {
				if (errorStatus != "abort"){
					$listObj.empty();
					$listObj.hide();
					alert("An error occurred trying to contact the server.");
				}
			}
		});
	}