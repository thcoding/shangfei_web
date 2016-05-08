/// <reference path="jquery-2.0.3.min.js" />
/// <reference path="Utilities.js" />
/// <reference path="Galaxy.Controls.CurveAnimator.js" />

$.registerNamespace("Galaxy.Controls");

///////////////////////////////////////////////////////////////////////////////

Galaxy.Controls.AnimationPoint = function (paper, settings) {
    var that = this;

    this.paper = paper;
    this.$handle = null;
    this.command = "L";
    this.pointX = 100;
    this.pointY = 100;
    this.w = 10;
    this.offset = this.w / 2;

    $.extend(this, settings);

    this.showHandle = function (bool) {
        bool ? that.$handle.show() : that.$handle.hide();
    };

    this.drawControlHandle = function (paper, command) {
        var rect = paper.rect(this.pointX - this.offset, this.pointY - this.offset, this.w, this.w).attr({
            stroke: command === "L" ? "#0071C5" : "#E81123",
            fill: "#ccc",
            opacity: .5
        });

        var start = function () {
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.animate({ opacity: 1 }, 500, ">");
        },
        move = function (dx, dy) {
            var newX = this.ox + dx,
                newY = this.oy + dy;

            this.attr({ x: newX, y: newY });
            that.pointX = newX + that.offset;
            that.pointY = newY + that.offset;
            $(document).trigger("baRefresh");
        },
        up = function () {
            this.animate({ opacity: .5 }, 500, ">");
        };

        rect.drag(move, start, up);

        return rect;
    };

    this.serialize = function () {
        var properties = ["imageUrl", "imageWidth", "imageHeight"],
           i = 0,
           data = {};

        for (i = 0; i < properties.length; i++) {
            data[properties[i]] = that[properties[i]];
        }
        return JSON.stringify(data);
    };

    this.remove = function () {
        that.$handle.remove();
    };

    /////
    this.$handle = this.drawControlHandle(this.paper, this.command);
};

///////////////////////////////////////////////////////////////////////////////

