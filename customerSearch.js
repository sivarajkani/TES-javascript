// JavaScript Document



//***************************
// AJAX
//***************************
function searchCustomer($input, $inListObj, clickEvent){
	var $listObj;
	var searchString = encodeURIComponent($input.val());
	
	if ($inListObj) {
		$listObj = $inListObj;
	} else {
		$listObj = $("#custSearchList");
	}
	
	var url = "custxmlctl.pgm?func=pqsearchcust&input=" + searchString;
	
	// Abort active geo search if one is in progress
	if(custSearchXHR && custSearchXHR.readyState != 4){
		custSearchXHR.abort();
	}
	
	if (searchString != ""){
		custSearchXHR =
			$.ajax({
				type: "GET",
				url: url,
				dataType: "xml",
				cache: false,
				success: function(xml) {
					
					var $tmpUL = $("<ul></ul>");
					
					// find all customer tags in the xml document
					$(xml).find('customer').each(function(){
						
						
						var liStr = 
							"<li" + 
								" prefix=" + $(this).attr("prefix") +
								" base=" + $(this).attr("base") + 
								" suffix=" + $(this).attr("suffix") +
								" formattednumber=" + $(this).attr("formattednumber") +
								" name=" + $(this).attr("name") +
								" city=" + $(this).attr("city") +
								" state=" + $(this).attr("state") +	">" + 
									"<span class='name'>" + 
										$(this).attr("name") + 
									"</span>" +
									"<span class='formattedNumber'>" + 
										$(this).attr("formattednumber") + 
									"</span>" +
									"<span class='location'>" + 
										$(this).attr("city") + ", " + $(this).attr("state") +
									"</span>" +
							"</li>";
					
						$liObj = $(liStr);
						
						$tmpUL.append($liObj);
					});
					
					if ($tmpUL.children().length > 0){
						$listObj.html($tmpUL.children());
						assignCustListClick($input, $listObj, clickEvent);
						$listObj.show();
					} else {
						$listObj.empty().hide();
					}
					
					
				},
				error: function(jqXHR, errorStatus, errorMessage) {
					if (errorStatus != "abort"){
						$listObj.empty();
						$listObj.hide();
						alert("An error occurred during the customer search AJAX request.");
					}
				}
			});
	} else {
		$listObj.empty();
		$listObj.hide();
	}
}


// Click events for Search results
function assignCustListClick($target, $ul, clickEvent){
	$ul.children("li").click(function(){
		setCustSelection($target, $(this));
		if (clickEvent){
			clickEvent();
		}
	});
}

function setCustSelection($target, $li){
	var $selectedCust;
	if ($("#custSearchList li.selected").length == 0){
		$selectedCust = $li;
	} else {
		$selectedCust = $("#custSearchList li.selected");
	}
	
	if ($selectedCust){
		$target.val($selectedCust.children(".formattedNumber").text());
	}
	
	if ($li){
		$li.parent("ul").hide().empty();
	} else {
		$("#custSearchList").hide().empty();
	}
}
