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

function stringForEvents(events) {

}


