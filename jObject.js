/******************************************************************************
 * Copyright (C) 2012 by Pi Ke												  *
 *																			  *
 * Permission is hereby granted, free of charge, to any person obtaining a 	  *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:		  *
 *																			  *
 * The above copyright notice and this permission notice shall be included in *
 * all copies or substantial portions of the Software.						  *
 *																			  *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE*
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER     *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS*
 * IN THE SOFTWARE.															  *
 ******************************************************************************
 * File 		: jObject.js                                                  *
 * Email		: admin@pixelstech.net                                        *
 * Website		: http://pixelstech.net                                       *
 * Description  : jObject is a JavaScript API which helps users to define     * 
 *                JavaScrip behaviors systematically and consistently. It     *
 *                creates many frequently used objects and it is also cross   * 
 *                platform compatible.It provides some frequently used        * 
 *                functions when doing web programming such as document       *
 *                element css settings,event handling, form validation and    *
 *                AJAX. All these processes are abstracted and encapsulated so*
 *                that users no need to know the internal working rationale of*
 *                these  processes.It can largely release the developer from  *
 *                the tedious JavaScript processing so that you can focus on  *
 *                the functionalities of the web applications.                *
 * ============================================================================
 * Version      Date       Author                    Comment
 * ============================================================================
 * v1.0.0     2011-12-05   Pi Ke           Initial creation
 * v1.1.0     2012-12-29   Pi Ke           Add getMousePageX() and fix some bugs
 * ============================================================================
 * NOTICE : This file conforms to MIT free distribution license
 ******************************************************************************/
function $(selector){
	return (new jObject(selector)).init();
}
/******************************************************************************
 *  Object 		: jObject
 *  Description : Main object in this module, it connects all parts of the 
 *                module and define the behaviors of this module
 *  Parameters  : selector -- id     : #{id}
 *  						  name	 : ${name}
 *  						  class  : .{class}
 *  						  tag	 : tagName
 ******************************************************************************/
