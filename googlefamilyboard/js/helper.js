/**
 * Created by esbenrasmussen on 29/10/2016.
 */

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'YOUR_API_KEY',
        // clientId and scope are optional if auth is not required.
        'clientId': '468104940896-nm65fr8s2qf39nhj4fqcdpoteorj1abp.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/calendar.readonly'
    }).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.request({
            'path': 'https://calendar.googleapis.com/v3/calendar/',
        })
    }).then(function(resp) {
        console.log(resp.result);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function getEventsForDay(currentDay, events) {
    var currentDayEvents = events.filter(function (event) {
        var when = event.start.dateTime;
        if (!when) {
            when = event.start.date;
        }
        var td = new Date(when);
        return td.getDate() == currentDay.getDate();
    });
    return currentDayEvents;
}

function classesForDate(d) {
    var n = new Date();
    var now = moment(n);
    var date = moment(d);
    return ((date.isBefore(now, 'minutes')) ? "before" : "after") + ((date.isSame(now, 'day')) ? " today" : "");
}

function stringForEvents(events) {
        var output = "";
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) {
                when = event.start.date;
            }
            var finish = event.end.dateTime;
            if (!finish) {
                finish = event.end.date;
            }

            output = output + "<div class='" + classesForDate(finish) + "'>" + moment(when).format('LT') + " " + event.summary + "</div>";
        }
        return output;
}

