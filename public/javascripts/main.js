//var color = '#000';
var baseUrl = 'http://localhost:3000/';

var Ewebshot =(function(){
	var obj = {};
	obj.color = '#000';
	obj.getLoader = function getLoader(){
		return '<img class="loading" src="images/preloader.gif">';
    };

	obj.perfectLayout = function perfectLayout(){
		var keyup = false;
		$('#inputUrl').keyup(function() {
		  
		  if(keyup == false){
		  	$('body').css("padding", "0");
		  	$('.container').css({"position": "absolute"});
		  	$('h1').css({"float": "left", "width":"170px"});
		  	$('.group-search, .screen-box').css({"float": "left","margin":"13px 20px"});
		  	$('.screen-box').css({"opacity": "1"});
		  	keyup = true;
		  }
		});
	};

	obj.saveImage = function saveImage(){
			
		$('#save-tool').on('click',function(e){
			loader = obj.getLoader;
			$(".container").append(loader);
			canvas = document.getElementById("myCanvas");
			imgData = canvas.toDataURL("image/jpeg");
			var filename = 'Texture_0.jpg';
			
			$.ajax({
				type: "POST",
				dataType: "json",
				data: {
					filename: filename,
					file : imgData
				},
				mimeType: "multipart/form-data",
			    url: '/save',
	            success: function(response){
	            	$('.loading').remove();
	            	$('#save-tool').removeClass('active');

	            	$('#link-container').css({"opacity": "1"});
	            	linkImg = baseUrl + response.url
	            	$('#link-result').val(linkImg);
	            	$('#open-link').attr("href",linkImg);
				}
			});

		});
	};
	obj.captureWebPage = function captureWebPage(){
		$('#f_process').on('submit',function(e){
			$('#tools-container').hide();
			$('body').css("background", "#fff");
			loader = obj.getLoader();
			$('#canvas-container').html(loader);
			web_url = $('#inputUrl').val();
			screen_size = $('#screen-size').val();
			$.ajax({
				type: "GET",
				dataType: "json",
				    url: '/content?web_url='+web_url+'&screen_size=' + screen_size,
	                success: function(response){
	                	if(response.status == false){
	                		$('#canvas-container').html('<p style="color:red;">Can not load page.</p>');
	                	}else{
	                		$('#canvas-container').html('');
							$('body').css("background", "#333");
							$('#img-url').val(response.url);
		                 	obj.createCanvas(response.url);
		                 	$('#tools-container').show();
	                	}


	            }
			});

		});
	};
	obj.createCanvas = function createCanvas(imgUrl){
		
		
		var canvas = document.createElement('canvas');
		canvas.id = "myCanvas";
		$('#canvas-container').html(canvas);
			
		var ctx = canvas.getContext("2d");
		
		var imageObj = new Image();

		imageObj.onload = function() {
		  	canvas.width = imageObj.width + 10;
			canvas.height = imageObj.height + 10	;
		    ctx.drawImage(imageObj, 5, 5);
		};
		
	    imageObj.src =  imgUrl;

	};
	obj.selectTool = function selectTool(){
		$('#tools-container a').on('click', function(){
			color = $('#color').val();
		 	$('#tools-container a').removeClass('active');
		 	
		 	if($(this).hasClass('undo-tool')){
		 		obj.undo();
		 		return false;
		 	}
		 	$(this).addClass('active');
		 	$('#myCanvas').unbind();
		 	if($('#crop-tool').hasClass('active')){
		     	$('#myCanvas').imgAreaSelect({
			        handles: true,
			        onSelectEnd: obj.onSelectedArea
				});
			    document.onkeypress = function(e){
				    if (!e) e = window.event;
				    var keyCode = e.keyCode || e.which;
				    if (keyCode == '13' && $('#crop-tool').hasClass('active')){
				    	obj.crop();
				    }
				}

		 	}else if($('#paint-brush-tool').hasClass('active')){
		 		obj.paintDraw();
		 	}else if($('#circle-o').hasClass('active')){
		 		obj.ellipseDraw();
		 	}else if($('#square-o').hasClass('active')){
		 		obj.rectDraw();
		 	}


		});
	};
	obj.onSelectedArea = function onSelectedArea(img, selection){
		$('#sx').val(selection.x1);
		$('#sy').val(selection.y1);
		swidth = selection.x2 - selection.x1;
		sheight = selection.y2 - selection.y1;
		$('#swidth').val(swidth);
		$('#sheight').val(sheight);
		$('#main-contain').css("overflow", "hidden");
		if(swidth > 2 || sheight > 2){
			//$('#crop-tool').show();
		}
		
	};

	obj.crop = function crop(){

		var sx = $('#sx').val();
		var sy = $('#sy').val();
		var swidth = $('#swidth').val();
		var sheight = $('#sheight').val();
		var newCanvas = document.createElement("canvas");
		newCanvas.id = "myCanvas";
		newCanvas.width = swidth;
		newCanvas.height = sheight	;
		//newCanvas.style.border = "1px solid";
		var image_target = new Image();
		canvas = document.getElementById("myCanvas");
		image_target.onload = function() {
			newCanvas.getContext('2d').drawImage(image_target, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
		}
		
		image_target.src = canvas.toDataURL();

		
		$('#canvas-container').html(newCanvas);
		$('.imgareaselect-outer').prev().hide();
		$('.imgareaselect-outer').hide();
		$('#crop-tool').removeClass('active');

	};

	obj.paintDraw = function paintDraw(){
	    var myCanvas = document.getElementById("myCanvas");
	    
	    if(myCanvas){
	        var isDown      = false;
	        var ctx = myCanvas.getContext("2d");
	        var canvasX, canvasY;
	        ctx.lineWidth = 5;
	         
	        $(myCanvas)
	        .mousedown(function(e){
	            isDown = true;
	            ctx.beginPath();
	            canvasX = e.pageX - myCanvas.offsetLeft;
	            canvasY = e.pageY - myCanvas.offsetTop;
	            ctx.moveTo(canvasX, canvasY);
	        })
	        .mousemove(function(e){
	            if(isDown != false) {
	                canvasX = e.pageX - myCanvas.offsetLeft;
	                canvasY = e.pageY - myCanvas.offsetTop;
	                ctx.lineTo(canvasX, canvasY);
	                ctx.strokeStyle = obj.color;
	                ctx.stroke();
	            }
	        })
	        .mouseup(function(e){
	            isDown = false;
	            ctx.closePath();
	        });
	    }
	     
	     
	};

	obj.ellipseDraw = function ellipseDraw(){
		var myCanvas = document.getElementById("myCanvas");
		var ctx = myCanvas.getContext('2d');
		var scribble_canvasx = $(myCanvas).offset().left;
		var scribble_canvasy = $(myCanvas).offset().top;
		var scribble_last_mousex = scribble_last_mousey = 0;
		var scribble_mousex = scribble_mousey = 0;
		var scribble_mousedown = false;
		if(myCanvas){
			$(myCanvas)
	        .mousedown(function(e){
	            scribble_last_mousex = parseInt(e.pageX-scribble_canvasx);
				scribble_last_mousey = parseInt(e.pageY-scribble_canvasy);
			    scribble_mousedown = true;

	        })
	        .mouseup(function(e){
			    scribble_mousex = parseInt(e.pageX-scribble_canvasx);
				scribble_mousey = parseInt(e.pageY-scribble_canvasy);
			    if(scribble_mousedown) {
			      
			        //Save
			        ctx.save();
			        ctx.beginPath();
			        //Dynamic scaling
			        var scalex = 1*((scribble_mousex-scribble_last_mousex)/2);
			        var scaley = 1*((scribble_mousey-scribble_last_mousey)/2);
			        ctx.scale(scalex,scaley);
			        //Create ellipse
			        var centerx = (scribble_last_mousex/scalex)+1;
			        var centery = (scribble_last_mousey/scaley)+1;

			        ctx.arc(centerx, centery, 1, 0, 2*Math.PI);
			        //Restore and draw
			        ctx.restore();
			        ctx.strokeStyle = obj.color;
			        ctx.lineWidth = 5;
			        ctx.stroke();
			    }
			    ctx.closePath();
			    scribble_mousedown = false;


	        })
	        .mousemove(function(e){
	        	//console.log(e.pageY);
	        });
		}
	};
	obj.rectDraw = function rectDraw(){
	    var myCanvas = document.getElementById("myCanvas");
	    var ctx = myCanvas.getContext('2d');
	    var scribble_canvasx = $(myCanvas).offset().left;
	    var scribble_canvasy = $(myCanvas).offset().top;
	    var scribble_last_mousex = scribble_last_mousey = 0;
	    var rect_width = rect_height = 0;
	    var scribble_mousedown = false;
	    console.log($(myCanvas).offset().left);
	    if(myCanvas){
	        $(myCanvas)
	        .mousedown(function(e){
	            scribble_last_mousex = parseInt(e.pageX-scribble_canvasx);
	            scribble_last_mousey = parseInt(e.pageY-scribble_canvasy);
	            scribble_mousedown = true;

	        })
	        .mouseup(function(e){
	            rect_width = Math.abs(parseInt(e.pageX-scribble_last_mousex-scribble_canvasx));
	            rect_height = Math.abs(parseInt(e.pageY-scribble_last_mousey-scribble_canvasy));
	            if(scribble_mousedown) {
	              
	                //Save
	                ctx.save();
	                ctx.beginPath();

	                if(scribble_last_mousey > (e.pageY - scribble_canvasy)){
	                    scribble_last_mousey = e.pageY - scribble_canvasy;
	                }

	                if(scribble_last_mousex > (e.pageX - scribble_canvasx )){
	                    scribble_last_mousex = e.pageX - scribble_canvasx;
	                }

	                ctx.rect(scribble_last_mousex, scribble_last_mousey,rect_width,rect_height);
	                //Restore and draw
	                ctx.restore();
	                ctx.strokeStyle = obj.color;
	                ctx.lineWidth = 5;
	                ctx.stroke();
	            }
	            ctx.closePath();
	            scribble_mousedown = false;


	        })
	        .mousemove(function(e){
	            //console.log(e.pageY);
	        });
	    }
	};
	obj.undo = function undo(){

		img_url = $('#img-url').val();
		if(img_url !=''){
		
			obj.createCanvas(img_url);
		}

	};

	return obj;
}()); 


$(document).ready(function(){
	Ewebshot.selectTool();
	Ewebshot.captureWebPage();
	Ewebshot.perfectLayout();
	Ewebshot.saveImage();
	$('.color-picker').colorpicker().on('changeColor.colorpicker', function(event){
	  Ewebshot.color = event.color;

	});
});

