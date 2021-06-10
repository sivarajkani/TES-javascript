	// Set Click event for Customer Info Icon
	$(function(){
		$("#custInfoIcon").click(function(){
			if (! $(this).hasClass("disabled")){
				if ($("#custInfoBox").css("display") == "none"){
					showCustInfoBox();
				} else {
					hideCustInfoBox();
				}
			}
		});
		
		$("#closeCustDetail").click(function(){
			hideCustInfoBox();
		});
		
		$("#custCommentBox")
			.click(function(e){
				e.stopPropagation();
			})
			.focus(function(){
				$(this).addClass("full");
				$(this).parent().addClass("full");
				window.setTimeout(function(){$("#custCommentControls button").fadeIn()}, 100);
				window.setTimeout(function(){$("#custCommentControls select").fadeIn()}, 100);
				$("#closeCustComment").show();
			})
			.bind("keypress", function(e){
				// Save Comments to Customer Notes Array on enter
				if (e.which == 13) { //Enter
					e.preventDefault();
					
					$("#custCommentSubmit").click();

					return false;
				}
				// clear on Esc
				if (e.which == 27) {
					e.preventDefault();
					
					$("#closeCustComment").click();		
				}
			});
		
		$("#custCommentSubmit").click(function(){

			var now = new Date();
			var day = ("0" + now.getDate()).slice(-2);
			var month = ("0" + (now.getMonth() + 1)).slice(-2);
			var currentDate = now.getFullYear() + "-" + (month) + "-" + (day);
			var currentTime = ("0" + now.getHours()).slice(-2) + "."  
			+ ("0" + now.getMinutes()).slice(-2) + "."
			+ ("0" + now.getSeconds()).slice(-2);

			var newCustComment = $("#custCommentBox").val();
			var newNote = {};

			newNote["cmtseq"] = "0";
			newNote["cmtkeytyp"] = "CU";
			newNote["cmtaplcod"] = "PRICE";
			newNote["cmttype"] = $("#custCommentType option:selected").attr("value");
			newNote["comment"] = newCustComment;
			newNote["commentlength"] = "0";
			newNote["entusr"] = currentUser;
			newNote["enttim"] = currentTime;
			newNote["entdat"] = currentDate;
			newNote["chgusr"] = "";
			newNote["chgtim"] = "00.00.00";
			newNote["chgdat"] = "0001-01-01";
			newNote["cmtkey"] = cusprefix + cusbase + cussuffix;
			custNotes.unshift(newNote);	
			saveCustComment(0);
			rebuildCustComments();

			$(this).trigger('autosize.resize')
			
			$("#closeCustComment").click();
		});
		
		$("#closeCustComment").click(function(){
			$("#custCommentBox").val("");
			$("#custCommentSubmit").fadeOut(100, function(){
				$("#custCommentBox").removeClass("full");
				$("#custCommentControls").removeClass("full");
			});
			$("#custCommentType").fadeOut(100);
			$("#closeCustComment").hide();

			$("#custCommentBox").blur();
		});
		
		$("#publishCustomerNumber").click(function(){
            window.open("freitrcgi.pgm?publishCust="+cusprefix+cusbase+cussuffix);
        });
		
		
	});
	
	function showCustInfoBox(){
		if (!$("#customerNumberEdit").css("display","none")){
			$("#customerNumberEdit").blur();
		}
		
		$("#custInfoBox").fadeIn("fast");	
		$("#custCommentType").val("GNRL");
		// Get Customer Comment and Rebuild Comment List		
		getCustComments();
		
		
		
	}
	
	function hideCustInfoBox(){
		$("#custInfoBox").fadeOut("fast");
		$("#closeCustComment").click();
		
	}
	// Rebuild Customer Comments List 
	function rebuildCustComments (){
		var commentListUL = $('#custCommentList');
		var commentHistListUL = $('#custCommentHistList');
		var commentDtl;
		var commentUL;
		var commentLI;
		var commentUser;
		var saveDate;
		
		commentListUL.empty();
		$("#custCommentBox").val('');
		
		// Hide Comment Entry Box when user Does Not have Authorization
		if (saveAuthorized){
			$("#custCommentControls").show();
		} else {
			$("#custCommentControls").hide();
		};
		
		var noteCount = 0;
		
		// Build Customer Current Comments
		for (i = 0; i < custNotes.length; i++){
			
		
			// Exclude Comments with HIST Type
			if (custNotes[i].cmttype != "HIST")	{
				noteCount++;
				
				var dateSection = moment(custNotes[i].entdat,"YYYY-MM-DD").calendar();
			
				if (custNotes[i].entdat != saveDate){
					commentDtl = $("<li class='daySection'></li>");
								
					commentDtl.append($("<div class='custCommentDate'>"+ dateSection + "</div>"));
				
					commentListUL.append(commentDtl);
				
					commentUL = $("<ul class='custComments'></ul>");
				
				
					commentListUL.append(commentDtl);

					saveDate = custNotes[i].entdat;
				}
			
				commentLI = $("<li class='custComment' custCommentId='"+i+"'></li>");
				if (custNotes[i].chgusr != ""){
					commentLI.append($("<span class='custCommentUser'>"+custNotes[i].chgusr+"</span>"));
				} else {
					commentLI.append($("<span class='custCommentUser'>"+custNotes[i].entusr+"</span>"));
				}
				commentLI.append($("<span class='custCommentType'>"+custNotes[i].cmttype+"</span>"));
				if (saveAuthorized) {
					var $typeEditor = $("<select class='custTypeEditor'></select>");
					$typeEditor.html($("#custCommentType").html());
					commentLI.append($typeEditor);
					
				}
				
				commentLI.append($("<span class='custCommentTime'>"+custNotes[i].enttim+"</span>"));
				commentLI.append($("<span class='custCommentText'>"+custNotes[i].comment+"</span>"));
			
				// Add comment editing features when authorized to save
				if (saveAuthorized) {
					var $commentEditor = $("<textarea class='custCommentEditor'>" + custNotes[i].comment + "</textarea>");
					var $commentControls = 
						$(
						    "<div class='custCommentControls'>" + 
								"<div class='control custDeleteComment' title='Delete'></div>" +
								"<div class='control custHistComment' title='Send to History'></div>" +
								"<div class='control custEditComment' title='Edit'></div>" +
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
		
		if (noteCount > 0){
			$("#custInfoCounter").html("(" + (noteCount) + ")");
		} else {
			$("#custInfoCounter").html("");
		}
		
		if ($("#custCommentList li").length == 1)  {
			$("#custCommentList").css("display", "none");
		} else {
			$("#custCommentList").css("display", "block");
		}
		
		saveDate = "";
		commentHistListUL.empty();
		
		// Build Customer History Comments - Displayed at End of List
		for (i = 0; i < custNotes.length; i++){
			
		
			// Include ONLY Comments with HIST Type
			if (custNotes[i].cmttype == "HIST")	{
			
				var dateSection = moment(custNotes[i].entdat,"YYYY-MM-DD").calendar();
			
				if (custNotes[i].entdat != saveDate){
					commentDtl = $("<li class='daySection'></li>");
								
					commentDtl.append($("<div class='custCommentDate'>"+ dateSection + "</div>"));
				
					commentHistListUL.append(commentDtl);
				
					commentUL = $("<ul class='custComments'></ul>");
				
				
					commentHistListUL.append(commentDtl);

					saveDate = custNotes[i].entdat;
				}
			
				commentLI = $("<li class='custComment' custCommentId='"+i+"'></li>");
				if (custNotes[i].chgusr != ""){
					commentLI.append($("<span class='custCommentUser'>"+custNotes[i].chgusr+"</span>"));
				} else {
					commentLI.append($("<span class='custCommentUser'>"+custNotes[i].entusr+"</span>"));
				}
				commentLI.append($("<span class='custCommentType'>"+custNotes[i].cmttype+"</span>"));
				commentLI.append($("<span class='custCommentTime'>"+custNotes[i].enttim+"</span>"));
				commentLI.append($("<span class='custCommentText'>"+custNotes[i].comment+"</span>"));
			
				// Add comment editing features when authorized to save - Only to Move from HIST to Current
				if (saveAuthorized) {
					
					var $commentControls = 
						$(
						    "<div class='custCommentControls'>" + 
								"<div class='control custHistComment' title='Remove from History'></div>" +
							"</div>"
						);
					
					
					commentLI.append($commentControls);
				}
				commentUL.append(commentLI);
				commentDtl.append(commentUL);
				commentHistListUL.append(commentDtl);
			};
		};
		if ($("#custCommentHistList li").length == 1)  {
			$("#custCommentHistList").css("display", "none");
		} else {
			$("#custCommentHistList").css("display", "block");
		}
		assignCustCommentEditFunctions();
	}
	
	// Set UI functions
	function assignCustCommentEditFunctions() {
		$(".custComment")
			.hover(
				function(){
					$(this).children(".custCommentControls").css("display", "inline-block");
					$(this).children(".custCommentControlsEditHist").css("display", "block");
					
				},
				function(){
					$(this).children(".custCommentControls").css("display", "none");
				}
			);
			
		$(".custCommentControls .custDeleteComment").click(function(){
			var commentNumber = $(this).parents(".custComment").attr("custCommentId");
			custNotes[commentNumber].comment = "";
			saveCustComment(commentNumber);
			rebuildCustComments();
		});
		
		$(".custCommentControls .custEditComment").click(function(){
			var $commentText = $(this).parents(".custComment").children(".custCommentText");
			var $commentTextArea = $(this).parents(".custComment").children("textarea");
			$commentTextArea.val($commentText.text());
			$commentText.hide();
			$commentTextArea.show().focus().select().trigger('autosize.resize');
		});
		$(".custCommentControls .custHistComment").click(function(){
			var commentNumber = $(this).parents(".custComment").attr("custCommentId");
			if (custNotes[commentNumber].cmttype == "HIST"){
				custNotes[commentNumber].cmttype = "GNRL";
			} else {
				custNotes[commentNumber].cmttype = "HIST";
			}
			saveCustComment(commentNumber);
			rebuildCustComments();
		});
		
		/*$(".custComment .custCommentType")
			.click(function(){
				var commentNumber = $(this).parents(".custComment").attr("custCommentId");
				$(this).css("display", "none");
				
				$(this).siblings(".custTypeEditor").val(custNotes[commentNumber].cmttype);
				$(this).siblings(".custTypeEditor").css("display", "inline-block");
				
		});*/
		
		$(".custComment .custTypeEditor")
			.change(function(){
				var commentNumber = $(this).parents(".custComment").attr("custCommentId");
				var commentTypeSelected = $(this).children("option:selected").val();
				custNotes[commentNumber].cmttype = commentTypeSelected;
				saveCustComment(commentNumber);
				rebuildCustComments();
				
				$(".custCommentType").css("display", "inline-block");
				$(".custTypeEditor").css("display", "none");
			})
			.blur(function(){
				$(".custCommentType").css("display", "inline-block");
				$(".custTypeEditor").css("display", "none");
			})
			.focusout(function(){
				$(".custCommentType").css("display", "inline-block");
				$(".custTypeEditor").css("display", "none");
			});
		
		$(".custComment textarea")
			.click(function(e){
				e.stopPropagation();
			})
			.focusout(function(){
				var $commentText = $(this).parents(".custComment").children(".custCommentText");
				$commentText.show();
				$(this).hide();
			})
			.bind("keydown", function(e){
				// Retrieve Customer Info on Enter
				if (e.which == 13) { //Enter
					e.preventDefault();
					
					var $commentText = $(this).parents(".custComment").children(".custCommentText");
					var commentNumber = $(this).parents(".custComment").attr("custCommentId");
					
					custNotes[commentNumber].comment = $(this).val();
					$commentText.text($(this).val());
					$(this).hide();
					$commentText.show();
					saveCustComment(commentNumber);
					
				}
				// clear on Esc
				if (e.which == 27) {
					e.preventDefault();
					
					var $commentText = $(this).parents(".custComment").children(".custCommentText");
					$commentText.show();
					$(this).hide();	
				}
			});
		
		// Autosize all textboxes
		$("#custCommentList textarea").autosize();
	}
	
	function saveCustComment(noteNumber){
		var errMessage;
		var error = false;
		var i = -1;
		var url;
			
		var postXML = custNote_forSave_xml(noteNumber);
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
					if (custNotes[noteNumber].comment == "") {
						custNotes.splice(noteNumber, 1);
					} else {
						$(xml).find('notes').each(function(){
							var n = (custNotes[noteNumber] = {});
							custNotes[noteNumber].cmtkey = $(this).attr("cmtkey");
							custNotes[noteNumber].cmtseq = $(this).attr("cmtseq");
							custNotes[noteNumber].cmtkeytyp = $(this).attr("cmtkeytyp");
							custNotes[noteNumber].cmtaplcod = $(this).attr("cmtaplcod");
							custNotes[noteNumber].cmttype = $(this).attr("cmttype");
							custNotes[noteNumber].comment = $(this).attr("comment");
							custNotes[noteNumber].commentlength = $(this).attr("commentlength");
							custNotes[noteNumber].entusr = $(this).attr("entusr");
							custNotes[noteNumber].enttim = $(this).attr("enttim");
							custNotes[noteNumber].entdat = $(this).attr("entdat");
							custNotes[noteNumber].chgusr = $(this).attr("chgusr");
							custNotes[noteNumber].chgtim = $(this).attr("chgtim");
							custNotes[noteNumber].chgdat = $(this).attr("chgdat");
						});	
					}
				}
			},
			complete: function(){
				rebuildCustComments();
			},
			error: function() {
				alert('Could not Save customer note');
			   
			}
		});
	}
	function getCustComments(){
		var errMessage;
		var error = false;
		var i = -1;
		var url;
		
		custNotes.length = 0;	
		
		// Build URL to update note
		url = "GNRLAJAX.pgm?" +
		"Action=GET&gcmtkey=" + cusprefix+cusbase+cussuffix + "&gcmtkeytype=CU&gcmtaplcod=PRICE";
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function(xml) {
				
				errMessage = $(xml).find('Error').attr('message');
				if (errMessage){
					alert (errMessage); 
					error = true;
				} else {
					$(xml).find('notes').each(function(){
						i++;
						custNotes[i] = {};
						custNotes[i].cmtkey = $(this).attr("cmtkey");
						custNotes[i].cmtseq = $(this).attr("cmtseq");
						custNotes[i].cmtkeytyp = $(this).attr("cmtkeytyp");
						custNotes[i].cmtaplcod = $(this).attr("cmtaplcod");
						custNotes[i].cmttype = $(this).attr("cmttype");
						custNotes[i].comment = $(this).attr("comment");
						custNotes[i].commentlength = $(this).attr("commentlength");
						custNotes[i].entusr = $(this).attr("entusr");
						custNotes[i].enttim = $(this).attr("enttim");
						custNotes[i].entdat = $(this).attr("entdat");
						custNotes[i].chgusr = $(this).attr("chgusr");
						custNotes[i].chgtim = $(this).attr("chgtim");
						custNotes[i].chgdat = $(this).attr("chgdat");
					});	
					
				}
				
			},
			complete: function(){
				rebuildCustComments();
			},
			error: function() {
				alert('Error in Retrieving Customer Notes/Comments.');
				$("#custInfoCounter").html("");
			   
			}
		});
	}
	
	// Build xml document for saving a note
	function custNote_forSave_xml(noteNumber) {
		var xml;
	
		var xml = 
			'<GnrlComment>' +
				'<notes' +
				' cmtkey="' + custNotes[noteNumber].cmtkey + '"' + 	
				' cmtseq="' + custNotes[noteNumber].cmtseq + '"' + 	
				' cmtkeytyp="' + custNotes[noteNumber].cmtkeytyp + '"' + 	
				' cmtaplcod="' + custNotes[noteNumber].cmtaplcod + '"' + 	
				' cmttype="' + custNotes[noteNumber].cmttype + '"' + 
			//	' comment="' + escapeXML(custNotes[noteNumber].comment) + '"' + 
                ' comment="' + encodeURIComponent(custNotes[noteNumber].comment) + '"' + 
                ' commentlength="' + custNotes[noteNumber].commentlength + '"' + 	
				' entusr="' + custNotes[noteNumber].entusr + '"' + 	
				' enttim="' + custNotes[noteNumber].enttim + '"' +
				' chgusr="' + custNotes[noteNumber].chgusr + '"' + 	
				' chgtim="' + custNotes[noteNumber].chgtim + '"' + 
				' entdat="' + custNotes[noteNumber].entdat + '"' + 	
				' chgdat="' + custNotes[noteNumber].chgdat + '"' + 	
				' />' +
			'</GnrlComment>';
			
			
		return xml;
	}
	
	