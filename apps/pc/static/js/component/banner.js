fml.define("component/banner", [], function(require, exports) {
    /*
        @plugName: jquery.imageSlide.simple.js
        @author: xudeming208@126.com
        @data: 2012-4-22
        @example: 
            $(id).imageSlide({
                //初次显示第几张，从0开始
                index: 0,
                //列表框的标签
                ul: "ul",
                //列表标签
                li: "li",
                //图片序列号按钮BOX
                numBox: ".num",
                //上一张按钮
                prev: ".prev",
                //下一张按钮
                next: ".next",
                //数字按钮焦点样式
                cur: "cur",
                //是否自动播放
                isAuto: true,
                //是否启用图片延迟加载，提高网站初次载入的速度
                lazyLoad: false,
                //启用图片延迟加载时，真正图片存贮的属性名称
                imgSrc: "data-src",
                //是否根据图片的数量自动生成系号
                displayNum: true,
                //触发效果的事件，0：hover事件；1：click事件
                evt: 1,
                //特效类型 0：渐变；1:左右滑动；2：上下滑动；
                effect: 1,
                //效果时间
                speed: 500,
                //效果间隔时间
                autoTime: 5000
            });
        */

    ;
    (function($) {
        /*属性写在构造函数中*/
        function ImageSlide(el, opts) {
            var self = this;
            self.wrap = el;
            self.ul = self.wrap.find(opts.ul);
            self.li = self.ul.find(opts.li);
            self.len = self.li.length;
            self.liWidth = self.li.outerWidth(true);
            self.liHeight = self.li.outerHeight(true);
            self.numBox = self.wrap.find(opts.numBox);
            self.prev = self.wrap.find(opts.prev);
            self.next = self.wrap.find(opts.next);
            self.isAuto = opts.isAuto;
            self.lazyLoad = opts.lazyLoad;
            self.imgSrc = opts.imgSrc;
            self.displayNum = opts.displayNum;
            self.cur = opts.cur;
            self.evt = opts.evt;
            self.effect = opts.effect;
            self.speed = opts.speed;
            self.autoTime = opts.autoTime;
            self.index = opts.index;
            self.numBoxB = null;
            self.timer = null;
            self.direction = null;
            self.step = null;
            self.dbclicks = false;
            self.moveObj = {};
            self.moveObj2 = {};
            self.prevIndex = 0;
            //执行
            self.init();
        }
        /*方法写在原型中*/
        ImageSlide.prototype = {
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
                self.speed = self.speed >= self.autoTime ? self.autoTime - 100 : self.speed;
                //限制index的值的范围
                if (self.index <= 0) {
                    self.index = 0;
                } else if (self.index >= self.len) {
                    self.index = self.len - 1;
                }
                /*是否显示图片序列号*/
                if (self.displayNum) {
                    self.numBox.empty();
                    for (var m = 0; m < self.len; m++) {
                        self.numBox.append("<b>" + (m + 1) + "</b>");
                    }
                }
                self.numBoxB = self.numBox.children();
                self.numBoxB.eq(self.index).addClass(self.cur);
                /*添加覆盖loading层*/
                if (self.lazyLoad) {
                    for (var n = 0; n < self.len; n++) {
                        self.li.eq(n).append("<div class='loading-cover'></div>");
                    }
                }
                self.lazyLoad && self.loadImg(self.index);
                switch (self.effect) {
                    //渐变效果
                    case 0:
                        self.li.hide().eq(self.index).show();
                        break;
                        //横向滑动
                    case 1:
                        self.direction = "left";
                        self.step = self.liWidth;
                        break;
                        //垂直滑动
                    case 2:
                        self.direction = "top";
                        self.step = self.liHeight;
                        break;
                }
                //滑动共同config
                if (self.effect != 0) {
                    self.li.css(self.direction, self.step).eq(self.index).css(self.direction, 0).addClass("prevIndexLi");
                }
                self.moveObj[self.direction] = 0;
            },
            /*移动*/
            move: function() {
                var self = this;
                //防止双击
                if (!self.dbclicks) {
                    self.prevIndex = self.wrap.find(".prevIndexLi").index();
                    if (arguments[0] == 0) {
                        self.index < self.len - 1 ? self.index++ : self.index = 0;
                        if (self.effect != 0) {
                            self.moveObj2[self.direction] = -self.step;
                            self.li.eq(self.index).css(self.direction, self.step);
                        }
                    } else if (arguments[0] == 1) {
                        self.index <= 0 ? (self.index = self.len - 1) : self.index--;
                        if (self.effect != 0) {
                            self.moveObj2[self.direction] = self.step;
                            self.li.eq(self.index).css(self.direction, -self.step);
                        }
                    } else {
                        if (self.prevIndex < self.index) {
                            self.moveObj2[self.direction] = -self.step;
                            self.effect != 0 && self.li.eq(self.index).css(self.direction, self.step);
                        } else {
                            self.moveObj2[self.direction] = self.step;
                            self.effect != 0 && self.li.eq(self.index).css(self.direction, -self.step);
                        }
                    }
                    self.li.removeClass("prevIndexLi").eq(self.index).addClass("prevIndexLi");
                    switch (self.effect) {
                        //渐变效果
                        case 0:
                            self.li.stop(true, true).fadeOut(self.speed).eq(self.index).fadeIn(self.speed,
                                function() {
                                    self.dbclicks = false;
                                    self.loadImg(self.index);
                                });
                            self.numBoxB.removeClass(self.cur).eq(self.index).addClass(self.cur);
                            break;
                            //滑动效果
                        case 1:
                        case 2:
                            self.li.eq(self.prevIndex).stop(true, true).animate(self.moveObj2, self.speed);
                            self.li.eq(self.index).stop(true, true).animate(self.moveObj, self.speed,
                                function() {
                                    self.dbclicks = false;
                                    self.loadImg(self.index);
                                });
                            self.numBoxB.removeClass(self.cur).eq(self.index).addClass(self.cur);
                            if (self.index == self.len) {
                                self.numBoxB.removeClass(self.cur).eq(0).addClass(self.cur);
                            }
                            break;
                    }
                }
            },
            /*加载图片函数*/
            loadImg: function(index, callback) {
                var self = this;
                if (self.lazyLoad) {
                    var o = self.li.eq(index).find("img");
                    //图片都加载完成后不再执行下面的方法
                    if (o.attr(self.imgSrc)) {
                        var img = new Image();
                        img.src = o.attr(self.imgSrc);
                        img.onload = function() {
                            o.attr("src", img.src);
                            o.removeAttr(self.imgSrc);
                            self.li.eq(index).find(".loading-cover").remove();
                            callback && typeof callback == "function" && callback();
                        }
                    }
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
            /*定义移上相应元素停止自动效果的函数*/
            hoverStop: function(hoverObj) {
                var self = this;
                hoverObj.hover(function() {
                        clearInterval(self.timer);
                    },
                    function() {
                        self.autoPlay();
                    });
            },
            /*鼠标事件*/
            bind: function() {
                var self = this;
                self.hoverStop(self.li);
                /*hover事件*/
                if (self.evt == 0) {
                    //hover事件的时候隐藏左右按键
                    self.prev.hide();
                    self.next.hide();
                    //移到数字显示相应图片
                    var delayTime;
                    self.numBoxB.hover(function() {
                            clearInterval(self.timer);
                            //不是同一张照片的时候才执行动画
                            if (!$(this).hasClass(self.cur)) {
                                self.index = self.numBoxB.index(this);
                                /*设置延迟响应，避免太过于灵活*/
                                delayTime = setTimeout(function() {
                                        self.move();
                                    },
                                    200);
                            }
                        },
                        function() {
                            clearTimeout(delayTime);
                            self.autoPlay();
                        });
                }
                /*click事件*/
                else if (self.evt == 1) {
                    self.hoverStop(self.numBoxB);
                    self.hoverStop(self.prev);
                    self.hoverStop(self.next);
                    self.numBoxB.click(function() {
                        //不是同一张照片的时候才执行动画
                        if (!$(this).hasClass(self.cur)) {
                            self.index = self.numBoxB.index(this);
                            self.move();
                        }
                    });
                    self.prev.click(function() {
                        self.move(1);
                        self.dbclicks = true;
                    });
                    self.next.click(function() {
                        self.move(0);
                        self.dbclicks = true;
                    });
                }
            }
        };
        //插件
        $.fn.imageSlide = function(options) {
            var opts = $.extend({},
                $.fn.imageSlide.defaults, options);
            this.each(function() {
                //new构造函数对象
                new ImageSlide($(this), opts);
            });
        };
        /*定义默认值*/
        $.fn.imageSlide.defaults = {
            //初次显示第几张，从0开始
            index: 0,
            //列表框的标签
            ul: "ul",
            //列表标签
            li: "li",
            //图片序列号按钮BOX
            numBox: ".num",
            //上一张按钮
            prev: ".prev",
            //下一张按钮
            next: ".next",
            //数字按钮焦点样式
            cur: "cur",
            //是否自动播放
            isAuto: true,
            //是否启用图片延迟加载，提高网站初次载入的速度
            lazyLoad: false,
            //启用图片延迟加载时，真正图片存贮的属性名称
            imgSrc: "data-src",
            //是否根据图片的数量自动生成系号
            displayNum: true,
            //触发效果的事件，0：hover事件；1：click事件
            evt: 1,
            //特效类型 0：渐变；1:左右滑动；2：上下滑动；
            effect: 1,
            //效果时间
            speed: 500,
            //效果间隔时间
            autoTime: 5000
        };
    })(jQuery)
})