function jObject(selector)
{
	/* Define the HTML object which is currently selected */
	this.element=document;	
	/* Define the HTML objects which are currently selected */
	this.elements=null;
	/* The selector specified by user */
	this.selector=selector;
	/* Current selected element type */
	this.elementType=jObject.ELEMENT;
	/* Applied to collection of elements. Specify the current selected
	 * element in the collection of elements */
	this.elementIndex=-1;
}
jObject.prototype={
		init:function(){
			/* If the user put the element itself in */
			if(typeof this.selector=="object"){
				if(this.selector.length){
					this.elements=this.selector;
				}else{
					this.element=this.selector;
				}
			}else if(this.selector!="undefined"&&this.selector!=null){
				this.retrieveElement(this.selector);
			}
			return this;
		},
		/* Get element by ID */
		_id:function(id){
			if(this.element==document){
				this.element=this.element.getElementById(id);
				this.elementType=jObject.ELEMENT;
			}else{
				var errorObj=new ModalWindow("ID can be applied to only document object",ModalWindow.ERROR,"ID Error");
				errorObj.init();
				errorObj.show();
			}
			return this;
		},
		/* Get elements by name */
		_name:function(name){
			if(this.element==document){
				this.elements=this.element.getElementsByName(name);
				this.elementType=jObject.COLLECTION;
			}
			return this;
		},
		/* Get element which has unique name */
		_unique_name:function(name){
			this._name(name);
			this.first();
			this.elementType=jObject.ELEMENT;
			return this;
		},
		/* Get elements by tag name */
		_tagName:function(tagName){
			this.elements=this.element.getElementsByTagName(tagName);
			this.elementType=jObject.COLLECTION;
			return this;
		},
		/******************************************************************** 
		 * Function 	: _class()
		 * Description	: Get elements by class name. 
		 * Parameters	: className--class name to be matched
		 * 				  tag--Optional, to narrow down macthed element,match 
		 * 			           elements with class name className and tag name
		 * 					   tag
		 * 
		 *	NOTICE:
		 *  This function is developed by Robert Nyman, http://www.robertnyman.com
		 *	Code/licensing: http://code.google.com/p/getelementsbyclassname/
		 ********************************************************************/
		_class:function(className,tag){
			this.elements=new Array();
			if (document.getElementsByClassName) {
				var elements = this.element.getElementsByClassName(className),
					nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
					current;
				if(nodeName) {
					for(var i=0, il=elements.length; i<il; i+=1){
						current = elements[i];
						if(nodeName.test(current.nodeName)) {
							this.elements.push(current);
						}
					}
				}else{
					this.elements=elements;
				}
			}else if (document.evaluate) {
					tag = tag || "*";
					var classes = className.split(" "),
						classesToCheck = "",
						xhtmlNamespace = "http://www.w3.org/1999/xhtml",
						namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
						elements,
						node;
					for(var j=0, jl=classes.length; j<jl; j+=1){
						classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
					}
					try	{
						elements = document.evaluate(".//" + tag + classesToCheck, this.element, namespaceResolver, 0, null);
					}
					catch (e) {
						elements = document.evaluate(".//" + tag + classesToCheck, thie.element, null, 0, null);
					}
					while ((node = elements.iterateNext())) {
						this.elements.push(node);
					}
			}else {
					tag = tag || "*";
					var classes = className.split(" "),
						classesToCheck = [],
						elements = (tag === "*" && this.element.all)? this.element.all : this.element.getElementsByTagName(tag),
						current,
						match;
					for(var k=0, kl=classes.length; k<kl; k+=1){
						classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
					}
					for(var l=0, ll=elements.length; l<ll; l+=1){
						current = elements[l];
						match = false;
						for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
							match = classesToCheck[m].test(current.className);
							if (!match) {
								break;
							}
						}
						if (match) {
							this.elements.push(current);
						}
					}
			}
			return this.elements;
		},
		/* Recursively get elements */
		$:function(selector){
			this.retrieveElement(selector);
			return this;
		},
		/* Get first element of a collection of elements */
		first:function(){
			if(this.elements!=null){	
				this.element=this.elements[0];
				this.elementType=jObject.ELEMENT;
				this.elementIndex=0;
			}
			return this;
		},
		/* Get last element of a collection of elements */
		last:function(){
			if(this.elements!=null){
				this.element=this.elements[this.elements.length-1];
				this.elementType=jObject.ELEMENT;
				this.elementIndex=this.elements.length-1;
			}
			return this;
		},
		/* Get previous element in the collection of elements */
		previous:function(){
			if(this.elementIndex>0){
				this.element=this.elements[--this.elementIndex];
				this.elementType=jObject.ELEMENT;
			}else{
				this.element=null;
			}
			return this;
		},
		/* Get next element in the collection of elements */
		next:function(){
			if(this.elementIndex<(this.elements.length-1)){
				this.element=this.elements[++this.elementIndex];
				this.elementType=jObject.ELEMENT;
			}else{
				this.element=null;
			}
			return this;
		},
		/****************************************************************
		 * Next section is to do the element operation, such as CSS style
		 * settings
		 ****************************************************************/
		/* Set style of element */
		setStyle:function(style){
			if(this.elementType==jObject.ELEMENT){
				this.element.style.cssText=style;
			}else{
				for(var i=0;i<this.elements.length;i++){
					this.elements[i].style.cssText=style;
				}
			}
			return this;
		},
		/* Get style of element */
		getStyle:function(){
			if(this.elementType!=jObject.COLLECTION){
				var cssText="";
				if(window.getComputedStyle){            //For Firefox and Chrome			
					var style=window.getComputedStyle(this.element,null);
					var cssPair=new Array();
					for(var i=0;i<style.length;i++){
						var value=style.getPropertyValue(style.item(i).toUpperCase());
						if(value!="undefined"&&value!=null){
							cssPair.push(style.item(i)+":"+value);
						}
					}
					cssText=cssPair.join(";");
				}else if(this.element.currentStyle){	//For IE
					var style=this.element.currentStyle;
					var cssPair=new Array();
					for(var prop in style){
						cssPair.push(prop+":"+style[prop]);
					}
					cssText=cssPair.join(";");
				}else{
					//Only get the inline style
					if(this.element.style&&this.element.style.cssText){
						cssText=this.element.style.cssText;
					}else{
						cssText=this.element.getAttribute("style");
					}
				}
				
				for(var key in DOMCSSMap){
					cssText=cssText.replace(key,DOMCSSMap[key]);
				}
				return cssText.concat(";");
			}else{
				var errorObj=new ModalWindow("Cannot get style for a collection of elements at the same time",ModalWindow.ERROR,"Style getting error");
				errorObj.init();
				errorObj.show();
			}
		},
		/* Get style for one single property */
		getSingleStyle:function(name){
			var value="undefined";
			if(this.element.currentStyle){	    //For IE
				value=this.element.currentStyle[name];
			}else if(window.getComputedStyle){	//For Firefox and Chrome
				value=window.getComputedStyle(this.element,null).getPropertyValue(name);
			}else{	//For others
				var style=this.element.style.cssText.toUpperCase()+";";
				var matchEx=new RegExp(";[\s| ]*"+name+".*?;","i");
				if(matchEx.test(style)){
					var str=matchEx.exec(style);
					value=str.substring(str.indexOf(":")+1,str.length-1);
				}
			}
			return value;
		},
		/* Add style to element */
		addStyle:function(style){
			var newStyle=this.getStyle();
			this.setStyle(newStyle+style);
			//alert(this.getStyle());
			return this;
		},
		/* Remove style from element */
		removeStyle:function(name){
			var style=this.getStyle().toUpperCase();
			var matchEx=new RegExp(";[\s| ]*"+name+".*?;","i");
			if(matchEx.test(style)){
				var str=matchEx.exec(style);
				style=style.replace(str,"")+";";
			}else if(style.indexOf(name.toUpperCase())==0){
				var regEx=new RegExp("^"+name+".*?;","i");
				style=style.replace(regEx,"");
			}
			this.setStyle(style);
			return this;
		},
		/* Modify one style */
		modifyStyle:function(name,newStyle){
			var style=this.getStyle().toUpperCase();
			var matchEx=new RegExp(";[\s| ]*"+name+".*?;","i");
			if(matchEx.test(style)){
				var str=matchEx.exec(style);
				style=style.replace(str,";"+name.toUpperCase()+":"+newStyle+";");
			}else if(style.indexOf(name.toUpperCase())==0){
				var regEx=new RegExp("^"+name+".*?;","i");
				style=style.replace(regEx,name.toUpperCase()+":"+newStyle+";");
			}else{
				style=style+name+":"+newStyle+";";
			}
			
			this.setStyle(style);		
			return this;
		},
		/* Set inner html of the specified element */
		setHtml:function(html){
			this.element.innerHTML=html;
			return this;
		},
		/* Get inner html of the specified element */
		getHtml:function(){
			return this.element.innerHTML;
		},
		/* Append HTML to the specified element */
		appendHtml:function(html){
			this.element.innerHTML+=html;
			return this;
		},
		/* Prepend html to the specified element */
		prependHtml:function(html){
			this.element.innerHTML=html+this.element.innerHTML;
			return this;
		},
		/* Set inner text of the specified element */
		setText:function(text){
			this.element.innerText=text;
			return this;
		},
		/* Get inner text of the specified element */
		getText:function(){
			return this.element.innerText;
		},
		/* Append text to the specified element */
		appendText:function(text){
			this.element.innerText+=text;
			return this;
		},
		/* Prepend text to the specified element */
		prependText:function(text){
			this.element.innerText=text+this.element.innerText;
			return this;
		},
		/* Set value of HTML element attribute */
		setProperty:function(name,value){
			this.element.setAttribute(name,value);
			return this;
		},
		/* Get value of HTML element attribute */
		getProperty:function(name){
			return this.element.getAttribute(name);
		},
		/* Check whether a property is present or not */
		hasProperty:function(name){
			if(this.getProperty(name)!="undefined"&&this.getProperty(name)!=null){
				return true;
			}
			return false;
		},
		/* Remove property from the element */
		removeProperty:function(name){
			if(this.hasProperty(name)){
				this.element.removeAttribute(name);
			}
			return this;
		},
		/* Set value of HTML input element attribute */
		setValue:function(value){
			if(this.element!=null){
				this.element.value=value;
			}
			return this;
		},
		/* Get value of HTML input element attribute */
		getValue:function(){
			if(this.element!=null){
				return this.element.value;
			}
			return null;
		},
		/* Add event listener to the specified element */
		addEventListener:function(type,handler){
			switch(this.elementType){
			case jObject.ELEMENT    : EventHandler.addEventHandler(this.element,type,handler);break;
			case jObject.COLLECTION : {
										var size=this.elements.length;
										for(var i=0;i<size;i++){
											EventHandler.addEventHandler(this.elements[i],type,handler);
										}
									   };break;
			}
		},
		/* Remove event listener from the specified element */
		removeEventListener:function(type,handler){
			switch(this.elementType){
			case jObject.ELEMENT    : EventHandler.removeEventHandler(this.element,type,handler);break;
			case jObject.COLLECTION : {
										var size=this.elements.length;
										for(var i=0;i<size;i++){
											EventHandler.removeEventHandler(this.elements[i],type,handler);
										}
									  };break;
			}
		},
		/* Get class of an element */
		getClass:function(){
			return this.element.className;
		},
		/* Get the current selected element */
		getElement:function(){
			return this.element;
		},
		/* Get the current selected elements */
		getElements:function(){
			return this.elements;
		},
		/* Get element by id, class or tag name */
		retrieveElement:function(selector){
			if(selector!="undefined"&&selector!=null){
				switch(selector.charAt(0)){
				case "#":this.element=document.getElementById(selector.substr(1));this.elementType=jObject.ELEMENT;break;
				case "$":this.elements=this.element.getElementsByName(selector.substr(1));this.elementType=jObject.COLLECTION;break;
				case ".":this.elements=this._class(selector.substr(1));this.elementType=jObject.COLLECTION;break;
				default:this.elements=this.element.getElementsByTagName(selector);this.elementType=jObject.COLLECTION;break;
				}
			}else{
				var errorObj=new ModalWindow("Cannot find the element specified. Make sure you put the correct name",ModalWindow.ERROR,"No element found");
				errorObj.init();
				errorObj.show();
			}
		}
};
jObject.ELEMENT    = 1;
jObject.COLLECTION = 2;
/* *
 * DOM and CSS style attributes mapping 
 * key   -- attributes in DOM object
 * value -- css property
 * */
