
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
        html += `<td class="day${markToday(day)}">${getEventsFromDay(events, day).map(renderEvent).join('')}</td>`;
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
        styleClass = ' due';
    }

    return styleClass;
};

const renderCal = (cal, startDate, endDate) => {
    let html = `<tr class="cal" data-cal-color="${cal.colorId}">
      <td class="name">${cal.name}</td>
    `;
    html += renderEvents(cal.events, startDate, endDate);
    html += `</tr>`;
    return html;
};

const renderHeader = (startDate, endDate) => {
    let html = `<table><tr class="header">
      <td class="spacer"><a href="configure.html">Settings</a></td>`;
    let day = moment(startDate);
    while (day.isSameOrBefore(endDate)) {
        html += `<td class="day">${day.format('dddd').capitalizeFirstLetter()}</td>`;
        day = day.add(1, 'day');
    }
    html += `</tr>`;
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

    if(!calendars) {
        drawNoCalendarData();
        return;
    }

    loadColors();
    loadCalendars(calendars, startDate, endDate);
};

const loadCalendars = (calendars, startDate, endDate) => {
    var request = gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    });

    request.execute(function(response) {
        $.each(calendars, function(index, calendar){
            let matchingCal = response.items.find(function(cal){
                return cal.id == calendar.name;
            });
            calendar.colorId = matchingCal.colorId;
        });
        draw(calendars, startDate, endDate);
    })
};

const draw = (calendars, startDate, endDate) => {
    let main = document.querySelector('.main');
    console.log("drawing");
    Promise.all(
        calendars.map(calendar => getCalendar(calendar, startDate, endDate))
    )
        .then(cals => {
        return cals.map(cal => renderCal(cal, startDate, endDate)).join('')
    })
    .then(html => {
        main.innerHTML = renderHeader(startDate, endDate) + html + `</table>`;
        console.log("done drawing")
        setTimeout(function() {
            loadCalendars(calendars, startDate, endDate);
        }, 60000);
    });
};

const drawNoCalendarData = () => {
    let main = document.querySelector('.main');
    main.innerHTML = `<div class="no-calendars"><p>Du har endnu ikke konfigureret dit Googe Family Board.</p><br/><a href="configure.html" class="button">Gå til opsætning</a></div>`;
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};