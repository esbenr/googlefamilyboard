const init = () => {

    let calendars = JSON.parse(localStorage.getItem('calendars'));

    loadColors();
    loadCalendars(calendars)
};

const loadCalendars = (calendars) => {
    var request = gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    });

    request.execute(function(response) {
        $.each(response.items, function(index, calendar){
            let matchingCal = calendars.find(function(cal){
                return cal.name == calendar.id;
            });
            calendar.selected = matchingCal != undefined;
        });

        console.log(response.items);
        draw(response.items);
    })
};

const draw = (calendars) => {
    let main = document.querySelector('.calendars');
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
