 // Retrieve Contact Methods 
function retrieveContactMethods (){
		
	var url;
	var contMethSelect = $('#contMethSelect');
	var contMethodList = $("#contactMethodList");
	var contMethodCount = 0;
	
	
	// Build URL to Retrieve Contact Methods
	url = "PQxml.pgm?" +
		  "Func=GETCONTACTMETHODS";	
	
		
	$.ajax({
		type: "GET",
			url: url,
			dataType: "xml",
			cache: false,
			
			success: function(xml){
				
				contMethSelect.append("<option value='0'>Proposal Source</option>");
								
				$(xml).find('method').each(function(){
					var contMethId = $(this).attr('id');
					var contMethDesc = $(this).attr('desc');							
					var contMethIcon = $(this).attr('icon');
					
					contMethodCount++;
					
					contMethSelect.append(
							"<option value='"+ contMethId + 
							"'>"+contMethDesc+"</option>");
					
					var $contactMethodLI = 
						$(
							"<li value='" + contMethId + "'>" +
								"<span>" + contMethDesc + "</span>" +
							"</li>"
						);
							
					$contactMethodLI.css(
						"background-image", 
						"url(" + 
								"'/applications/pricing/images/" + contMethIcon + 
							"')");
							

					contMethodList.append($contactMethodLI);
					
				});	
				
				switch (contMethodCount % 3) {
					case 1:
						$("#contactMethodList > li:last").css("width","98%");
						break;
					case 2:
						//$("#contactMethodList > li:nth-last-child(2)").css("width","49%");
						//$("#contactMethodList > li:last").css("width","49%");
						break;
					default:
						break;
				}
			},
						
		
			complete: function() {
				assignContactMethodClickEvents();
			},
		
			error: function() {
				alert('Cannot find Contact Methods.');
							
			}
	});
}

function assignContactMethodClickEvents(){
	$("#contactMethodList > li").click(function(){
		idpqcontme = $(this).attr("value");
		$(".savePanel").hide("drop", {direction: "up"}, "fast");
		$("#saveRates").click();
	});
}
	
