const init = () => {

    let calendars = JSON.parse(localStorage.getItem('calendars'));

    loadColors();
    loadCalendars(calendars)
};

const loadCalendars = (calendars) => {
    var request = gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    });

    request.then(function(response) {
        $.each(response.result.items, function(index, calendar){
            calendar.selected = false;
            if(calendars) {
                let matchingCal = calendars.find(function (cal) {
                    return cal.name == calendar.id;
                });
                calendar.selected = matchingCal != undefined;
                calendar.alias = matchingCal != undefined ? matchingCal.alias: "";
            }
        });

        draw(response.result.items);
    }, function(reason) {
        console.log('Loading calendar failed. ' + reason);
    })
};

const draw = (calendars) => {
    let main = document.querySelector('.calendars');
    console.log("drawing");
    Promise.all(
        calendars.map(calendar => renderCalendar(calendar))
    )
        .then(html => {
            main.innerHTML = `<ul>` + html.join('') + `</ul>`;
            console.log("done drawing")
        });
};

const renderCalendar = (calendar) => {
    return `<li class="calendar" data-cal-color="${calendar.colorId}">
        <input class="calendarCheckbox" type="checkbox" value="${calendar.id}" name="calendarId" ${calendar.selected ? "checked" : ""} />
        Vis <span class="strong">${calendar.summary}</span> på Family Board med alias* <input type="text" name="calendarAlias" value="${calendar.alias ? calendar.alias : ""}" />&nbsp;
        </li>`;
};