var DOMCSSMap=new Array();
DOMCSSMap["backgroundAttachment"] = "background-attachment";
DOMCSSMap["backgroundColor"] 	  = "background-color";
DOMCSSMap["backgroundImage"] 	  = "background-image";
DOMCSSMap["backgroundPosition"]   = "background-position";
DOMCSSMap["backgroundRepeat"]     = "background-repeat";
DOMCSSMap["borderColor"]   		  = "border-color";
DOMCSSMap["borderStyle"]  		  = "border-style";
DOMCSSMap["borderTop"]   	      = "border-top";
DOMCSSMap["borderRight"]   	      = "border-right";
DOMCSSMap["borderLeft"]   	      = "border-left";
DOMCSSMap["borderBottom"]   	  = "border-bottom";
DOMCSSMap["borderTopColor"]   	  = "border-top-color";
DOMCSSMap["borderRightColor"]     = "border-right-color";
DOMCSSMap["borderBottomColor"]    = "border-bottom-color";
DOMCSSMap["borderLeftColor"]   	  = "border-left-color";
DOMCSSMap["borderTopStyle"]   	  = "border-top-style";
DOMCSSMap["borderRightStyle"]     = "border-right-style";
DOMCSSMap["borderBottomStyle"]    = "border-bottom-style";
DOMCSSMap["borderLeftStyle"]   	  = "border-left-style";
DOMCSSMap["borderTopWidth"]   	  = "border-top-width";
DOMCSSMap["borderRightWidth"]     = "border-right-width";
DOMCSSMap["borderBottomWidth"]    = "border-bottom-width";
DOMCSSMap["borderLeftWidth"]   	  = "border-left-width";
DOMCSSMap["borderWidth"]   	      = "border-width";
DOMCSSMap["cssFloat"]   	      = "float";
DOMCSSMap["fontFamily"]   	      = "font-family";
DOMCSSMap["fontSize"]   	      = "font-size";
DOMCSSMap["fontStyle"]   	      = "font-style";
DOMCSSMap["fontVariant"]   	      = "font-variant";
DOMCSSMap["fontWeight"]   	      = "font-weight";
DOMCSSMap["letterSpacing"]   	  = "letter-spacing";
DOMCSSMap["lineHeight"]   	      = "line-height";
DOMCSSMap["listStyle"]   	      = "list-style";
DOMCSSMap["listStyleImage"]   	  = "list-style-image";
DOMCSSMap["listStylePosition"]    = "list-style-position";
DOMCSSMap["listStyleType"]   	  = "list-style-type";
DOMCSSMap["marginTop"]   	  	  = "margin-top";
DOMCSSMap["marginRight"]   	  	  = "margin-right";
DOMCSSMap["marginLeft"]   	  	  = "margin-left";
DOMCSSMap["marginBottom"]   	  = "margin-bottom";
DOMCSSMap["paddingTop"]   	  	  = "padding-top";
DOMCSSMap["paddingRight"]   	  = "padding-right";
DOMCSSMap["paddingLeft"]   	  	  = "padding-left";
DOMCSSMap["paddingBottom"]   	  = "padding-bottom";
DOMCSSMap["textAlign"]   	  	  = "text-align";
DOMCSSMap["textDecoration"]   	  = "text-decoration";
DOMCSSMap["textIndent"]   	  	  = "text-indent";
DOMCSSMap["textTransform"]   	  = "text-transform";
DOMCSSMap["verticalAlign"]   	  = "vertical-align";
DOMCSSMap["whiteSpace"]   	  	  = "white-space";
DOMCSSMap["wordSpacing"]   	  	  = "word-spacing";
DOMCSSMap["zIndex"]		     	  = "z-index";
/************************************************************************
 * Object		: EventHandler
 * Description  : It is to define the cross browser compatible event handle 
 *		          object (BOM),it defines some methods related to client event
 *				  such as addEventHandler and getEvent. All user related events
 *                such as mouse click, move, keydown, keypress can be handled 
 *                by this object. It can also tess the mouse position and event
 *                target when a particular event trggered.
 ************************************************************************/
var EventHandler={
		addEventHandler:function(element,type,handler){
			if(element!=null){
				if(element.addEventListener){
					element.addEventListener(type,handler,false);
				}else if(element.attachEvent){
					element.attachEvent("on"+type,handler);
				}else{
					element["on"+type]=handler;
				}
			}
		},
		removeEventHandler:function(element,type,handler){
			if(element!=null){
				if(element.removeEventListener){
					element.removeEventListener(type,handler,false);
				}else if(element.detachEvent){
					element.detachEvent("on"+type,handler);
				}else{
					element["on"+type]=null;
				}
			}
		},
		getEvent:function(event){
			return event?event:window.event;
		},
		getTarget:function(event){
			return event.target||event.srcElement;
		},
		getMouseX:function(event){
			var e=EventHandler.getEvent(event);
			return e.clientX;
		},
		getMouseY:function(event){
			var e=EventHandler.getEvent(event);
			return e.clientY;
		},
		getMouseScreenX:function(event){
			var e=EventHandler.getEvent(event);
			return e.screenX;
		},
		getMouseScreenY:function(event){
			var e=EventHandler.getEvent(event);
			return e.screenY;
		},	
		getMousePageX:function(event){
			var e=EventHandler.getEvent(event);
			var x=e.pageX;
			if(x===undefined){
				x=e.clientX+(document.body.scrollLeft || document.documentElement.scrollLeft);
			}
			return x;
		},
		getMousePageY:function(event){
			var e=EventHandler.getEvent(event);
			var y=e.pageY;
			if(y===undefined){
				y=e.clientY+(document.body.scrollTop || document.documentElement.scrollTop);
			}
			return y;
		},	
		getMouseButton:function(event){
			if(document.implementation.hasFeature("MouseEvnts","2.0")){
				return event.button;
			}else{
				switch(event.button){
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0;						//Left button is clicked
					case 2:
					case 6:
						return 2;						//Right button is clicked
					case 4:
						return 1;						//Middle button is clicked
				}
			}
		},
		getMouseWheelDirection:function(event){
			if(event.wheelDelta)
				return (event.wheelDelta>0)?1:-1;				//1 indicates toword front of mouse,-1 toworm back of mouse
			else
				return (event.detail>0)?-1:1;
		},
		getKeyCode:function(event){
			if(event.which){					//Firefox
				return event.which;
			}else if(typeof event.charCode=="number"){
				return event.charCode;
			}else{								//IE
				return event.keyCode;
			}
		},
		preventDefault:function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returneValue=false;
			}
		},
		stopPropagation:function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble=true;
			}
		},
		getClipboardData:function(event){
			var clip=(event.clipboardData||window.clipboardData);
			return clip.getData("text");
		},
		setClipboardData:function(event,data){
			if(event.clipboardData){
				return event.clipboardData.setData("text/plain",data);
			}else{
				return window.clipboardData.setData("text",data);
			}
		}
};
/************************************************************************
 * Object		: Broswer
 * Description  : It is to define the cross browser compatible browser 
 *		          object model(BOM),it defines some properties related to 
 *				  browser such as browser width and height
 ************************************************************************/
var Browser={
	/* Get browser window width */
	getWidth:function(){
		var windowWidth=window.innerWidth;	
		if(typeof windowWidth!="number"){
			if(document.documentElement){
				windowWidth=document.documentElement.clientWidth;
			}else{	
				windowWidth=document.body.clientWidth;
			}	
		}
		return windowWidth;
	},
	/* Get browser window height */
	getHeight:function(){
		var windowHeight=window.innerHeight;
		if(typeof windowHeight!="number"){
			if(document.documentElement){
				windowHeight=document.documentElement.clientHeight;				
			}else{
				windowHeight=document.body.clientHeight;
			}
		}
		return windowHeight;
	},
	/* Get scrolled region height */
	getScrollTop:function(){
		var scrollTop;
		if(window.scrollY){
			scrollTop=window.scrollY;
		}else if(document.documentElement){
			scrollTop=document.documentElement.scrollTop;	
		}else{
			scrollTop=document.body.scrollTop;
		}
		return scrollTop;
	},
	/* Get scrolled region width */
	getScrollLeft:function(){
		var scrollLeft;
		if(window.scrollX){
			scrollLeft=window.scrollX;
		}else if(document.documentElement){
			scrollLeft=document.documentElement.scrollLeft;	
		}else{
			scrollLeft=document.body.scrollLeft;
		}
		return scrollLeft;
	},	
	/* Get mouse X position */
	getMouseX:function(event){
		var mouseX;
		if(window.event){
			mouseX=window.event.clientX;
		}else{
			mouseX=event.clientX;
		}
		return mouseX;
	},
	/* Get mouse Y position */
	getMouseY:function(event){
		var mouseY;
		if(window.event){
			mouseY=window.event.clientY;
		}else{
			mouseY=event.clientY;
		}
		return mouseY;
	},
	/* Get browser type , not recommend to use it */
	getBrowserType:function(){
		var agent=navigator.userAgent.toUpperCase();
		if(agent.indexOf("MSIE 8.0")>0){
			return "IE8";
		}else{
			if(agent.indexOf("MSIE 7.0")>0){
				return "IE7";
			}else{
				if(agent.indexOf("FIREFOX")>0){
					return "FIREFOX";
				}else{
					if(agent.indexOf("CHROME")>0){
						return "CHROME";
					}else{
						if(agent.indexOf("SAFARI")>0){
							return "SAFARI";
						}else{
							return "UNKNOWN";
						}
					}
				}
			}
		}						   
	}
};
/************************************************************************
 * Object		: System
 * Description	: System functions like show element and hide element
 ************************************************************************/
