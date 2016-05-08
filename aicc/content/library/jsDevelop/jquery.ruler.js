/**
* jQuery.Ruler v1.1
* Add Photoshop-like rulers and mouse position to a container element using jQuery.
* http://ruler.hilliuse.com
* 
* Dual licensed under the MIT and GPL licenses.
* Copyright 2013 Hillius Ettinoffe http://hilliuse.com
*/
; (function ($) {

    $.fn.ruler = function (options) {

        var defaults = {
            vRuleSize: 18,
            hRuleSize: 18,
            hRuleSpace: 5,
            ruleUnit: '',
            ruleGuidesPageX:false,
            ruleGuidesPageY:false,
            ruleGuidesArea:true,
            ruleSectionSize: 10,
            applyParentScroll:true,
            isInsideContainer:true,
            isUseVMouse: true,
            isUseHMouse:false,
            isRealPixel: false,
            showCrosshair: true,
            showMousePos: true
        }; //defaults
        var settings = $.extend({}, defaults, options);
        var $this = $(this);
        var hRule = '<div class="ruler hRule"></div>',
				vRule = '<div class="ruler vRule"></div>',
				corner = '<div class="ruler corner"></div>',
				vMouse = '<div class="vMouse_Box"><div class="vMouse"></div></div>',
				hMouse = '<div class="hMouse_Box"><div class="hMouse"></div></div>',
                dvMouse = '<div class="dvMouse"></div>',
				dhMouse = '<div class="dhMouse"></div>',
				mousePosBox = '<div class="mousePosBox">x: 50%, y: 50%</div>';
                containerRule='<div class="containerRule"></div>';
        var convertSpace = settings.hRuleSpace;
        var realScroll;
        var mouseContainerObj;
        var vthisOffsetLeft,hthisOffsetTop,containerRealWidth,containerRealHeight;
        if (!Modernizr.touch) {
            // Mouse crosshair
            if (settings.showCrosshair) {
                if (settings.isUseVMouse && settings.isUseHMouse) {
                    $('body').append(vMouse, hMouse);
                } else {
                    $('body').append(hMouse);
                }
            }
            // Mouse position
            if (settings.showMousePos) {
                $('body').append(mousePosBox);
            }
            if(settings.isInsideContainer){
                mouseContainerObj=this;
            }else{
                mouseContainerObj=window;
            }
            
            // If either, then track mouse position
            if (settings.showCrosshair || settings.showMousePos) {
                $(mouseContainerObj).mousemove(function (e) {
                    if (settings.showCrosshair) {

                         if(settings.applyParentScroll){
                                    hthisOffsetTop=$this.parent().offset().top;
                                    vthisOffsetLeft=$this.parent().offset().left;
                                    containerRealWidth=$this.parent().width();
                                    containerRealHeight=$this.parent().height();
                                }else{
                                    hthisOffsetTop=$this.offset().top;  
                                    vthisOffsetLeft=$this.offset().left;
                                    containerRealWidth=$this.width(); 
                                    containerRealHeight=$this.height();
                        }
                         $('.hMouse_Box').show();
                         $('.vMouse_Box').show();
                        if (settings.isUseVMouse &&  settings.isUseHMouse) {
//                            console.log("pageX:"+e.pageX);
                            if(settings.ruleGuidesArea){
                                  $('.hMouse_Box').height(containerRealHeight);
                                  $('.vMouse_Box').width(containerRealWidth);
                                 $('.vMouse_Box').css("left",vthisOffsetLeft);
                                 $('.hMouse_Box').css("top",hthisOffsetTop); 

                                 if(e.pageY<=hthisOffsetTop || e.pageY>containerRealHeight+hthisOffsetTop){
                                 }else{
                                    $('.vMouse_Box').css("top", e.pageY - ($(document).scrollTop()) + 1);
                                 }
                                  if(e.pageX<=vthisOffsetLeft || e.pageX>containerRealWidth+vthisOffsetLeft){
//                                     console.log("pageX1:"+e.pageX);
                                }else{
                                     $('.hMouse_Box').css("left", e.pageX-($(document).scrollLeft()) + 2);
                                }

                            }else{
                                $('.vMouse_Box').css("top", e.pageY - ($(document).scrollTop()) + 1);
                                $('.hMouse_Box').css("left", e.pageX -($(document).scrollLeft()) + 2);
                            }
                        } else {
                            if(settings.ruleGuidesArea){
                               
                                $('.hMouse_Box').height(containerRealHeight);
                                $('.hMouse_Box').css("top",hthisOffsetTop); 
                            
                                if(e.pageX>=vthisOffsetLeft && e.pageX<containerRealWidth+vthisOffsetLeft){
                              
                                     $('.hMouse_Box').css("left", e.pageX-($(document).scrollLeft()) + 2);
                                }

                            }else{
                                $('.hMouse_Box').css("left", e.pageX-($(document).scrollLeft()) + 2);
                            }
                        }
                        //-($(window).scrollTop())
                    }
                    if (settings.showMousePos) {
                        $('.mousePosBox').show();
                        if (settings.isRealPixel)
                            convertSpace = 1;
                        if($this.is("body")){
                             realScroll=$(document);
                        }else{
                             if(settings.applyParentScroll){
                                realScroll=$this.parent();
                             }else{
                                realScroll=$this;
                             }
                        }   
                        if (settings.isUseVMouse && settings.isUseHMouse) {
                            
                            if(settings.ruleGuidesArea){
                                if(e.pageY>hthisOffsetTop && e.pageY<=containerRealHeight+hthisOffsetTop &&  e.pageX>=vthisOffsetLeft && e.pageX<containerRealWidth+vthisOffsetLeft ){
                                 console.log("pageX1:"+e.pageX);
                                      $('.mousePosBox').html("x:" + (Math.floor((e.pageX+realScroll.scrollLeft()-parseInt(settings.vRuleSize)-  parseInt(vthisOffsetLeft)+2) / convertSpace)) + settings.ruleUnit+" y:" + 
                                        (Math.floor((e.pageY+realScroll.scrollTop()-parseInt(settings.hRuleSize)-  parseInt(hthisOffsetTop)+2) / convertSpace))+ settings.ruleUnit).css({
                                            top: e.pageY - ($(document).scrollTop()) + 16,
                                            left: e.pageX-($(document).scrollLeft()) + 12
                                      });
                                }
                             

                            }else{
                              $('.mousePosBox').html("x:" + (Math.floor((e.pageX+realScroll.scrollLeft()-parseInt(settings.vRuleSize)-  parseInt(vthisOffsetLeft)+2) / convertSpace)) + settings.ruleUnit+" y:" + 
                              (Math.floor((e.pageY+realScroll.scrollTop()-parseInt(settings.hRuleSize)-  parseInt(hthisOffsetTop)+2) / convertSpace))+ settings.ruleUnit).css({
                                top: e.pageY - ($(document).scrollTop()) + 16,
                                left: e.pageX-($(document).scrollLeft()) + 12
                              });
                            }
                        }else{
                           
                           if(settings.ruleGuidesArea){
                                if(e.pageY>hthisOffsetTop && e.pageY<=containerRealHeight+hthisOffsetTop &&  e.pageX>=vthisOffsetLeft && e.pageX<containerRealWidth+vthisOffsetLeft ){
                                    $('.mousePosBox').html("x:" + ((e.pageX+realScroll.scrollLeft()-parseInt(settings.vRuleSize)-  parseInt(vthisOffsetLeft)+2) / convertSpace) + settings.ruleUnit).css({
                                        top: e.pageY - ($(document).scrollTop()) + 16,
                                        left: e.pageX-($(document).scrollLeft()) + 12
                                    });
                                }
                           }else{
                                $('.mousePosBox').html("x:" + (Math.floor((e.pageX+realScroll.scrollLeft()-parseInt(settings.vRuleSize)-  parseInt(vthisOffsetLeft)+2) / convertSpace)) + settings.ruleUnit).css({
                                    top: e.pageY - ($(document).scrollTop()) + 16,
                                    left: e.pageX-($(document).scrollLeft()) + 12
                                });
                           }
                        }
                    }
                }).mouseleave(function(e){
                     $('.hMouse_Box').hide();
                     $('.vMouse_Box').hide();
                     $('.mousePosBox').hide();
                });
            }
           

        }

        //resize
        $(window).resize(function (e) {
            var $hRule = $('.hRule');
            var $vRule = $('.vRule');
            $hRule.empty();
            $vRule.empty().height(0).outerHeight($vRule.parent().outerHeight());
            //------------------------------------------------------------------------
            var hRuleOffset=0;
            var scrollWidth=0;
            var scrollHeight=0;
            var hRealWidth=0;
            var vRealHeight=0;
            var cutVRuleSize=0;
            var cutHRuleSize=0;
            var currentThis;
            // Attach rulers containerRule
            if($hRule.parent()!=undefined){
                $this=$hRule.parent();
            }else if($vRule.parent()!=undefined){
                $this=$vRule.parent();
            }
            var currentObj;
            if(settings.applyParentScroll){
                currentObj=$this.parent();
            }else{
                currentObj=$this;  
            }
            // Should not need 1 min padding-top of 1px but it does
            // will figure it out some other time
            //$this.css("padding-top", settings.hRuleSize + 1 + "px");
            if (settings.hRuleSize > 0) {
               
                if($this.children('.hRule').parent().is("body")){
                   $this.children('.hRule').width($(document).width());
                }else{
                    currentObj.scroll(function(){
                        $this.children('.hRule').css("top", currentObj.scrollTop());
                    });

                    $this.children('.hRule').css("position", "absolute");
                    $this.children('.hRule').css("left", settings.vRuleSize);
                    $this.css("position", "relative");


                    if($this.css("overflow")=="visible" && !settings.applyParentScroll){
                        $this.children('.hRule').width($this.children('.hRule').width()-settings.hRuleSize-1);    
                    }else{
                        
                        if(settings.applyParentScroll){
                          
                                scrollWidth=currentObj.get(0).scrollWidth;
                        }else{
                                scrollWidth=currentObj.get(0).scrollWidth;
                        }
                        if(scrollWidth>$this.children('.hRule').width()){
                            hRealWidth=scrollWidth;
                        }else{
                            hRealWidth=$this.children('.hRule').width();
                        }
                        $this.children('.hRule').width(hRealWidth);//scollWidth and border is 19px
                   }
                }
            }

            if (settings.vRuleSize > 0) {

                if($this.children('.vRule').parent().is("body")){

                  $this.css("padding-left", settings.vRuleSize + 1 + "px").outerWidth(oldWidth);             

                }else{
                    scrollHeight=currentObj.get(0).scrollHeight;
                   
                    currentObj.scroll(function(){
                        $this.children('.vRule').css("left", currentObj.scrollLeft());
                    });
                    if(scrollHeight>$this.children('.vRule').height()){
                            vRealHeight=scrollHeight;
                     }else{
                            vRealHeight=$this.children('.vRule').height();
                     }
                     $this.children('.vRule').height(vRealHeight);
                 }

                var oldWidth = $this.outerWidth();
                
               
            }

            if ((settings.vRuleSize > 0) && (settings.hRuleSize > 0)) {
                $this.width($this.get(0).scrollWidth-2);

                hRuleOffset=settings.vRuleSize;
            }


            //------------------------------------------------------------------------
            // Horizontal ruler ticks
            var hRuleOffset=0;
            if ((settings.vRuleSize > 0) && (settings.hRuleSize > 0)) {
                hRuleOffset=settings.vRuleSize;
            }
            var tickLabelPos = settings.vRuleSize;
            var tickhRuleSpace = settings.hRuleSpace;
            var tickRuleUnit = settings.ruleUnit;
            var tickIsRealPixel = settings.isRealPixel;
            var tickRuleSectionSize = settings.ruleSectionSize;
            var i = 0;
            var newTickLabel = "";
            if (tickhRuleSpace < 5)
                tickhRuleSpace = 5;
            if (tickRuleSectionSize < 5)
                tickRuleSectionSize = 5;
            while (tickLabelPos-hRuleOffset <= $hRule.width()) {
                if ((i % tickRuleSectionSize) == 0) {
                    if (tickIsRealPixel)
                        newTickLabel = "<div class='tickLabel'>" + (tickLabelPos - settings.vRuleSize) + tickRuleUnit + "</div>";
                    else
                        newTickLabel = "<div class='tickLabel'>" + (tickLabelPos - settings.vRuleSize) / tickhRuleSpace + tickRuleUnit + "</div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                } else if ((i % 2) == 0) {
                    newTickLabel = "<div class='tickMajor'></div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                } else {
                    newTickLabel = "<div class='tickMinor'></div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                }
                i++;
                tickLabelPos = (tickLabelPos + tickhRuleSpace);
            } //hz ticks

            // Vertical ruler ticks
            tickLabelPos = settings.hRuleSize;
            i = 0;
            newTickLabel = "";
            while (tickLabelPos <= $vRule.height()) {
                if ((i % tickRuleSectionSize) == 0) {
                    if (tickIsRealPixel)
                        newTickLabel = "<div class='tickLabel'><span>" + (tickLabelPos - settings.hRuleSize) + tickRuleUnit + "</span></div>";
                    else
                        newTickLabel = "<div class='tickLabel'><span>" + (tickLabelPos - settings.hRuleSize) / tickhRuleSpace + tickRuleUnit + "</span></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                } else if ((i % 2) == 0) {
                    newTickLabel = "<div class='tickMajor'></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                } else {
                    newTickLabel = "<div class='tickMinor'></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                }
                i++;
                tickLabelPos = (tickLabelPos + tickhRuleSpace);
            } //vert ticks					
        }); //resize

        return this.each(function () {
            var $this = $(this);
            var hRuleOffset=0;
            var scrollWidth=0;
            var scrollHeight=0;
            var hRealWidth=0;
            var vRealHeight=0;
            var cutVRuleSize=0;
            var cutHRuleSize=0;
            var currentThis;
            // Attach rulers containerRule
            var currentObj;
            if(settings.applyParentScroll){
                currentObj=$this.parent();
            }else{
                currentObj=$this;  
            }
            // Should not need 1 min padding-top of 1px but it does
            // will figure it out some other time
            //$this.css("padding-top", settings.hRuleSize + 1 + "px");
            if (settings.hRuleSize > 0) {
                $(hRule).height(settings.hRuleSize).prependTo($this);
                if($this.children('.hRule').parent().is("body")){
                   $this.children('.hRule').width($(document).width());
                }else{

                    currentObj.scroll(function(){
                        $this.children('.hRule').css("top", currentObj.scrollTop());
                    });

                    $this.children('.hRule').css("position", "absolute");
                    $this.children('.hRule').css("left", settings.vRuleSize);
                    $this.css("position", "relative");


                    if($this.css("overflow")=="visible" && !settings.applyParentScroll){
                        $this.children('.hRule').width($this.children('.hRule').width()-settings.hRuleSize-1);    
                    }else{
                        
                        if(settings.applyParentScroll){
                          
                                scrollWidth=$this.parent().get(0).scrollWidth;
                        }else{
                                scrollWidth=$this.get(0).scrollWidth;
                        }
                        if(scrollWidth>$this.children('.hRule').width()){
                            hRealWidth=scrollWidth;
                        }else{
                            hRealWidth=$this.children('.hRule').width();
                        }
                        $this.children('.hRule').width(hRealWidth);//scollWidth and border is 19px
                   }
                }
            }

            if (settings.vRuleSize > 0) {
                //$('.hRule').css("position", "fixed");

                $(vRule).width(settings.vRuleSize).height($this.outerHeight()).prependTo($this);

                if($this.children('.vRule').parent().is("body")){

                  $this.css("padding-left", settings.vRuleSize + 1 + "px").outerWidth(oldWidth);             

                }else{
//                     $this.children('.vRule').css("position", "relative");
//                     $this.children('.vRule').css("float", "left");
                    scrollHeight=currentObj.get(0).scrollHeight;
                   
                    currentObj.scroll(function(){
                        $this.children('.vRule').css("left", currentObj.scrollLeft());
                    });
                    if(scrollHeight>$this.children('.vRule').height()){
                            vRealHeight=scrollHeight;
                     }else{
                            vRealHeight=$this.children('.vRule').height();
                     }
                     $this.children('.vRule').height(vRealHeight);
                 }

                var oldWidth = $this.outerWidth();
                
               
            }

            if ((settings.vRuleSize > 0) && (settings.hRuleSize > 0)) {
                if($this.children('.hRule').parent().is("body")){
                    $(corner).css({
                        width: settings.vRuleSize,
                        height: settings.hRuleSize
                    }).prependTo($this);
                }

                $this.width($this.get(0).scrollWidth-2);

                hRuleOffset=settings.vRuleSize;
            }


            var $hRule = $this.children('.hRule');
            var $vRule = $this.children('.vRule');

            // Horizontal ruler ticks
            var tickLabelPos = settings.vRuleSize;
            var tickhRuleSpace = settings.hRuleSpace;
            var tickRuleUnit = settings.ruleUnit;
            var tickIsRealPixel = settings.isRealPixel;
            var tickRuleSectionSize = settings.ruleSectionSize;
            var i = 0;
            var newTickLabel = "";
            if (tickhRuleSpace < 5)
                tickhRuleSpace = 5;
            if (tickRuleSectionSize < 5)
                tickRuleSectionSize = 5;
            while (tickLabelPos-hRuleOffset <= $hRule.width()) {
                if ((i % tickRuleSectionSize) == 0) {
                    if (tickIsRealPixel)
                        newTickLabel = "<div class='tickLabel'>" + (tickLabelPos - settings.vRuleSize) + tickRuleUnit + "</div>";
                    else
                        newTickLabel = "<div class='tickLabel'>" + (tickLabelPos - settings.vRuleSize) / tickhRuleSpace + tickRuleUnit + "</div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                } else if ((i % 2) == 0) {
                    newTickLabel = "<div class='tickMajor'></div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                } else {
                    newTickLabel = "<div class='tickMinor'></div>";
                    $(newTickLabel).css("left", tickLabelPos-hRuleOffset + "px").appendTo($hRule);
                }
                i++;
                tickLabelPos = (tickLabelPos + tickhRuleSpace);
            } //hz ticks

            // Vertical ruler ticks
            tickLabelPos = settings.hRuleSize;
            i = 0;
            newTickLabel = "";
            while (tickLabelPos <= $vRule.height()) {
                if ((i % tickRuleSectionSize) == 0) {
                    if (tickIsRealPixel)
                        newTickLabel = "<div class='tickLabel'><span>" + (tickLabelPos - settings.hRuleSize) + tickRuleUnit + "</span></div>";
                    else
                        newTickLabel = "<div class='tickLabel'><span>" + (tickLabelPos - settings.hRuleSize) / tickhRuleSpace + tickRuleUnit + "</span></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                } else if ((i % 2) == 0) {
                    newTickLabel = "<div class='tickMajor'></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                } else {
                    newTickLabel = "<div class='tickMinor'></div>";
                    $(newTickLabel).css("top", tickLabelPos + "px").appendTo($vRule);
                }
                i++;
                tickLabelPos = (tickLabelPos + tickhRuleSpace);
            } //vert ticks					
          
            var vRuleWidth=currentObj.offset().left+currentObj.width();
            if(settings.ruleGuidesPageX){
                $('.vRule').mousedown(function (e) {

                    $('body').append(hMouse);

                    var r,o_x;
                    if (e) {
                        r = window.getSelection(); r.removeAllRanges();
                    }
                    else {
                        var r = document.selection.createRange();
                        if (r.text.length > 0) { r.move('character', r.text.length); r.select(); }
                    }

                    if(settings.ruleGuidesArea){
                        $('.hMouse_Box:last').height(currentObj.height());
                        $('.hMouse_Box:last').css("top",currentObj.offset().top);
                    }

                    $(document).mousemove(function (e) {
                        console.log("mousemove");

                        $('.hMouse_Box:last').css("left", e.pageX + 1);

                    }).mouseup(function (e) {
                        console.log("mouseup");
                        o_x=e.pageX;//$('.hMouse_Box:last').css("left");
                        $('.hMouse_Box:last').remove();
                        $(document).unbind('mousemove').unbind('mouseup');
                        if(o_x<=vRuleWidth && o_x>currentObj.offset().left+settings.vRuleSize){
                            $this.append(hMouse);//pointer
                            $('.hMouse_Box:last').css("cursor","e-resize");
                            $('.hMouse_Box:last').css("left",o_x-currentObj.offset().left+currentObj.scrollLeft()).draggable({axis:"x"});
                        }
                        if(settings.ruleGuidesArea){
                            $('.hMouse_Box:last').height(currentObj.get(0).scrollHeight);
                            //$('.hMouse_Box:last').css("top",currentObj.offset().top);
                        }else{
                             $('.hMouse_Box:last').height("2000px");
                        }

                         $('.hMouse_Box:last').mouseup(function (p) {
                            var t=this;
                            console.log($('.vRule').offset());
                            var vRuleOffset=currentObj.offset().left+settings.vRuleSize;
                            $(document).mousemove().mouseup(function (e) {
                                 $(document).unbind('mousemove').unbind('mouseup');
                                if(e.pageX<=vRuleOffset || e.pageX>vRuleWidth){
                               
                                        console.log("t",t);
                                        $(t).remove();
                                    }
                             });
                    
                         });
                    });
                });
            }
            var hRuleHeight=currentObj.offset().top+currentObj.height();

             if(settings.ruleGuidesPageY){
                 $('.hRule').mousedown(function (e) { 
                     $('body').append(vMouse);
                    //currentObj.append(vMouse);
                     var r,o_x;
                    if (e) {
                        r = window.getSelection(); r.removeAllRanges();
                    }
                    else {
                        var r = document.selection.createRange();
                        if (r.text.length > 0) { r.move('character', r.text.length); r.select(); }
                    }

                     if(settings.ruleGuidesArea){
                        $('.vMouse_Box:last').width(currentObj.width());
                        $('.vMouse_Box:last').css("left",currentObj.offset().left);
                    }

                    $(document).mousemove(function (e) {
                        console.log("mousemove");

                        $('.vMouse_Box:last').css("top", e.pageY + 1);

                    }).mouseup(function (e) {
                        console.log("mouseup");
                        o_y=e.pageY;//$('.vMouse_Box:last').css("top");
                        $('.vMouse_Box:last').remove();
                        $(document).unbind('mousemove').unbind('mouseup');
                        if(o_y<=hRuleHeight && o_y>currentObj.offset().top+settings.hRuleSize){
                            //$('body').append(vMouse);//pointer
                            $this.append(vMouse);
                            $('.vMouse_Box:last').css("cursor","s-resize");
                            $('.vMouse_Box:last').css("top",o_y-currentObj.offset().top+currentObj.scrollTop()).draggable({axis:"y"});
                             if(settings.ruleGuidesArea){
                                 $('.vMouse_Box:last').width(currentObj.get(0).scrollWidth);
                                 //$('.vMouse_Box:last').css("left",currentObj.offset().left);
                            }
                        }
                         $('.vMouse_Box:last').mouseup(function (p) {
                            var t=this;
                            var hRuleOffset=currentObj.offset().left+settings.hRuleSize;
                            $(document).mousemove().mouseup(function (e) {
                                $(document).unbind('mousemove').unbind('mouseup');
                                if(e.pageY<=hRuleOffset || e.pageY>hRuleHeight){
                                        $(t).remove();
                                    }
                             });
                    
                         });
                    });

                 });
             }
             

        }); //each		

    }; //ruler





})(jQuery);