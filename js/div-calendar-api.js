
const renderEvent = (event) => {
    let start = moment(event.start.dateTime);
    let end = moment(event.end.dateTime);
    return `<div class="event${markOverdue(start, end)}"><p><span class="time">${start.format('LT')}</span> <span class="summary">${event.summary}</span></p></div>`
};

const getEventsFromDay =(events, day) => {
    return events.filter(event => {
        let m = moment(event.start.dateTime);
        return m.isSame(day, 'day');
    })
};

const renderEvents = (events, startDate, endDate) => {
    let html = '';
    let day = moment(startDate);
    while (day.isSameOrBefore(endDate)) {
        html += `<div class="day${markToday(day)}">${getEventsFromDay(events, day).map(renderEvent).join('')}</div>`;
        day = day.add(1, 'day');
    }
    return html;
};

const markToday = (day) => {
    return moment(new Date()).isSame(day, 'day') ? ' today' : '';
};

const markOverdue = (start, end) => {
    let now = moment(new Date());
    let styleClass = '';
    if (end.isBefore (now, 'minute')) {
        styleClass = ' overDue';
    }
    if (start.isSameOrBefore(now, 'minute') && end.isAfter(now, 'minute')) {
        styleClass = ' due blink';
    }

    return styleClass;
};

const renderCal = (cal, startDate, endDate) => {
    let html = `<div class="cal" data-cal-color="${cal.colorId}">
      <div class="name">${cal.name}</div>
    `;
    html += renderEvents(cal.events, startDate, endDate);
    html += `</div>`;
    return html;
};

const renderHeader = (startDate, endDate) => {
    let html = `<div class="header">
      <div class="spacer"><a href="setup.html">Settings</a></div>`;
    let day = moment(startDate);
    while (day.isSameOrBefore(endDate)) {
        html += `<div class="day">${day.format('dddd').capitalizeFirstLetter()}</div>`;
        day = day.add(1, 'day');
    }
    html += `</div>`;
    return html;
};

const getCalendar = (calendar, startDate, endDate) => {

    return new Promise(resolve => {

        var request = gapi.client.calendar.events.list({
            'calendarId': calendar.name,
            'timeMin': startDate.toISOString(),
            'timeMax': endDate.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 1000,
            'orderBy': 'startTime'
        });

        request.execute(function(resp) {
            var events = resp.items;
                resolve({
                    name: calendar.alias,
                    colorId: calendar.colorId,
                    events
                })
            })
    });
};

const init = () => {
    moment.locale('da');
    let startDate = moment().startOf('week');
    let endDate = moment().endOf('week');

    let calendars = JSON.parse(localStorage.getItem('calendars'));

    loadColors();
    loadCalendars(calendars, startDate, endDate);
};

const draw = (calendars, startDate, endDate) => {
    let main = document.querySelector('.main');

    Promise.all(
        calendars.map(calendar => getCalendar(calendar, startDate, endDate))
    )
        .then(cals => {
        return cals.map(cal => renderCal(cal, startDate, endDate)).join('')
    })
    .then(html => {
        main.innerHTML = renderHeader(startDate, endDate) + html;
        //setTimeout(draw(calendars, startDate, endDate), 30000);
    })

};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};