var System={
	/* Print out some message to the browser window */
	out:{
		println:function(str){
			document.write(str+"<br />");
		},
		print:function(str){
			document.write(str);
		}
	},
	/* Print out some ERROR message to the browser window */
	err:{
		println:function(str){
			document.write("<font color='RED'>"+str+"</font><br />");
		},
		print:function(str){
			document.write("<font color='RED'>"+str+"</font>");
		}
	},
	/*******************************************************************
	 * Function    : trim()
	 * Description : Remove spaces before and after a string or new lines
	 * 				 after the string
	 * Parameters  : str--String to be trimed
	 * Return	   : The trimed string
	 *******************************************************************/
	trim:function(str){
		return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
	},
	/*******************************************************************
	 * Function    : showItem()
	 * Description : Display the specified element on the browser window
	 * Parameters  : id--Element id or the element itself
	 *******************************************************************/
    showItem:function(id){
		var obj=null;
		if(typeof id=="string"){
			obj=$("#"+id).getElement();
		}else{
			obj=id;
		}	
		obj.style.visibility="visible";
		obj.style.display="block";
	},
	/*******************************************************************
	 * Function    : hideItem()
	 * Description : Hide the specified element on the browser window
	 * Parameters  : id--Element id or the element itself
	 *******************************************************************/
    hideItem:function(id){
		var obj=null;
		if(typeof id=="string"){
			obj=$("#"+id).getElement();
		}else{
			obj=id;
		}	
		obj.style.display="none";
		obj.style.visibility="hidden";
	},
	/*******************************************************************
	 * Function    : toggleItem()
	 * Description : Toggle to show or hide the specified element on the 
	 * 				 browser window
	 * Parameters  : id--Element id or the element itself
	 *******************************************************************/
	toggleItem:function(id){
		var obj=null;
		if(typeof id=="string"){
			obj=$("#"+id).getElement;
		}else{
			obj=id;
		}
		if(obj.style.visibility=="hidden"||obj.style.visibility=="undefined"){
			this.showItem(obj);
		}else{
			this.hideItem(obj);
		}
	},
	/*******************************************************************
	 * Function    : scrollObject()
	 * Description : Scroll an element with different directions
	 * Parameters  : obj--Object to be scrolled
	 * 				 dir--Direction of scrolling, the direction can be 
	 * 					  top, left, right or bottom
	 * 				 start--start position of the object
	 * 				 mode--Auto mode or non-auto mode???
	 * 				 step--Step size of the scrolling
	 *******************************************************************/
	scrollObject:function(obj,dir,start,mode,step){
		if(mode!="undefined"&&mode=="auto"){
			if(obj.style.top==""||obj.style.top==null){
				obj.style.top=0+"px";
			}

			switch(dir){
			case "top":obj.style.top=parseInt(start)+parseInt(step)+"px";break;
			case "left":obj.style.left=parseInt(start)+parseInt(step)+"px";break;
			case "right":obj.style.right=parseInt(start)+parseInt(step)+"px";break;
			case "bottom":obj.style.bottom=parseInt(start)+parseInt(step)+"px";break;
			default:alert("Undefined scroll direction");break;
			}
		}else{
			var amount=0;
			if(document.documentElement&&Browser.getBrowserType()!="Chrome"){
				switch(dir){
				case "top":amount=document.documentElement.scrollTop;break;
				case "left":amount=document.documentElement.scrollLeft;break;
				case "right":amount=document.documentElement.scrollRight;break;
				case "bottom":amount=document.documentElement.scrollBottom;break;
				default:alert("Undefined scroll direction");break;
				}
			}else if(document.body){
				switch(dir){
				case "top":amount=document.body.scrollTop;break;
				case "left":amount=document.body.scrollLeft;break;
				case "right":amount=document.body.scrollRight;break;
				case "bottom":amount=document.body.scrollBottom;break;
				default:alert("Undefined scroll direction");break;
				}
			}else{
				alert("Scroll is not supported");
			}
			this.scrollObject(obj,dir,start,"auto",amount);
		}
	}
};
/************************************************************************
 * Object		: Checker
 * Description	: Checker class is used for the form validation
 ************************************************************************/
var Checker={
	/*******************************************************************
	 * Function    : isEmpty()
	 * Description : Check whether a form field is empty or not
	 * Parameters  : field--Field value or the field element, can be textbox
	 * 				 textarea
	 *******************************************************************/
	isEmpty:function(field){
		if(typeof field=="object"){
			if(field.value==""){
				return true;
			}
		}else{
			if(field==""){
				return true;
			}
		}
		return false;
	},
	/*******************************************************************
	 * Function    : isEmail()
	 * Description : Check whether a string is an Email or not, this is
	 * 				 to verify the form field which requires a user to enter
	 * 				 a valid email.
	 * Parameters  : email--The email to be verified
	 *******************************************************************/
	isEmail:function(email){
		var email_reg=/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return email_reg.test(email);
	},
	/*******************************************************************
	 * Function    : isPhone()
	 * Description : Check whether a string is a phone number ir not
	 * Parameters  : phone-Phone number to be verified
	 *******************************************************************/
	isPhone:function(phone){
		var phone_reg=/^(\+[0-9]{2}\s*)*[0-9]+$/;
		return phone_reg.test(phone);
	},
	/*******************************************************************
	 * Function    : isZipCode()
	 * Description : Check whether a string is a zipcode or not
	 * Parameters  : zipcode--ZipCode to be verified
	 *******************************************************************/
	isZipCode:function(zipcode){
		var zip_reg=/^[0-9]+$/;
		return zip_reg.test(zipcode);
	},
	/*******************************************************************
	 * Function    : isEqual()
	 * Description : Check whether two values are equal or no. It is useful
	 * 				 when checking two passwords or two emails are the same
	 * 				 or not when registering account
	 * Parameters  : value1--First value to be checked
	 * 				 value2--Second value to be checked
	 *******************************************************************/
	isEqual:function(value1,value2){
		return (value1==value2);
	},
	/*******************************************************************
	 * Function    : isInRange()
	 * Description : Check whether a value is in the minimum and maximum 
	 * 				 length range. It is useful when one wants to restrict
	 *               the length of the username or password or something
	 *               else
	 * Parameters  : value--Value to be verified
	 * 				 min_len--Minimum length of the value required
	 * 				 max_len--Maximum length of the value required
	 *******************************************************************/
	isInRange:function(value,min_len,max_len){
		return (value.length>=min_len&&value.length<=max_len);
	},
	/*******************************************************************
	 * Function    : isSelected()
	 * Description : Check whether a radio button or checkbox is checked
	 * Parameters  : field--Field name or field element
	 *******************************************************************/
	isSelected:function(field){
		var obj=null;
		if(typeof field=="string"){
			obj=$("$"+field).first().getElement()
		}else{
			obj=field;
		}
		return obj.checked;
	},
	/*******************************************************************
	 * Function    : isNumber()
	 * Description : Check whether a value is a number or not
	 * Parameters  : value-- Value to be verified
	 *******************************************************************/
	isNumber:function(value){
		var number_reg=/^[0-9]+\.?[0-9]*$/;
		if(typeof value=="number"||number_reg.test(value)){
			return true;
		}
		return false;
	}
};
/************************************************************************
 * Object		: Calendar
 * Description	: An object related Date and Calendar. It can help users
 * 				  retrieve some frequently needed values and also can be 
 * 				  used to do Date comparisons. Also, it can create a GUI
 * 				  for any date.
 ************************************************************************/
