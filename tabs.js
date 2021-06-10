// JavaScript Document
	
	
	
	function assignTabFunctions() {
		if (saveAuthorized){
			$("#commentControls").show();
		}
		
		// Set Note Type to Lane
		noteType = "lane";
		$("#quoteButton").addClass("tabButtonBlur");
		$("#quoteButton").removeClass("tabButtonFocus");
		$("#laneButton").addClass("tabButtonFocus");
		$("#laneButton").removeClass("tabButtonBlur");
		
		$("#commentBox")
		.click(function(e){
			e.stopPropagation();
		})
		
		.bind("keypress", function(e){
			// Save Comments to Notes Array on enter
			if (e.which == 13) { //Enter
				e.preventDefault();
				
				var now = new Date();
			    var day = ("0" + now.getDate()).slice(-2);
			    var month = ("0" + (now.getMonth() + 1)).slice(-2);
			    var currentDate = now.getFullYear() + "-" + (month) + "-" + (day);
			    var currentTime = ("0" + now.getHours()).slice(-2) + "."  
			                    + ("0" + now.getMinutes()).slice(-2) + "."
			                    + ("0" + now.getSeconds()).slice(-2);
				
				var newComment = $("#commentBox").val();
				var newNote = {};
				
				newNote["cmtseq"] = "0";
				newNote["cmtkeytyp"] = "RP";
				newNote["cmtaplcod"] = "PRICE";
				newNote["cmttype"] = "GNRL";
				newNote["comment"] = newComment;
				newNote["commentlength"] = "0";
				newNote["entusr"] = currentUser;
				newNote["enttim"] = currentTime;
				newNote["entdat"] = currentDate;
				newNote["chgusr"] = "";
				newNote["chgtim"] = "00.00.00";
				newNote["chgdat"] = "0001-01-01";
				notes.unshift(newNote);
				if (quotenum != "" && lanenumber != 0){
					if (noteType == "quote"){
						newNote["cmtkey"] = quotenum + "0000000000";
					} else {
						var laneX = pad(lanenumber,10)
						newNote["cmtkey"] = quotenum + laneX;
					};
					saveComment(0);
				} else {
					if (noteType == "quote"){
						newNote["cmtkey"] = "quote";
					} else {
						newNote["cmtkey"] = "lane";
					};
				};
				
			
				// Enable the SAVE only when user is Authorized and Proposal is NOT a Spot, or Proposal is a SPOT with No Duplicates
		        //if (saveAuthorized == true){
		        //	if ( ((quotetype == 'S') && (duplicateCount == 0)) || (quotetype != 'S') ){
		        //		$("#saveRates").removeClass("disabled");
		        //	}
		        //};
				//$("#emailButton").addClass("disabled");
				
				rebuildNotes();
				
				$(this).trigger('autosize.resize')
				
				return false;
			}
			// clear on Esc
			if (e.which == 27) {
				e.preventDefault();
				$("#commentBox").click();			
			}
		});
		
		// Comments for Quotes
		$("#quoteButton").click( function (e) {
			$("#laneButton").addClass("tabButtonBlur");
			$("#laneButton").removeClass("tabButtonFocus");
			$("#quoteButton").addClass("tabButtonFocus");
			$("#quoteButton").removeClass("tabButtonBlur");
			noteType = "quote";
			rebuildNotes();
			$("#commentBox").focus(); 
		});	
		
		// Comments for Lane
		$("#laneButton").click( function (e) {
			$("#quoteButton").addClass("tabButtonBlur");
			$("#quoteButton").removeClass("tabButtonFocus");
			$("#laneButton").addClass("tabButtonFocus");
			$("#laneButton").removeClass("tabButtonBlur");
			noteType = "lane";
			rebuildNotes();
			$("#commentBox").focus(); 
		});
		
		// Statistics for Zone to Zone
		//$("#zoneButton").click( function (e) {
        //$("#zoneButton").addClass("tabButtonFocus");
		//	$("#zoneButton").removeClass("tabButtonBlur");
		//	$("#rateRecordButton").addClass("tabButtonBlur");
		//	$("#rateRecordButton").removeClass("tabButtonFocus");
			//statToggle = "zone";
			//rebuildStats();
            // Index Based on User Selection of Company or Customer
            // Hard Code Company for now
            //var groupIdx = 0;
        //    buildAnalyticsTab(groupIdx);
		//});	
		
		// Statistics for Rate Record
		//$("#rateRecordButton").click( function (e) {
		//	$("#rateRecordButton").addClass("tabButtonFocus");
		//	$("#rateRecordButton").removeClass("tabButtonBlur");
		//	$("#zoneButton").addClass("tabButtonBlur");
		//	$("#zoneButton").removeClass("tabButtonFocus");
			//statToggle = "rate";
			//rebuildStats();
            // Index Based on User Selection of Company or Customer
            // Hard Code Company for now
        //var groupIdx = 0;
          //  buildAnalyticsTab(groupIdx);
		//});
        
        // Statistics Header Click
        $("#statsControl > button").click(function (e) {
            
            // Refresh charts to make sure they are sized properly
            // -- only if moving to detail -- 
            if ($("#statsEntryMode").hasClass("hidden")){
                $("#analyticsSection").find('.ct-chart').each(function(i, e) {
                    e.__chartist__.update();
                });
            }
            
            $("#contentSlider").toggleClass("analyticsMode");
            $("#statsControl > button").toggleClass("hidden");
            if ($("#contentSlider.analyticsMode").length == 1){
                loadTopOrgDest();
            } else {
                dropTopOrgDest();
            }
        });
        
        
        // Analytics Stats by Customer
        $("#analyticGroupCustomer").click(function (e){
            var groupIdx = 1;
            buildAnalyticsTab(groupIdx);
            $(this).addClass("analyticButtonSelected"); 
            $("#analyticGroupCompany").removeClass("analyticButtonSelected");
            calcAnalyticSandbox("RATE",function(){
                buildSandbox();
                
            });
        })
        // Analytics stats by Company
        $("#analyticGroupCompany").click(function (e){
            var groupIdx = 0;
            buildAnalyticsTab(groupIdx);
            $(this).addClass("analyticButtonSelected"); 
            $("#analyticGroupCustomer").removeClass("analyticButtonSelected");
            calcAnalyticSandbox("RATE",function(){
                buildSandbox();
                
            });
        })
        // Time Frame Selector
        $("#monthSlider3").click(function (e){
            $("div .analyticMonthButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
                        
            calcMonthSlider = "3";
        })
        
        $("#monthSlider6").click(function (e){
            $("div .analyticMonthButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcMonthSlider = "6";
        })
        $("#monthSlider9").click(function (e){
            $("div .analyticMonthButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcMonthSlider = "9";
        })
        $("#monthSlider12").click(function (e){
            $("div .analyticMonthButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcMonthSlider = "12";
        })
        // Geography Selector
        $("#analyticOrigZone").click(function (e){
            $("div .analyticOrigButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcOrigGeoCode = "ZN";
            
        })
        $("#analyticOrigZip3").click(function (e){
            $("div .analyticOrigButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcOrigGeoCode = "3D";
        })
        $("#analyticOrigReg").click(function (e){
            $("div .analyticOrigButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcOrigGeoCode = "RG";
        })
        $("#analyticOrigState").click(function (e){
            $("div .analyticOrigButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcOrigGeoCode = "ST";
        })
        
        // Destination Geography Selector
        $("#analyticDestZone").click(function (e){
            $("div .analyticDestButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcDestGeoCode = "ZN";

        })
        $("#analyticDestZip3").click(function (e){
            $("div .analyticDestButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcDestGeoCode = "3D";
        })
        $("#analyticDestReg").click(function (e){
            $("div .analyticDestButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcDestGeoCode = "RG";
        })
        $("#analyticDestState").click(function (e){
            $("div .analyticDestButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcDestGeoCode = "ST";
        })
        
        // Service
        $("#analyticSrvTeam").click(function (e){
            $("div .analyticSrvButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 
            
            calcService = "T";
        })
        $("#analyticSrvSingle").click(function (e){
            $("div .analyticSrvButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcService = "S";
        })
        $("#analyticSrvBoth").click(function (e){
            $("div .analyticSrvButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcService = " ";
        })
        // Rate Source
        $("#analyticSrcPublish").click(function (e){
            $("div .analyticSrcButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcSource = "P";
        })
        $("#analyticSrcOther").click(function (e){
            $("div .analyticSrcButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcSource = "O";
        })
        $("#analyticSrcBoth").click(function (e){
            $("div .analyticSrcButton").removeClass("analyticButtonSelected");
            $(this).addClass("analyticButtonSelected"); 

            calcSource = " ";
        })
        // Rate Records
        $("#analyticRateRec").click(function (e){
            if ( $(this).hasClass("analyticButtonSelected") ){
                $(this).removeClass("analyticButtonSelected"); 
                $("div .analyticMonthButton").removeClass("disabled");
                $("div .analyticOrigButton").removeClass("disabled");
                $("div .analyticDestButton").removeClass("disabled");
                $("div .analyticSrcButton").removeClass("disabled");
                $("div .analyticSrvButton").removeClass("disabled");
                calcRateRecord = false; 
                
            } else {
                $(this).addClass("analyticButtonSelected"); 
                $("div .analyticMonthButton").addClass("disabled");
                $("div .analyticOrigButton").addClass("disabled");
                $("div .analyticDestButton").addClass("disabled");
                $("div .analyticSrcButton").addClass("disabled");
                $("div .analyticSrvButton").addClass("disabled");
                calcRateRecord = true; 
            }
        })
        
        $("#analyticsCalc").click(function (e){
            ds_Analytics.monthSlider = calcMonthSlider;
            ds_Analytics.originGeographyType = calcOrigGeoCode;
            ds_Analytics.destGeographyType = calcDestGeoCode;
            ds_Analytics.serviceType = calcService;
            ds_Analytics.rateSource = calcSource;
            if (calcRateRecord){
                ds_Analytics.originGeographyType = "RR";
                ds_Analytics.destGeographyType = "RR";    
            }
           
            retrieveAnalytics("CALC",function(){
                buildAnalytics();
                
                // Activate Save only when user is Authorized
                if (saveAuthorized == true){
					$("#saveRates").removeClass("disabled");
					$("#emailButton").addClass("disabled");
                };
                
            })
        })
        $("#analyticsOpt").click(function (e){
            
            retrieveAnalytics("OPTIMIZE",function(){
                buildAnalytics();

            })
            // Activate Save only when user is Authorized
            if (saveAuthorized == true){
				$("#saveRates").removeClass("disabled");
				$("#emailButton").addClass("disabled");
            };
        })
        
        $(".analyticDropHitBox").click(function (e){
            if (!$(this).children(".cssIconDropCarrot").hasClass("up")){
                $("#analyticCalcSelectors").addClass("show");
                $("#statsBlock").addClass("collapse");
                $(this).children(".cssIconDropCarrot").addClass("up");
                $("#analyticsOpt").removeClass("disabled");
                $("#analyticsCalc").removeClass("disabled");
            }else{
                $("#analyticCalcSelectors").removeClass("show");
                $("#statsBlock").removeClass("collapse");
                $(this).children(".cssIconDropCarrot").removeClass("up");
                $("#analyticsOpt").addClass("disabled");
                $("#analyticsCalc").addClass("disabled");
            }

            
        })
        
        // Sanbox Click Events
        $("#propOrInput").change(function (e) {
            if (! $.isNumeric($("#propOrInput").val())){
                // Proposed Value must be numeric
                $("#propOrInput").addClass('invalidField');
            } else {
                $("#propOrInput").removeClass('invalidField');
            	// Recalc Sandbox OR Values
                calcAnalyticSandbox("OR",function(){
                    buildSandbox();
                    // Activate Save only when user is Authorized
                    if (saveAuthorized == true){
						$("#saveRates").removeClass("disabled");
						$("#emailButton").addClass("disabled");
                    };    
                });
            }
        });  
        $("#propLHRPLMInput").change(function (e) {
            if (! $.isNumeric($("#propLHRPLMInput").val())){
                // Proposed Value must be numeric
                $("#propLHRPLMInput").addClass('invalidField');
            } else {
                $("#propLHRPLMInput").removeClass('invalidField');
                // Recalc Sandbox OR Values
                calcAnalyticSandbox("RATE",function(){
                    buildSandbox();
                    // Activate Save only when user is Authorized
                    if (saveAuthorized == true){
						$("#saveRates").removeClass("disabled");
						$("#emailButton").addClass("disabled");
                    };    
                });
            }
        });  
        $("#propEmptyMilesAdjInput").change(function (e) {
            if (! $.isNumeric($("#propEmptyMilesAdjInput").val())){
                // Proposed Value must be numeric
                $("#propEmptyMilesAdjInput").addClass('invalidField');
            } else {
                $("#propEmptyMilesAdjInput").removeClass('invalidField');
                // Recalc Sandbox OR Values
                calcAnalyticSandbox("MTMILES",function(){
                    buildSandbox();
                    // Activate Save only when user is Authorized
                    if (saveAuthorized == true){
						$("#saveRates").removeClass("disabled");
						$("#emailButton").addClass("disabled");
                    };    
                });
            }
        })
		.bind("keydown", function(e){
			var $selectedLI = $("#contSearchList li.selected");
			switch (e.which) {
				case 9: //Tab
					if (!e.shiftKey){
						e.preventDefault();
						$("#propLHRPLMInput").focus();
					}

					break;
			}
		});  

    
	}
	
	// Rebuild Notes Tab List 
	function rebuildNotes (){
		var commentListUL = $('#commentList');
		var commentDtl;
		var commentUL;
		var commentLI;
		var commentUser;
		var saveDate;
		
		commentListUL.empty();
		$("#commentBox").val('');
		
		// Hide Comment Entry Box when user Does Not have Authorization
		if (saveAuthorized){
			$("#commentControls").show();
		} else {
			$("#commentControls").hide();
		};
		
		if (notes.length != 0) {
			$("#notesTabAsterisk").show();
		} else {
			$("#notesTabAsterisk").hide();
		}
		
		for (i = 0; i < notes.length; i++){
			
			var commentLaneId = notes[i].cmtkey.slice(11);
			
			// Set Comment Lane ID to 0 for New Quote Comment
			if (notes[i].cmtkey == "quote"){
				commentLaneId = "0000000000";
			};
			// Set Comment Lane ID to 1 for New Lane Comment
			if (notes[i].cmtkey == "lane"){
				commentLaneId = "0000000001";
			};
			
			// Include Notes based on Note Type Selected  - Quote or Lane
			if ((noteType == "quote" && commentLaneId == "0000000000") ||
				(noteType == "lane" && commentLaneId != "0000000000")){
				
							
				var dateSection = moment(notes[i].entdat,"YYYY-MM-DD").calendar();
			
				if (notes[i].entdat != saveDate){
					commentDtl = $("<li class='daySection'></li>");
								
					commentDtl.append($("<div class='commentDate'>"+ dateSection + "</div>"));
				
					commentListUL.append(commentDtl);
				
					commentUL = $("<ul class='comments'></ul>");
				
				
					commentListUL.append(commentDtl);

					saveDate = notes[i].entdat;
				}
			
				commentLI = $("<li class='comment' commentId='"+i+"'></li>");
			
				commentLI.append($("<span class='commentUser'>"+notes[i].entusr+"</span>"));
				commentLI.append($("<span class='commentTime'>"+notes[i].enttim+"</span>"));
				commentLI.append($("<span class='commentText'>"+notes[i].comment+"</span>"));
			
				// Add comment editing features to current day for current user and authorized to save
				if (dateSection == "Today" && notes[i].entusr == currentUser && saveAuthorized) {
					var $commentEditor = $("<textarea class='commentEditor'>" + notes[i].comment + "</textarea>");
					var $commentControls = 
						$(
						    "<div class='commentControls'>" + 
								"<div class='deleteComment' title='Delete'></div>" +
								"<div class='editComment' title='Edit'></div>" +
							"</div>"
						);
					
					commentLI.append($commentEditor);
					commentLI.append($commentControls);
				}
			
				commentUL.append(commentLI);
				commentDtl.append(commentUL);
				commentListUL.append(commentDtl);
			};
		};
		
		assignTabEditFunctions();
	}
	
	// Set UI functions
	function assignTabEditFunctions() {
		$(".comment")
			.hover(
				function(){
					$(this).children(".commentControls").css("display", "inline-block");
				},
				function(){
					$(this).children(".commentControls").css("display", "none");
				}
			);
			
		$(".commentControls .deleteComment").click(function(){
			var commentNumber = $(this).parents(".comment").attr("commentid");
			notes[commentNumber].comment = "";
			if (quotenum != ''){
				saveComment(commentNumber);
			} else {
				notes.splice(commentNumber, 1);
			}
			rebuildNotes();
		});
		
		$(".commentControls .editComment").click(function(){
			var $commentText = $(this).parents(".comment").children(".commentText");
			var $commentTextArea = $(this).parents(".comment").children("textarea");
			$commentTextArea.val($commentText.text());
			$commentText.hide();
			$commentTextArea.show().focus().select().trigger('autosize.resize');
		});
		
		$(".comment textarea")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function() {
				var $commentText = $(this).parents(".comment").children(".commentText");
				$commentText.show();
				$(this).hide();
			})
			.bind("keydown", function(e){
				// Retrieve Customer Info on Enter
				if (e.which == 13) { //Enter
					e.preventDefault();
					
					var $commentText = $(this).parents(".comment").children(".commentText");
					var commentNumber = $(this).parents(".comment").attr("commentid");
					
					notes[commentNumber].comment = $(this).val();
					$commentText.text($(this).val());
					$(this).hide();
					$commentText.show();
					if (quotenum != ''){
						saveComment(commentNumber);
					}
				}
				// clear on Esc
				if (e.which == 27) {
					e.preventDefault();
					
					var $commentText = $(this).parents(".comment").children(".commentText");
					$commentText.show();
					$(this).hide();	
				}
			});
		
		// Autosize all textboxes
		$("#commentList textarea").autosize();
	}
	
	function saveComment(noteNumber){
		var errMessage;
		var error = false;
		var i = -1;
		var url;
			
		var postXML = note_forSave_xml(noteNumber);
		// Build URL to update note
		url = "GNRLAJAX.pgm?" +
		"Action=SAVE";
		
		$.ajax({
			type: "POST",
			url: url,
			data: postXML,
			dataType: "xml",
			async: false,
			success: function(xml) {
				errMessage = $(xml).find('Error').attr('message');
				if (errMessage){
					alert (errMessage); 
					error = true;
				} else {
					if (notes[noteNumber].comment == "") {
						notes.splice(noteNumber, 1);
					} else {
						$(xml).find('notes').each(function(){
							var n = (notes[noteNumber] = {});
							notes[noteNumber].cmtkey = $(this).attr("cmtkey");
							notes[noteNumber].cmtseq = $(this).attr("cmtseq");
							notes[noteNumber].cmtkeytyp = $(this).attr("cmtkeytyp");
							notes[noteNumber].cmtaplcod = $(this).attr("cmtaplcod");
							notes[noteNumber].cmttype = $(this).attr("cmttype");
							notes[noteNumber].comment = $(this).attr("comment");
							notes[noteNumber].commentlength = $(this).attr("commentlength");
							notes[noteNumber].entusr = $(this).attr("entusr");
							notes[noteNumber].enttim = $(this).attr("enttim");
							notes[noteNumber].entdat = $(this).attr("entdat");
							notes[noteNumber].chgusr = $(this).attr("chgusr");
							notes[noteNumber].chgtim = $(this).attr("chgtim");
							notes[noteNumber].chgdat = $(this).attr("chgdat");
						});	
					}
				}
			},
			
			error: function() {
				//alert('Could not Save note');
			   
			}
		});
	}
	
	// Build xml document for saving a note
	function note_forSave_xml(noteNumber) {
		var xml;
	
		var xml = 
			'<GnrlComment>' +
				'<notes' +
				' cmtkey="' + notes[noteNumber].cmtkey + '"' + 	
				' cmtseq="' + notes[noteNumber].cmtseq + '"' + 	
				' cmtkeytyp="' + notes[noteNumber].cmtkeytyp + '"' + 	
				' cmtaplcod="' + notes[noteNumber].cmtaplcod + '"' + 	
				' cmttype="' + notes[noteNumber].cmttype + '"' + 
				' comment="' + encodeURIComponent(notes[noteNumber].comment) + '"' + 
			//	' comment="' + '<![CDATA[' +  notes[noteNumber].comment + ']]>' +  '"' + 	
				' commentlength="' + notes[noteNumber].commentlength + '"' + 	
				' entusr="' + notes[noteNumber].entusr + '"' + 	
				' enttim="' + notes[noteNumber].enttim + '"' +
				' chgusr="' + notes[noteNumber].chgusr + '"' + 	
				' chgtim="' + notes[noteNumber].chgtim + '"' + 
				' entdat="' + notes[noteNumber].entdat + '"' + 	
				' chgdat="' + notes[noteNumber].chgdat + '"' + 	
				' />' +
			'</GnrlComment>';
			
			
		return xml;
	}

    function loadTopOrgDest(){
        $("#originLabel").clone(true).appendTo("#topOrgDest > .org");
        $("#destLabel").clone(true).appendTo("#topOrgDest > .dest");
        $("#topOrgDest").addClass("visible");
    }

    function dropTopOrgDest(){
        $("#topOrgDest .label").remove();
        $("#topOrgDest").removeClass("visible");
    }