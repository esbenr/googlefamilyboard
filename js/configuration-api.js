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
        calendars.map(calendar => renderCalendar(calendar))
    )
        .then(html => {
            main.innerHTML = `<ul>` + html.join('') + `</ul>`;
            console.log("done drawing")
        });
};

const renderCalendar = (calendar) => {
    return `<li class="calendar" data-cal-color="${calendar.colorId}">
        <input type="checkbox" name="selectedCalendars" ${calendar.selected ? "checked" : ""}>
        <span class="name">${calendar.summary}</span>
        </li>`;
};
