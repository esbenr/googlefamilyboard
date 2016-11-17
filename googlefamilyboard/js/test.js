
const renderEvent = (event) => {
    return `<div class="event"><p>${event.summary}</p></div>`
};

const getEventsFromDay =(events, day) => {
    return events.filter(event => {
        let m = moment(event.start.dateTime);
        return m.isSame(day, 'day');
    })
}

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
    let html = `<div class="cal">
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

const getCalendar = (name, startDate, endDate) => {
    return new Promise(resolve => {

        var request = gapi.client.calendar.events.list({
            'calendarId': name,
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
                    name,
                    events
                })
            })
    });
};

const init = () => {
    moment.locale('da');
    let startDate = moment().startOf('week');
    let endDate = moment().endOf('week');
    draw(startDate, endDate);
}

const draw = (startDate, endDate) => {
    let main = document.querySelector('.main');
    Promise.all([
        getCalendar('esben@giflen.dk', startDate, endDate),
        //getCalendar('Tobias'),
        //getCalendar('Mikkel'),
        //getCalendar('Jeppe')
    ])
        .then(cals => {
        return cals.map(cal => renderCal(cal, startDate, endDate)).join('')
    })
    .then(html => {
        main.innerHTML = renderHeader(startDate, endDate) + html;
        // setTimeout(draw, 3600 * 1000);
    })

};