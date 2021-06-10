// JavaScript Document

//------------------------------------------------------------------------------------------------
// Click Events
//------------------------------------------------------------------------------------------------
	function assignClickFunctions() {
		// Hide menus
		$(document).click(function(e){
			if (($(e.target).parents("#matchIndicator").length == 0) && $(e.target).parents("#matchBox").length == 0){
				$("#matchBox").hide();
			}

			if (e.target.className.indexOf('slick-cell') < 0){
				$("#rateInfo").hide();
				$("#deficitInfo").hide();
			}

			if ($(e.target).parents("#contSearchList").length == 0) {
				$("#contSearchList").empty().hide();
			}

			if ($(e.target).parents("#custSearchList").length == 0) {
				$("#custSearchList").empty().hide();
			}

			if ($(e.target).parents("#geoSearchList").length == 0) {
				$("#updGeoSearchList").empty().hide();
			}

			if ($(e.target).parents("#startContSearchList").length == 0) {
				$("#startContSearchList").empty().hide();
			}

			if ($(e.target).parents("#startCustSearchList").length == 0) {
				$("#startCustSearchList").empty().hide();
			}
			
			if ((e.target.id != "attributes") &&
					(e.target.id != "getAccessorials") &&
					$(e.target.id != "accessorialsDropdown") && $(e.target).parents("#accessorialsDropdown").length == 0 &&
					(e.target.id != "getShipCond") && $(e.target.id != "shipCondDropdown") && $(e.target).parents("#shipCondDropdown").length == 0
					&& e.target.className != "deleteLoad" &&
					(e.target.id != "getDeficits") &&
					$(e.target.id != "deficitsDropdown") && $(e.target).parents("#deficitsDropdown").length == 0 ){
				$(".attributesBar").css("display", "none");
				$("#accessorialsDropdown").css("display", "none");
				$("#shipCondDropdown").css("display", "none");
				$("#getShipCond").removeClass("attributesButtonSelected");
				$("#deficitsDropdown").css("display", "none");
				$("#getDeficits").removeClass("attributesButtonSelected");
				if (accessorialsChanged){
					// Set shipCondChanged to False. Function, retrieveMatchedQuotes will already execute.
					if (shipCondChanged){
						shipCondChanged = false;
					}
					// Set deficitsChanged to False. Rating function will handle the changed deficit.
					if (deficitsChanged){
						deficitsChanged = false;
					}
					popGeoArray();
					retrieveRMSRate(function(){
						retrieveMatchedQuotes();
					});
					accessorialsChanged = false;
				}
				if ($("#loadBox").hasClass("invalidField")) {
					$("#loadBox").removeClass("invalidField");
					$("#LoadBox").removeAttr("title");
				};
				if (shipCondChanged){
					retrieveMatchedQuotes();
					shipCondChanged = false;
				}
				if (deficitsChanged){
					retrieveDeficitCharges();
					deficitsChanged = false;
				}

			}

			/*if ((e.target.id != "getAccessorials") && $(e.target.id != "accessorialsDropdown") && $(e.target).parents("#accessorialsDropdown").length == 0) {
				$('#accessorialsDropdown').hide();
				  if (accessorialsChanged){
					  popGeoArray();
					  retrieveRMSRate(function(){
							retrieveMatchedQuotes();
					  });
					  accessorialsChanged = false;
				  }
				  
			}

			if ((e.target.id != "getShipCond") && $(e.target.id != "shipCondDropdown") && $(e.target).parents("#shipCondDropdown").length == 0
					&& e.target.className != "deleteLoad") {
				if ($("#loadBox").hasClass("invalidField")) {
					$("#loadBox").removeClass("invalidField");
					$("#LoadBox").removeAttr("title");
				};
				if (shipCondChanged){
					retrieveMatchedQuotes();
					shipCondChanged = false;
				}
				$("#shipCondDropdown").css("display", "none");
			}
*/
			if ($(e.target).parents("#contactMethodList").length == 0) {
				$(".savePanel").hide("drop", {direction: "down"}, "fast");
			}

		});


		// CUSTOMER NUMBER INPUT/SEARCH
		$("#customerNumber")
			.hover(
				
			)
			.click(function(){
				if ($("#custInfoBox").css("display") != "block"){
					//$("#customerNumberEdit").val($(this).children("span").text());
					$("#customerNumberEdit").val($("#customerName").text());
					//$("#customerNumber").children("span").hide();
					$("#customerName").hide();
					$(this).children("input").show();
					$(this).children("input").focus().select();
					$("#custSearchList").hide().empty();
				}

			});


		$("#customerNumberEdit")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function() {
				//$("#customerNumber").children("span").show();
				$("#customerName").show();
				$("#customerNumber").children("input").hide();
				$("#customerNumberEdit").removeClass("invalidField");
			})
			.bind("keyup", function(e){
				var $selectedLI = $("#custSearchList li.selected");

				switch (e.which){
				// Retrieve Customer Info on Enter
					case 13: //Enter
						e.preventDefault();

						if ($("#custSearchList").css("display") != "none"){
							setCustSelection($(this));
						}

						// Cancel any rating in progress
						if(rmsRateXHR && rmsRateXHR.readyState != 4){
							rmsRateXHR.abort();
						}

						var customerNumber = $("#customerNumberEdit").val();
						retrieveCUST($(this).val(), function(){
							$("#customerNumber").children("input").hide();
							//$("#customerNumber").children("span").show();
							$("#customerName").show();

							// Rerate if rate grid has already been populated
							if ($("#rateBlock").css("visibility") == "visible"){
								// Don't allow rerate if rating in progress
								if(!rmsRateXHR || rmsRateXHR.readyState == 0 || rmsRateXHR.readyState == 4){
									popGeoArray();
									retrieveRMSRate(function(){
										retrieveMatchedQuotes();
									});
								}
							}
						});

						break;

					case 27: // clear on Esc
						e.preventDefault();
						$("#customerNumber").click();
						break;

					case 38: //Up arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#custSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
								}
							}
						}
						break;
					case 40: //Down arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#custSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
								}
							}
						} else {
							$("#custSearchList li").first().addClass("selected");
						}
						break;
					default: //All character keys not mentioned above
						var $custTextBox = $(this);
						var searchString = escape($custTextBox.val());
						searchCustomer($custTextBox, $("#custSearchList"), function(){
							// Cancel any rating in progress
							if(rmsRateXHR && rmsRateXHR.readyState != 4){
								rmsRateXHR.abort();
							}
							// Customer Number has Changed - Load Primary Customer Contact
							getPrimaryCustContact = true;

							var customerNumber = $("#customerNumberEdit").val();
							retrieveCUST($custTextBox.val(), function(){
								$("#customerNumber").children("input").hide();
								$("#customerNumber").children("span").show();

								// Rerate if rate grid has already been populated
								if ($("#rateBlock").css("visibility") == "visible"){
									// Don't allow rerate if rating in progress
									if(!rmsRateXHR || rmsRateXHR.readyState == 0 || rmsRateXHR.readyState == 4){
										popGeoArray();
										retrieveRMSRate(function(){
											retrieveMatchedQuotes();
										});
									}
								}
							});
						});

						break;
				}
			});

		$("#startCustEntry")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function() {
			})
			.bind("keyup", function(e){
				var $selectedLI = $("#startCustSearchList li.selected");

				switch (e.which){
				// Retrieve Customer Info on Enter
					case 13: //Enter
						e.preventDefault();
						if ($selectedLI.length != 0){
							setCustSelection($(this), $selectedLI);
						}

						// Cancel any rating in progress
						if(rmsRateXHR && rmsRateXHR.readyState != 4){
							rmsRateXHR.abort();
						}

						var customerNumber = $(this).val();
						$("#startCustEntry").removeClass("invalidField");
						$("#customerNumberEdit").removeClass("invalidField");
						retrieveCUST($("#startCustEntry").val(), function(){
							if ($("#customerNumberEdit").hasClass("invalidField")){
								$("#startCustEntry").addClass("invalidField");
							} else {
								$("#startForm").fadeOut("fast", function(){
									$("#logo").switchClass("splashPosition", "cornerPosition", "fast", function(){
										$("#customerBlock").css("visibility","visible");
										$("#contactBlock").css("visibility","visible");
										$("#proposalMenu").css("display", "block");
                                        $("#tabs").css("display", "inline-block");
                                        $("#analyticsSection").css("display", "inline-block");

                                        $("#helpButton").fadeIn();
									});
								});
							}
						});

						break;

					case 27: // clear on Esc
						e.preventDefault();
						$(this).val("");
						$(this).focus();
						$("#startCustSearchList").hide().empty();
						break;

					case 38: //Up arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#startCustSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
								}
							}
						}
						break;
					case 40: //Down arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#startCustSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
								}
							}
						} else {
							$("#startCustSearchList li").first().addClass("selected");
						}
						break;
					default: //All character keys not mentioned above
						var $custTextBox = $(this);
						var searchString = escape($custTextBox.val());
						searchCustomer($custTextBox, $("#startCustSearchList"), function(){
							// Cancel any rating in progress
							if(rmsRateXHR && rmsRateXHR.readyState != 4){
								rmsRateXHR.abort();
							}
							// Customer Number has Changed - Load Primary Customer Contact
							getPrimaryCustContact = true;

							var customerNumber = $("#startCustEntry").val();
							$("#startForm").fadeOut("fast", function(){
								$("#logo").switchClass("splashPosition", "cornerPosition", "fast", function(){
									retrieveCUST($("#startCustEntry").val(), function(){
										$("#customerBlock").css("visibility","visible");
										$("#contactBlock").css("visibility","visible");
										$("#proposalMenu").css("display", "block");
									});

                                    $("#helpButton").fadeIn();
								});
							});
						});

						break;
				}
			});



		$("#contInfoIcon")
		.click(function(){
			$("#contInfoBox").toggle();
		});

        $("#custMileageSourceCode").click(function(){
            window.open("msrcusmnt.pgm?PR="+cusprefix+"&BA="+cusbase+"&SU="+cussuffix+"&start=options");
        });

		// Set FancyBox click for help
		$("#helpButton").fancybox({
			beforeShow: function() {
        		this.wrap.draggable();
    		},
			helpers: {
				overlay: false
			}
		});

        // Set FancyBox click for help
        $("#authButton").fancybox({
            beforeShow: function() {
                this.wrap.draggable();

                $("#authGroup" + ds_Auth.authorityLevel).css("display", "block");
            },
            helpers: {
                overlay: false
            }
        });

		// Contact Name Input/Search
		$(".contactNameLabel")
			/*.hover(
				function(){
					$(".contactNameEditIcon").css("visibility", "visible");
				},
				function(){
					$(".contactNameEditIcon").css("visibility", "hidden");
				}
			)*/
			.click(function(){
				$("#contactNameEdit").val($(this).text());
				$("#contactName").children("span").hide();
				$("#contactNameEdit").show();
				$("#contactNameEdit").focus().select();
				$("#contSearchList").hide().empty();

			});


		$("#contactNameEdit")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function() {
				$("#contactName").children("span").show();
				$("#contactName").children("input").hide();
				$("#contactNameEdit").removeClass("invalidField");
			})
			.bind("keyup", function(e){
				var $selectedLI = $("#contSearchList li.selected");

				switch (e.which){
				// Retrieve Contact Info on Enter
					case 13: //Enter
						e.preventDefault();

						if ($("#contSearchList").css("display") != "none" &&
								$("#contSearchList > li.selected").length != 0){
							setContSelection($(this));

							var contactName = $("#contactNameEdit").val();
							$('.contactNameLabel').html(contactName);
							$("#contactName").children("input").hide();
							$("#contactName").children("span").show();

							// Activate Save only when user is Authorized
							if (saveAuthorized == true){
								$("#saveRates").removeClass("disabled");
							};
							$("#emailButton").addClass("disabled");

						};
						break;

					case 27: // clear on Esc
						e.preventDefault();
						$("#contactName").click();
						break;

					case 38: //Up arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#contSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
								}
							}
						}
						break;
					case 40: //Down arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#contSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
								}
							}
						} else {
							$("#contSearchList li").first().addClass("selected");
						}
						break;
					default: //All character keys not mentioned above
						var $contTextBox = $(this);
						var searchString = escape($contTextBox.val());
						searchContacts($contTextBox, $("#contSearchList"), function(){
							var contactName = $("#contactNameEdit").val();
							$('.contactNameLabel').html(contactName);
							$("#contactName").children("input").hide();
							$("#contactName").children("span").show();
						});

						break;
				}
			});


		$("#startContactEntry")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function() {
			})
			.bind("keyup", function(e){
				var $selectedLI = $("#startContSearchList li.selected");

				switch (e.which){
				// Retrieve Contact Info on Enter
					case 13: //Enter
						e.preventDefault();

						if ($("#startContSearchList").css("display") != "none" &&
								$selectedLI.length != 0){
							setContSelection($(this), $selectedLI);

							var contactName = $(this).val();
							$('.contactNameLabel').html(contactName);

							$("#startForm").fadeOut("fast", function(){
								$("#logo").switchClass("splashPosition", "cornerPosition", "fast", function(){
									$("#customerBlock").css("visibility","visible");
									$("#contactBlock").css("visibility","visible");

                                    $("#helpButton").fadeIn();
								});
							});
						};
						break;

					case 27: // clear on Esc
						e.preventDefault();
						$(this).val("");
						$(this).focus();
						$("#startContSearchList").hide().empty();
						break;

					case 38: //Up arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.prev().length > 0){
								$selectedLI = $selectedLI.prev();
								$("#startContSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() - $selectedLI.innerHeight());
								}
							}
						}
						break;
					case 40: //Down arrow
						if ($selectedLI.length > 0){
							if ($selectedLI.next().length > 0){
								$selectedLI = $selectedLI.next();
								$("#startContSearchList li").removeClass("selected");
								$selectedLI.addClass("selected");

								if (!isElementInViewport($selectedLI)){
									$selectedLI.parent().scrollTop(
										$selectedLI.parent().scrollTop() + $selectedLI.innerHeight());
								}
							}
						} else {
							$("#startContSearchList li").first().addClass("selected");
						}
						break;
					default: //All character keys not mentioned above
						var $contTextBox = $(this);
						var searchString = escape($contTextBox.val());

						searchContacts($contTextBox, $("#startContSearchList"), function(){
							// click Events for selection
							var contactName = $("#startContactEntry").val();
							$('.contactNameLabel').html(contactName);

							$("#startForm").fadeOut("fast", function(){
								$("#logo").switchClass("splashPosition", "cornerPosition", "fast", function(){
									$("#customerBlock").css("visibility","visible");
									$("#contactBlock").css("visibility","visible");

                                    $("#helpButton").fadeIn();
								});
							});
						});

						break;
				}
			});



		// Lane Type Select Box
		$(".laneType").change(function (e) {
			var new_quotetype = $(".laneType option:selected").val();

			// Check if Priced Amounts are within Users Authority for this Quote Type
			var authorizedPrice;
			if (new_quotetype != 'I' & chrg.length != 0){
				authorizedPrice = true;
				if (! checkQuotePriceDeviations(new_quotetype)){
					authorizedPrice = false;
				}
			} else {
				authorizedPrice = true;
			}
            if (authorizedPrice){
            	quotetype = new_quotetype;
				// Activate Save only when user is Authorized
			    if (saveAuthorized == true){
			    	$("#saveRates").removeClass("disabled");
			    };
				$("#emailButton").addClass("disabled");

	            // if User is not authorized to select the Current WorkFlow Status for this lane type, reset to NEW
	            if(!authorizedWorkFlowStatus(quotetype,approvdsts)){
	                $("#workFlowStatus").val("");
	                approvdsts = "";
	            }
	            // Set Available Work Flow Selections based on Authority
	            setAuthorizedWorkFlow();

				// if the lane type is spot and expiration date is 90 days after effective
				// date then set expiration date to 7 days after effective
				if (this.value == "S") {
					// Set Authorized Effective Dates
					var setExpirationDate = true;
					setAuthorizedQuoteDates(quotetype,setExpirationDate);
				}
            } else {
                alert('Quote not changed to selected type.  Priced rate is below authorized amount.  Please contact Pricing at Ext 5375 for immediate help or if after hours email Sales@cfidrive.com.');
            }
		});

        //work flow status Select Box
        $("#workFlowStatus").change(function (e) {
            approvdsts = $("#workFlowStatus option:selected").attr("value");
			// Activate Save only when user is Authorized
		    if (saveAuthorized == true){
		    	$("#saveRates").removeClass("disabled");
		    };
			$("#emailButton").addClass("disabled");
        });

      //Sales Users
        $("#salesUser").change(function (e) {

            for (i = 0; i < quoteLaneUsers.length; i++){
    			if (quoteLaneUsers[i].usertype == "SALES"){
    				quoteLaneUsers[i].userprofile = $("#salesUser option:selected").attr("value");
    			}
    		}

			// Activate Save only when user is Authorized
		    if (saveAuthorized == true){
		    	$("#saveRates").removeClass("disabled");
		    };
			$("#emailButton").addClass("disabled");
        });

      //Publish Users
        $("#publishUser").change(function (e) {

            for (i = 0; i < quoteLaneUsers.length; i++){
    			if (quoteLaneUsers[i].usertype == "PUBLISH"){
    				quoteLaneUsers[i].userprofile = $("#purlishUser option:selected").attr("value");
    			}
    		}

			// Activate Save only when user is Authorized
		    if (saveAuthorized == true){
		    	$("#saveRates").removeClass("disabled");
		    };
			$("#emailButton").addClass("disabled");
        });

      //Pricing Users
        $("#priceUser").change(function (e) {

            for (i = 0; i < quoteLaneUsers.length; i++){
    			if (quoteLaneUsers[i].usertype == "PRICING"){
    				quoteLaneUsers[i].userprofile = $("#priceUser option:selected").attr("value");
    			}
    		}

			// Activate Save only when user is Authorized
		    if (saveAuthorized == true){
		    	$("#saveRates").removeClass("disabled");
		    };
			$("#emailButton").addClass("disabled");
        });



		// Method of Contact Select Box
		$(".contMethod").change(function (e) {
			idpqcontme = $(".contMethod option:selected").val();
			// Activate Save only when user is Authorized and Method Selected
		    if (saveAuthorized == true && idpqcontme != 0){
		    	$("#saveRates").removeClass("disabled");
		    } else {
		    	$("#saveRates").addClass("disabled");
		    };

			$("#emailButton").addClass("disabled");
		});

		// Minimum Charge Proposed Amount
		$("#minChrgPricedRateSpan").click(function(){
			$(this).hide();
			$("#minChrgPricedRateAmt").val($(this).html()).show().focus().select();
		});


		$("#minChrgPricedRateAmt")
			.bind("keyup", function(e){
				switch (e.which){
						// Retrieve Contact Info on Enter
					case 13: //Enter
						e.preventDefault();

						// Clear Invalid Fields
						if ($("#minChrgPricedRateAmt").hasClass("invalidField")) {
							$("#minChrgPricedRateAmt").removeClass("invalidField");
							$("#minChrgPricedRateAmt").removeAttr("title");
						}
						var minChargePricedRate = $("#minChrgPricedRateAmt").val();
						if ( minChargePricedRate != "" ){
							if (! $.isNumeric(minChargePricedRate)){
								$("#minChrgPricedRateAmt").addClass("invalidField");
								$("#minChrgPricedRateAmt").attr("title", "Priced Minimum Charge Rate must be Numeric.");
							} else {
								// Activate Save only when user is Authorized and Method Selected
								if (saveAuthorized == true){
									$(this).hide();

									var rateFormatted = numeral(parseFloat($(this).val())).format('0.00');

									$("#minChrgPricedRateSpan").html(rateFormatted).show();
									$("#saveRates").removeClass("disabled");
								} else {
									$("#saveRates").addClass("disabled");
								}

								$("#emailButton").addClass("disabled");
							}
						}

						break;

					case 27: // clear on Esc
						e.preventDefault();
						$(this).blur();

						break;

					default:
						break;
				}
			})
			.blur(function(){
				$(this).hide();
				$("#minChrgPricedRateSpan").css("display", "block");

				$(this).val($("#minChrgPriceRateSpan").html());
			});

		// GEOGRAPHY SEARCH BOX
		$("#geoEntry").bind("keyup", function(e){
			var $selectedLI = $("#geoSearchList li.selected");

			switch (e.which) {
				case 13: //Enter
					geoSearch($selectedLI);
					if ($selectedLI.attr("pointsrc") == "CL"){
						updateGeoCount($selectedLI);
					}
					break;
				case 27: //Escape
					$("#geoEntry").val("");
					$("#geoSearchList").hide().empty();
					if ($("#closeGeoEntry").css("display") != "none"){
						$("#closeGeoEntry").click();
					}

					break;

				case 38:
					//alert('up');
					if ($selectedLI.length > 0){
						if ($selectedLI.prev().length > 0){
							$selectedLI = $selectedLI.prev();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					}

					break;


				case 40:
					//alert('down');
					if ($selectedLI.length > 0){
						if ($selectedLI.next().length > 0){
							$selectedLI = $selectedLI.next();
							$("#geoSearchList li").removeClass("selected");
							$selectedLI.addClass("selected");
						}
					} else {
						$("#geoSearchList li").first().addClass("selected");
					}

					break;

				default:
					var searchString = escape($(this).val());
					searchGeography(searchString, $("#geoSearchList"), $(this));

					break;
			}
		});

		$("#geoEntry").blur(function(){
			
		});

		$("#closeGeoEntry").click(function(){
			if ($("#entryBox").css("display") != "none"){
				$("#entryBox").animate({
					height: "toggle",
					opacity: "toggle"
				}, "fast");
			}

			$(".stopPanel").hide("drop", {direction: "up"}, "fast");
			$("#geoSearchList").hide().empty();
		});

		// BORDER SELECT
		$("#borderSelect")
			.bind("keyup", function(e){
				var $selectedLI = $("#geoSearchList li.selected");

				switch (e.which) {
					case 27: //Escape
						if ($("#closeGeoEntry").css("display") != "none"){
							$("#closeGeoEntry").click();
						}

						break;
				}
			})
			.change(function(){
				$selectedBorder = $("#borderSelect option:selected");

				if ($("#destTag").hasClass("pos3") && !$('#entryBox').is(':animated')){
					$("#entryBox").animate({
						height: "toggle",
						opacity: "toggle"
					}, "fast", function(){
						$("#borderSelect").hide();
						$("#entryBox .searchBox").show();
						searchFor = "stop";
						$("#geoEntryLabel").html("Enter a Stop");
					});
				} else {
					$("#geoEntryLabel").fadeOut(300, function(){
						$("#borderSelect").hide();
						$("#entryBox .searchBox").show();
						$("#geoEntry").focus();
						searchFor = "dest";
						$("#geoEntryLabel").html("Enter a Destination");
						$("#geoEntryLabel").fadeIn(300);
					});
				}

				var borderBox = $(this).attr("changing");
				$("#" + borderBox).attr("cityid", $(this).val());

				$("#" + borderBox + " .label").html($selectedBorder.text());

				// Update global
				var laneLayoutBorderPoint = laneLayout[$("#laneMap > div").index($("#" + borderBox))].points[0];

				laneLayoutBorderPoint.cityname = $selectedBorder.attr("cityname");
				laneLayoutBorderPoint.idcity = $selectedBorder.val();
				laneLayoutBorderPoint.state = $selectedBorder.attr("state");
				laneLayoutBorderPoint.idzip = $selectedBorder.attr("idzip");
				laneLayoutBorderPoint.zipcode = $selectedBorder.attr("zipcode");

				popGeoArray();
				retrieveRMSRate(function(){
					retrieveMatchedQuotes();
				});

			});

		// ORIGIN TAG
		$("#originTag").click(function(){
			if ($(this).parents(".disabled").length) {
				return false;
			}

			$(".stopPanel").hide("drop", {direction: "up"}, "fast");
			laneSectionTarget = 0;

			if ($("#entryBox").css("display") != "none"){
				$("#geoEntryLabel").fadeOut(400, function(){
					$("#borderSelect").hide();
					$("#entryBox .searchBox").show();
					searchFor = "origin";
					$("#geoEntryLabel").html("Enter an Origin");
					$("#geoEntryLabel").fadeIn(400);
					$("#geoEntry").focus();
				});
			} else {
				$("#borderSelect").hide();
				$("#entryBox .searchBox").show();
				searchFor = "origin";
				$("#geoEntryLabel").html("Enter an Origin");

				$("#entryBox").animate({
					height: "toggle",
					opacity: "toggle"
				}, "fast", function(){
					$("#geoEntry").focus();
				});
			}
		});

		$("#originLabel").click(function(){
			$("#originTag").click();
		});

		// DESTINATION TAG
		$("#destTag").click(function(){
			if ($(this).parents(".disabled").length) {
				return false;
			}

			$(".stopPanel").hide("drop", {direction: "up"}, "fast");
			laneSectionTarget = $("#laneMap > div").index($(this));

			if ($("#entryBox").css("display") != "none"){
				$("#geoEntryLabel").fadeOut(400, function(){
					$("#borderSelect").hide();
					$("#entryBox .searchBox").show();
					searchFor = "dest";
					$("#geoEntryLabel").html("Enter a Destination");
					$("#geoEntryLabel").fadeIn(400);
					$("#geoEntry").focus();
				});
			} else {
				$("#borderSelect").hide();
				$("#entryBox .searchBox").show();
				searchFor = "dest";
				$("#geoEntryLabel").html("Enter a Destination");
				$("#geoEntry").focus();
				$("#entryBox").animate({
					height: "toggle",
					opacity: "toggle"
				}, "fast", function(){
					$("#geoEntry").focus();
				});
			}
		});

		$("#destLabel").click(function(){
			$("#destTag").click();
		});

		// TEMP TAG - FOR ENTERING STOPS
		$("#tempTag").click(function(){
			if ($(this).parents(".disabled").length) {
				return false;
			}

			searchFor = "stop";
			laneSectionTarget = 1;

			$("#geoEntryLabel").html("Enter a Stop");

			if ($("#entryBox").css("display") == "none"){
				$("#entryBox").animate({
					height: "toggle",
					opacity: "toggle"
				}, "fast", function(){
					$("#geoEntry").focus();
				});
			}
		});

		// Display Matched Quotes List
		$("#matchIndicator").click(function(){
			if ($("#matchBox").css("display") == "none"){
				$("#matchBox").show();
				matchTable.columns.adjust().draw();

			} else {
				$("#matchBox").hide();
			}
		});

		// GET RATES BUTTON //
		$("#getRates").click(function(){
			// Don't allow rating without Origin and Dest
			if (laneLayout.length > 1){
				// Don't allow rerate if rating in progress
				if(!rmsRateXHR || rmsRateXHR.readyState == 0 || rmsRateXHR.readyState == 4){
					popGeoArray();
					retrieveRMSRate(function(){
						//retrieveStats();
						retrieveMatchedQuotes();

						var retrievalType;
						var proposal = getURLParm('quotenum');
						if (proposal.search(".xml") != -1 && geo.length > 1){
							retrievalType = "GET";
						} else {
							retirevalType = "CALC";
						}
                        retrieveAnalytics(retrievalType,function(){
                        	buildAnalytics();


                        });

					});

				}
			}
		});

		// SAVE BUTTON //
		$("#saveRates").click(function (e) {
		    // Don't allow save if rating in progress
		    if (!rmsRateXHR || rmsRateXHR.readyState == 0 || rmsRateXHR.readyState == 4) {
		        if (!$(this).hasClass("disabled") && !$(this).hasClass("lockDisable")) {

		            if (validateDates()) {
		                if (validateContMethod(e)) {
		                    if (authorizedWorkFlowStatus_change(quotetype, approvdsts)) {

		                        // Deactivate Save
		                        $("#saveRates").addClass("disabled");

		                        // display "Saving..." message
		                        $("#propMessageSpinner").css("display", "inline-block");
		                        $("#propMessage > span").html("Saving...");
		                        $("#propMessage").css("display", "inline-block");

		                        popGeoArray();
		                        checkLoads = true;

		                        if (importMode) {
		                            saveImport();
		                        } else {
		                            saveProposal();
		                        }

		                        // Disable Lane Type Selections when Quote is "SPOT"
		                        if (quotetype == "S") {
		                            disableQuoteTypes(); // Disables All Quote Types Except Inquiry
		                            $(".laneType option:contains('Inquiry')").attr('disabled', 'disabled');
		                            //$(".laneType option:contains('Proposal')").attr('disabled','disabled');
		                            //$(".laneType option:contains('Bid')").attr('disabled','disabled');
		                            //$(".laneType option:contains('Review')").attr('disabled','disabled');
		                            $(".laneType option:contains('Spot')").removeAttr('disabled');
		                        }
		                    } else {
		                        alert("Not authorized to save quote due to quote type and/or current work flow status")
		                    }
		                }

		            } else {
		                alert("Invalid date");
		            }
		        }
		    }
		});
		// Display Attributes DropDown - attributes
		$("#attributes").click(function(){
			if ($('.attributesBar').css("display")=="none") {
				accessorialsChanged = false;
				shipCondChanged = false;
				deficitsChanged = false;
				$(".attributesBar").css("display", "block");
				$("#shipCondDropdown").css("display", "none");
				$("#deficitsDropdown").css("display", "none");
				$("#getAccessorials" ).click();

			} else {
				$(".attributesBar").css("display", "none");
				$("#shipCondDropdown").css("display", "none");
				$("#getShipCond").removeClass("attributesButtonSelected");
				$("#deficitsDropdown").css("display", "none");
				$("#getDeficits").removeClass("attributesButtonSelected");
				$('#accessorialsDropdown').css("display", "none");
				if (accessorialsChanged){
					// Set shipCondChanged to False. Function, retrieveMatchedQuotes will already be executed.
					if (shipCondChanged){
						shipCondChanged = false;
					}
					// Set deficitsChanged to False. Rating function will handle the changed deficit.
					if (deficitsChanged){
						deficitsChanged = false;
					}
					popGeoArray();
					retrieveRMSRate(function(){
						retrieveMatchedQuotes();
					});
					accessorialsChanged = false;
				}
				if ($("#loadBox").hasClass("invalidField")) {
					$("#loadBox").removeClass("invalidField");
					$("#LoadBox").removeAttr("title");
				};
				if (shipCondChanged){
					retrieveMatchedQuotes();
					shipCondChanged = false;
				}
				if (deficitsChanged){
					retrieveDeficitCharges();
					deficitsChanged = false;
				}
			}
		});
		// GET ACCESSORORIALS BUTTON  //
	    $("#getAccessorials").click(function(){
	      if ($('#accessorialsDropdown').css("display")=="none") {
	    	  if ($('#shipCondDropdown').css("display")=="block") {
	    		  $("#shipCondDropdown").css("display", "none");
	    		  $("#getShipCond").removeClass("attributesButtonSelected");
	    	  }
	    	  if ($('#deficitsDropdown').css("display")=="block") {
	    		  $("#deficitsDropdown").css("display", "none");
	    		  $("#getDeficits").removeClass("attributesButtonSelected");
	    	  }
	          retrieveAccessorials();
			  $("#accessorials input:first").focus();
			  $("#getAccessorials").addClass("attributesButtonSelected");
	      //} else {
	    	  // Code removed due to attributes handeling this
	          /*$('#accessorialsDropdown').hide();
			  if (accessorialsChanged){
				  popGeoArray();
				  retrieveRMSRate(function(){
						retrieveMatchedQuotes();
				  });
				  accessorialsChanged = false;
			  }*/
	      }
	    });

	 // GET Shipment Conditions Button  //
	    $("#getShipCond").click(function(){
	      if ($('#shipCondDropdown').css("display")=="none") {
	    	  if ($('#accessorialsDropdown').css("display")=="block") {
	    		  $('#accessorialsDropdown').css("display", "none");
	    		  $("#getAccessorials").removeClass("attributesButtonSelected");
	    	  }
	    	  if ($('#deficitsDropdown').css("display")=="block") {
	    		  $("#deficitsDropdown").css("display", "none");
	    		  $("#getDeficits").removeClass("attributesButtonSelected");
	    	  }
	    	  buildShipCondList();
			  $("#dayOfWeekList input:first").focus();
			  $("#getShipCond").addClass("attributesButtonSelected");
//	      } else {
	    	// Code removed due to attributes handeling this
//	    	  $("#shipCondDropdown").css("display", "none");
//	    	  if (shipCondChanged){
//	    		  retrieveMatchedQuotes();
//	    		  shipCondChanged = false;
//	    	  }

	      }
	    });
	    
	 // GET DEFICITS BUTTON  //
	    $("#getDeficits").click(function(){
	    	if ($('#deficitsDropdown').css("display")=="none") {
	    		if ($('#shipCondDropdown').css("display")=="block") {
	    			$("#shipCondDropdown").css("display", "none");
	    			$("#getShipCond").removeClass("attributesButtonSelected");
	    		}
	    		if ($('#accessorialsDropdown').css("display")=="block") {
	    			$("#accessorialsDropdown").css("display", "none");
	    			$("#getAccessorials").removeClass("attributesButtonSelected");
	    		}
	    		buildDeficitCodeDropDown()
	    		$("#deficits input:first").focus();
	    		$("#getDeficits").addClass("attributesButtonSelected");
	    	}
	    });
	    
	    // View Deficits in Rate Grid
	    $("#viewDeficitDetails").click(function(){
	    	if ($("#viewDeficitDetails").hasClass("viewingDeficits")){
	    		$("#viewDeficitDetails").removeClass("viewingDeficits");
	    		viewDeficits = false;
	    		rebuildCharges();
	    	} else {
	    		$("#viewDeficitDetails").addClass("viewingDeficits");
	    		viewDeficits = true;
	    		rebuildCharges();
	    	}
	    });
	    

		// date validation
		$(".dateEntry input")
			.change(function(){
				if ($(this).val() == '') {
					if ($(this).hasClass('effectiveDate')){
						$("#effectiveDate").datepicker("setDate", "0");
						// get the dates from the textboxes
						var efDate = new moment($("#effectiveDate").val(), "MM-DD-YYYY");
						// set global variable
						effdate = efDate.format("YYYY-MM-DD");
					}
					if ($(this).hasClass('')){
						$("#expirationDate").datepicker("setDate", "+45");
						var exDate = new moment($("#expirationDate").val(), "MM-DD-YYYY");
						expdate = exDate.format("YYYY-MM-DD");
					}
					if ($(this).hasClass('updeffectiveDate')){
						updeffectiveDate = '0001-01-01';
						// clear if previously invalid
						if ($("#updeffectiveDate").hasClass("invalidDate")) {
							$("#updeffectiveDate").removeClass("invalidDate");
							$("#updeffectiveDate").removeAttr("title");
						}
					}
					if ($(this).hasClass('updexpireDate')){
						// clear if previously invalid
						updexpireDate = '0001-01-01';
						if ($("#updexpireDate").hasClass("invalidDate")) {
							$("#updexpireDate").removeClass("invalidDate");
							$("#updexpireDate").removeAttr("title");
						}
					}
				} else {
					if ( ($(this).hasClass('effectiveDate')) || ( $(this).hasClass('expirationDate')) ){
						//validateDates();
						if (validateDates()){
							if (laneLayout.length > 1){
								// Find Matching Proposals
								retrieveMatchedQuotes();
							}

							// if the quote has an origin and destination then allow save
							if (geo.length >= 2) {
								$("#emailButton").removeClass("enabled");

								// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
						        if (saveAuthorized == true){
						        	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
						        		$("#saveRates").removeClass("disabled");
						        	}
						        };
						     // Enable SPOT Type when No Duplicates Exist
						        if ((duplicateCount == 0) && (quotetype == 'P')){
                                    // Only Disable Spot selection when user is authorized to SPOT.
                                    // Disable SPOT only when user is authorized
                                    if (authorizedQuoteType("S")){
                                        $(".laneType option:contains('Spot')").removeAttr('disabled');
                                    }
						        };
								$("#emailButton").addClass("disabled");
							}
						}
					} else {
						if ( ($(this).hasClass('updeffectiveDate')) || ($(this).hasClass('updexpireDate')) ){
							validateUpdDates();
						}

					}
				}
			})
			.bind("keyup", function(e){
				if (e.which === 13) {
					$(".dateEntry input").trigger("blur");
				}
		});

		// new customer button
		$("#newButton").click( function (e) {
			var newOK = true;

			$("#emailButton").addClass("disabled");

			if (!$("#saveRates").hasClass("disabled")) { // proposal needs saved

				// create the save dialog div
				var custNum = $("#customerNumber").text().trim();
				$("body").append("<div id=\"saveDialog\" style=\"display: none\">" +
						"Do you want to save changes to this quote?</div");

				// make the save dialog div a jQuery Dialog object
				$("#saveDialog").dialog({
					title: "Save Quote",
					buttons: {
						"Save": function () {
							// Cancel any rating in progress
							if(rmsRateXHR && rmsRateXHR.readyState != 4){
								rmsRateXHR.abort();
							}

							$("#saveRates").click();
							clearGlobalVars();
							rebuildScreen();

							$("#saveDialog").dialog("close");
						},
						"Don't Save": function () {
							// Cancel any rating in progress
							if(rmsRateXHR && rmsRateXHR.readyState != 4){
								rmsRateXHR.abort();
							}

							clearGlobalVars();
							rebuildScreen();

							$("#saveDialog").dialog("close");
						},
						"Cancel": function () {
							$("#saveDialog").dialog("close");
							newOK = false;
						}
					},
					position: "center",
					close: function(event, ui){
						if (newOK){$("#customerNumber").click();}
					}
				});

			} else {  // the proposal had already been saved

				// Cancel any rating in progress
				if(rmsRateXHR && rmsRateXHR.readyState != 4){
					rmsRateXHR.abort();
				}

				clearGlobalVars();
				rebuildScreen();

				$("#saveDialog").dialog("close");
			}

		});

		// Volumetrics
        $("#volumetricsEdit").click(function(){
            if (saveAuthorized & quotenum != '' & lanenumber != 0){
                if ($("#volumetricsData .volumetricVal").css("display") == "none"){
                    hideVolumetricsEdit();
                } else {
                    showVolumetricsEdit();
                }
            }
        });

        $("#volumetricsData").change(function(){

            validateVolumetrics(function(){
                if (!volumetricErrors & saveAuthorized){
                  $("#volumetricsSave").removeClass('disabled');
                }
            });
        });

        $("#volumetricsSave").click(function(e){
            updateVolumetrics(quotenum,lanenumber,function(){
                buildVolumetricsChart();
            });
        });

    }
