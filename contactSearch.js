// JavaScript Document



//***************************
// AJAX
//***************************
function searchContacts($input, $inListObj, clickEvent){
	var $listObj = $inListObj; //$("#contSearchList");
	var searchString = $input.val();
	
	// Clear Selected Contact Customer Number
	contPrefix = "";
	contBase = 0;
	contSuffix = 0;
	contId = 0;
	
	var url = "contxmlctl.pgm?func=searchcontact&input=" + searchString;
	
	// Abort active contact search if one is in progress
	if(contSearchXHR && contSearchXHR.readyState != 4){
		contSearchXHR.abort();
	}
	
	if (searchString != ""){
		contSearchXHR =
			$.ajax({
				type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				success: function(xml) {
					
					var $tmpUL = $("<ul></ul>");
					
					$(xml).find('contact').each(function(){
						
						var liStr = 
							"<li" + 
								" contactid='" + $(this).attr("contactid") + "'" +
								" contactname='" + $(this).attr("contactname") + "'" +
								" contacttitle='" + $(this).attr("contacttitle") + "'" +
								" prefix='" + $(this).attr("prefix") + "'" +
								" base='" + $(this).attr("base") + "'" +
								" suffix='" + $(this).attr("suffix") + "'" +
								" formattednumber='" + $(this).attr("formattednumber") + "'" +
								" group='" + $(this).attr("group") + "'" +
								" city='" + $(this).attr("city") + "'" +
								" email='" + $(this).attr("email") + "'" +
								" phone='" + $(this).attr("phone") + "'" +
								" ext='" + $(this).attr("ext") +  "'>" + 
									"<span class='contactname'>" + 
										$(this).attr("contactname") + 
									"</span>" +
									"<span class='email'>" + 
									$(this).attr("email") + 
									"</span>" +
									"<span class='phone'>" + 
										formatPhone($(this).attr("phone")) + 
									"</span>" +
									"<span class='formattednumber'>" + 
										$(this).attr("formattednumber") + 
									"</span>" +
									"<span class='customername'>" +
										$(this).attr("cname") +
									"</span>" +
							"</li>";
					
						$liObj = $(liStr);
						
						$tmpUL.append($liObj);
					});
					
					if ($tmpUL.children().length > 0){
						$listObj.html($tmpUL.children());
						assignContListClick($input, $listObj, clickEvent);
						
						$listObj.show();
					} else {
						$listObj.empty().hide();
					}
					
					
				},
				error: function(jqXHR, errorStatus, errorMessage) {
					if (errorStatus != "abort"){
						$listObj.empty();
						$listObj.hide();
						alert("An error occurred during the contact search AJAX request.");
					}
				}
			});
	} else {
		$listObj.empty();
		$listObj.hide();
	}
}


// Click events for Search results
function assignContListClick($target, $ul, clickEvent){
	$ul.children("li").click(function(){
		setContSelection($target, $(this));
		if (clickEvent){
			clickEvent();
		}
	});
}

function setContSelection($target, $li){
	var $selectedCont;
	if ($("#contSearchList li.selected").length == 0){
		$selectedCont = $li;
	} else {
		$selectedCont = $("#contSearchList li.selected");
	}
	
	
	if ($selectedCont){
		var contactText = $selectedCont.children(".contactname").text();
		
		// code for handling selection process in search screen
		if ($target.siblings(".selectedListItem").length != 0){
			$target.siblings(".selectedListItem").children("span").text(contactText);
			$target.fadeOut("fast", function(){
				$target.siblings(".selectedListItem").animate({
					top: 0
				}, "fast");
				$target.val(contactText);
			});
		} else {
			$target.val(contactText);
		}
		
		contactid = $selectedCont.attr("contactid");

		$('#contactPhone').html(formatPhone($selectedCont.attr("phone")));
		$('#contactEmail').html($selectedCont.attr("email"));
		$('#contactTitle').html($selectedCont.attr("contacttitle"));
				
		contPrefix = $selectedCont.attr("prefix");
		contBase = $selectedCont.attr("base");
		contSuffix = $selectedCont.attr("suffix");
		contId = $selectedCont.attr("contactid");
		
		getPrimaryCustContact = false;
		
		if (cusprefix == ""){
			cusprefix = $selectedCont.attr("prefix");
			cusbase = $selectedCont.attr("base");
			cussuffix = $selectedCont.attr("suffix");
			var customer = cusprefix + cusbase + cussuffix;
			if (customer != "") {
				// Retrieve Customer Info - Populates Customer HTML 
				retrieveCUST(customer);
			};
		};
		
		// Activate Save only when user is Authorized
		if (saveAuthorized == true){
			$("#saveRates").removeClass("disabled");
		};
		$("#emailButton").addClass("disabled");
	}
	
	if ($li){
		$li.parent("ul").hide().empty();
	} else {
		$("#contSearchList").hide().empty();
	}
}