var Calendar={
	/********************************************************************
	 * Function   : getDaysInMonth()
	 * Description: Get number of days in one month of one year. User can 
	 * 				specify no year and month as arguments, this will make
	 * 			    the function calculate the days in current month of
	 * 			    current year.Or user can specify both year and month, 
	 * 				then the function will calculate days in that month of 
	 * 				that year. However, user cannot specify only the year
	 * 			    or the month.
	 * Parameters : year--Year to be matched
	 * 				month--Month to be matched
	 * Returns	  : Number of days in that month of that year
	 ********************************************************************/
	getDaysInMonth:function(year,month){
		year=Number(year);
		month=Number(month);
		if(year=="undefined"||month=="undefined"){
			var date=new Date();
			date=new Date(date.getFullYear(),date.getMonth()+1,0);
			return date.getDate();
		}else if(typeof year=="number"&&typeof month=="number"){
			var y=Number(year);
			var m=Number(month);
			var date=new Date(y,m,0);
			return date.getDate();
		}else{
			var errorModal=new ModalWindow("You must either specify no year and month or both year and month",ModalWindow.ERROR,"Arguments error");
			errorModal.init();
			errorModal.show();
		}
	},
	/********************************************************************
	 * Function   : getWeekDayOfFirstDayInMonth()
	 * Description: Get weekday of the first day of the month in that year.
	 * 				It is zero based, it means that Sunday will be 0 and 
	 * 				Monday will be 1
	 * Parameters : year--Year to be matched
	 * 				month--Month to be matched
	 * Returns	  : Weekday of the month in the year
	 ********************************************************************/
	getWeekDayOfFirstDayInMonth:function(year,month){
		var y=Number(year);
		var m=Number(month)-1;
		var date=new Date(y,m,1);
		return date.getDay();
	},
	/********************************************************************
	 * Function   : getWeekDayOfFirstDayInYear()
	 * Description: Get weekday of the first day of the year.It is zero 
	 * 				based, it means that Sunday will be 0 and Monday will 
	 * 				be 1 and so on...
	 * Parameters : year--Year to be matched
	 * Returns	  : Weekday of first day of the year
	 ********************************************************************/
	getWeekDayOfFirstDayInYear:function(year){
		var y=parseInt(year);
		var date=new Date(y,0,1);
		return date.getDay();
	},
	/********************************************************************
	 * Function   : isLeapYear()
	 * Description: Check whether a given year is a leap year or not
	 * Parameters : year--Year to be matched
	 * Returns	  : true if it is a leap year,otherwise return false
	 ********************************************************************/
	isLeapYear:function(year){
		if(year%400 ==0 || (year%100 != 0 && year%4 == 0)){
			return true;
		}
		return false;
	},
	/********************************************************************
	 * Function   : isBefore()
	 * Description: Check whether a date is before the other date
	 * Parameters : date1--First date to be compared
	 * 				date2--Second date to be compared
	 * Returns	  : true if date1 is earlier than date2, otherwise return 
	 * 				false
	 ********************************************************************/	
	isBefore:function(date1,date2){
		if(Calendar.compare(date1,date2)<0){
			return true;
		}
		return false;
	},
	/********************************************************************
	 * Function   : isInDates()
	 * Description: Check whether a date is in the date list
	 * Parameters : dates -- date list to be checked
	 * 				day   -- the date to be tested
	 * Returns	  : true if day is in dates, otherwise return false
	 ********************************************************************/	
	isInDates:function(dates,day){
		if(dates!=null){
			for(var i=0;i<dates.length;i++){
				if(dates[i]==day){
					return true;
				}
			}
		}
		return false;
	},
	/********************************************************************
	 * Function   : daysDifferenceBetween()
	 * Description: Calculate days difference between two dates
	 * Parameters : date1--First date to be calculated
	 * 				date2--Second date to be calculated
	 * Returns	  : Days difference value or null if dat1 or date2 is not 
	 * 				a valid date
	 ********************************************************************/	
	daysDifferenceBetween:function(date1,date2){
		date1=Calendar.convert(date1);
		date2=Calendar.convert(date2);
		
		if(date1!=null&&date2!=null){
			return ((date2-date1)/(24*60*60*1000)).toFixed(2);
		}
		return null;
	},
	/********************************************************************
	 * Function   : weekdayAfterDays()
	 * Description: Calculate the weekday some days later after today 
	 * Parameters : days--Number of days after today
	 * Returns	  : Weekday
	 ********************************************************************/
	weekdayAfterDays:function(days){
		var date=new Date();
		return Math.floor((date.getDay()+days)%7);
	},
	/********************************************************************
	 * Function   : isInRange()
	 * Description: Check whether a date is in a range of dates
	 * Parameters : date--Date to be checked
	 * 				start_date--Start date of the checking (inclusive)
	 * 				end_date--End date of the checking (inclusive)
	 * Returns	  : true if it resides in start_date and end_date, otherwise
	 * 				false
	 ********************************************************************/	
	isInRange:function(date,start_date,end_date){
		date=Calendar.convert(date);
		start_date=Calendar.convert(start_date);
		end_date=Calendar.convert(end_date);
		
		if(date!=null&&start_date!=null&&end_date!=null){
			if(Calendar.compare(date,start_date)>=0&&Calendar.compare(date,end_date)<=0){
				return true;
			}
		}
		return false;
	},
	/********************************************************************
	 * Function   : getCurrentTimeString()
	 * Description: Get current time with hh:mm:ss format
	 * Returns	  : Time string
	 ********************************************************************/	
	getCurrentTimeString:function(){
		var date=new Date();
		var hour=(date.getHours()<10)?("0"+date.getHours()):date.getHours();
		var minute=(date.getMinutes()<10)?("0"+date.getMinutes()):date.getMinutes();
		var second=(date.getSeconds()<10)?("0"+date.getSeconds()):date.getSeconds();
		return hour+":"+minute+":"+second;
	},
	/********************************************************************
	 * Function   : getWeekdayString()
	 * Description: Get the weekday string as Monday, Tuesday...
	 * Parameter  : i    -- Current weekday index
	 * 				type -- Long weekday string or short weekday string
	 * Returns	  : Weekday string
	 ********************************************************************/	
	getWeekdayString:function(i,type){
		var weekdays=null;
		if(type!=undefined&&type!=null&&type==Calendar.SHORTWEEKDAYSTRING){
			weekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		}else{
			weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		}
		return weekdays[i];
	},
	/********************************************************************
	 * Function   : getMonthString()
	 * Description: Get the month string as January, February...
	 * Parameter  : i    -- Current month index
	 * 				type -- Long month string or short month string
	 * Returns	  : Month string
	 ********************************************************************/	
	getMonthString:function(i,type){
		var months=null;
		if(type!=undefined&&type!=null&&type==Calendar.SHORTMONTHSTRING){
			months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		}else{
			months=['January','February','March','April','May','June','July','August','September','October','November','December'];
		}
		return months[i];
	},
	/********************************************************************
	 * Function   : getTimezone()
	 * Description: Get time zone of the user
	 * Returns	  : Time zone string
	 ********************************************************************/
	getTimezone:function(){
		var timeZoneOffset=new Date().getTimezoneOffset();
		var hours=new String((-timeZoneOffset/60).toFixed(2));
		if(TimezoneMap[hours]!="undefined"&&TimezoneMap[hours]!=null){
			return TimezoneMap[hours].join("/");
		}
		return "Unknown timezone";
	},
	/********************************************************************
	 * Function   : getCalendarPanel()
	 * Description: Build a Calendar panel for a given month of a given 
	 * 				year, it will build the HTML codes for the panel. You
	 * 			    can show this calendar panel anywhere you want. It can
	 * 				be included in a DIV or display by itself. If you want 
	 * 				to customize the style of the panel.You can either set
	 * 				the styles below in the function or change the style of 
	 * 				call this function outside
	 * Parameters : year--Given year
	 * 				month--Given month
	 * Returns	  : Calendar panel HTML code for the given month of the
	 * 				given year
	 ********************************************************************/	
	getCalendarPanel:function(year,month){
		var today=(new Date()).getDate();
		var days=this.getDaysInMonth(year,month);
		/* Maximum number of rows of a month, if a month has 31 days and the
		 * first day of the month is Saturday, it may take 6 rows to show 
		 * all days in that month and one title row will be added to become
		 * 7 rows
		 */ 
		var rows=7;
		/* Days of a week */
		var cols=7;	
		var prefix=this.getWeekDayOfFirstDayInMonth(year,month);
		var html='<table cellpadding="3" cellspacing="0" style="text-align:center;background-color:#FFF;border:1px solid #CCC;">';
		/* Create the title bar */
		html+='<tr><td class="calendar_table_highlight_td">Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td class="calendar_table_highlight_td">Sat</td></tr>';
		html+='<tr>';
		for(var i=0;i<prefix;i++){
			html+='<td></td>';
		}
		for(var i=1;i<=(cols-prefix);i++){
			if(today==i){
				html+='<td class="calendar_table_highlight_td"><div id="'+i+'">'+i+'</div></td>';
			}else{
				html+='<td><div id="'+i+'">'+i+'</div></td>';
			}
		}
		html+='</tr>';
		for(var i=0;i<=4;i++){
			var j;
			var curr_date;
			html+='<tr>';
			for(j=1;j<=cols;j++){
				curr_date=(cols-prefix+i*cols+j);
				if(curr_date>days){
					break;
				}
				if(today==curr_date){
					html+='<td class="calendar_table_highlight_td"><div id="'+curr_date+'">'+curr_date+'</div></td>';
				}else{
					html+='<td><div id="'+curr_date+'">'+curr_date+'</div></td>';
				}
			}
			html+='</tr>';
		}
		html+='</table>';
		
		return html;
	},
	/********************************************************************
	 * Function   : compare()
	 * Description: Compare two dates
	 * Parameters : date1--First date to be compared
	 * 				date2--Second date to be compared
	 * Returns	  : <0--If date1 is earlier than date2
	 * 				=0--If date1 is the same as date2
	 * 				>0--If date1 is later than date2
	 * 				null--If either one is not well formed date object
	 ********************************************************************/	
	compare:function(date1,date2){
		date1=Calendar.convert(date1);
		date2=Calendar.convert(date2);
		
		if(date1!=null&&date2!=null){
			return (date1-date2);
		}
		return null;
	},
	/********************************************************************
	 * Function   : convert()
	 * Description: Convert date string,date object,number into Date object
	 * 				if they can be correctly parsed into a Date object
	 * Parameters : date--Date to be converted
	 * Returns	  : Date object if successful, otherwise return null
	 ********************************************************************/	
	convert:function(date){
		if(date instanceof Date){
			date=date;
		}else if(typeof date=="string"){
			date=new Date(Date.parse(date));
		}else if(typeof date=="number"){
			date=new Date(date);
		}else{
			date=null;
		}
		return date;
	},
	/********************************************************************
	 * Object     : Timer
	 * Description: A simple timer object which can be used to set a count 
	 * 				down for some events
	 ********************************************************************/	
	Timer:function(){
		/* Time Id kept to trace the timer instance */
		this.timerId=null;
		/* Current running time of the timer */
		this.count=0;
		/* Status of the Timer */
		this.status=Calendar.Timer.RESET;
		/* Set the mode of the Time */
		this.mode=Calendar.TimerMode.NORMAL;
		/* Time limit of the count down if in countdown mode */
		this.limit=0;
		/* Set handler of the timer */
		this.handler=null;
	},
	/********************************************************************
	 * Object     : TimerMode
	 * Description: TimerMode object which belongs to Timer object to 
	 * 			    define the mode of the timer, it can be COUNTDOWN
	 * 				mode or NORMAL mode
	 ********************************************************************/	
	TimerMode:function(){}
};
Calendar.Timer.prototype={
	start:function(){
		var obj=this;
		this.timerId=setTimeout(function(){obj.loop(obj);},1000);
		this.status=Calendar.Timer.START;
	},
	pause:function(){
		this.stop();
		this.status=Calendar.Timer.PAUSE;
	},
	stop:function(){
		if(this.timerId!=null){
			clearTimeout(this.timerId);
			this.reset();
			this.status=Calendar.Timer.STOP;
		}
	},
	reset:function(){
		this.count=0;
		this.timerId=null;
		this.status=Calendar.Timer.RESET;
		this.mode=Calendar.TimerMode.NORMAL;
		this.limit=0;
		this.start_handler=null;
		this.handler=null;
	},
	loop:function(obj){
		clearTimeout(obj.timerId);
		if(obj.mode==Calendar.TimerMode.COUNTDOWN){
			obj.start_handler.call(null,(obj.limit-obj.count));
			if(obj.count==obj.limit){
				obj.handler.call(null,"");
				obj.stop();
			}
		}
		if(obj.status!=Calendar.Timer.STOP&&obj.status!=Calendar.Timer.RESET){
			obj.count++;
			obj.timerId=setTimeout(function(){obj.loop(obj);},1000);
		}
	},
	getCount:function(){
		return this.count;
	},
	/********************************************************************
	 * Function   : countdown()
	 * Description: Set a countdown event, when the limits reaches, the
	 * 			    handler will work and handle event.
	 * Parameters : count--Hong long to count down
	 * 				start_handler--When the count down starts, call this 
	 * 							   handler
	 * 				handler--The handler to be called when time limits reaches
	 ********************************************************************/	
	countdown:function(count,start_handler,handler){
		this.mode=Calendar.TimerMode.COUNTDOWN;
		this.limit=count;
		this.start_handler=start_handler;
		this.handler=handler;
		this.start();
	}
};
/* TimerMode object prototype */
Calendar.TimerMode.prototype={};
/* Timer constants */
Calendar.Timer.START	=	1;
Calendar.Timer.PAUSE	=	2;
Calendar.Timer.STOP		=	3;
Calendar.Timer.RESET	=	4;
Calendar.TimerMode.NORMAL 	 = 1;
Calendar.TimerMode.COUNTDOWN = 2;
Calendar.LONGWEEKDAYSTRING   = 1;
Calendar.SHORTWEEKDAYSTRING  = 2;
Calendar.LONGMONTHSTRING   = 1;
Calendar.SHORTMONTHSTRING  = 2;
/* World timezone mapping 
 * Here negative value means ahead of UTC
 * Positive means after UTC*/
