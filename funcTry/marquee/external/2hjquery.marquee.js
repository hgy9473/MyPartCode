/*!
 * Marquee jQuery Plug-in
 *
 * Copyright 2009 Giva, Inc. (http://www.givainc.com/labs/) 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2009-05-20
 * Rev:  1.0.01
 */
;(function($){
	// 设置版本号
	$.marquee = {version: "1.0.01"};
	
	$.fn.marquee = function(options) {

		console.log('$.fn.marquee::options',options);

		var method = typeof arguments[0] == "string" && arguments[0];//参数已传递并且为字符串
		var args = method && Array.prototype.slice.call(arguments, 1) || arguments;//--&&多余参数

		console.log('method args',method,args);
		console.log('this',this,this.length);

		// 获取this中的第一个元素
		var self = (this.length == 0) ? null : $.data(this[0], "marquee");
		
		console.log('self',self);		

		// if a method is supplied, execute it for non-empty results
		if( self && method && this.length ){

			// if request a copy of the object, return it			
			if( method.toLowerCase() == "object" ) return self;
			// if method is defined, run it and return either it's results or the chain
			else if( self[method] ){
				// define a result variable to return to the jQuery chain
				var result;
				this.each(function (i){
					// apply the method to the current element
					var r = $.data(this, "marquee")[method].apply(self, args);
					// if first iteration we need to check if we're done processing or need to add it to the jquery chain
					if( i == 0 && r ){
						// if this is a jQuery item, we need to store them in a collection
						if( !!r.jquery ){
							result = $([]).add(r);
						// otherwise, just store the result and stop executing
						} else {
							result = r;
							// since we're a non-jQuery item, just cancel processing further items
							return false;
						}
					// keep adding jQuery objects to the results
					} else if( !!r && !!r.jquery ){
						result = result.add(r);
					}
				});

				// return either the results (which could be a jQuery object) or the original chain
				return result || this;
			// everything else, return the chain
			} else return this;
		// initializing request
		} else {
			console.log("111 this",this);
			// 为每一个元素设置滚动
			return this.each(function (){
				console.log("mquLLLL.....");

				new $.Marquee(this, options);
			});
		};
	};

	$.Marquee = function (marquee, options){

		console.log("Marquee args:",marquee,options);
		console.log('this',this);

		//合并传入的参数和默认参数
		options = $.extend({}, $.Marquee.defaults, options);
		
		var self = this, 
		$marquee = $(marquee), 
		$lis = $marquee.find("> li"), //ul的所有li元素
		current = -1, 
		hard_paused = false, 
		paused = false, 
		loop_count = 0;

		console.log("$lis.....",$lis);

		// store a reference to this marquee
		$.data($marquee[0], "marquee", self);
		
		//暂停滚动
		this.pause = function (){
			hard_paused = true;
			pause();
		}
		
		//恢复滚动
		this.resume = function (){
			hard_paused = false;
			resume();
		}
		
		//更新滚动
		this.update = function (){
			var iCurrentCount = $lis.length;

			// update the line items
			$lis = $marquee.find("> li");
			


			// if we only have one item, show the next item by resuming playback (which will scroll to the next item)
			if( iCurrentCount <= 1 ) resume();
		}

		// code to introduce the new marquee message
		function show(i){
			// if we're already scrolling an item, stop processing
			if( $lis.filter("." + options.cssShowing).length > 0 ) return false;
			
			var $li = $lis.eq(i);

			console.log("li........",$li)
			
			// run the beforeshow callback
			if( $.isFunction(options.beforeshow) ) options.beforeshow.apply(self, [$marquee, $li]);

			var params = {
				top: (options.yScroll == "top" ? "-" : "+") + $li.outerHeight() + "px"
				, left: 0
			};
			
			$marquee.data("marquee.showing", true);
			$li.addClass(options.cssShowing);
	
			$li.
			css(params).
			animate(
				{top: "0px"}, 
				options.showSpeed, 
				options.fxEasingShow, 
				function (){ 
				// run the show callback
				if( $.isFunction(options.show) ) options.show.apply(self, [$marquee, $li]);
				$marquee.data("marquee.showing", false);
				scroll($li);
			});
		}

		// keep the message on the screen for the user to read, scrolling long messages
		function scroll($li, delay){
			// if paused, stop processing
			if( paused == true ) return false;

			// get the delay speed
			delay = delay || options.pauseSpeed;
			//如果li中的内容过长，则左右滚动
			if( doScroll($li) ){
				setTimeout(function (){
					// 暂停滚动时 停止处理
					if( paused == true ) return false;

					//获取宽度和左边距离
					var width = $li.outerWidth(), 
					endPos = width * -1, 
					curPos = parseInt($li.css("left"), 10);

					// 向左滚动文字				
					$li.animate(
						{left: endPos + "px"}, 
						((width + curPos) * options.scrollSpeed), 
						options.fxEasingScroll, 
						function (){ finish($li); });
				}, delay);
			} else if ( $lis.length > 1 ){
				setTimeout(function (){
					// 暂停滚动时 停止处理
					if( paused == true ) return false;

					// 上下滚动
					$li.animate(
						{top: (options.yScroll == "top" ? "+" : "-") + $marquee.innerHeight() + "px"}, 
						options.showSpeed, 
						options.fxEasingScroll);
					// finish showing this message
					finish($li);
				}, delay);
			}
			
		}
		
		function finish($li){
			// run the aftershow callback, only after we've displayed the first option
			if( $.isFunction(options.aftershow) ) options.aftershow.apply(self, [$marquee, $li]);
			
			// mark that we're done scrolling this element
			$li.removeClass(options.cssShowing);
			
			// show the next message
			showNext();
		}

		// 暂停滚动
		function pause(){
			// 暂停时 标记
			paused = true;
			// don't stop animation if we're just beginning to show the marquee message
			if( $marquee.data("marquee.showing") != true ){
				// we must dequeue() the animation to ensure that it does indeed stop animation
				$lis.filter("." + options.cssShowing).dequeue().stop();
			}
		}
		
		// 恢复动画
		function resume(){
			// 恢复时 标记
			paused = false;
			// don't resume animation if we haven't completed introducing the message
			if( $marquee.data("marquee.showing") != true ) scroll($lis.filter("." + options.cssShowing), 1);
		}

		// 设置鼠标悬停时是否暂停
		if( options.pauseOnHover ){
			$marquee.hover(
				function (){
					// if hard paused, prevent hover events
					if( hard_paused ) return false;
					// pause scrolling
					pause();
				}
				, function (){
					// if hard paused, prevent hover events
					if( hard_paused ) return false;
					// resume scrolling
					resume();
				}
			);
		}
		
		//根据li的宽度是否大于ul来确定是否需要左右滚动
		function doScroll($li){
			return ($li.outerWidth() > $marquee.innerWidth());
		}

		// 显示下一条信息	
		function showNext(){
			// increase the current counter (starts at -1, to indicate a new marquee beginning)
			current++;
			
			// if we only have 1 entry and it doesn't need to scroll, just cancel processing
			if( current >= $lis.length ){
				// if we've reached our loop count, cancel processing
				if( !isNaN(options.loop) && options.loop > 0 && (++loop_count >= options.loop ) ) return false;
				current = 0;
			} 

			console.log("showNext()");
			
			// show the next message
			show(current);
		}
		
		// run the init callback
		if( $.isFunction(options.init) ) options.init.apply(self, [$marquee, options]);
		
		// show the first item
		showNext();
	};

	$.Marquee.defaults = {
		  yScroll: "top"                          // 文字在y方向上的滚动顺序
		, showSpeed: 500                          // 文字切换速度
		, scrollSpeed: 12                         // 文字滚动速度
		, pauseSpeed: 3000                        // 文字等待/停留时间
		, pauseOnHover: true                      // 鼠标悬停是等待
		, loop: -1                                // 循环次数
		, fxEasingShow: "swing"                   // 文字显示动画
		, fxEasingScroll: "linear"                // 文字滚动动画

		// define the class statements
		, cssShowing: "marquee-showing"			  // 初始显示的元素的class

		// event handlers
		, init: null                              // callback that occurs when a marquee is initialized
		, beforeshow: null                        // callback that occurs before message starts scrolling on screen
		, show: null                              // callback that occurs when a new marquee message is displayed
		, aftershow: null                         // callback that occurs after the message has scrolled
	};

})(jQuery);
