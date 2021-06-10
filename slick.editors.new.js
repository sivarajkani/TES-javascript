/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($) {
	
	var rebuildGridCharges = false;
	var dependentRowsChanged = false;	
	
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Editors": {
        "Text": TextEditor,
        "Integer": IntegerEditor,
        "Date": DateEditor,
        "YesNoSelect": YesNoSelectEditor,
        "Checkbox": CheckboxEditor,
        "PercentComplete": PercentCompleteEditor,
        "LongText": LongTextEditor,
        "SelectUOM": SelectUOMEditor,
        "PriceRate": PriceRateEditor,
        "PriceQty": PriceQtyEditor
      }
    }
  });

  function TextEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function IntegerEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function DateEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");
      $input.appendTo(args.container);
      $input.focus().select();
      $input.datepicker({
        showOn: "button",
        buttonImageOnly: true,
        buttonImage: "../images/calendar.gif",
        beforeShow: function () {
          calendarOpen = true
        },
        onClose: function () {
          calendarOpen = false
        }
      });
      $input.width($input.width() - 18);
    };

    this.destroy = function () {
      $.datepicker.dpDiv.stop(true, true);
      $input.datepicker("hide");
      $input.datepicker("destroy");
      $input.remove();
    };

    this.show = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).show();
      }
    };

    this.hide = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).hide();
      }
    };

    this.position = function (position) {
      if (!calendarOpen) {
        return;
      }
      $.datepicker.dpDiv
          .css("top", position.top + 30)
          .css("left", position.left);
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function YesNoSelectEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      $select.val((defaultValue = item[args.column.field]) ? "yes" : "no");
      $select.select();
    };

    this.serializeValue = function () {
      return ($select.val() == "yes");
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return ($select.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function CheckboxEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
    };

    this.serializeValue = function () {
      return $select.prop('checked');
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function PercentCompleteEditor(args) {
    var $input, $picker;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-percentcomplete' />");
      $input.width($(args.container).innerWidth() - 25);
      $input.appendTo(args.container);

      $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
      $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

      $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

      $input.focus().select();

      $picker.find(".editor-percentcomplete-slider").slider({
        orientation: "vertical",
        range: "min",
        value: defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value)
        }
      });

      $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
        $input.val($(this).attr("val"));
        $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      })
    };

    this.destroy = function () {
      $input.remove();
      $picker.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
    };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /*
   * An example of a "detached" editor.
   * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
   * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
   */
  function LongTextEditor(args) {
    var $input, $wrapper;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

      $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

      $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button:first").bind("click", this.save);
      $wrapper.find("button:last").bind("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      $wrapper
          .css("top", position.top - 5)
          .css("left", position.left - 5)
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
  
  function SelectUOMEditor(args) {
	    var $select;
	    var defaultValue;
	    var scope = this;
	    var option_str;
	    
	    this.init = function () {

	    	if (args.item.linecode != 100){
	    		option_str = "<option value=''></option>";
	    	};
	    	
	    	// Build Select for UOM
	    	if (args.item.linecodetype == 'D' && args.item.linecode != 100){
	    		// Deficit UOM must match the Deficit Base Line Haul UOM
	    		//Find Deficit Base LineHaul UOM
	    		for (var x=0; x < chrg.length; x++){
	       			if (chrg[x].linecodetype == "D" && chrg[x].linecode == "100" ){
	       				if (chrg[x].propuom != ""){
	       					v = chrg[x].propuom;
	       				} else {
	       					v = chrg[x].rmsuom;
	       				}
	     				option_str += "<OPTION value='" + v + "'>" + v + "</OPTION>";
	    				break;
	    			}
	    		}
	    		
	    	} else {
	    		// Load UOM Select from the Rate Grid Rules using UOM defined for the Line Code
	    		for (i = 0; i < rules.length; i++) { 
	    			if (rules[i].linecode == args.item.linecode && 
	    				rules[i].linecodetype == args.item.linecodetype){
	    				v = rules[i].uom;
	    				option_str += "<OPTION value='" + v + "'>" + v + "</OPTION>";
	    			};
	    		}
	    	}
	        
	    
	        $select = $("<SELECT tabIndex='0' class='editor-select'>" + option_str + "</SELECT>");
	        $select.appendTo(args.container);
	        $select.focus();
	    };

	    this.destroy = function () {
	        $select.remove();
	    };

	    this.focus = function () {
	        $select.focus();
	    };

	    this.loadValue = function (item) {
	        defaultValue = item[args.column.field];
	        $select.val(defaultValue);
	    };
	    this.serializeValue = function () {
	        if (args.column.options) {
	            return $select.val();
	        } else {
	            return ($select.val() == "yes");
	        }
	    };

	    this.applyValue = function (item, state) {
	    	var rule_qtydefault = 0;
        	var rule_ratedecimals = 0;
        	var rule_qtyfield;
        	var rule_qtyline = 0;
        	var rule_extratdiv = 1;
	    	
	        item[args.column.field] = state;
	        
	     // UOM Selected is Blanks - Zero out Priced Quantity and Priced Rate, Reset Extended Amount to RMS Calculated Amount
	        if (item.propuom == ""){
	        	item.proprate = "";
	        	item.propqty = "";
	        	var chargeidx = item.id.slice(7);
	        	// Check Rules for RMSAMOUNT
	        	// Find Rate Grid Rules for Line Code and UOM
		        for (i = 0; i < rules.length; i++) { 
		            if ((rules[i].linecode == item.linecode) && (rules[i].uom == chrg[chargeidx].rmsuom)
		            	&& (rules[i].linecodetype == item.linecodetype)){
		            	rule_qtydefault = rules[i].qtydefault;
		            	rule_ratedecimals = rules[i].ratedecprc;
		            	rule_qtyfield = rules[i].qtysrcfld;
		            	rule_qtyline = rules[i].qtysrcline;
		            	rule_extratdiv = rules[i].extratdiv;
		            	break;
		            }
		         }
		        // Calculate Extended Amount Based on RMS Rate * Extended Amount of Rule Line
	        	if (rule_qtyfield == "RMSAMOUNT"){
	        		// Quantity Source Field and Quantity Source Line Code Determine the Priced Quantity
	        		// Find Line Number in the Chrg Array to Determine the Quantity Value for RMSAmount
	        		for (i = 0; i < chrg.length; i++) { 
	                    if (chrg[i].linecode == rule_qtyline){
	                    	var decimal_mult;
	            	        if (rule_ratedecimals == 0){
	            	        	decimal_mult = 1;
	            	        } else {
	            	        	decimal_mult = Math.pow(10,rule_ratedecimals)
	            	        }
	            	        
	            	        //item.propamt =  (((((chrg[chargeidx].rmsrate * decimal_mult) * chrg[i].propamt)/decimal_mult)/rule_extratdiv).toFixed(2)) ;
	            	        item.propamt =  round((((chrg[chargeidx].rmsrate * decimal_mult) * chrg[i].propamt)/decimal_mult)/rule_extratdiv, 2) ;
	            	       	break;
	                    }
	    	      	}
	                
	        	} else {
	        		item.propamt = chrg[chargeidx].rmsamount;
	        	}
	        	// Reset Lane Type based on Priced Rate Values 
	        	ResetLaneType(item);
	        	// Update Total Extended Amount
	        	updateRateTotal();
	        	return;
	        }; 
	        
	        	
	        // Find Rate Grid Rules for Line Code and UOM
	        for (i = 0; i < rules.length; i++) { 
	            if ((rules[i].linecode == item.linecode) && (rules[i].uom == item.propuom)
	            	&& (rules[i].linecodetype == item.linecodetype)){
	            	rule_qtydefault = rules[i].qtydefault;
	            	rule_ratedecimals = rules[i].ratedecprc;
	            	rule_qtyfield = rules[i].qtysrcfld;
	            	rule_qtyline = rules[i].qtysrcline;
	            	rule_extratdiv = rules[i].extratdiv;
	            	break;
	            };
	         }
	        
	        // Set the Priced Quantity Based on Rules 
	        
	        	// Quantity Source Field is Blanks, Set Priced Quantity to the Default Quantity        
	        if (rule_qtyfield == ""){
	        	item.propqty = rule_qtydefault;
	        } else {
	        	// Quantity Source Line Code is 0, Quantity is Based on the Current Row
	        	if (rule_qtyline == 0){
	        		switch (rule_qtyfield){
	        		case "RMSQTY":
	        			item.propqty = item.rmsqty;
	        			break;
	        		case "RMSAMOUNT":
	        			item.propqty = item.rmsamount;
	        			break;
	           		};
	        	} else {
	        		// Quantity Source Field and Quantity Source Line Code Determine the Priced Quantity
	        		// Find Line Number in the Chrg Array to Determine the Quantity Value
	        		for (i = 0; i < chrg.length; i++) { 
	                    if (chrg[i].linecode == rule_qtyline && chrg[i].linecodetype == item.linecodetype){
	                    	switch (rule_qtyfield){
	    	       			case "RMSQTY":
	    	       				item.propqty = chrg[i].rmsqty;
	    	       				break;
	    	       			case "RMSAMOUNT":
	    	       				item.propqty = chrg[i].propamt;
	    	       				break;
	    	       			};
	    	       		};
	                };
	        	};
	        }
	     
	        
	      
	     // Calculate Extended Amount using the Decimal Precision & Extended Rate Divisor
	        var decimal_mult;
	        if (rule_ratedecimals == 0){
	        	decimal_mult = 1;
	        } else {
	        	decimal_mult = Math.pow(10,rule_ratedecimals)
	        };
	        
	        //item.propamt =  (((((item.proprate * decimal_mult) * item.propqty)/decimal_mult)/rule_extratdiv).toFixed(2)) ;
	        item.propamt = round((((item.proprate * decimal_mult) * item.propqty)/decimal_mult)/ rule_extratdiv, 2);
	        
	     // Recalculate Charges for Grid Rows that are Dependent on this Line Code
	        if (item.linecodetype == 'F'){
	        	ReCalcDependentRows(item.linecode, item.rmsqty, item.propamt);
	        }
			
	     	        
	     // Update Total Extended Amount	      	
			updateRateTotal();
			
			// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
	        if (saveAuthorized == true){
	        	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
	        		$("#saveRates").removeClass("disabled");
	        	}
	        };
	        
			$("#emailButton").addClass("disabled");
	        
	    };


	    this.isValueChanged = function () {
	    	
	        return ($select.val() != defaultValue);
	    };

	    this.validate = function () {
            
         
                return {
                    valid: true,
                    msg: null
                };
                        
	    };

	    this.init();
	}

  function PriceRateEditor(args) {
	    var $input;
		var defaultValue;
	    var fieldValue;
		var protectValue
	    var scope = this;
		
		rebuildGridCharges = false;
		
	    this.init = function () {
			$input = $("<INPUT type=text class='editor-text' />")
	          .appendTo(args.container)
	          .bind("keydown.nav", function (e) {
	            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
	              e.stopImmediatePropagation();
	            }
	          })
			  
	          .focus()
	          .select();
			
	    };

		

	    this.destroy = function () {
	      $input.remove();
	    };

	    this.focus = function () {
	      $input.focus();
	    };

	    this.getValue = function () {
	      return $input.val();
	    };

	    this.setValue = function (val) {
	      $input.val(val);
	    };

	    this.loadValue = function (item) {
	      defaultValue = item[args.column.field] || "";
		  $input[0].defaultValue = defaultValue;
	      $input.select();
	    };

	    this.serializeValue = function () {
	      return $input.val();
	    };

	    this.applyValue = function (item, state) {
	    	// Used to Recalculate Line Haul Base
	    	var baseIdx = 1;  //Default 
	      	var proposedAmount = 0;
	      	var proposedQty = 0;
	      	var rule_ratedecimals = 0;
			var rule_extratdiv = 1;
			var linehaulRateBlankedByUser = false;
			var skipReCalcDependentRows = false;
			
			item[args.column.field] = state;
						    	    
			// Calculate Extended Amount
			switch (item.proprate){
			// Zero Rate
			case 0:
				item.propamt = 0;
				break;
			case "":
			// Blank Rate - Reset Extended Amount to RMS Amount	
				item.propqty = "";
				var chargeidx = item.id.slice(7);
	        	if (item.linecode == "100"){
	        		linehaulRateBlankedByUser = true;
	        		switch (item.linecodetype){
					case "F":
						item.propamt = chrg[chargeidx].rmsamount;
						// Find Deficit Base Linehaul and Reset values to zeros
						for (var x=0; x < chrg.length; x++){
							if (chrg[x].linecodetype == "D" && chrg[x].linecode == "100"){
								chrg[x].propamt = ".00";
								chrg[x].propqty = "0";
								chrg[x].proprate = "0";
								chrg[x].propuom = "";
							}
						}
						retrieveDeficitCharges("DEFICIT", function(){
							rebuildGridCharges = true;
						});
						break;
					case "D":
						item.propamt = ".00";
						// Freight Linehaul is always element 0 - Reset values to zeros
						chrg[0].propamt = chrg[0].rmsamount;
						chrg[0].propqty = "0";
						chrg[0].proprate = "0";
						chrg[0].propuom = "";
//						retrieveDeficitCharges("DEFICIT", function(){
//							ReCalcDependentRows(chrg[0].linecode, chrg[0].rmsqty, chrg[0].propamt, function(){
						
						// Re-Calc Dependent Rows needs to execute before calculation of deficits because the 
						// accessorials in the chrg array that are dependent on the line haul amount need 
						// recalculated before the execution of retrieveDeficitCharges function.
						ReCalcDependentRows(chrg[0].linecode, chrg[0].rmsqty, chrg[0].propamt, function(){
							retrieveDeficitCharges("DEFICIT", function(){
								rebuildGridCharges = true;
							});
						});
						break;
					default:
						break;
	        		}
	        	// Not Linehaul - 100 line code
	        	} else {
	        		// Blank Rate - Reset Extended Amount to RMS Amount	
					item.propqty = "";
					var chargeidx = item.id.slice(7);
					if (item.linecodetype == "F"){
						item.propamt = chrg[chargeidx].rmsamount;
					} else {
						item.propamt = ".00";
					}
	        	}
	        	
	        	break;
			default:
				// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM
	    		for (var i = 0; i < rules.length; i++) { 
	    	    	if ((rules[i].linecode == item.linecode) && (rules[i].uom == item.propuom)
	    	    		&& (rules[i].linecodetype == item.linecodetype)){
	    	    		rule_ratedecimals = rules[i].ratedecprc;
	    	    		rule_extratdiv = rules[i].extratdiv;
	    	    		break;
	    	    	};
	    	    }
        	    // Calculate Decimal Precision Multiplier
        	    var decimal_mult;
    	        if (rule_ratedecimals == 0){
    	        	decimal_mult = 1;
    	        } else {
    	        	decimal_mult = Math.pow(10,rule_ratedecimals)
    	        };
    	        // Calculate Extended Amount using the Decimal Precision Multiplier   	              
    	        //item.propamt = (((((item.proprate * decimal_mult) * item.propqty)/decimal_mult) / rule_extratdiv).toFixed(2));
    	        item.propamt = round((((item.proprate * decimal_mult) * item.propqty)/decimal_mult)/ rule_extratdiv, 2);
    	    };
									
			// Reset Lane Type based on Priced Rate Values 
			ResetLaneType(item);
			
			// Recalculate Line Haul Deficit Base or Priced Linehaul when Not Blanked Out
			if (! linehaulRateBlankedByUser){
				if (item.linecode == "100" ){

					var recalcPCT = false;
					// Check for Accessorials based on Percent of Line Haul
					for (var x=0; x < chrg.length; x++){
						if (chrg[x].linecodetype == "F" && (chrg[x].rmsuom == "PCT" || chrg[x].scaleuom == "PCT")){
							recalcPCT = true;	
						}
						if (chrg[x].linecodetype == "D" && chrg[x].linecode == "100"){
							baseIdx = x;
						}
					}

					switch (item.linecodetype){
					case "F":
						if (recalcPCT){
							// Recalculate Deficit Charges when a Deficit is based on Percent of Line Haul
							// this will also return a newly calculated Deficit Base Line Haul
							skipReCalcDependentRows = true;
							
//							retrieveDeficitCharges("DEFICIT", function(){
//								ReCalcDependentRows(item.linecode, item.rmsqty, item.propamt, function(){
							
							// Re-Calc Dependent Rows needs to execute before calculation of deficits because the 
							// accessorials in the chrg array that are dependent on the line haul amount need 
							// recalculated before the execution of retrieveDeficitCharges function.
							ReCalcDependentRows(item.linecode, item.rmsqty, item.propamt, function(){
								retrieveDeficitCharges("DEFICIT", function(){
									rebuildCharges();
									// Update Total Exteneded Amount	  		      	
									updateRateTotal();
								
								});
							});
						} else {
							// Recalculate Deficit Base Linehaul when Freight Linehaul Price Changes
							proposedAmount = item.propamt;
							if (item.propqty != ""){
								proposedQty = item.propqty;
							} else {
								var chargeidx = item.id.slice(7);
								proposedQty = chrg[chargeidx].rmsqty;
							}
							// Update Deficit Base Line Haul Amount from Priced and return chrg index for Based Line Haul
							baseIdx = updateDeficitBaseLinehaulfromPriced(proposedAmount, proposedQty);
							// Compare UOM for Base and Priced - update if different
							if (item.propuom != chrg[baseIdx].propuom && item.propuom != ""){
								// Convert Deficit UOM
								//var newUOM = item.propuom;
								//- Replaced with call to retrieveDeficitCharges because of rounding issues when converting from MLS to F/R
								//convertDeficitUOM(newUOM, 'F');
								retrieveDeficitCharges("DEFICIT");
								rebuildGridCharges = true
							}
						}

						break;
					case "D":
						// Recalculate Priced Linehaul when Deficit Linehaul Base Changes
						proposedAmount = item.propamt;
						if (item.propqty != ""){
							proposedQty = item.propqty;
						} else {
							var chargeidx = item.id.slice(7);
							proposedQty = chrg[chargeidx].rmsqty;
						}
						updatePricedLinehaulfromDeficitBase(proposedAmount, proposedQty, function(){
							ReCalcDependentRows(chrg[0].linecode, chrg[0].rmsqty, chrg[0].propamt, function(){
							  	retrieveDeficitCharges("BASEPERCENT");
								rebuildGridCharges = true
							});
						});
						skipReCalcDependentRows = true;
						
						// Compare UOM for Base and Priced - update if different
						if (item.propuom != chrg[0].propuom && item.propuom != ""){
							// Convert Deficit UOM
							//- Replaced with call to retrieveDeficitCharges because of rounding issues when converting from MLS to F/R
							//convertDeficitUOM(item.propuom, 'D');
							retrieveDeficitCharges("DEFICIT");
							rebuildGridCharges = true
						}
						
						// Reset Lane Type based on Priced Rate Values 
						ResetLaneType(item);
						break;
					}
				} else {
					// Not 100 Line 
					// Recalulate Deficit Base when a Deficit is Priced
					if (item.linecodetype == 'D'){
						// Recalculate Deficit Base Linehaul when Deficit is Priced
						proposedAmount = chrg[0].propamt;
						if (chrg[0].propqty != ""){
							proposedQty = chrg[0].propqty;
						} else {
							proposedQty = chrg[0].rmsqty;
						}
						updateDeficitBaseLinehaulfromPriced(proposedAmount, proposedQty);
					} else {
						// Freight Code Accessorial Changed - recalc deficits
						retrieveDeficitCharges("DEFICIT");
						rebuildGridCharges = true
					}
				}
			}
			
			
			// Recalculate Charges for Grid Rows that are Dependent on this Line Code
			if (item.linecodetype == "F" && !skipReCalcDependentRows){
				ReCalcDependentRows(item.linecode, item.rmsqty, item.propamt, function(){
					// Detail depending on the LineHaul Changed, then Recalc Deficits
					if (dependentRowsChanged){
						rebuildCharges();
					} else {
						// Rebuild Grid 
						if (rebuildGridCharges == true){
							rebuildCharges();
						}
					}
				});
			} else {
				// Rebuild Grid 
				if (rebuildGridCharges == true){
					rebuildCharges();
				}
			}
			
										
			// Update Total Exteneded Amount	  		      	
			updateRateTotal();
		      	
			// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
		    if (saveAuthorized == true){
                if ( (((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S')) & !pricingAuthErrors){
		      	
		      		$("#saveRates").removeClass("disabled");
		      	}
		    };
		        
			$("#emailButton").addClass("disabled");
			
			
	    };

	    this.isValueChanged = function () {
	    	var activeCellNode = args.container;
			$(activeCellNode).attr("title", "");
			$(activeCellNode).unbind("mouseover mouseout");
	      //return (!($input.val() == "" && fieldValue == null)) && ($input.val() != fieldValue);
		  return $input.val() != defaultValue;
	    };

	    this.validate = function () {
	    	
			var amount = $input.val();
			
			// Rate must be numeric
			if ($.isNumeric(amount)) {
				
				// Priced UOM must be selected 
				if (args.item.propuom == ""){
					var activeCellNode = args.container;
					var errorMessage = "Priced UOM Required with Priced Rate.";
					 $(activeCellNode).on('mouseover mouseout', function(event) {
						if (event.type == 'mouseover') {
							$(activeCellNode).attr("title", errorMessage);
						} else {
							$(activeCellNode).attr("title", "");
						}
					});
					return {
			    		valid: false,
			    		msg: "Priced UOM Required with Priced Rate."
			    	};
				} else {
                    
                    // Validate Linehaul & Fuel Amounts are within Users Authorized Amount
                    if ((args.item.linecode == "100" || args.item.linecode == "150") & quotetype != "I" && args.item.linecodetype == "F"){
                    	
                    	// Use Scale Quantity when calculating extended amount compared to scale on for MLS Unit of Measuer
                    	var qtyToCalcExt = args.item.propqty;
                    	if (args.item.propuom == 'MLS'){
                    		qtyToCalcExt = args.item.scaleqty;
                    	}
                    	
                        // Calculate Extended Amount
                        var extPropAmount = calculateExtendedAmount(args.item.linecode,amount,qtyToCalcExt,args.item.propuom,args.item.linecodetype); 
                        var rateType = "";
                        switch (args.item.linecode){
                            case "100":
                                rateType = "LINEHAUL";
                                break;
                            case "150":
                                rateType = "FUEL";
                                break;
                        }
                        // Check Authorized Amount
                        if (!authorizedRateAmount(quotetype,rateType,extPropAmount)){
                            var activeCellNode = args.container;
                            var errorMessage = "Priced Amount is below scale by an unauthorized amount.  Please contact Pricing at Ext 25375 for immediate help or if after hours email Sales@cfidrive.com.";
                            $(activeCellNode).on('mouseover mouseout', function(event) {
                                if (event.type == 'mouseover') {
                                    $(activeCellNode).attr("title", errorMessage);
                                } else {
                                    $(activeCellNode).attr("title", "");
                                }
                            });
                            $("#saveRates").addClass("disabled");
                            return {
                                valid: false,
                                msg: "Priced Amount is below scale by an unauthorized amount.  Please contact Pricing at Ext 25375 for immediate help or if after hours email Sales@cfidrive.com."
                            };
                        } else {
                            return {
                                valid: true,
                                msg: null
                            }; 
                        }
                        
                        
                    } else {
                    
                    
                        return {
                            valid: true,
                            msg: null
                        };
                    }
				}
                
                
				
			} else {
				if (amount != "") {
					var activeCellNode = args.container;
					var errorMessage = "Priced Rate must be Numeric.";
					 $(activeCellNode).on('mouseover mouseout', function(event) {
						if (event.type == 'mouseover') {
							$(activeCellNode).attr("title", errorMessage);
						} else {
							$(activeCellNode).attr("title", "");
						}
					});
                    $("#saveRates").addClass("disabled");
					return {
                        valid: false,
						msg: "Priced Rate must be Numeric."
					};
				} else {
					args.item.propuom = "";
					return {
			    		valid: true,
			    		msg: null
			    	};
				}
		 	}
			
			
	    	
	    	
	    };

	    this.init();
	  }
  
  
  function PriceQtyEditor(args) {
	    var $input;
		var defaultValue;
	    var fieldValue;
		var protectValue
	    var scope = this;
		
		rebuildGridCharges = false;
		
	    this.init = function () {
			$input = $("<INPUT type=text class='editor-text' />")
	          .appendTo(args.container)
	          .bind("keydown.nav", function (e) {
	            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
	              e.stopImmediatePropagation();
	            }
	          })
			  
	          .focus()
	          .select();
			
	    };

		

	    this.destroy = function () {
	      $input.remove();
	    };

	    this.focus = function () {
	      $input.focus();
	    };

	    this.getValue = function () {
	      return $input.val();
	    };

	    this.setValue = function (val) {
	      $input.val(val);
	    };

	    this.loadValue = function (item) {
	      defaultValue = item[args.column.field] || "";
		  $input[0].defaultValue = defaultValue;
	      $input.select();
	    };

	    this.serializeValue = function () {
	      return $input.val();
	    };

	    this.applyValue = function (item, state) {
	      	
			item[args.column.field] = state;
			
			// Calculate Extended Amount
			switch (item.propqty){
			// Zero Quantity
			case 0:
				item.propamt = 0;
				break;
			case "":
			// Blank Quantity - Reset Extended Amount to RMS Amount	
				item.proprate = "";
				if (item.linecodetype != "D") {
					item.propuom = "";
				}				
				var chargeidx = item.id.slice(7);
	        	item.propamt = chrg[chargeidx].rmsamount;
				break;
			default:
				// Find Rate Grid Decimal Precision Rule and Extended Rate Divisor for Line Code and UOM
				var rule_ratedecimals = 0;
				var rule_extratdiv = 1;
				for (var i = 0; i < rules.length; i++) { 
					if ((rules[i].linecode == item.linecode) && (rules[i].uom == item.propuom)
						&& (rules[i].linecodetype == item.linecodetype)){
						rule_ratedecimals = rules[i].ratedecprc;
						rule_extratdiv = rules[i].extratdiv;
						break;
					};
				}
				// Calculate Decimal Precision Multiplier
				var decimal_mult;
				if (rule_ratedecimals == 0){
					decimal_mult = 1;
				} else {
					decimal_mult = Math.pow(10,rule_ratedecimals)
				};
				// Calculate Extended Amount using the Decimal Precision Multiplier and Extended Rate Divisor   	              
				//item.propamt = (((((item.proprate * decimal_mult) * item.propqty)/decimal_mult)/ rule_extratdiv).toFixed(2)) ;
				item.propamt = round((((item.proprate * decimal_mult) * item.propqty)/decimal_mult)/ rule_extratdiv, 2);
			
				
			};
			
			// Reset Lane Type based on Priced Rate Values 
			ResetLaneType(item);
						
			//NOTE:  Line Haul Recalculation Code does not apply to Quantity Change based on business logic states the user
			//       is not allowed to manually change the quantity of the "100" line haul code.  If business logic changes
			//       the Line Haul Recalculation code needs added here to match the Priced Rate Editor.
			
			// Recalulate Deficit Base when a Deficit is Priced
			if (item.linecodetype == 'D'){
				if (item.linecode != "100"){
					var getRecalculatedDeficits = false;
					// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
					for (var i = 0; i < rules.length; i++) { 
						if ((rules[i].linecode == item.linecode) && (rules[i].uom == item.propuom) 
							&& (rules[i].linecodetype == item.linecodetype)){
							if ((rules[i].updqty == "Y")){ 
								getRecalculatedDeficits = true;
							};
							break;
						}
					}
					if (getRecalculatedDeficits){
						retrieveDeficitCharges("DEFICIT");
						rebuildGridCharges = true;
					} else {
						// Recalculate Deficit Base Linehaul when Deficit is Priced
						proposedAmount = chrg[0].propamt;
						if (chrg[0].propqty != ""){
							proposedQty = chrg[0].propqty;
						} else {
							proposedQty = chrg[0].rmsqty;
						}
						updateDeficitBaseLinehaulfromPriced(proposedAmount, proposedQty);
					}
				}
			}
			
			
			if (item.linecodetype == 'F'){
				ReCalcDependentRows(item.linecode, item.rmsqty, item.propamt);
			}
						
			if (rebuildGridCharges == true){
				rebuildCharges();
			}
			
			// Update Total Exteneded Amount	  		      	
			updateRateTotal();
	      	
			// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
	        if (saveAuthorized == true){
                if ( (((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S')) & !pricingAuthErrors){
	        		$("#saveRates").removeClass("disabled");
	        	}
	        };
	        
			$("#emailButton").addClass("disabled");
	    };

	    this.isValueChanged = function () {
	    	var activeCellNode = args.container;
			$(activeCellNode).attr("title", "");
			$(activeCellNode).unbind("mouseover mouseout");
	      //return (!($input.val() == "" && fieldValue == null)) && ($input.val() != fieldValue);
		  return $input.val() != defaultValue;
	    };

	    this.validate = function () {
	    	
			var amount = $input.val();
			
			// Quantity must be numeric
			if ($.isNumeric(amount)) {
                                
                    return {
                        valid: true,
                        msg: null
                        };
                		
			} else {
				if (amount != "") {
					var activeCellNode = args.container;
					var errorMessage = "Quantity must be Numeric.";
					 $(activeCellNode).on('mouseover mouseout', function(event) {
						if (event.type == 'mouseover') {
							$(activeCellNode).attr("title", errorMessage);
						} else {
							$(activeCellNode).attr("title", "");
						}
					});
					return {
						valid: false,
						msg: "Quantity must be Numeric."
					};
				} else {
					if (args.item.linecodetype != "D") {
						args.item.propuom = "";
					}	
					
					return {
			    		valid: true,
			    		msg: null
			    	};
				}
		 	}
	    	
	    };

	    this.init();
  }
  
  function ReCalcDependentRows(thisLineCode, thisRMSQty, thisPropAmt, callback) {
	  dependentRowsChanged = false;	
	  // Recalculate Proposed Charges for Grid Rows that are Dependent on this Line Code
	  for (var i = 0; i < rules.length; i++) { 
		  if (rules[i].qtysrcline == thisLineCode && rules[i].linecodetype == "F"){

			  // Look for Proposed Charges that match the rule line code and uom that depend on this quantity source line code
			  for (var x = 0; x < chrg.length; x++) { 
				  if ((chrg[x].linecode == rules[i].linecode) && (chrg[x].propuom == rules[i].uom) && 
					  (chrg[x].linecodetype == rules[i].linecodetype)){
					  // Change the Qty of the Dependent Line
					  switch (rules[i].qtysrcfld){
					  case "RMSQTY":
						  chrg[x].propqty = thisRMSQty;
						  break;
					  case "RMSAMOUNT":
						  chrg[x].propqty = thisPropAmt;
						  break;
					  };
					  // Recalculate Extended Amount of Dependent Line
					  if (rules[i].ratedecprc == 0){
						  decimal_mult = 1;
					  } else {
						  decimal_mult = Math.pow(10,rules[i].ratedecprc);
					  };
					  chrg[x].propamt = round((((chrg[x].proprate * decimal_mult) * chrg[x].propqty)/decimal_mult) / rules[i].extratdiv, 2);

					  /*function round(value, decimals) {
						  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
					  }*/

					  dependentRowsChanged = true;
				  }
			  }

			  // Look for RMS Charges that match the rule line code and uom that depend on this quantity source line code
			  var wrkQty = 0;
			  for (var x = 0; x < chrg.length; x++) { 
				  if (chrg[x].linecode == rules[i].linecode && chrg[x].rmsuom == rules[i].uom && chrg[x].propuom == "" &&
					  chrg[x].linecodetype == rules[i].linecodetype){

					  // Determine the Qty Multiplier of the Dependent Line
					  if (chrg[x].rmsuom == rules[i].uom ){
						  switch (rules[i].qtysrcfld){
						  case "RMSQTY":
							  wrkQty = thisRMSQty;
							  break;
						  case "RMSAMOUNT":
							  wrkQty = thisPropAmt;
							  break;
						  };
					  }
					  // Determine Decimal Multiplier to Calculate Extended Amount of Dependent Line
					  if (rules[i].ratedecprc == 0){
						  decimal_mult = 1;
					  } else {
						  decimal_mult = Math.pow(10,rules[i].ratedecprc);
					  }

					  // Calculate Extended Amount for RMS Rate using the Decimal Precision Multiplier
					  //chrg[x].propamt = (((((chrg[x].rmsrate * decimal_mult) * wrkQty)/decimal_mult) / rules[i].extratdiv).toFixed(2));
					  chrg[x].propamt = round((((chrg[x].rmsrate * decimal_mult) * wrkQty)/decimal_mult) / rules[i].extratdiv, 2);

					  dependentRowsChanged = true;
				  }
			  }
		  }
	  }


	  // Rebuild Rate Grid if Rows have changed due to Dependent Lines
	  if (dependentRowsChanged){
		  //rebuildCharges();
		  rebuildGridCharges = true;
	  }

	  if (callback) {
		  callback();
	  }

  }
	  
  
  function ResetLaneType(item) {
    pricingAuthErrors = false;
	// Reset Lane Type Depending on Priced Rate Value
	// Change Lane Type to Proposal from Inquiry when Priced Rate Entered and Enable SPOT Selection
	if (quotetype != 'B' && quotetype != 'R'){
		if ((item.proprate != 0) && (quotetype == 'I' || quotetype == 'P')){
			// Check is User has Authority to Proposal
            if (authorizedQuoteType("P") & Number(chrg[0].proprate) != 0){
                // Check if Priced Amounts are within Users Authority for Proposal
                if (checkQuotePriceDeviations('P')){
                    
                    $(".laneType").val('P');
                    quotetype = $(".laneType option:selected").val();
                    setAuthorizedQuoteTypes(function(){
                        // Disable Inquiry - even if user has authority
                        $(".laneType option:contains('Inquiry')").attr('disabled','disabled');

                        // No Duplicates and Linehaul must have a Proposed amount to change to SPOT
                        // User is Authorized to Spot, then it will be available to select.  
                        // If duplicates exist or proposed linehaul amount is zero then disable the SPOT selection.
                        if (duplicateCount != 0 || chrg[0].proprate == 0){
                            $(".laneType option:contains('Spot')").attr('disabled','disabled');
                        }
                    })
                    setAuthorizedWorkFlow();
                } else {
                    $("#saveRates").addClass("disabled");
                    pricingAuthErrors = true;
                    alert('Quote not changed to a proposal.  Priced rate is below authorized amount.  Please contact Pricing at Ext 5375 for immediate help or if after hours email Sales@cfidrive.com.');
                }
							
			} else {
				// Check if User has Authority to SPOT and No Duplicates and Linehaul Rate Exists
                if (authorizedQuoteType("S") & Number(chrg[0].proprate) != 0){
                    if (duplicateCount == 0){
                        // Check if Priced Amounts are within Users Authority for Spot
                        if (checkQuotePriceDeviations('S')){
                            $(".laneType").val('S');
                            quotetype = $(".laneType option:selected").val();
                            // Disable All Quote Types except Spot
                            disableQuoteTypes(function(){
                                // Disable Inquiry - even if user has authority
                                $(".laneType option:contains('Inquiry')").attr('disabled','disabled');
                                $(".laneType option:contains('Spot')").removeAttr('disabled');
                            })
                            setAuthorizedWorkFlow();

                            // Set Authorized Quote Date Picker and Set Expiration Date
                            var setExpirationDate = true;
                            setAuthorizedQuoteDates('S',setExpirationDate);
                        } else {
                            $("#saveRates").addClass("disabled");
                            pricingAuthErrors = true;
                            alert('Quote not changed to a spot.  Priced rate is below authorized amount.  Please contact Pricing at Ext 5375 for immediate help or if after hours email Sales@cfidrive.com.');   
                        }
                    } else {
                        $("#saveRates").addClass("disabled");
                        pricingAuthErrors = true;
                        alert('Quote not changed to a spot.  Duplicates exist.');       
                    }
				}
			}
		};
		
		
		// Change Proposal Type to Inquiry when All Priced Rates are Zero
		if ((item.proprate == 0 || item.proprate == "") && (quotetype != 'I')){
		 // Check for Priced Rates in Charges Array
			var rateEntered = false;
			for (var x = 0; x < chrg.length; x++) {
				if (chrg[x].proprate != 0 && chrg[x].linecode == "100" && chrg[x].linecodetype == "F"){
					rateEntered = true;
				}
			};
			if (rateEntered == false){
				$(".laneType").val('I');
				quotetype = $(".laneType option:selected").val();
				setAuthorizedQuoteTypes(function(){
					// Disable Proposal and Spot even if user has Authority - Price = 0
					$(".laneType option:contains('Proposal')").attr('disabled','disabled');
					$(".laneType option:contains('Spot')").attr('disabled','disabled');
				})
                								
                //set work flow stats back to 'NEW'
                document.getElementById("workFlowStatus").selectedIndex = 0;
                approvdsts = $("#workFlowStatus option:selected").attr("value");
                setAuthorizedWorkFlow();
			}
		}
	}
	
	
	// Bids or Reviews - Enable "Proposal" and "Spot" Lane Type when Line Haul Amount Exists 
	// No Automatic Quote Type Update for Bids and Reviews
	if (quotetype == 'B' || quotetype == 'R'){
		// Linehaul must have a Proposed amount to change to Proposal or SPOT
		if (item.proprate != 0 && chrg[0].proprate != 0){
			// Check if User is Authorized to Proposal
			if (authorizedQuoteType("P")){
				$(".laneType option:contains('Proposal')").removeAttr('disabled');
			}
			// No Duplicates and Linehaul must have a Proposed amount to change to SPOT
			if (duplicateCount == 0){
				// Check if User is Authorized to Spot
				if (authorizedQuoteType("S")){
					$(".laneType option:contains('Spot')").removeAttr('disabled');
				}
			}
		}
	}
  }
  function updateDeficitBaseLinehaulfromPriced(propAmt, propQty){
	var deficitTotal = 0;
	var dIndex;
	var newDeficitBase = 0;
	var newDeficitBaseRate = 0;
	var pricedAmount = 0;
	var rawAmount = 0;
	
	for (var x=0; x < chrg.length; x++){
		// Total Deficit Code Charges except for Base Linehaul 
		if (chrg[x].linecodetype == "D"){
			if (chrg[x].linecode != "100"){
				// Accumulate Deficit Charges
				rawAmount = chrg[x].propamt;
				if (rawAmount != ""){
					deficitTotal += Number(rawAmount) * 100;
				}
			} else{
				dIndex = x;
			}
		}
	}
	
	pricedAmount = Number(propAmt) * 100;
	rawAmount = pricedAmount - deficitTotal;
	newDeficitBase = (rawAmount/100).toFixed(2);
				
	chrg[dIndex].propamt = newDeficitBase;
	
	// Calculate Deficit Propsed Rate based on New Extended Amount
	if (newDeficitBase != 0){
		newDeficitBaseRate = calculateProposedRate(newDeficitBase, propQty);
	} else{
		newDeficitBaseRate = 0;
	}
	chrg[dIndex].proprate = newDeficitBaseRate;

	rebuildGridCharges = true;
	
	return dIndex;  
  }

  function updatePricedLinehaulfromDeficitBase(propAmt, propQty, callback){
	var baseDeficitLH = 0;
	var deficitTotal = 0;
	var lHIndex = 0;
	var newPricedLH = 0;
	var newPricedLHRate = 0;
	var rawAmount = 0;
	
	for (var x=0; x < chrg.length; x++){
		// Total Deficit Code Charges except for Base Linehaul 
		if (chrg[x].linecodetype == "D"){
			if (chrg[x].linecode != "100"){
				// Accumulate Deficit Charges
				rawAmount = chrg[x].propamt;
				if (rawAmount != ""){
					deficitTotal += Number(rawAmount) * 100;
				}
			}
		}
	}
	
	
	// Line Haul Proposed/Priced Amount = Deficit Line Haul Base + Total Deficit Charges 
	baseDeficitLH = Number(propAmt) * 100;
	rawAmount = baseDeficitLH + deficitTotal;
	newPricedLH = (rawAmount/100).toFixed(2);
	
	// Line Haul 		
	chrg[lHIndex].propamt = newPricedLH;
	
	// Calculate LH Proposed Rate based on New LH Extended Amount
	if (newPricedLH != 0){
		newPricedLHRate = calculateProposedRate(newPricedLH, propQty);
	} else {
		newPricedLHRate = 0;
	}	
	chrg[lHIndex].proprate = newPricedLHRate;
		
	rebuildGridCharges = true;
	
	if(callback){
		callback();
	}
  }
  
  function convertDeficitUOM(newUOM, lineHaulType){
	var qtyToUse;
	if (newUOM == 'MLS'){
		if (chrg[0].propqty != "0" && chrg[0].propqty != "" ){
			qtyToUse = chrg[0].propqty;
		} else {
			qtyToUse = chrg[0].rmsqty;
		}
	} else {
		qtyToUse = 1;
	}
	for (var x=0; x < chrg.length; x++){
		
		if ((lineHaulType == 'D' && chrg[x].linecodetype == 'F' && chrg[x].linecode == '100') ||
			(lineHaulType == 'D' && chrg[x].linecodetype == 'D' && chrg[x].linecode != '100') ||				
		    (lineHaulType == 'F' && chrg[x].linecodetype == 'D')){
			
//			var zeroQty = false;
//			// Determine if Quantity can be Edited according to the Rules for Line Code & UOM
//			if (newUOM == 'MLS'){
//				for (var i = 0; i < rules.length; i++) { 
//					if ((rules[i].linecode == chrg[x].linecode) && (rules[i].linecodetype == chrg[x].linecodetype) 
//							&& (rules[i].uom == 'MLS')){
//						if ((rules[i].updqty == "Y")){ 
//							zeroQty = true;
//						};
//						break;
//					}
//				}
//			}
//		  // Convert to New UOM
//			chrg[x].propuom = newUOM;
//			// Zero when user can manually enter quantity
//			if (zeroQty){
//				chrg[x].propqty = 0;
//				chrg[x].proprate = 0;
//				chrg[x].propamt = .00;
//			} else {
//				chrg[x].propqty = qtyToUse;
//				if (chrg[x].propamt != 0){
//					chrg[x].proprate = calculateProposedRate(chrg[x].propamt, qtyToUse);
//				} else{
//					chrg[x].proprate = 0;
//				}
//			}
			
			// Always change the Priced UOM
			chrg[x].propuom = newUOM;
			
			// Only Modify the Priced Quantity if the field is uneditable by the user.
			rules.forEach(rule => {
				if(chrg[x].linecode == rule.linecode && chrg[x].linecodetype == rule.linecodetype){
					rule.updqty == 'N' ? chrg[x].propqty = qtyToUse : null;
					chrg[x].propamt == 0 
						? chrg[x].proprate = 0 
						: chrg[x].proprate = calculateProposedRate(chrg[x].propamt, qtyToUse); 
				};
			});
		}
	}	
  }
  
  /// Calculate Priced Rate based on Extended Amount
  function calculateProposedRate (propAmt, propQty){
	// Default for Line Haul Rate
    var rule_extratdiv = Number(2);
	var rule_ratedecimals = Number(4);
	var propRate = 0;
    
    // Calculate Priced Rate Amount using the Decimal Precision Multiplier   	              
    propRate = (((propAmt * rule_extratdiv) / propQty) / rule_extratdiv).toFixed(rule_ratedecimals); 

    return propRate;
  }
  
  function round(value, decimals) {
	  var fixValue = value.toFixed(4);   
	  return Number(Math.round(fixValue+'e'+decimals)+'e-'+decimals);
  }


})(jQuery);