var TimezoneMap=new Array();
TimezoneMap["-12.00"] = ["International Date Line West"];
TimezoneMap["-11.00"] = ["Samoa"];
TimezoneMap["-10.00"] = ["Hawaii"];
TimezoneMap["-9.00"]  = ["Alaska"];
TimezoneMap["-8.00"]  = ["Baja Califonia","Pacific Time(US&Caanda)"];
TimezoneMap["-7.00"]  = ["Arizona","Chihuahua,La Paz,Mazatlan","Mountain Time(US&Canada)"];
TimezoneMap["-6.00"]  = ["Central America","Central Time(US&Canada)"];
TimezoneMap["-5.00"]  = ["Bogata,Lima,Quito","Eastern Time(US&Canada)","Indiana"];
TimezoneMap["-4.50"]  = ["Caracas"];
TimezoneMap["-4.00"]  = ["Asuncion","Atlantic Time(Canada)","Cuiaba","Georgetown,La Paz,Manaus,San Juan","Santiago"];
TimezoneMap["-3.50"]  = ["Newfoundland"];
TimezoneMap["-3.00"]  = ["Brasilia","Buenos Aires","Cayenne,Fortalesa","Greenland","Montevideo"];
TimezoneMap["-2.00"]  = ["Coordinated Universal Time-02","Mid-Atlantic"];
TimezoneMap["-1.00"]  = ["Azores","Cape Verde Is."];
TimezoneMap["0.00"]   = ["Casablanca","Coordinated Universal Time","Dublin,Edinburgh,Lisbon,London","Monrovia,Reykjavik"];
TimezoneMap["1.00"]   = ["Amsterdan,Berlin,Bern,Rome,Stockholm,Vienna","Belgrade,Bratislava,Budapest,Ljubijana,Prague","Brussels,Copenhagen,Madrid,Paris","Sarajevo,Skopje,Warsaw,Zagreb","West Central Africa","Windhoek"];
TimezoneMap["2.00"]   = ["Amman","Athens,Bucharest,Istanbul","Beirut","Cairo","Damascus","Harare,Pretoria","Helsinki,Kyiv,Riga,Sofia,Tallinn,Vilnius","Jenusalem","Minsk"];
TimezoneMap["3.00"]   = ["Baghdad","Kuwait,Riyadh","Moscow,St.[etersburg,Volgograd","Nairobi"];
TimezoneMap["3.50"]   = ["Tehran"];
TimezoneMap["4.00"]   = ["Abu Dhabi,Muscat","Baku","Port Louis","Tbilisi","Verevan"];
TimezoneMap["4.50"]   = ["Kabul","Ekaterinburg"];
TimezoneMap["5.00"]   = ["Islamabad,Karachi","Tashkent"];
TimezoneMap["5.50"]   = ["Chennai,Kolkata,Mumbai,New Delhi","Sri Jayawardenepura"];
TimezoneMap["5.75"]   = ["Kathmandu"];
TimezoneMap["6.00"]   = ["Astana","Dhaka","Novisibrisk"];
TimezoneMap["6.50"]   = ["Vangon(Rangoon)"];
TimezoneMap["7.00"]   = ["Bangkok,Hanoi,Jakarta","Krasnoyarsk"];
TimezoneMap["8.00"]   = ["Beijing,Chongqing,Hong Kong,Urumuqi,Taipei","Irkutsk","Kuala Lumpur,Singapore","Perth","Ulaanbaatar"];
TimezoneMap["9.00"]   = ["Osaka,Sapporo,Tokyo","Seoul","Yakutsk"];
TimezoneMap["9.50"]   = ["Adelaide","Darwin"];
TimezoneMap["10.00"]  = ["Brisbane","Canbera,Melbourne,Sydney","Guam,Port Moresby","Hobart","Vladivostok"];
TimezoneMap["11.00"]  = ["Magadan,Solomom Is,New Caledonia"];
TimezoneMap["12.00"]  = ["Auckland,Wellington","Coordinated Universal Time+12","Fiji"];
TimezoneMap["13.00"]  = ["Nuku alofa","Samoa"];
/************************************************************************
 * Object		: XHR
 * Description	: AJAX Use, used to do Asynchronous communication with 
 * 				  server.
 * Parameters	: method  -- Method t use , include GET and POST
 * 				  url     -- server side handling script path
 * 				  async   -- Whether the request is aynchronous or not
 * 				  success_handler -- The handler when the request successes
 * 				  failure_handler -- The handler when the request fails or in
 * 							         progress
 ************************************************************************/
