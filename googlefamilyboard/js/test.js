
const renderEvent = (event) => {
    return `<div class="event"><p>${event}</p></div>`
};

const renderDay = (day) => {
    return day.map(events => {
            return `<div class="day">${events.map(renderEvent).join('')}</div>`
        }).join('')
};

const renderCal = (cal) => {
    let html = `<div class="cal">
      <div class="name">${cal.name}</div>
  `;
    html += renderDay(cal.events);
    html += `</div>`;
    return html;
};

const renderHeader = () => {
    let m = moment().startOf('week');
    let daysA = [];
    for (let i = 0; i < 7; i++) {
        daysA.push(m.format('dddd'));
        m.add(1, 'day')
    }
    let days = daysA.map(d => `<div class="day">${d}</div>`)
.join('');

    let html = `<div class="header">
      <div class="spacer"></div>
      ${days}
    </div>`;
    return html;
};

const getCalendar = (name) => {

    var monday = moment().startOf('week');
    var sunday = moment().endOf('week');
    console.log(monday);
    console.log(sunday);

    var request = gapi.client.calendar.events.list({
        'calendarId': name,
        'timeMin': monday.toISOString(),
        'timeMax': sunday.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 1000,
        'orderBy': 'startTime'
    });

    request.execute(function(resp) {
        var events = resp.items;
        console.log(events);

        return new Promise(resolve => {
            resolve({
                name: 'ere',
                events: [
                    [],
                    [],
                    ['test', 'test2'],
                    [],
                    [],
                    ['foobar'],
                    []
                ]
            })
        })
    });
};

const draw = () => {
    moment.locale('da');
    let main = document.querySelector('.main');
    Promise.all([
        getCalendar('esben@giflen.dk'),
        //getCalendar('Tobias'),
        //getCalendar('Mikkel'),
        //getCalendar('Jeppe')
    ])
        .then(cals => {
        return cals.map(renderCal).join('')
    })
.then(html => {
        main.innerHTML = renderHeader() + html;
    // setTimeout(draw, 3600 * 1000);
})

};