Galaxy.Controls.BezierAnimation = function (containerId, settings) {
    var that = this;

    this.containerId = containerId;

    //path data
    this.path;
    this.animationPoints = [];
    this.pointData = [];

    //image
    this.imageUrl;
    this.imageWidth;
    this.imageHeight;
    this.imageLeft;
    this.imageTop;
    this.enableDrawPath = !0;

    this.commandMode = "L";

    $.extend(this, settings);

    ///////////////////////////////////////////////////////////////////////////////
    //Main api calls
    this.enableDrawPathFunction = function (enable) {
        this.enableDrawPath = enable; return this;
    };
    this.init = function () {
        var i = 0,
            pdata = null;

        //cache
        this.$container = $("#" + this.containerId);
        this.paper = Raphael(this.containerId, "100%", "100%");
        //custom guides
        this.paper.addGuides();
        //load pointData
        for (i = 0; i < this.pointData.length; i++) {
            pdata = this.pointData[i];
            this.addAnimationPoint(pdata.command, pdata.pointX, pdata.pointY);
        }
        //create image
        this.$image = this.createImage(this.paper, this.imageUrl, this.imageWidth, this.imageHeight, this.imageLeft, this.imageTop);
        //create default control point
        if (this.animationPoints.length === 0) {
            this.addAnimationPoint("L", this.imageLeft + (this.imageWidth / 2), this.imageTop + (this.imageHeight / 2));
        }
        //draw path
        this.drawPath(this.animationPoints);

        //event handlers

        this.enableDrawPath && that.$container.click(function (e) {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            var target = e.target;
            //todo: this should be some class value, check how to id raphael
            if (target.nodeName != "rect") {
                that.addAnimationPoint(that.commandMode, relX, relY);
            }
            e.stopImmediatePropagation();
            e.isImmediatePropagationStopped();
        });

        $(document).on("baRefresh", that.refresh);

        this.refresh();
        return that;
    };

    this.addAnimationPoint = function (command, x, y) {
        var point = new Galaxy.Controls.AnimationPoint(that.paper, {
            command: command,
            pointX: x,
            pointY: y
        }),
        point2 = null,
        currAp = that.animationPoints[that.animationPoints.length - 1];
        //prevAp = that.animationPoints[that.animationPoints.length - 2];
        if (currAp) {
            if (currAp.command === "L" && command === "R") {
                //add an extra point halfway
                point2 = new Galaxy.Controls.AnimationPoint(that.paper, {
                    command: command,
                    pointX: x - ((x - currAp.pointX) / 2),
                    pointY: y - ((y - currAp.pointY) / 2)
                });
                that.animationPoints.push(point2);
            }
        }

        that.animationPoints.push(point);
        that.drawPath(that.animationPoints);
        return that;
    };

    this.clearPath = function () {
        var i = 0;
        for (var i = 0; i < that.animationPoints.length; i++) {
            that.animationPoints[i].remove();
        }
        that.animationPoints = [];
        if (this.path) {
            this.path.remove();
        };

        this.paper.clear();
        return that;
    };

    this.showPath = function (flag) {
        if (typeof (flag) === "boolean") {
            flag ? this.path.show() : this.path.hide();
        } else {
            this.path.show();
        }
        return that;
    };

    this.showHandles = function (flag) {
        var f = typeof (flag) === "boolean" ? flag : true,
            i = 0;

        for (i = 0; i < that.animationPoints.length; i++) {
            that.animationPoints[i].showHandle(f);
        }
        return that;
    };

    this.play = function (duration, rotateAlong, preCall, callback) {
        //http://zreference.com/raphael-animation-along-a-path/
        //todo: anything before we animate?
        if (that.animationPoints.length <= 1) {
            callback(-1);
            return -1;
        }

        preCall && preCall();

        that.$image.attr({
            x: 0,
            y: 0,
            rotateAlong: rotateAlong,
            guide: that.path,
            along: 0
        })
           .animate({
               along: 1,
               callback: function () {
                   //todo: anything after animate?
                   callback && callback();
               }
           }, duration || 3, "");
    };

    this.serializeData = function () {
        var animationPoints = {},
            data = {
                imageUrl: that.imageUrl,
                imageWidth: that.imageWidth,
                imageHeight: that.imageHeight,
                imageTop: that.imageTop,
                imageLeft: that.imageLeft,
                pointData: []
            },
            ap = null,
            i = 0;

        for (i = 0; i < that.animationPoints.length; i++) {
            ap = that.animationPoints[i];
            data.pointData.push({
                command: ap.command,
                pointX: ap.pointX,
                pointY: ap.pointY
            });
        }
        return JSON.stringify(data);
    };

    this.refresh = function () {
        that.drawPath(that.animationPoints);
        //move image
        if (that.animationPoints.length === 1) {
            that.$image.attr({
                x: that.animationPoints[0].pointX - (that.$image.attrs.width / 2),
                y: that.animationPoints[0].pointY - (that.$image.attrs.height / 2)
            });
        } else {
            that.$image.attr({
                x: 0,
                y: 0,
                rotateAlong: false,
                guide: that.path,
                along: 0
            });
        }
        return that;
    };

    this.removeLastPoint = function () {
        var prev_1 = that.animationPoints[that.animationPoints.length - 2],
            prev_2 = that.animationPoints[that.animationPoints.length - 3];

        if (that.animationPoints.length <= 1) {
            that.refresh();
            return;
        }
        that.removePoint(that.animationPoints.length - 1);

        if (prev_1 && prev_1.command === "R") {
            if (prev_2 && prev_2.command == "L") {
                //remove one more
                that.removePoint(that.animationPoints.length - 1);
            }
        }
        if (that.animationPoints.length <= 1) {
            that.$image.attr("transform", "");
        }
        that.refresh();
    };

    this.removePoint = function (index) {
        if (that.animationPoints.length > 1) {
            that.animationPoints[index].remove();
            that.animationPoints.splice(index, 1);
        }
    };

    this.remove = function () {
        that.clearPath();
        $(document).unbind("baRefresh");
        that.$container.unbind("click");
        that.paper.canvas.parentNode.removeChild(that.paper.canvas);
    };

    ///////////////////////////////////////////////////////////////////////////////

    this.createImage = function (paper, src, width, height, x, y) {
        return paper.image(src, x, y, width, height).toBack();
    };

    this.setPosition = function (rObj, x, y) {
        rObj.attr({
            x: x,
            y: y,
            transform: "",
            along: 0
        });
    };

    this.drawPath = function (animationPoints) {
        var p = this.getAnimationPathString(animationPoints);
        if (this.path) {
            this.path.remove();
        };
        this.path = this.paper.path(p).attr("stroke", "#333").toBack();
    };

    this.getAnimationPathString = function (animationPoints) {
        var i = 0,
            ap = null,
            p = "",
            currentCommandMode = "";

        //starting point
        ap = animationPoints[0];
        p += "M " + ap.pointX + " " + ap.pointY + " ";

        //p += "R ";
        for (i = 1; i < animationPoints.length; i++) {
            ap = animationPoints[i];

            //special case for curves
            if (currentCommandMode === "R" && ap.command === "R") {
                p += ap.pointX + " " + ap.pointY + " ";
            } else {
                p += ap.command + " " + ap.pointX + " " + ap.pointY + " ";
            }
            currentCommandMode = ap.command;
        }
        return p;
    };
};