function XHR(method,url,async,success_handler,failure_handler)
{
	this.method=method;
	this.url=url;
	this.async=async;
	this.success_handler=success_handler;
	this.failure_handler=failure_handler;
	/*Reference of created XMLHttpRequest object */
	this.xhr=null;	
	this.responseText=null;
	/* Initialize the XHR object */
	this.init();
}
XHR.prototype={
	/*********************************************************************
	 * Function 	: init()
	 * Description  : initialize the XHR object, such as the server-client
	 * 				  channel setup and XMLHttpRequest creation
	 * ******************************************************************/
	init:function(){
		this.create();
	},
	/********************************************************************
	 * Function 	: create()
	 * Description  : Creation of the XMLHttpRequest object. It is cross
	 * 				  browser compatible
	 *******************************************************************/
	create:function(){
		if(typeof XMLHttpRequest!="undefined"){
			this.xhr=new XMLHttpRequest();
		}else if(typeof ActiveXObject!="undefined"){
			if(typeof arguments.callee.activeXString!="string"){
				var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];
				for(var i=0;i<versions.length;i++){
					try{
						var xhr=new ActiveXObject(versions[i]);
						arguments.callee.activeXString=version[i];
						this.xhr=xhr;
					}catch(ex){
						var errorModal=new ModalWindow("Sorry, cannot create XMLHttpRequest now. Please try again later!",ModalWindow.ERROR,"XMLHttpRequest Error");
						errorModal.init();
						errorModal.init();
					}
				}
				this.xhr=new ActiveXObject(arguments.callee.activeXString);
			}else{
				throw new Error("NO XHR Object available");
			}
		}
	},
	/********************************************************************
	 * Function 	: connect()
	 * Description  : Setup the Event handler for the XMLHttpRequest so that
	 * 				  the server response can be well handled in either 
	 * 				  success or failure condition
	 *******************************************************************/
	connect:function(){
		if(this.xhr!=null){
			var xhrObj=this.xhr;
			xhrObj.success_handler=this.success_handler;
			xhrObj.failure_handler=this.failure_handler;
			this.xhr.onreadystatechange=function(){
				if(xhrObj.readyState==4&&xhrObj.status==200){	
					/* When this function is called, the responseText from
					 * server will be passed as parameters to the success_handler
					 */
					if(xhrObj.success_handler!=null){
						xhrObj.success_handler.call(null,xhrObj.responseText);
					}
				}else{
					if(xhrObj.failure_handler!=null){
						xhrObj.failure_handler.call(null);
					}
				}
			};
		}
	},
	/********************************************************************
	 * Function 	: send()
	 * Description  : Send the request from client to server
	 * Parameters	: query--Query to be sent to server
	 *******************************************************************/
	send:function(query){
		if(this.method.toLowerCase()=="get"){
			this.xhr.open(this.method,this.url+"?"+query+"&rnd="+Math.random(),this.async);
			this.xhr.send(null);
		}else{
			this.xhr.open(this.method,this.url,this.async);
			this.xhr.setRequestHeader("Content-Type","Application/x-www-form-urlencoded");   
			this.xhr.setRequestHeader("Cache-Control","no-cache");
			this.xhr.send(query+"&rnd="+Math.random());
		}
	},
	/********************************************************************
	 * Function 	: setSuccessHandler()
	 * Description  : Set the handler when successfully getting reponse from
	 * 				  server
	 * Parameters	: success_handler--Handler to be called when success
	 *******************************************************************/
	setSuccessHandler:function(success_handler){
		this.success_handler=success_handler;
	},
	/********************************************************************
	 * Function 	: setFailureHandler()
	 * Description  : Set the handler when unsuccessfully getting reponse from
	 * 				  server
	 * Parameters	: failure_handler--Handler to be called when failure
	 *******************************************************************/
	setFailureHandler:function(failure_handler){
		this.failure_handler=failure_handler;
	},
	/********************************************************************
	 * Function 	: close()
	 * Description  : Free the XHR object
	 *******************************************************************/
	close:function(){
		this.xhr=null;
	}
};
/************************************************************************
 * Object		: ModalWindow
 * Description	: System modal window
 * Parameters	: text--Text to be shown on the ModalWindow
 *				  type--Type of the ModalWindow such as INFORMATION,WARNING
 *				  title--Text shown on the title bar
 *				  yes_handler--When open the confirm window,if user clicks 'Yes', this 
 *				  handler will run
 *				  no_handler-- When open the confirm window,if user clicks 'No', this 
 *				  handler will run
 * All parameters are optional
 ************************************************************************/
