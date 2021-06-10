

function buildLaneUserSelectOptions (selectUserList,selectUserType){
		
	var x=0;
		
	for (x = 0; x < laneUsers.length; x++) {
		if (laneUsers[x].userType == selectUserType){
			// Build Select Option List 
			selectUserList.append(
					"<option value='"+ laneUsers[x].userProfile+ 
					"' userType='"+ laneUsers[x].userType+ 
					"' userProfile='"+ laneUsers[x].userProfile+ 
					"'>"+laneUsers[x].userProfile+"</option>");
		}
	};
		
}
function buildLaneUserTypeSelectOptions (selectUserTypeList){
	
	var x=0;
		
	var saveUserType="";	
	for (x = 0; x < laneUsers.length; x++) {
		if (laneUsers[x].userType != saveUserType){
			// Build Select Option List 
			selectUserTypeList.append(
				"<option value='"+ laneUsers[x].userType+
				"'>"+laneUsers[x].userType+"</option>");
			saveUserType = laneUsers[x].userType;
		}
	};
		
}
//Retrieve All Lane Users  
function retrieveAllLaneUsers (callback){
	var i;
	var url;
	
	laneUsers.length = 0;
	
	// Build URL to Retrieve All Users
	url = "PQxml.pgm?" +
          "Func=GETALLUSERS";

	$.ajax({
		type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			
	    	success: function(xml){
	    		i = -1;
	    		$(xml).find('pricingusers').each(function(){
					i++;
					var u = (laneUsers[i] = {});
					u["userType"] = $(this).attr("type");
					u["userProfile"] = $(this).attr('userprofile');
				});
	    		
	    		$(xml).find('salesusers').each(function(){
					i++;
					var u = (laneUsers[i] = {});
					u["userType"] = $(this).attr("type");
					u["userProfile"] = $(this).attr('userprofile');
				});
	    		
	    		$(xml).find('publishingusers').each(function(){
					i++;
					var u = (laneUsers[i] = {});
					u["userType"] = $(this).attr("type");
					u["userProfile"] = $(this).attr('userprofile');
				});
							
	    	},
		
			complete: function() {
				if (typeof callback === "function"){
					callback();
				}
				
			},
		
			error: function() {
				alert('Cannot find Lane User Types and Profiles.');
		   					
			}
	});
}
