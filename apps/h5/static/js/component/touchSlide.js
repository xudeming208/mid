fml.define("component/touchSlide", [], function(require, exports) {
    /*
    @plugName: wap.touchSlide.js
    @author: xudeming208@126.com
    @data: 2013-06-22
    @example:
        $(id).touchSlide({
            //初次显示第几张，从0开始
            index: 0,
            //列表框的标签
            ul: "ul",
            //列表标签
            li: "li",
            //图片序列号按钮BOX
            numBox: ".num",
            //数字按钮焦点样式
            cur: "cur",
            //是否需要循环轮播
            isLoop: true,
            //是否自动播放
            isAuto: true,
            //效果时间
            speed: 300,
            //效果间隔时间
            autoTime: 5000,
            //是否让UL随着手指滑动
            follow: false,
            //是否滑多少就是多少，通常用于导航滑动,此时follow一定为true,isLoop设置为false，如果要连贯惯性滑动可以考虑CSS：-webkit-overflow-scrolling: touch;
            isSlideLi: false,
            //是否滑多少就是多少的时候，外容器的宽度，默认为$(window).width()
            isSlideLiWidth: $(window).width(),
            //滑动前的回调，参数为wrap和index
            beforeCallback: function() {},
            //滑动完成后的回调，参数为wrap和index
            finishCallback: function() {}
        });
    */
    ;
    (function($) {
        var TRANSFORM = (function() {
            var vendorTransform = ['transform', '-webkit-transform', '-moz-transform', '-o-transform'],
                style = document.body.style,
                len = vendorTransform.length,
                i = 0

            for (; i < len; i++) {
                if (vendorTransform[i] in style) {
                    return vendorTransform[i]
                }
            }
        })();
        var transformReg = /matrix\(1,\s*0,\s*0,\s*1,|,\s*0\)/gi;
        //返回transform
        function returnTransform(val) {
            return 'translate3d(' + val + 'px,0,0)';
        }
        //设置transform
        function setTransform(obj, val) {
            obj.css(TRANSFORM, returnTransform(val));
        }
        //获取transform
        function getTransform(obj) {
            return parseFloat(window.getComputedStyle(obj[0], null)[TRANSFORM].replace(transformReg, '')) || 0;
        }
        /*属性写在构造函数中*/
        function TouchSlide(el, opts) {
            var self = this;
            self.wrap = el;
            self.index = opts.index;
            self.ul = self.wrap.find(opts.ul);
            self.li = self.ul.find(opts.li);
            self.len = self.li.length;
            self.wrapWidth = self.wrap.width();
            self.liWidth = self.li.width();
            self.numBox = self.wrap.find(opts.numBox);
            self.isLoop = opts.isLoop;
            self.isAuto = opts.isAuto;
            self.cur = opts.cur;
            self.follow = opts.follow;
            self.speed = opts.speed;
            self.autoTime = opts.autoTime;
            self.isSlideLi = opts.isSlideLi;
            self.isSlideLiWidth = opts.isSlideLiWidth;
            self.beforeCallback = opts.beforeCallback;
            self.finishCallback = opts.finishCallback;
            self.timer = null;
            //执行
            self.init();
        }
        /*方法写在原型中*/
        TouchSlide.prototype = {
            /*初始化*/
            init: function() {
                var self = this;
                self.config();
                self.autoPlay();
                self.bind();
            },
            /*配置*/
            config: function() {
                var self = this;
                // zepto的width是四舍五入计算的，这里重新设置宽度是为了避免其宽度为小数px的情况
                self.wrap.width(self.wrapWidth);
                self.li.width(self.liWidth);
                // 是否滑多少就是多少，通常用于导航滑动,此时follow一定为true,isLoop设置为false
                if (self.isSlideLi) {
                    self.follow = true;
                    self.isLoop = false;
                }
                //限制index的值的范围
                if (self.index <= 0) {
                    self.index = 0;
                } else if (self.index >= self.len) {
                    self.index = self.len - 1;
                }
                self.numBox.empty();
                for (var m = 0; m < self.len; m++) {
                    self.numBox.append("<b>" + (m + 1) + "</b>");
                }
                self.numBoxB = self.numBox.children();
                self.numBoxB.eq(self.index).addClass(self.cur);
                if (self.isLoop) {
                    self.ul.width(self.liWidth * (self.len + 2));
                    self.li.eq(0).clone().appendTo(self.ul);
                    self.li.eq(self.len - 1).clone().appendTo(self.ul);
                    self.ul.children().eq(self.len + 1).css({
                        "position": "relative",
                        "left": -self.liWidth * (self.len + 2)
                    });
                } else {
                    self.ul.width(self.liWidth * self.len);
                }
                setTransform(self.ul, -self.liWidth * self.index);
                self.beforeCallback && typeof self.beforeCallback == "function" && self.beforeCallback(self.wrap, self.index);
            },
            /*移动*/
            move: function() {
                var self = this;
                if (arguments[0] == 0) {
                    //不循环的时候
                    if (!self.isLoop) {
                        if (self.index < self.len - 1) {
                            self.index++;
                        } else {
                            clearInterval(self.timer);
                        }
                    }
                    //循环的时候
                    else {
                        self.index++;
                    }
                } else if (arguments[0] == 1) {
                    if (!self.isLoop && self.index > 0) {
                        self.index--;
                    } else if (self.isLoop) {
                        self.index--;
                    }
                }
                var animatObj = {};
                animatObj[TRANSFORM] = returnTransform(-self.liWidth * self.index);
                self.ul.animate(animatObj,
                    self.speed,
                    function() {
                        if (self.index > self.len - 1) {
                            setTransform(self.ul, 0);
                            self.index = 0;
                        } else if (self.index < 0) {
                            setTransform(self.ul, -self.liWidth * (self.len - 1));
                            self.index = self.len - 1;
                        }
                        self.numBoxB.removeClass(self.cur).eq(self.index).addClass(self.cur);
                        self.finishCallback && typeof self.finishCallback == "function" && self.finishCallback(self.wrap, self.index);
                    });
                if (self.isLoop && self.index == self.len) {
                    self.numBoxB.removeClass(self.cur).eq(0).addClass(self.cur);
                }
            },
            /*自动*/
            autoPlay: function() {
                var self = this;
                clearInterval(self.timer);
                if (self.isAuto) {
                    self.timer = setInterval(function() {
                            self.move(0);
                        },
                        self.autoTime);
                }
            },
            /*touch事件*/
            bind: function() {
                var self = this;
                var startX, startY, ulOffset, spirit = null;

                function touchStart(event) {
                    clearInterval(self.timer);
                    spirit = null;
                    if (!event.touches.length) return;
                    var touch = event.touches[0];
                    startX = touch.clientX;
                    startY = touch.clientY;
                    ulOffset = getTransform(self.ul);
                }

                function touchMove(event) {
                    if (!event.touches.length) return;
                    var touch = event.touches[0],
                        x = touch.clientX - startX,
                        y = touch.clientY - startY;
                    //这里是为了手指一定是横向滑动的,原理是计算X位置的偏移要比Y的偏移大
                    if (Math.abs(x) > Math.abs(y)) {
                        event.preventDefault();
                        //向左滑动
                        if (x < 0) {
                            spirit = 0;
                            self.follow && setTransform(self.ul, ulOffset - Math.abs(x));
                        }
                        //向右滑动
                        else {
                            spirit = 1;
                            self.follow && setTransform(self.ul, ulOffset + Math.abs(x));
                        }
                        //控制不滑出视线
                        if (self.isSlideLi) {
                            var leftOffset = getTransform(self.ul),
                                ulWidth = self.ul.width(),
                                winWidth = self.isSlideLiWidth,
                                off = winWidth - ulWidth;
                            if (leftOffset >= 0) {
                                setTransform(self.ul, 0);
                            }
                            if (leftOffset <= off) {
                                setTransform(self.ul, off);
                            }
                        }
                    }
                }

                function touchEnd(event) {
                    if (!self.isSlideLi) {
                        spirit == 0 && self.move(0);
                        spirit == 1 && self.move(1);
                        self.autoPlay();
                    }
                }
                self.wrap.on("touchstart", touchStart);
                self.wrap.on("touchmove", touchMove);
                self.wrap.on("touchend", touchEnd);
            }
        };
        //插件
        $.fn.touchSlide = function(options) {
            var opts = $.extend({}, $.fn.touchSlide.defaults, options);
            this.each(function() {
                //new构造函数对象
                new TouchSlide($(this), opts);
            });
        };
        /*定义默认值*/
        $.fn.touchSlide.defaults = {
            //初次显示第几张，从0开始
            index: 0,
            //列表框的标签
            ul: "ul",
            //列表标签
            li: "li",
            //图片序列号按钮BOX
            numBox: ".num",
            //数字按钮焦点样式
            cur: "cur",
            //是否需要循环轮播
            isLoop: true,
            //是否自动播放
            isAuto: true,
            //效果时间
            speed: 300,
            //效果间隔时间
            autoTime: 5000,
            //是否让UL随着手指滑动
            follow: false,
            //是否滑多少就是多少，通常用于导航滑动,此时follow一定为true,isLoop设置为false
            isSlideLi: false,
            //是否滑多少就是多少的时候，外容器的宽度，默认为$(window).width()
            isSlideLiWidth: $(window).width(),
            //滑动前的回调，参数为wrap和index
            beforeCallback: function() {},
            //滑动完成后的回调，参数为wrap和index
            finishCallback: function() {}
        };
    })(Zepto)
})