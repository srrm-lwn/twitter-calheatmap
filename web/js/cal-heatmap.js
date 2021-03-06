/*! cal-heatmap v3.3.10 (Tue Dec 03 2013 19:30:23)
 *  ---------------------------------------------
 *  Cal-Heatmap is a javascript module to create calendar heatmap to visualize time series data
 *  https://github.com/kamisama/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2013 Wan Qi Chen
 */
function mergeRecursive(t, e) {
    "use strict";
    for (var n in e) try {
        t[n] = e[n].constructor === Object ? mergeRecursive(t[n], e[n]) : e[n]
    } catch (i) {
        t[n] = e[n]
    }
    return t
}

function arrayEquals(t, e) {
    "use strict";
    if (!e || !t) return !1;
    if (t.length !== e.length) return !1;
    for (var n = 0; t.length > n; n++)
        if (t[n] instanceof Array && e[n] instanceof Array) {
            if (!arrayEquals(t[n], e[n])) return !1
        } else if (t[n] !== e[n]) return !1;
    return !0
}
var CalHeatMap = function() {
    "use strict";

    function t() {
        i.verticalDomainLabel = "top" === i.options.label.position || "bottom" === i.options.label.position, i.domainVerticalLabelHeight = null === i.options.label.height ? Math.max(25, 2 * i.options.cellSize) : i.options.label.height, i.domainHorizontalLabelWidth = 0, "" === i.options.domainLabelFormat && null === i.options.label.height && (i.domainVerticalLabelHeight = 0), i.verticalDomainLabel || (i.domainVerticalLabelHeight = 0, i.domainHorizontalLabelWidth = i.options.label.width), i.paint(), i.options.nextSelector !== !1 && d3.select(i.options.nextSelector).on("click." + i.options.itemNamespace, function() {
            return d3.event.preventDefault(), i.loadNextDomain(1)
        }), i.options.previousSelector !== !1 && d3.select(i.options.previousSelector).on("click." + i.options.itemNamespace, function() {
            return d3.event.preventDefault(), i.loadPreviousDomain(1)
        }), i.Legend.redraw(i.graphDim.width - i.options.domainGutter - i.options.cellPadding), i.afterLoad();
        var t = i.getDomainKeys();
        i.options.loadOnInit ? i.getDatas(i.options.data, new Date(t[0]), i.getSubDomain(t[t.length - 1]).pop(), function() {
            i.fill(), i.onComplete()
        }) : i.onComplete(), i.checkIfMinDomainIsReached(t[0]), i.checkIfMaxDomainIsReached(i.getNextDomain().getTime())
    }

    function e(t, e) {
        var n = i.options.cellSize * i._domainType[i.options.subDomain].column(t) + i.options.cellPadding * i._domainType[i.options.subDomain].column(t);
        return 2 === arguments.length && e === !0 ? n += i.domainHorizontalLabelWidth + i.options.domainGutter + i.options.domainMargin[1] + i.options.domainMargin[3] : n
    }

    function n(t, e) {
        var n = i.options.cellSize * i._domainType[i.options.subDomain].row(t) + i.options.cellPadding * i._domainType[i.options.subDomain].row(t);
        return 2 === arguments.length && e === !0 && (n += i.options.domainGutter + i.domainVerticalLabelHeight + i.options.domainMargin[0] + i.options.domainMargin[2]), n
    }
    var i = this;
    this.allowedDataType = ["json", "csv", "tsv", "txt"], this.options = {
        itemSelector: "#cal-heatmap",
        paintOnLoad: !0,
        range: 12,
        cellSize: 10,
        cellPadding: 2,
        cellRadius: 0,
        domainGutter: 2,
        domainMargin: [0, 0, 0, 0],
        domain: "hour",
        subDomain: "min",
        colLimit: null,
        rowLimit: null,
        weekStartOnMonday: !0,
        start: new Date,
        minDate: null,
        maxDate: null,
        data: "",
        dataType: this.allowedDataType[0],
        considerMissingDataAsZero: !1,
        loadOnInit: !0,
        verticalOrientation: !1,
        domainDynamicDimension: !0,
        label: {
            position: "bottom",
            align: "center",
            offset: {
                x: 0,
                y: 0
            },
            rotate: null,
            width: 100,
            height: null
        },
        legend: [10, 20, 30, 40],
        displayLegend: !0,
        legendCellSize: 10,
        legendCellPadding: 2,
        legendMargin: [0, 0, 0, 0],
        legendVerticalPosition: "bottom",
        legendHorizontalPosition: "left",
        legendOrientation: "horizontal",
        legendColors: null,
        highlight: [],
        itemName: ["item", "items"],
        domainLabelFormat: null,
        subDomainTitleFormat: {
            empty: "{date}",
            filled: "{count} {name} {connector} {date}"
        },
        subDomainDateFormat: null,
        subDomainTextFormat: null,
        legendTitleFormat: {
            lower: "less than {min} {name}",
            inner: "between {down} and {up} {name}",
            upper: "more than {max} {name}"
        },
        animationDuration: 500,
        nextSelector: !1,
        previousSelector: !1,
        itemNamespace: "cal-heatmap",
        tooltip: !1,
        onClick: null,
        afterLoad: null,
        afterLoadNextDomain: null,
        afterLoadPreviousDomain: null,
        onComplete: null,
        afterLoadData: function(t) {
            return t
        },
        onMaxDomainReached: null,
        onMinDomainReached: null
    }, this._domainType = {
        min: {
            name: "minute",
            level: 10,
            maxItemNumber: 60,
            defaultRowNumber: 10,
            defaultColumnNumber: 6,
            row: function(t) {
                return i.getSubDomainRowNumber(t)
            },
            column: function(t) {
                return i.getSubDomainColumnNumber(t)
            },
            position: {
                x: function(t) {
                    return Math.floor(t.getMinutes() / i._domainType.min.row(t))
                },
                y: function(t) {
                    return t.getMinutes() % i._domainType.min.row(t)
                }
            },
            format: {
                date: "%H:%M, %A %B %-e, %Y",
                legend: "",
                connector: "at"
            },
            extractUnit: function(t) {
                return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()).getTime()
            }
        },
        hour: {
            name: "hour",
            level: 20,
            maxItemNumber: function(t) {
                switch (i.options.domain) {
                    case "day":
                        return 24;
                    case "week":
                        return 168;
                    case "month":
                        return 24 * (i.options.domainDynamicDimension ? i.getDayCountInMonth(t) : 31)
                }
            },
            defaultRowNumber: 6,
            defaultColumnNumber: function(t) {
                switch (i.options.domain) {
                    case "day":
                        return 4;
                    case "week":
                        return 28;
                    case "month":
                        return i.options.domainDynamicDimension ? i.getDayCountInMonth(t) : 31
                }
            },
            row: function(t) {
                return i.getSubDomainRowNumber(t)
            },
            column: function(t) {
                return i.getSubDomainColumnNumber(t)
            },
            position: {
                x: function(t) {
                    return "month" === i.options.domain ? i.options.colLimit > 0 || i.options.rowLimit > 0 ? Math.floor((t.getHours() + 24 * (t.getDate() - 1)) / i._domainType.hour.row(t)) : Math.floor(t.getHours() / i._domainType.hour.row(t)) + 4 * (t.getDate() - 1) : "week" === i.options.domain ? i.options.colLimit > 0 || i.options.rowLimit > 0 ? Math.floor((t.getHours() + 24 * i.getWeekDay(t)) / i._domainType.hour.row(t)) : Math.floor(t.getHours() / i._domainType.hour.row(t)) + 4 * i.getWeekDay(t) : Math.floor(t.getHours() / i._domainType.hour.row(t))
                },
                y: function(t) {
                    var e = t.getHours();
                    if (i.options.colLimit > 0 || i.options.rowLimit > 0) switch (i.options.domain) {
                        case "month":
                            e += 24 * (t.getDate() - 1);
                            break;
                        case "week":
                            e += 24 * i.getWeekDay(t)
                    }
                    return Math.floor(e % i._domainType.hour.row(t))
                }
            },
            format: {
                date: "%Hh, %A %B %-e, %Y",
                legend: "%H:00",
                connector: "at"
            },
            extractUnit: function(t) {
                return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()).getTime()
            }
        },
        day: {
            name: "day",
            level: 30,
            maxItemNumber: function(t) {
                switch (i.options.domain) {
                    case "week":
                        return 7;
                    case "month":
                        return i.options.domainDynamicDimension ? i.getDayCountInMonth(t) : 31;
                    case "year":
                        return i.options.domainDynamicDimension ? i.getDayCountInYear(t) : 366
                }
            },
            defaultColumnNumber: function(t) {
                switch (t = new Date(t), i.options.domain) {
                    case "week":
                        return 1;
                    case "month":
                        return i.options.domainDynamicDimension && !i.options.verticalOrientation ? i.getWeekNumber(new Date(t.getFullYear(), t.getMonth() + 1, 0)) - i.getWeekNumber(t) + 1 : 6;
                    case "year":
                        return i.options.domainDynamicDimension ? i.getWeekNumber(new Date(t.getFullYear(), 11, 31)) - i.getWeekNumber(new Date(t.getFullYear(), 0)) + 1 : 54
                }
            },
            defaultRowNumber: 7,
            row: function(t) {
                return i.getSubDomainRowNumber(t)
            },
            column: function(t) {
                return i.getSubDomainColumnNumber(t)
            },
            position: {
                x: function(t) {
                    switch (i.options.domain) {
                        case "week":
                            return Math.floor(i.getWeekDay(t) / i._domainType.day.row(t));
                        case "month":
                            return i.options.colLimit > 0 || i.options.rowLimit > 0 ? Math.floor((t.getDate() - 1) / i._domainType.day.row(t)) : i.getWeekNumber(t) - i.getWeekNumber(new Date(t.getFullYear(), t.getMonth()));
                        case "year":
                            return i.options.colLimit > 0 || i.options.rowLimit > 0 ? Math.floor((i.getDayOfYear(t) - 1) / i._domainType.day.row(t)) : i.getWeekNumber(t)
                    }
                },
                y: function(t) {
                    var e = i.getWeekDay(t);
                    if (i.options.colLimit > 0 || i.options.rowLimit > 0) switch (i.options.domain) {
                        case "year":
                            e = i.getDayOfYear(t) - 1;
                            break;
                        case "week":
                            e = i.getWeekDay(t);
                            break;
                        case "month":
                            e = t.getDate() - 1
                    }
                    return Math.floor(e % i._domainType.day.row(t))
                }
            },
            format: {
                date: "%A %B %-e, %Y",
                legend: "%e %b",
                connector: "on"
            },
            extractUnit: function(t) {
                return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
            }
        },
        week: {
            name: "week",
            level: 40,
            maxItemNumber: 54,
            defaultColumnNumber: function(t) {
                switch (t = new Date(t), i.options.domain) {
                    case "year":
                        return i._domainType.week.maxItemNumber;
                    case "month":
                        return i.getWeekNumber(new Date(t.getFullYear(), t.getMonth() + 1, 0)) - i.getWeekNumber(t)
                }
            },
            defaultRowNumber: 1,
            row: function(t) {
                return i.getSubDomainRowNumber(t)
            },
            column: function(t) {
                return i.getSubDomainColumnNumber(t)
            },
            position: {
                x: function(t) {
                    switch (i.options.domain) {
                        case "year":
                            return Math.floor(i.getWeekNumber(t) / i._domainType.week.row(t));
                        case "month":
                            return Math.floor(i.getMonthWeekNumber(t) / i._domainType.week.row(t))
                    }
                },
                y: function(t) {
                    return i.getWeekNumber(t) % i._domainType.week.row(t)
                }
            },
            format: {
                date: "%B Week #%W",
                legend: "%B Week #%W",
                connector: "on"
            },
            extractUnit: function(t) {
                var e = new Date(t.getFullYear(), t.getMonth(), t.getDate()),
                    n = e.getDay() - 1;
                return 0 > n && (n = 6), e.setDate(e.getDate() - n), e.getTime()
            }
        },
        month: {
            name: "month",
            level: 50,
            maxItemNumber: 12,
            defaultColumnNumber: 12,
            defaultRowNumber: 1,
            row: function() {
                return i.getSubDomainRowNumber()
            },
            column: function() {
                return i.getSubDomainColumnNumber()
            },
            position: {
                x: function(t) {
                    return Math.floor(t.getMonth() / i._domainType.month.row(t))
                },
                y: function(t) {
                    return t.getMonth() % i._domainType.month.row(t)
                }
            },
            format: {
                date: "%B %Y",
                legend: "%B",
                connector: "on"
            },
            extractUnit: function(t) {
                return new Date(t.getFullYear(), t.getMonth()).getTime()
            }
        },
        year: {
            name: "year",
            level: 60,
            row: function() {
                return i.options.rowLimit || 1
            },
            column: function() {
                return i.options.colLimit || 1
            },
            position: {
                x: function() {
                    return 1
                },
                y: function() {
                    return 1
                }
            },
            format: {
                date: "%Y",
                legend: "%Y",
                connector: "on"
            },
            extractUnit: function(t) {
                return new Date(t.getFullYear()).getTime()
            }
        }
    };
    for (var o in this._domainType)
        if (this._domainType.hasOwnProperty(o)) {
            var a = this._domainType[o];
            this._domainType["x_" + o] = {
                name: "x_" + o,
                level: a.type,
                maxItemNumber: a.maxItemNumber,
                defaultRowNumber: a.defaultRowNumber,
                defaultColumnNumber: a.defaultColumnNumber,
                row: a.column,
                column: a.row,
                position: {
                    x: a.position.y,
                    y: a.position.x
                },
                format: a.format,
                extractUnit: a.extractUnit
            }
        }
    this.lastInsertedSvg = null, this._completed = !1, this._domains = d3.map(), this.graphDim = {
        width: 0,
        height: 0
    }, this.legendDim = {
        width: 0,
        height: 0
    }, this.NAVIGATE_LEFT = 1, this.NAVIGATE_RIGHT = 2, this.RESET_ALL_ON_UPDATE = 0, this.RESET_SINGLE_ON_UPDATE = 1, this.APPEND_ON_UPDATE = 2, this.DEFAULT_LEGEND_MARGIN = 10, this.root = null, this.tooltip = null, this._maxDomainReached = !1, this._minDomainReached = !1, this.domainPosition = new DomainPosition, this.Legend = null, this.legendScale = null, this.DSTDomain = [], this._init = function() {
        return i.getDomain(i.options.start).map(function(t) {
            return t.getTime()
        }).map(function(t) {
            i._domains.set(t, i.getSubDomain(t).map(function(t) {
                return {
                    t: i._domainType[i.options.subDomain].extractUnit(t),
                    v: null
                }
            }))
        }), i.root = d3.select(i.options.itemSelector).append("svg").attr("class", "cal-heatmap-container"), i.tooltip = d3.select(i.options.itemSelector).attr("style", function() {
            var t = d3.select(i.options.itemSelector).attr("style");
            return (null !== t ? t : "") + "position:relative;"
        }).append("div").attr("class", "ch-tooltip"), i.root.attr("x", 0).attr("y", 0).append("svg").attr("class", "graph"), i.Legend = new Legend(i), i.options.paintOnLoad && t(), !0
    }, this.paint = function(t) {
        function o(e, n, o, a) {
            var r = 0;
            switch (t) {
                case !1:
                    return r = n[o], n[o] += a, i.domainPosition.setPosition(e, r), r;
                case i.NAVIGATE_RIGHT:
                    return i.domainPosition.setPosition(e, n[o]), l = a, u = i.domainPosition.getPositionFromIndex(1), i.domainPosition.shiftRightBy(u), n[o];
                case i.NAVIGATE_LEFT:
                    return r = -a, l = -r, u = n[o] - i.domainPosition.getLast(), i.domainPosition.setPosition(e, r), i.domainPosition.shiftLeftBy(l), r
            }
        }

        function a(t) {
            switch (r.label.rotate) {
                case "right":
                    t.attr("transform", function(t) {
                        var n = "rotate(90), ";
                        switch (r.label.position) {
                            case "right":
                                n += "translate(-" + e(t) + " , -" + e(t) + ")";
                                break;
                            case "left":
                                n += "translate(0, -" + i.domainHorizontalLabelWidth + ")"
                        }
                        return n
                    });
                    break;
                case "left":
                    t.attr("transform", function(t) {
                        var n = "rotate(270), ";
                        switch (r.label.position) {
                            case "right":
                                n += "translate(-" + (e(t) + i.domainHorizontalLabelWidth) + " , " + e(t) + ")";
                                break;
                            case "left":
                                n += "translate(-" + i.domainHorizontalLabelWidth + " , " + i.domainHorizontalLabelWidth + ")"
                        }
                        return n
                    })
            }
        }
        var r = i.options;
        0 === arguments.length && (t = !1);
        var s = i.root.select(".graph").selectAll(".graph-domain").data(function() {
                var e = i.getDomainKeys();
                return t === i.NAVIGATE_LEFT ? e.reverse() : e
            }, function(t) {
                return t
            }),
            l = 0,
            u = 0,
            m = s.enter().append("svg").attr("width", function(t) {
                return e(t, !0)
            }).attr("height", function(t) {
                return n(t, !0)
            }).attr("x", function(t) {
                return r.verticalOrientation ? (i.graphDim.width = Math.max(i.graphDim.width, e(t, !0)), 0) : o(t, i.graphDim, "width", e(t, !0))
            }).attr("y", function(t) {
                return r.verticalOrientation ? o(t, i.graphDim, "height", n(t, !0)) : (i.graphDim.height = Math.max(i.graphDim.height, n(t, !0)), 0)
            }).attr("class", function(t) {
                var e = "graph-domain",
                    n = new Date(t);
                switch (r.domain) {
                    case "hour":
                        e += " h_" + n.getHours();
                    case "day":
                        e += " d_" + n.getDate() + " dy_" + n.getDay();
                    case "week":
                        e += " w_" + i.getWeekNumber(n);
                    case "month":
                        e += " m_" + (n.getMonth() + 1);
                    case "year":
                        e += " y_" + n.getFullYear()
                }
                return e
            });
        i.lastInsertedSvg = m, m.append("rect").attr("width", function(t) {
            return e(t, !0) - r.domainGutter - r.cellPadding
        }).attr("height", function(t) {
            return n(t, !0) - r.domainGutter - r.cellPadding
        }).attr("class", "domain-background");
        var c = m.append("svg").attr("x", function() {
                return "left" === r.label.position ? i.domainHorizontalLabelWidth + r.domainMargin[3] : r.domainMargin[3]
            }).attr("y", function() {
                return "top" === r.label.position ? i.domainVerticalLabelHeight + r.domainMargin[0] : r.domainMargin[0]
            }).attr("class", "graph-subdomain-group"),
            h = c.selectAll("g").data(function(t) {
                return i._domains.get(t)
            }).enter().append("g");
        h.append("rect").attr("class", function(t) {
            return "graph-rect" + i.getHighlightClassName(t.t) + (null !== r.onClick ? " hover_cursor" : "")
        }).attr("width", r.cellSize).attr("height", r.cellSize).attr("x", function(t) {
            return i.positionSubDomainX(t.t)
        }).attr("y", function(t) {
            return i.positionSubDomainY(t.t)
        }).on("click", function(t) {
            return null !== r.onClick ? i.onClick(new Date(t.t), t.v) : void 0
        }).call(function(t) {
            r.cellRadius > 0 && t.attr("rx", r.cellRadius).attr("ry", r.cellRadius), null !== i.legendScale && null !== r.legendColors && r.legendColors.hasOwnProperty("base") && t.attr("fill", r.legendColors.base), r.tooltip && (t.on("mouseover", function(t) {
                var e = this.parentNode.parentNode.parentNode;
                i.tooltip.html(i.getSubDomainTitle(t)).attr("style", "display: block;"), i.tooltip.attr("style", "display: block; left: " + (i.positionSubDomainX(t.t) - i.tooltip[0][0].offsetWidth / 2 + r.cellSize / 2 + parseInt(e.getAttribute("x"), 10)) + "px; " + "top: " + (i.positionSubDomainY(t.t) - i.tooltip[0][0].offsetHeight - r.cellSize / 2 + parseInt(e.getAttribute("y"), 10)) + "px;")
            }), t.on("mouseout", function() {
                i.tooltip.attr("style", "display:none").html("")
            }))
        }), r.tooltip || h.append("title").text(function(t) {
            return i.formatDate(new Date(t.t), r.subDomainDateFormat)
        }), "" !== r.domainLabelFormat && m.append("text").attr("class", "graph-label").attr("y", function(t) {
            var e = r.domainMargin[0];
            switch (r.label.position) {
                case "top":
                    e += i.domainVerticalLabelHeight / 2;
                    break;
                case "bottom":
                    e += n(t) + i.domainVerticalLabelHeight / 2
            }
            return e + r.label.offset.y * ("right" === r.label.rotate && "right" === r.label.position || "left" === r.label.rotate && "left" === r.label.position ? -1 : 1)
        }).attr("x", function(t) {
            var n = r.domainMargin[3];
            switch (r.label.position) {
                case "right":
                    n += e(t);
                    break;
                case "bottom":
                case "top":
                    n += e(t) / 2
            }
            return "right" === r.label.align ? n + i.domainHorizontalLabelWidth - r.label.offset.x * ("right" === r.label.rotate ? -1 : 1) : n + r.label.offset.x
        }).attr("text-anchor", function() {
            switch (r.label.align) {
                case "start":
                case "left":
                    return "start";
                case "end":
                case "right":
                    return "end";
                default:
                    return "middle"
            }
        }).attr("dominant-baseline", function() {
            return i.verticalDomainLabel ? "middle" : "top"
        }).text(function(t) {
            return i.formatDate(new Date(t), r.domainLabelFormat)
        }).call(a), null !== r.subDomainTextFormat && h.append("text").attr("class", function(t) {
            return "subdomain-text" + i.getHighlightClassName(t.t)
        }).attr("x", function(t) {
            return i.positionSubDomainX(t.t) + r.cellSize / 2
        }).attr("y", function(t) {
            return i.positionSubDomainY(t.t) + r.cellSize / 2
        }).attr("text-anchor", "middle").attr("dominant-baseline", "central").text(function(t) {
            return i.formatDate(new Date(t.t), r.subDomainTextFormat)
        }), t !== !1 && s.transition().duration(r.animationDuration).attr("x", function(t) {
            return r.verticalOrientation ? 0 : i.domainPosition.getPosition(t)
        }).attr("y", function(t) {
            return r.verticalOrientation ? i.domainPosition.getPosition(t) : 0
        });
        var g = i.graphDim.width,
            d = i.graphDim.height;
        r.verticalOrientation ? i.graphDim.height += l - u : i.graphDim.width += l - u, s.exit().transition().duration(r.animationDuration).attr("x", function(n) {
            if (r.verticalOrientation) return 0;
            switch (t) {
                case i.NAVIGATE_LEFT:
                    return Math.min(i.graphDim.width, g);
                case i.NAVIGATE_RIGHT:
                    return -e(n, !0)
            }
        }).attr("y", function(e) {
            if (!r.verticalOrientation) return 0;
            switch (t) {
                case i.NAVIGATE_LEFT:
                    return Math.min(i.graphDim.height, d);
                case i.NAVIGATE_RIGHT:
                    return -n(e, !0)
            }
        }).remove(), i.resize()
    }
};
CalHeatMap.prototype = {
    init: function(t) {
        "use strict";

        function e(t, e, n) {
            if ((e && t === !1 || t instanceof Element || "string" == typeof t) && "" !== t) return !0;
            throw Error("The " + n + " is not valid")
        }

        function n(t) {
            switch (t) {
                case "year":
                    return "month";
                case "month":
                    return "day";
                case "week":
                    return "day";
                case "day":
                    return "hour";
                default:
                    return "min"
            }
        }

        function i() {
            if (!m._domainType.hasOwnProperty(c.domain) || "min" === c.domain || "x_" === c.domain.substring(0, 2)) throw Error("The domain '" + c.domain + "' is not valid");
            if (!m._domainType.hasOwnProperty(c.subDomain) || "year" === c.subDomain) throw Error("The subDomain '" + c.subDomain + "' is not valid");
            if (m._domainType[c.domain].level <= m._domainType[c.subDomain].level) throw Error("'" + c.subDomain + "' is not a valid subDomain to '" + c.domain + "'");
            return !0
        }

        function o() {
            if (!t.hasOwnProperty("label") || t.hasOwnProperty("label") && !t.label.hasOwnProperty("align")) {
                switch (c.label.position) {
                    case "left":
                        c.label.align = "right";
                        break;
                    case "right":
                        c.label.align = "left";
                        break;
                    default:
                        c.label.align = "center"
                }
                "left" === c.label.rotate ? c.label.align = "right" : "right" === c.label.rotate && (c.label.align = "left")
            }(!t.hasOwnProperty("label") || t.hasOwnProperty("label") && !t.label.hasOwnProperty("offset")) && ("left" === c.label.position || "right" === c.label.position) && (c.label.offset = {
                x: 10,
                y: 15
            })
        }

        function a() {
            switch (c.legendVerticalPosition) {
                case "top":
                    c.legendMargin[2] = m.DEFAULT_LEGEND_MARGIN;
                    break;
                case "bottom":
                    c.legendMargin[0] = m.DEFAULT_LEGEND_MARGIN;
                    break;
                case "middle":
                case "center":
                    c.legendMargin["right" === c.legendHorizontalPosition ? 3 : 1] = m.DEFAULT_LEGEND_MARGIN
            }
        }

        function r(t) {
            switch ("number" == typeof t && (t = [t]), Array.isArray(t) || (console.log("Margin only takes an integer or an array of integers"), t = [0]), t.length) {
                case 1:
                    return [t[0], t[0], t[0], t[0]];
                case 2:
                    return [t[0], t[1], t[0], t[1]];
                case 3:
                    return [t[0], t[1], t[2], t[1]];
                case 4:
                    return t;
                default:
                    return t.slice(0, 4)
            }
        }

        function s(t) {
            return "string" == typeof t ? [t, t + ("" !== t ? "s" : "")] : Array.isArray(t) ? 1 === t.length ? [t[0], t[0] + "s"] : t.length > 2 ? t.slice(0, 2) : t : ["item", "items"]
        }

        function l(t) {
            return t > 0 ? t : null
        }

        function u(t) {
            return t > 0 && c.colLimit > 0 ? (console.log("colLimit and rowLimit are mutually exclusive, rowLimit will be ignored"), null) : t > 0 ? t : null
        }
        var m = this,
            c = m.options = mergeRecursive(m.options, t);
        if (i(), e(c.itemSelector, !1, "itemSelector"), -1 === m.allowedDataType.indexOf(c.dataType)) throw Error("The data type '" + c.dataType + "' is not valid data type");
        if (null === d3.select(c.itemSelector)[0][0]) throw Error("The node '" + c.itemSelector + "' specified in itemSelector does not exists");
        try {
            e(c.nextSelector, !0, "nextSelector"), e(c.previousSelector, !0, "previousSelector")
        } catch (h) {
            return console.log(h.message), !1
        }
        t.hasOwnProperty("subDomain") || (this.options.subDomain = n(t.domain)), ("string" != typeof c.itemNamespace || "" === c.itemNamespace) && (console.log("itemNamespace can not be empty, falling back to cal-heatmap"), c.itemNamespace = "cal-heatmap");
        var g = ["data", "onComplete", "onClick", "afterLoad", "afterLoadData", "afterLoadPreviousDomain", "afterLoadNextDomain"];
        for (var d in g) t.hasOwnProperty(g[d]) && (c[g[d]] = t[g[d]]);
        return c.subDomainDateFormat = "string" == typeof c.subDomainDateFormat || "function" == typeof c.subDomainDateFormat ? c.subDomainDateFormat : this._domainType[c.subDomain].format.date, c.domainLabelFormat = "string" == typeof c.domainLabelFormat || "function" == typeof c.domainLabelFormat ? c.domainLabelFormat : this._domainType[c.domain].format.legend, c.subDomainTextFormat = "string" == typeof c.subDomainTextFormat && "" !== c.subDomainTextFormat || "function" == typeof c.subDomainTextFormat ? c.subDomainTextFormat : null, c.domainMargin = r(c.domainMargin), c.legendMargin = r(c.legendMargin), c.highlight = m.expandDateSetting(c.highlight), c.itemName = s(c.itemName), c.colLimit = l(c.colLimit), c.rowLimit = u(c.rowLimit), t.hasOwnProperty("legendMargin") || a(), o(), this._init()
    },
    expandDateSetting: function(t) {
        "use strict";
        return Array.isArray(t) || (t = [t]), t.map(function(t) {
            return "now" === t ? new Date : t instanceof Date ? t : !1
        }).filter(function(t) {
            return t !== !1
        })
    },
    fill: function(t) {
        "use strict";

        function e(t) {
            return null === n.legendScale ? !1 : (t.attr("fill", function(t) {
                return 0 === t.v && null !== i.legendColors && i.legendColors.hasOwnProperty("empty") ? i.legendColors.empty : 0 > t.v && i.legend[0] > 0 && null !== i.legendColors && i.legendColors.hasOwnProperty("overflow") ? i.legendColors.overflow : n.legendScale(Math.min(t.v, i.legend[i.legend.length - 1]))
            }), void 0)
        }
        var n = this,
            i = n.options;
        0 === arguments.length && (t = n.root.selectAll(".graph-domain"));
        var o = t.selectAll("svg").selectAll("g").data(function(t) {
            return n._domains.get(t)
        });
        o.transition().duration(i.animationDuration).select("rect").attr("class", function(t) {
            var e = n.getHighlightClassName(t.t);
            return null === n.legendScale && (e += " graph-rect"), null !== t.v ? e += " " + n.Legend.getClass(t.v, null === n.legendScale) : i.considerMissingDataAsZero && (e += " " + n.Legend.getClass(0, null === n.legendScale)), null !== i.onClick && (e += " hover_cursor"), e
        }).call(e), o.transition().duration(i.animationDuration).select("title").text(function(t) {
            return n.getSubDomainTitle(t)
        })
    },
    triggerEvent: function(t, e, n) {
        "use strict";
        return 3 === arguments.length && n || null === this.options[t] ? !0 : "function" == typeof this.options[t] ? ("function" == typeof e && (e = e()), this.options[t].apply(this, e)) : (console.log("Provided callback for " + t + " is not a function."), !1)
    },
    onClick: function(t, e) {
        "use strict";
        return this.triggerEvent("onClick", [t, e])
    },
    afterLoad: function() {
        "use strict";
        return this.triggerEvent("afterLoad")
    },
    onComplete: function() {
        "use strict";
        var t = this.triggerEvent("onComplete", [], this._completed);
        return this._completed = !0, t
    },
    afterLoadPreviousDomain: function(t) {
        "use strict";
        var e = this;
        return this.triggerEvent("afterLoadPreviousDomain", function() {
            var n = e.getSubDomain(t);
            return [n.shift(), n.pop()]
        })
    },
    afterLoadNextDomain: function(t) {
        "use strict";
        var e = this;
        return this.triggerEvent("afterLoadNextDomain", function() {
            var n = e.getSubDomain(t);
            return [n.shift(), n.pop()]
        })
    },
    onMinDomainReached: function(t) {
        "use strict";
        return this._minDomainReached = t, this.triggerEvent("onMinDomainReached", [t])
    },
    onMaxDomainReached: function(t) {
        "use strict";
        return this._maxDomainReached = t, this.triggerEvent("onMaxDomainReached", [t])
    },
    checkIfMinDomainIsReached: function(t, e) {
        "use strict";
        this.minDomainIsReached(t) && this.onMinDomainReached(!0), 2 === arguments.length && this._maxDomainReached && !this.maxDomainIsReached(e) && this.onMaxDomainReached(!1)
    },
    checkIfMaxDomainIsReached: function(t, e) {
        "use strict";
        this.maxDomainIsReached(t) && this.onMaxDomainReached(!0), 2 === arguments.length && this._minDomainReached && !this.minDomainIsReached(e) && this.onMinDomainReached(!1)
    },
    formatNumber: d3.format(",g"),
    formatDate: function(t, e) {
        "use strict";
        if (2 > arguments.length && (e = "title"), "function" == typeof e) return e(t);
        var n = d3.time.format(e);
        return n(t)
    },
    getSubDomainTitle: function(t) {
        "use strict";
        if (null !== t.v || this.options.considerMissingDataAsZero) {
            var e = t.v;
            return null === e && this.options.considerMissingDataAsZero && (e = 0), this.options.subDomainTitleFormat.filled.format({
                count: this.formatNumber(e),
                name: this.options.itemName[1 !== e ? 1 : 0],
                connector: this._domainType[this.options.subDomain].format.connector,
                date: this.formatDate(new Date(t.t), this.options.subDomainDateFormat)
            })
        }
        return this.options.subDomainTitleFormat.empty.format({
            date: this.formatDate(new Date(t.t), this.options.subDomainDateFormat)
        })
    },
    loadNextDomain: function(t) {
        "use strict";
        if (this._maxDomainReached || 0 === t) return !1;
        var e = this.loadNewDomains(this.NAVIGATE_RIGHT, this.getDomain(this.getNextDomain(), t));
        return this.afterLoadNextDomain(e.end), this.checkIfMaxDomainIsReached(this.getNextDomain().getTime(), e.start), !0
    },
    loadPreviousDomain: function(t) {
        "use strict";
        if (this._minDomainReached || 0 === t) return !1;
        var e = this.loadNewDomains(this.NAVIGATE_LEFT, this.getDomain(this.getDomainKeys()[0], -t).reverse());
        return this.afterLoadPreviousDomain(e.start), this.checkIfMinDomainIsReached(e.start, e.end), !0
    },
    loadNewDomains: function(t, e) {
        "use strict";

        function n(t) {
            return {
                t: i._domainType[i.options.subDomain].extractUnit(t),
                v: null
            }
        }
        for (var i = this, o = t === this.NAVIGATE_LEFT, a = -1, r = e.length, s = this.getDomainKeys(); r > ++a;) {
            if (o && this.minDomainIsReached(e[a])) {
                e = e.slice(0, a + 1);
                break
            }
            if (!o && this.maxDomainIsReached(e[a])) {
                e = e.slice(0, a);
                break
            }
        }
        for (e = e.slice(-this.options.range), a = 0, r = e.length; r > a; a++) this._domains.set(e[a].getTime(), this.getSubDomain(e[a]).map(n)), this._domains.remove(o ? s.pop() : s.shift());
        return s = this.getDomainKeys(), o && (e = e.reverse()), this.paint(t), this.getDatas(this.options.data, e[0], this.getSubDomain(e[e.length - 1]).pop(), function() {
            i.fill(i.lastInsertedSvg)
        }), {
            start: e[o ? 0 : 1],
            end: s[s.length - 1]
        }
    },
    maxDomainIsReached: function(t) {
        "use strict";
        return null !== this.options.maxDate && t > this.options.maxDate.getTime()
    },
    minDomainIsReached: function(t) {
        "use strict";
        return null !== this.options.minDate && this.options.minDate.getTime() >= t
    },
    getDomainKeys: function() {
        "use strict";
        return this._domains.keys().map(function(t) {
            return parseInt(t, 10)
        }).sort(function(t, e) {
            return t - e
        })
    },
    positionSubDomainX: function(t) {
        "use strict";
        var e = this._domainType[this.options.subDomain].position.x(new Date(t));
        return e * this.options.cellSize + e * this.options.cellPadding
    },
    positionSubDomainY: function(t) {
        "use strict";
        var e = this._domainType[this.options.subDomain].position.y(new Date(t));
        return e * this.options.cellSize + e * this.options.cellPadding
    },
    getSubDomainColumnNumber: function(t) {
        "use strict";
        if (this.options.rowLimit > 0) {
            var e = this._domainType[this.options.subDomain].maxItemNumber;
            return "function" == typeof e && (e = e(t)), Math.ceil(e / this.options.rowLimit)
        }
        var n = this._domainType[this.options.subDomain].defaultColumnNumber;
        return "function" == typeof n && (n = n(t)), this.options.colLimit || n
    },
    getSubDomainRowNumber: function(t) {
        "use strict";
        if (this.options.colLimit > 0) {
            var e = this._domainType[this.options.subDomain].maxItemNumber;
            return "function" == typeof e && (e = e(t)), Math.ceil(e / this.options.colLimit)
        }
        var n = this._domainType[this.options.subDomain].defaultRowNumber;
        return "function" == typeof n && (n = n(t)), this.options.rowLimit || n
    },
    getHighlightClassName: function(t) {
        "use strict";
        if (t = new Date(t), this.options.highlight.length > 0)
            for (var e in this.options.highlight)
                if (this.options.highlight[e] instanceof Date && this.dateIsEqual(this.options.highlight[e], t)) return " highlight" + (this.isNow(this.options.highlight[e]) ? " now" : "");
        return ""
    },
    isNow: function(t) {
        "use strict";
        return this.dateIsEqual(t, new Date)
    },
    dateIsEqual: function(t, e) {
        "use strict";
        switch (this.options.subDomain) {
            case "x_min":
            case "min":
                return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate() && t.getHours() === e.getHours() && t.getMinutes() === e.getMinutes();
            case "x_hour":
            case "hour":
                return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate() && t.getHours() === e.getHours();
            case "x_day":
            case "day":
                return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
            case "x_week":
            case "week":
            case "x_month":
            case "month":
                return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth();
            default:
                return !1
        }
    },
    getDayOfYear: d3.time.format("%j"),
    getWeekNumber: function(t) {
        "use strict";
        var e = this.options.weekStartOnMonday === !0 ? d3.time.format("%W") : d3.time.format("%U");
        return e(t)
    },
    getMonthWeekNumber: function(t) {
        "use strict";
        "number" == typeof t && (t = new Date(t));
        var e = this.getWeekNumber(new Date(t.getFullYear(), t.getMonth()));
        return this.getWeekNumber(t) - e - 1
    },
    getWeekNumberInYear: function(t) {
        "use strict";
        "number" == typeof t && (t = new Date(t))
    },
    getDayCountInMonth: function(t) {
        "use strict";
        return this.getEndOfMonth(t).getDate()
    },
    getDayCountInYear: function(t) {
        "use strict";
        return "number" == typeof t && (t = new Date(t)), 1 === new Date(t.getFullYear(), 1, 29).getMonth() ? 366 : 365
    },
    getWeekDay: function(t) {
        "use strict";
        return this.options.weekStartOnMonday === !1 ? t.getDay() : 0 === t.getDay() ? 6 : t.getDay() - 1
    },
    getEndOfMonth: function(t) {
        "use strict";
        return "number" == typeof t && (t = new Date(t)), new Date(t.getFullYear(), t.getMonth() + 1, 0)
    },
    jumpDate: function(t, e, n) {
        "use strict";
        var i = new Date(t);
        switch (n) {
            case "hour":
                i.setHours(i.getHours() + e);
                break;
            case "day":
                i.setHours(i.getHours() + 24 * e);
                break;
            case "week":
                i.setHours(i.getHours() + 7 * 24 * e);
                break;
            case "month":
                i.setMonth(i.getMonth() + e);
                break;
            case "year":
                i.setFullYear(i.getFullYear() + e)
        }
        return new Date(i)
    },
    getMinuteDomain: function(t, e) {
        "use strict";
        var n = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()),
            i = null;
        return i = e instanceof Date ? new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours()) : new Date(+n + 60 * 1e3 * e), d3.time.minutes(Math.min(n, i), Math.max(n, i))
    },
    getHourDomain: function(t, e) {
        "use strict";
        var n = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()),
            i = null;
        e instanceof Date ? i = new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours()) : (i = new Date(n), i.setHours(i.getHours() + e));
        var o = d3.time.hours(Math.min(n, i), Math.max(n, i)),
            a = 0,
            r = o.length;
        for (a = 0; r > a; a++)
            if (a > 0 && o[a].getHours() === o[a - 1].getHours()) {
                this.DSTDomain.push(o[a].getTime()), o.splice(a, 1);
                break
            }
        return "number" == typeof e && o.length > Math.abs(e) && o.splice(o.length - 1, 1), o
    },
    getDayDomain: function(t, e) {
        "use strict";
        var n = new Date(t.getFullYear(), t.getMonth(), t.getDate()),
            i = null;
        return e instanceof Date ? i = new Date(e.getFullYear(), e.getMonth(), e.getDate()) : (i = new Date(n), i = new Date(i.setDate(i.getDate() + parseInt(e, 10)))), d3.time.days(Math.min(n, i), Math.max(n, i))
    },
    getWeekDomain: function(t, e) {
        "use strict";
        var n;
        this.options.weekStartOnMonday === !1 ? n = new Date(t.getFullYear(), t.getMonth(), t.getDate() - t.getDay()) : 1 === t.getDay() ? n = new Date(t.getFullYear(), t.getMonth(), t.getDate()) : 0 === t.getDay() ? (n = new Date(t.getFullYear(), t.getMonth(), t.getDate()), n.setDate(n.getDate() - 6)) : n = new Date(t.getFullYear(), t.getMonth(), t.getDate() - t.getDay() + 1);
        var i = new Date(n),
            o = e;
        return "object" != typeof e && (o = new Date(i.setDate(i.getDate() + 7 * e))), this.options.weekStartOnMonday === !0 ? d3.time.mondays(Math.min(n, o), Math.max(n, o)) : d3.time.sundays(Math.min(n, o), Math.max(n, o))
    },
    getMonthDomain: function(t, e) {
        "use strict";
        var n = new Date(t.getFullYear(), t.getMonth()),
            i = null;
        return e instanceof Date ? i = new Date(e.getFullYear(), e.getMonth()) : (i = new Date(n), i = i.setMonth(i.getMonth() + e)), d3.time.months(Math.min(n, i), Math.max(n, i))
    },
    getYearDomain: function(t, e) {
        "use strict";
        var n = new Date(t.getFullYear(), 0),
            i = null;
        return i = e instanceof Date ? new Date(e.getFullYear(), 0) : new Date(t.getFullYear() + e, 0), d3.time.years(Math.min(n, i), Math.max(n, i))
    },
    getDomain: function(t, e) {
        "use strict";
        switch ("number" == typeof t && (t = new Date(t)), 2 > arguments.length && (e = this.options.range), this.options.domain) {
            case "hour":
                var n = this.getHourDomain(t, e);
                return "number" == typeof e && e > n.length && (e > 0 ? n.push(this.getHourDomain(n[n.length - 1], 2)[1]) : n.shift(this.getHourDomain(n[0], -2)[0])), n;
            case "day":
                return this.getDayDomain(t, e);
            case "week":
                return this.getWeekDomain(t, e);
            case "month":
                return this.getMonthDomain(t, e);
            case "year":
                return this.getYearDomain(t, e)
        }
    },
    getSubDomain: function(t) {
        "use strict";
        "number" == typeof t && (t = new Date(t));
        var e = this,
            n = function(t, n) {
                switch (n) {
                    case "year":
                        return e.getDayCountInYear(t);
                    case "month":
                        return e.getDayCountInMonth(t);
                    case "week":
                        return 7
                }
            },
            i = function(t, e) {
                switch (e) {
                    case "hour":
                        return 60;
                    case "day":
                        return 1440;
                    case "week":
                        return 10080
                }
            },
            o = function(t, n) {
                switch (n) {
                    case "day":
                        return 24;
                    case "week":
                        return 168;
                    case "month":
                        return 24 * e.getDayCountInMonth(t)
                }
            },
            a = function(t, n) {
                if ("month" === n) {
                    var i = new Date(t.getFullYear(), t.getMonth() + 1, 0),
                        o = e.getWeekNumber(i),
                        a = e.getWeekNumber(new Date(t.getFullYear(), t.getMonth()));
                    return a > o && (a = 0, o++), o - a + 1
                }
                return "year" === n ? e.getWeekNumber(new Date(t.getFullYear(), 11, 31)) : void 0
            };
        switch (this.options.subDomain) {
            case "x_min":
            case "min":
                return this.getMinuteDomain(t, i(t, this.options.domain));
            case "x_hour":
            case "hour":
                return this.getHourDomain(t, o(t, this.options.domain));
            case "x_day":
            case "day":
                return this.getDayDomain(t, n(t, this.options.domain));
            case "x_week":
            case "week":
                return this.getWeekDomain(t, a(t, this.options.domain));
            case "x_month":
            case "month":
                return this.getMonthDomain(t, 12)
        }
    },
    getNextDomain: function(t) {
        "use strict";
        return 0 === arguments.length && (t = 1), this.getDomain(this.jumpDate(this.getDomainKeys().pop(), t, this.options.domain), 1)[0]
    },
    getPreviousDomain: function(t) {
        "use strict";
        return 0 === arguments.length && (t = 1), this.getDomain(this.jumpDate(this.getDomainKeys().shift(), -t, this.options.domain), 1)[0]
    },
    getDatas: function(t, e, n, i, o, a) {
        "use strict";
        var r = this;
        5 > arguments.length && (o = !0), 6 > arguments.length && (a = this.APPEND_ON_UPDATE);
        var s = function(t) {
            o !== !1 ? "function" == typeof o ? t = o(t) : "function" == typeof r.options.afterLoadData ? t = r.options.afterLoadData(t) : console.log("Provided callback for afterLoadData is not a function.") : ("csv" === r.options.dataType || "tsv" === r.options.dataType) && (t = this.interpretCSV(t)), r.parseDatas(t, a, e, n), "function" == typeof i && i()
        };
        switch (typeof t) {
            case "string":
                if ("" === t) return s({}), !0;
                switch (this.options.dataType) {
                    case "json":
                        d3.json(this.parseURI(t, e, n), s);
                        break;
                    case "csv":
                        d3.csv(this.parseURI(t, e, n), s);
                        break;
                    case "tsv":
                        d3.tsv(this.parseURI(t, e, n), s);
                        break;
                    case "txt":
                        d3.text(this.parseURI(t, e, n), "text/plain", s)
                }
                return !1;
            case "object":
                if (t === Object(t)) return s(t), !1;
            default:
                return s({}), !0
        }
    },
    parseDatas: function(t, e, n, i) {
        "use strict";
        e === this.RESET_ALL_ON_UPDATE && this._domains.forEach(function(t, e) {
            e.forEach(function(t, e, n) {
                n[e].v = null
            })
        });
        var o = {},
            a = function(t) {
                return t.t
            };
        for (var r in t) {
            var s = new Date(1e3 * r),
                l = this.getDomain(s)[0].getTime();
            if (this.DSTDomain.indexOf(l) >= 0 && this._domains.has(l - 36e5) && (l -= 36e5), !isNaN(r) && t.hasOwnProperty(r) && this._domains.has(l) && l >= +n && +i > l) {
                var u = this._domains.get(l);
                o.hasOwnProperty(l) || (o[l] = u.map(a));
                var m = o[l].indexOf(this._domainType[this.options.subDomain].extractUnit(s));
                e === this.RESET_SINGLE_ON_UPDATE ? u[m].v = t[r] : isNaN(u[m].v) ? u[m].v = t[r] : u[m].v += t[r]
            }
        }
    },
    parseURI: function(t, e, n) {
        "use strict";
        return t = t.replace(/\{\{t:start\}\}/g, e.getTime() / 1e3), t = t.replace(/\{\{t:end\}\}/g, n.getTime() / 1e3), t = t.replace(/\{\{d:start\}\}/g, e.toISOString()), t = t.replace(/\{\{d:end\}\}/g, n.toISOString())
    },
    interpretCSV: function(t) {
        "use strict";
        var e, n, i = {},
            o = Object.keys(t[0]);
        for (e = 0, n = t.length; n > e; e++) i[t[e][o[0]]] = +t[e][o[1]];
        return i
    },
    resize: function() {
        "use strict";
        var t = this,
            e = t.options,
            n = e.displayLegend ? t.Legend.getDim("width") + e.legendMargin[1] + e.legendMargin[3] : 0,
            i = e.displayLegend ? t.Legend.getDim("height") + e.legendMargin[0] + e.legendMargin[2] : 0,
            o = t.graphDim.width - e.domainGutter - e.cellPadding,
            a = t.graphDim.height - e.domainGutter - e.cellPadding;
        this.root.transition().duration(e.animationDuration).attr("width", function() {
            return "middle" === e.legendVerticalPosition || "center" === e.legendVerticalPosition ? o + n : Math.max(o, n)
        }).attr("height", function() {
            return "middle" === e.legendVerticalPosition || "center" === e.legendVerticalPosition ? Math.max(a, i) : a + i
        }), this.root.select(".graph").transition().duration(e.animationDuration).attr("y", function() {
            return "top" === e.legendVerticalPosition ? i : 0
        }).attr("x", function() {
            return "middle" !== e.legendVerticalPosition && "center" !== e.legendVerticalPosition || "left" !== e.legendHorizontalPosition ? 0 : n
        })
    },
    next: function(t) {
        "use strict";
        return 0 === arguments.length && (t = 1), this.loadNextDomain(t)
    },
    previous: function(t) {
        "use strict";
        return 0 === arguments.length && (t = 1), this.loadPreviousDomain(t)
    },
    jumpTo: function(t, e) {
        "use strict";
        2 > arguments.length && (e = !1);
        var n = this.getDomainKeys(),
            i = n[0],
            o = n[n.length - 1];
        return i > t ? this.loadPreviousDomain(this.getDomain(i, t).length) : e ? this.loadNextDomain(this.getDomain(i, t).length) : t > o ? this.loadNextDomain(this.getDomain(o, t).length) : !1
    },
    rewind: function() {
        "use strict";
        this.jumpTo(this.options.start, !0)
    },
    update: function(t, e, n) {
        "use strict";
        2 > arguments.length && (e = !0), 3 > arguments.length && (n = this.RESET_ALL_ON_UPDATE);
        var i = this.getDomainKeys(),
            o = this;
        this.getDatas(t, new Date(i[0]), this.getSubDomain(i[i.length - 1]).pop(), function() {
            o.fill()
        }, e, n)
    },
    setLegend: function() {
        "use strict";
        var t = this.options.legend.slice(0);
        arguments.length >= 1 && Array.isArray(arguments[0]) && (this.options.legend = arguments[0]), arguments.length >= 2 && (this.options.legendColors = Array.isArray(arguments[1]) && arguments[1].length >= 2 ? [arguments[1][0], arguments[1][1]] : arguments[1]), (arguments.length > 0 && !arrayEquals(t, this.options.legend) || arguments.length >= 2) && (this.Legend.buildColors(), this.fill()), this.Legend.redraw(this.graphDim.width - this.options.domainGutter - this.options.cellPadding)
    },
    removeLegend: function() {
        "use strict";
        return this.options.displayLegend ? (this.options.displayLegend = !1, this.Legend.remove(), !0) : !1
    },
    showLegend: function() {
        "use strict";
        return this.options.displayLegend ? !1 : (this.options.displayLegend = !0, this.Legend.redraw(this.graphDim.width - this.options.domainGutter - this.options.cellPadding), !0)
    },
    highlight: function(t) {
        "use strict";
        return (this.options.highlight = this.expandDateSetting(t)).length > 0 ? (this.fill(), !0) : !1
    },
    destroy: function(t) {
        "use strict";
        return this.root.transition().duration(this.options.animationDuration).attr("width", 0).attr("height", 0).remove().each("end", function() {
            "function" == typeof t ? t() : arguments.length > 0 && console.log("Provided callback for destroy() is not a function.")
        }), null
    },
    getSVG: function() {
        "use strict";
        for (var t = {
                ".cal-heatmap-container": {},
                ".graph": {},
                ".graph-rect": {},
                "rect.highlight": {},
                "rect.now": {},
                "text.highlight": {},
                "text.now": {},
                ".domain-background": {},
                ".graph-label": {},
                ".subdomain-text": {},
                ".q0": {},
                ".qi": {}
            }, e = 1, n = this.options.legend.length + 1; n >= e; e++) t[".q" + e] = {};
        var i = this.root,
            o = ["stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-miterlimit", "fill", "fill-opacity", "fill-rule", "marker", "marker-start", "marker-mid", "marker-end", "alignement-baseline", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "kerning", "text-anchor", "shape-rendering", "text-transform", "font-family", "font", "font-size", "font-weight"],
            a = function(e, n, i) {
                -1 !== o.indexOf(n) && (t[e][n] = i)
            },
            r = function(t) {
                return i.select(t)[0][0]
            };
        for (var s in t)
            if (t.hasOwnProperty(s)) {
                var l = r(s);
                if (null !== l)
                    if ("getComputedStyle" in window) {
                        var u = getComputedStyle(l, null);
                        if (0 !== u.length)
                            for (var m = 0; u.length > m; m++) a(s, u.item(m), u.getPropertyValue(u.item(m)));
                        else
                            for (var c in u) u.hasOwnProperty(c) && a(s, c, u[c])
                    } else if ("currentStyle" in l) {
                    var h = l.currentStyle;
                    for (var g in h) a(s, g, h[g])
                }
            }
        var d = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"><![CDATA[ ';
        for (var p in t) {
            d += p + " {\n";
            for (var f in t[p]) d += "	" + f + ":" + t[p][f] + ";\n";
            d += "}\n"
        }
        return d += "]]></style>", d += (new XMLSerializer).serializeToString(this.root[0][0]), d += "</svg>"
    }
};
var DomainPosition = function() {
    "use strict";
    this.positions = d3.map()
};
DomainPosition.prototype.getPosition = function(t) {
    "use strict";
    return this.positions.get(t)
}, DomainPosition.prototype.getPositionFromIndex = function(t) {
    "use strict";
    var e = this.getKeys();
    return this.positions.get(e[t])
}, DomainPosition.prototype.getLast = function() {
    "use strict";
    var t = this.getKeys();
    return this.positions.get(t[t.length - 1])
}, DomainPosition.prototype.setPosition = function(t, e) {
    "use strict";
    this.positions.set(t, e)
}, DomainPosition.prototype.shiftRightBy = function(t) {
    "use strict";
    this.positions.forEach(function(e, n) {
        this.set(e, n - t)
    });
    var e = this.getKeys();
    this.positions.remove(e[0])
}, DomainPosition.prototype.shiftLeftBy = function(t) {
    "use strict";
    this.positions.forEach(function(e, n) {
        this.set(e, n + t)
    });
    var e = this.getKeys();
    this.positions.remove(e[e.length - 1])
}, DomainPosition.prototype.getKeys = function() {
    "use strict";
    return this.positions.keys().sort(function(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    })
};
var Legend = function(t) {
    "use strict";
    this.calendar = t, this.computeDim(), null !== t.options.legendColors && this.buildColors()
};
Legend.prototype.computeDim = function() {
    "use strict";
    var t = this.calendar.options;
    this.dim = {
        width: t.legendCellSize * (t.legend.length + 1) + t.legendCellPadding * t.legend.length,
        height: t.legendCellSize
    }
}, Legend.prototype.remove = function() {
    "use strict";
    this.calendar.root.select(".graph-legend").remove(), this.calendar.resize()
}, Legend.prototype.redraw = function(t) {
    "use strict";

    function e(t) {
        t.attr("width", l.legendCellSize).attr("height", l.legendCellSize).attr("x", function(t, e) {
            return e * (l.legendCellSize + l.legendCellPadding)
        })
    }

    function n() {
        switch (l.legendHorizontalPosition) {
            case "right":
                return "center" === l.legendVerticalPosition || "middle" === l.legendVerticalPosition ? t + l.legendMargin[3] : t - a.getDim("width") - l.legendMargin[1];
            case "middle":
            case "center":
                return Math.round(t / 2 - a.getDim("width") / 2);
            default:
                return l.legendMargin[3]
        }
    }

    function i() {
        return "bottom" === l.legendVerticalPosition ? r.graphDim.height + l.legendMargin[0] - l.domainGutter - l.cellPadding : l.legendMargin[0]
    }
    if (!this.calendar.options.displayLegend) return !1;
    var o, a = this,
        r = this.calendar,
        s = r.root,
        l = r.options;
    this.computeDim();
    var u = l.legend.slice(0);
    u.push(u[u.length - 1] + 1);
    var m = r.root.select(".graph-legend");
    null !== m[0][0] ? (s = m, o = s.select("g").selectAll("rect").data(u)) : (s = "top" === l.legendVerticalPosition ? s.insert("svg", ".graph") : s.append("svg"), s.attr("x", n()).attr("y", i()), o = s.attr("class", "graph-legend").attr("height", a.getDim("height")).attr("width", a.getDim("width")).append("g").selectAll().data(u)), o.enter().append("rect").call(e).attr("class", function(t) {
        return r.Legend.getClass(t, null === r.legendScale)
    }).attr("fill-opacity", 0).call(function(t) {
        null !== r.legendScale && null !== l.legendColors && l.legendColors.hasOwnProperty("base") && t.attr("fill", l.legendColors.base)
    }).append("title"), o.exit().transition().duration(l.animationDuration).attr("fill-opacity", 0).remove(), o.transition().delay(function(t, e) {
        return l.animationDuration * e / 10
    }).call(e).attr("fill-opacity", 1).call(function(t) {
        t.attr("fill", function(t, e) {
            return null === r.legendScale ? "" : 0 === e ? r.legendScale(t - 1) : r.legendScale(l.legend[e - 1])
        }), t.attr("class", function(t) {
            return r.Legend.getClass(t, null === r.legendScale)
        })
    }), o.select("title").text(function(t, e) {
        return 0 === e ? l.legendTitleFormat.lower.format({
            min: l.legend[e],
            name: l.itemName[1]
        }) : e === u.length - 1 ? l.legendTitleFormat.upper.format({
            max: l.legend[e - 1],
            name: l.itemName[1]
        }) : l.legendTitleFormat.inner.format({
            down: l.legend[e - 1],
            up: l.legend[e],
            name: l.itemName[1]
        })
    }), s.transition().duration(l.animationDuration).attr("x", n()).attr("y", i()).attr("width", a.getDim("width")).attr("height", a.getDim("height")), s.select("g").transition().duration(l.animationDuration).attr("transform", function() {
        return "vertical" === l.legendOrientation ? "rotate(90 " + l.legendCellSize / 2 + " " + l.legendCellSize / 2 + ")" : ""
    }), r.resize()
}, Legend.prototype.getDim = function(t) {
    "use strict";
    var e = "horizontal" === this.calendar.options.legendOrientation;
    switch (t) {
        case "width":
            return this.dim[e ? "width" : "height"];
        case "height":
            return this.dim[e ? "height" : "width"]
    }
}, Legend.prototype.buildColors = function() {
    "use strict";
    var t = this.calendar.options;
    if (null === t.legendColors) return this.calendar.legendScale = null, !1;
    var e = [];
    if (Array.isArray(t.legendColors)) e = t.legendColors;
    else {
        if (!t.legendColors.hasOwnProperty("min") || !t.legendColors.hasOwnProperty("max")) return t.legendColors = null, !1;
        e = [t.legendColors.min, t.legendColors.max]
    }
    var n = t.legend.slice(0);
    n[0] > 0 ? n.unshift(0) : 0 > n[0] && n.unshift(n[0] - (n[n.length - 1] - n[0]) / n.length);
    var i = d3.scale.linear().range(e).interpolate(d3.interpolateHcl).domain([d3.min(n), d3.max(n)]),
        o = n.map(function(t) {
            return i(t)
        });
    return this.calendar.legendScale = d3.scale.threshold().domain(t.legend).range(o), !0
}, Legend.prototype.getClass = function(t, e) {
    "use strict";
    if (null === t || isNaN(t)) return "";
    for (var n = [this.calendar.options.legend.length + 1], i = 0, o = this.calendar.options.legend.length - 1; o >= i; i++) {
        if (this.calendar.options.legend[0] > 0 && 0 > t) {
            n = ["1", "i"];
            break
        }
        if (this.calendar.options.legend[i] >= t) {
            n = [i + 1];
            break
        }
    }
    return 0 === t && n.push(0), n.unshift(""), (n.join(" r") + (e ? n.join(" q") : "")).trim()
}, String.prototype.format = function() {
    "use strict";
    var t = this;
    for (var e in arguments[0])
        if (arguments[0].hasOwnProperty(e)) {
            var n = RegExp("\\{" + e + "\\}", "gi");
            t = t.replace(n, arguments[0][e])
        }
    return t
}, "function" == typeof define && define.amd && define(["d3"], function() {
    "use strict";
    return CalHeatMap
});
//@ sourceMappingURL=cal-heatmap.source-map.js
