$(document).ready(function() {
    $("#go").click(function() {
        initialize();

        var handle = deformUser($("#handle").val());
        var url = 'timeline.php?userId=' + handle;
        $.getJSON(url).done(success).fail(failure);
    });


    function failure(status) {
        $("#errorMessage").text(status);
        $("#errorAlert").removeClass("hidden");
    }

    function initialize() {
        $("#infoAlert").removeClass("hidden");
        $("#previous").addClass("hidden");
        $("#next").addClass("hidden");
        $("#errorMessage").empty();
        $("#errorAlert").addClass("hidden");
        $("#cal-heatmap").empty();
    }

    function success(json) {
        $("#infoAlert").addClass("hidden");
        if (json.errorMessage === null && json.tweets !== null) {
            createHeatMap(json);
        } else {
            var status = json.errorMessage === null ? (json.tweets === null ? "This user is private or hasn't tweeted yet!" : "Oops, something went wrong!") : json.errorMessage;
            failure(status);
        }
    }


    function createHeatMap(json) {
        var range = 4;
        var domain = json.domain;
        var dateFormat;
        var start;
        var subDomainTextFormat;
        if (domain === "month") {
            dateFormat = "MMM 'YY";
            start = monthsBeforeToday(range - 1);
            subDomainTextFormat = "%d";
        } else {
            dateFormat = "D MMM";
            start = daysBeforeToday(range - 1);
            subDomainTextFormat = "%H";
        }

        var cal = new CalHeatMap();
        cal.init({
            domain: domain,
            data: json.tweets,
            start: start,
            cellSize: 18,
            cellPadding: 2,
            domainGutter: 5,
            range: range, //dynamic
            domainDynamicDimension: true,
            previousSelector: "#previous",
            nextSelector: "#next",
            domainLabelFormat: function(date) {
                moment.locale("en");
                return moment(date).format(dateFormat).toUpperCase();
            },
            label: {
                position: "top"
            },
            highlight: "now",
            minDate: new Date(json.minDate),
            maxDate: new Date(),
            tooltip: true,
            subDomainTextFormat: subDomainTextFormat,
            afterLoadData: function(data) {
                var i, total, results = {};
                for (i = 0, total = data.length; i < total; i++) {
                    results[data[i].date / 1e3] = 1;
                }
                return results;
            },
            onComplete: function() {
                $("#previous").removeClass("hidden");
                $("#next").removeClass("hidden");
            },
            colLimit: 4,
            legend: json.legend,
            legendHorizontalPosition: "center",
            legendMargin: [10, 0, 0,0]

        });
    }

    function daysBeforeToday(days) {
        var d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    }

    function monthsBeforeToday(months) {
        var d = new Date();
        d.setMonth(d.getMonth() - months);
        return d;
    }

    function deformUser(userName) {
        return userName.charAt(0) == '@' ? userName.substr(1, userName.length) : userName;
    }

});