function ModalWindow(text,type,title,yes_handler,no_handler)
{
	var rnd=(new Date()).getTime();
	if(text==null=="undefined"||text==null){
		this.text="";
	}else{
		this.text=text;
	}
	this.type=type;
	this.title=title;
	this.yes_handler=yes_handler;
	this.no_handler=no_handler;
	this.moddalWindow=null;
	this.shadow=null;
	/* The to-be created ModowlWindow ID, The reason to use a rnd here is
	 * that we may show more than one ModalWindow at the same time in response
	 * to different events, so it may prevent the overlapping of ModalWindow
	 * ID */
	this.modalWindowId="SystemModalWindow"+rnd;
	this.modalWindowTitleBarId="SystemModalWindowTitleBar"+rnd;
	this.shadowLayerId="SystemShadow"+rnd;
}
ModalWindow.prototype={
	/*********************************************************************
	 * Function 	: init()
	 * Description  : initialize the ModalWindow object, including creating
	 * 				  the modal window and the shadow layer which prevents 
	 * 				  user to edit other contents on the page
	 * ******************************************************************/
	init:function(){
		this.createWindow();
		this.createShadowLayer();
		var obj=this;
		EventHandler.addEventHandler($("#"+this.modalWindowId).getElement(),"click",function(event){obj.handleCommand(event,obj);});
	},
	/*********************************************************************
	 * Function 	: createWindow()
	 * Description  : Create the modal window which will be displayed when
	 * 				  some events happen
	 * ******************************************************************/
	createWindow:function(){
		var imageUrl="http://"+location.host+"/js/";
		switch(this.type){
		case ModalWindow.INFORMATION:imageUrl+="icons/info.gif";
									 if(this.title=="undefined"||this.title==null){
										 this.title="Information";
									 };
									 break;
		case ModalWindow.WARNING	:imageUrl+="icons/warning.gif";
		  							 if(this.title=="undefined"||this.title==null){
		  								 this.title="Warning";
		  							 };
		  							 break;
		case ModalWindow.ERROR		:imageUrl+="icons/error.gif";
									 if(this.title=="undefined"||this.title==null){
										 this.title="Error";
									 };
									 break;
		case ModalWindow.CONFIRM	:imageUrl+="icons/confirm.gif";
		  							 if(this.title=="undefined"||this.title==null){
		  								 this.title="Confirm";
		  							 };
		  							 break;
		default						:imageUrl+="icons/info.jpg";
		  							 if(this.title=="undefined"||this.title==null){
		  								 this.title="Information";
		  							 };
		  							 break;
		}
		//Generate SystemModalWindow code
		var html='<div id="'+this.modalWindowId+'" class="ModalWindow">';
		html+='<table id="'+this.modalWindowTitleBarId+'" cellpadding="0" cellspacing="0" width="100%" style="height:20px;line-height:20px;padding:0px 10px;background:#DDD url(icons/btn_bg_20.gif) repeat-x;"><tr><td><div style="width:430px;height:20px;overflow:hidden;font-size:14px;">'+this.title+'</div></td><td><div style="padding:0px 4px;border-left:1px solid #333;border-bottom:1px solid #333;border-right:1px solid #333;height:18px;" onmouseover="this.style.backgroundColor=\'#FF0000\';this.style.color=\'#FFF\';this.style.cursor=\'pointer\';" onmouseout="this.style.backgroundColor=\'#CCC\';this.style.color=\'#000\';" cmd="close" title="Close">&times;</div></td></tr></table>';
		html+='<table cellpadding="10" cellspacing="0" width="100%" style="padding:0px 10px;"><tr><td style="width:80px;"><img src="'+imageUrl+'" style="width:60px;height:60px;" /></td><td><div style="font-size:14px;line-height:23px;">'+this.text+'</div></td></tr></table>';
		if(this.type==ModalWindow.CONFIRM){
			html+='<p style="text-align:right;padding:5px;background-color:#DEE;margin:0px;" ><input type="button" value=" Yes " cmd="confirm_yes"/>&nbsp;<input type="button" value=" No " cmd="confirm_no"/></p>';
		}else{
			html+='<p style="text-align:right;padding:5px;background-color:#DEE;margin:0px;" ><input type="button" value=" OK " cmd="info_ok"/></p>';
		}
		html+='</div>';
		
		//Create container
		var div=document.createElement("div");
		div.innerHTML=html;
		document.body.appendChild(div);
		
		//Get modal window id
		var modalWindowID="#"+this.modalWindowId;
		this.modalWindow=$(modalWindowID).getElement();
		
		//Set modal window style
		$(modalWindowID).setStyle("position:fixed;width:500px;z-index:8;visibility:hidden;background-color:#FFF;border:1px solid #333;font-family:Arial;");
		var posX=(parseInt(Browser.getWidth()) -parseInt($(modalWindowID).getElement().clientWidth))/2+"px";
		var posY=(parseInt(Browser.getHeight())-parseInt($(modalWindowID).getElement().clientHeight))/2+"px";
		this.modalWindow.style.left=posX;
		this.modalWindow.style.top= posY;
	},
	/*********************************************************************
	 * Function 	: createShadowLayer()
	 * Description  : Create the shadow layer so that when the modal window
	 * 				  shows, the user cannot do other operations on the page
	 * 				  except respond to the modal window
	 * ******************************************************************/
	createShadowLayer:function(){
		//Generate shadow layer code
		var html='<div id="'+this.shadowLayerId+'" class="Shadow"></div>';
		var div=document.createElement("div");
		div.innerHTML=html;
		document.body.appendChild(div);
		this.shadow=$("#"+this.shadowLayerId).getElement();
		$("#"+this.shadowLayerId).setStyle("position:fixed;z-index:5;top:0px;left:0px;background-color:#999;visibility:hidden;filter:alpha(opacity=50);opacity:0.5;");
		var browser=Browser.getBrowserType();
		if(browser=="CHROME"||browser=="FIREFOX"){
			this.shadow.style.width= Browser.getWidth()+"px";
			this.shadow.style.height=Browser.getHeight()+"px";
		}else{
			this.shadow.style.width=Browser.getWidth();
			this.shadow.style.height=Browser.getHeight();
		}
	},
	/*********************************************************************
	 * Function 	: show()
	 * Description  : Show the modal window and shadow layer
	 * ******************************************************************/
	show:function(){	
		System.showItem(this.shadow.id);
		System.showItem(this.modalWindow.id);
	},
	/*********************************************************************
	 * Function 	: hide()
	 * Description  : Hide the modal window and shadow layer
	 * ******************************************************************/
	hide:function(obj){
		if(obj!=null){
			System.hideItem(obj.shadow.id);
			System.hideItem(obj.modalWindow.id);
		}else{
			System.hideItem(this.shadow.id);
			System.hideItem(this.modalWindow.id);
		}
	},
	/*********************************************************************
	 * Function 	: setTitleBarStyle()
	 * Description  : Users can customize the ModalWindow title bar when
	 *                creating the ModalWindow
	 * ******************************************************************/
	setTitleBarStyle:function(attributes){
		if(attributes instanceof Array){
			var style=attributes.join(";");
			if($("#"+this.modalWindowTitleBarId).getElement().style.cssText){
				$("#"+this.modalWindowTitleBarId).getElement().style.cssText=style;
			}else{
				$("#"+this.modalWindowTitleBarId).getElement().setAttribute("style",style);
			}
		}else if(typeof attributes==="string"){
			if($("#"+this.modalWindowTitleBarId).getElement().style.cssText){
				$("#"+this.modalWindowTitleBarId).getElement().style.cssText=attributes;
			}else{
				$("#"+this.modalWindowTitleBarId).getElement().setAttribute("style",attributes);
			}
		}else{
			var errorModal=new ModalWindow("Cannot set style of title bar",ModalWindow.ERROR,"Style error");
			errorModal.init();
			errorModal.show();
			//Hide the main window
			this.hide();
		}
	},
	/*********************************************************************
	 * Function 	: handleCommand()
	 * Description  : Handle the user event when the modal window shows up
	 * 				  Some events are user may click the OK button or click 
	 * 				  the Confirm window's Yes or No button.When these buttons
	 * 				  are clicked, some event handlers should work to respond
	 * 				  to these events
	 * ******************************************************************/
	handleCommand:function(event,obj){
		var e=EventHandler.getEvent(event);
		var target=EventHandler.getTarget(e);
		var cmd=target.getAttribute("cmd");
		if(cmd!="undefined"&&cmd!=null){
			switch(cmd){
			case "close":
			case "info_ok":
				obj.hide();break;
			case "confirm_yes":
				if(obj.yes_handler!="undefined"&&obj.yes_handler!=null){
					obj.yes_handler.call(null);
				}
				obj.hide();
				break;
			case "confirm_no" :
				if(obj.no_handler!="undefined"&&obj.no_handler!=null){
					obj.no_handler.call(null);
				}
				obj.hide();
				break;
			}
		}
	}
};
/* Constants defined for the ModalWindow object */
ModalWindow.INFORMATION  = 1;
ModalWindow.WARNING	 	 = 2;
ModalWindow.ERROR		 = 3;
ModalWindow.CONFIRM 	 = 4;
/*********************************************************************************
*  End of jObject.js
**********************************************************************************/
