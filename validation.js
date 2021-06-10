/**
 * Validates the effective and expiration dates.
 * 
 * Returns either true or false based on if the
 * validation passes
 */
function validateDates() {
	
	var effIsValid = false;
	var expIsValid = false;
	
	var effMoment;
	var effString;
	
	var yearLength;
	
	effString = $("#effectiveDate").val();

	if (effString.indexOf("/") != -1) {
		
		yearLength = (effString.length - 1) - effString.lastIndexOf("/");
		
		if (yearLength == 1 || yearLength == 2) {
			effMoment = new moment(effString, "MM-DD-YY");
		} else {
			effMoment = new moment(effString, "MM-DD-YYYY");
		}
	} else {
		if (effString.length == 6) {
			effMoment = new moment(effString, "MM-DD-YY");
		}
		else {
			effMoment = new moment(effString, "MM-DD-YYYY");
		}
	}
		

	expString = $("#expirationDate").val();

	if (expString.indexOf("/") != -1) {
		
		yearLength = (expString.length - 1) - expString.lastIndexOf("/");
		
		if (yearLength == 1 || yearLength == 2) {
			expMoment = new moment(expString, "MM-DD-YY");
		} else {
			expMoment = new moment(expString, "MM-DD-YYYY");
		}
	} else {
		if (expString.length == 6) {
			expMoment = new moment(expString, "MM-DD-YY");
		}
		else {
			expMoment = new moment(expString, "MM-DD-YYYY");
		}
	}
	
	// check to see if the effective date is valid
	if (effMoment.isValid()) {
		
		// clear if previously invalid
		if ($("#effectiveDate").hasClass("invalidDate")) {
			$("#effectiveDate").removeClass("invalidDate");
			$("#effectiveDate").removeAttr("title");
		}
		
		// set global variable
		effdate = effMoment.format("YYYY-MM-DD");
		effIsValid = true;
		
		$("#effectiveDate").val(effMoment.format("MM/DD/YYYY"));
		
	} else {
		$("#effectiveDate").addClass("invalidDate");
		$("#effectiveDate").attr("title", "Invalid Date");
	}
	
	// check to see if the expiration date is valid
	if (expMoment.isValid()) {
		
		if ($("#expirationDate").hasClass("invalidDate")) {
			$("#expirationDate").removeClass("invalidDate");
			$("#expirationDate").removeAttr("title");
		}
		
		// check to see if expiration date is greater than effective date
		if (expMoment < effMoment) {
			$("#expirationDate").addClass("invalidDate");
			$("#expirationDate").attr("title", "Expiration Date must be greater than, or equal to the Effective Date.");
		} else {
			if ($("#expirationDate").hasClass("invalidDate")) {
				$("#expirationDate").removeClass("invalidDate");
				$("#expirationDate").removeAttr("title");
			}
			
			// set global variables
			effdate = effMoment.format("YYYY-MM-DD");
			expdate = expMoment.format("YYYY-MM-DD");
			expIsValid = true;
			
			$("#effectiveDate").val(effMoment.format("MM/DD/YYYY"));
			$("#expirationDate").val(expMoment.format("MM/DD/YYYY"));
		}
		
	} else {
		$("#expirationDate").addClass("invalidDate");
		$("#expirationDate").attr("title", "Invalid Date");
	}
	
	if (effIsValid && expIsValid) {
		return true;
	} else {
		return false;
	}
	
}

function validateContMethod(e) {
	
	
//	if (idpqcontme == 0){
//		$("#contMethSelect").addClass("invalidField");
//		$("#contMethSelect").attr("title", "Proposal Source Required. Please select a source from the list.");
//		return false;
//	} else {
//		if ($("#contMethSelect").hasClass("invalidField")) {
//			$("#contMethSelect").removeClass("invalidField");
//			$("#contMethSelect").removeAttr("title");
//		};
//		return true;
//	}

	e.stopPropagation();
	if (idpqcontme == 0){
		$(".savePanel").show("drop", {direction: "down"}, "fast");
		return false;
	} else {
		return true;
	}
	
}