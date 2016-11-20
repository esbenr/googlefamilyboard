
const renderEvent = (event) => {
    return `<div class="event"><p>${event.summary}</p></div>`
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
        html += `<div class="day">${getEventsFromDay(events, day).map(renderEvent).join('')}</div>`;
        day = day.add(1, 'day');
    }
    return html;
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
      <div class="spacer"></div>`;
    let day = moment(startDate);
    while (day.isSameOrBefore(endDate)) {
        html += `<div class="day">${day.format('dddd')}</div>`;
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
    let calendars = [
        {
            name:'markus@buecking.dk',
            alias: 'Markus'
        },
        {
            name:'mikkel@giflen.dk',
            alias: 'Mikkel'
        },
        {
            name:'tobias@giflen.dk',
            alias: 'Tobias'
        },
        {
            name:'eva-maria@buecking.dk',
            alias: 'Eva-Maria'
        },
        {
            name:'esben@giflen.dk',
            alias: 'Esben'
        }];
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
        //setTimeout(init, 1000);
    })

};