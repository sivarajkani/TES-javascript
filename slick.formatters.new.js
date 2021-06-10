/***
 * Contains basic SlickGrid formatters.
 * 
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 * 
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        "PriceRateCell": PriceRateCellFormatter,
        "PriceQtyCell": PriceQtyCellFormatter,
        "DestCell": DestCellFormatter
      }
    }
  });

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='../images/tick.png'>" : "";
  }
  
  function PriceQtyCellFormatter(row, cell, value, columnDef, dataContext) {
				
		if (value === null || value === "" || dataContext.propuom == "" ){ 
			return "";
		} else {
			return value;
	    }

			  
  }
  
  function PriceRateCellFormatter(row, cell, value, columnDef, dataContext) {
	var numberDecimals = 0;
	
	
	
	if (value === null || value === "" || dataContext.propuom == "" ){ 
		return "";
	} else {
		
		// Get Rate Decimal Precision from the Rate Grid Rules using Line Code and UOM
        for (i = 0; i < rules.length; i++) { 
            if ((rules[i].linecode == dataContext.linecode) && (rules[i].uom == dataContext.propuom)
            		&& (rules[i].linecodetype == dataContext.linecodetype) ){
            	numberDecimals = rules[i].ratedecprc;
            };
         }
        // Default to 2 Decimals
        if (numberDecimals == 0){
        	numberDecimals = 2;
        }
        
        dataContext.proprate = Number(value).toFixed(numberDecimals);
        
        return Number(value).toFixed(numberDecimals);
        
	}

		  
  }
  
  function DestCellFormatter(row, cell, value, columnDef, dataContext) {
		
	  	// Freight Line Code Type of "F" for regular freight code will display the original value in pubdest 
		if (dataContext.linecodetype == 'F'){
			return value;
		}
		
		// Freight Line Code Type of "D" for deficit freight code will display an edit icon only when the 
		// deficit can be edited by the user.
		var canEditDeficit = false;
		// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
		for (var i = 0; i < rules.length; i++) { 
			if ((rules[i].linecode == dataContext.linecode) && (rules[i].uom == dataContext.propuom)
				&& (rules[i].linecodetype == dataContext.linecodetype)){
				if (rules[i].updqty == "Y"){ 
					canEditDeficit = true;
				}
				break;
			}
		}
		// Determine if Deficit Value can be Updated according to Deficit Rules for Line Code 
		if (!canEditDeficit){
			for (var i = 0; i < deficitRules.length; i++) { 
				if (deficitRules[i].code == dataContext.linecode){
					if (deficitRules[i].change_Value_Allowed == "Y"){
						canEditDeficit = true;
					}
					break;
				}
			}
		}
		
		// Deficit Line Code Type Only - when user can Edit the Deficit Code then Display the pencil edit icon in the Dest Column	
	   if (canEditDeficit){
		   return "<div class='deficitEditIcon'><img src='/applications/Pricing/images/pencil.svg'></div>"; 
	   } else {
		   return value;
	   }
	         
  }
  
})(jQuery);
