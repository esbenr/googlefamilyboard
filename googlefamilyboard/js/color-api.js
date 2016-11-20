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

const loadColors = () => {
    var request = gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/colors'
    });

    request.execute(function(response) {
        makeStyleSheet(response.calendar, 'data-cal-color');
        makeStyleSheet(response.event, 'data-e-color');
    })
};

const makeStyleSheet = (colors, prefix) => {
    let styleEle = document.createElement('style');
    document.body.appendChild(styleEle);

    let s = styleEle.sheet;

    for (let key in colors) {
        let rule = `[${prefix}="${key}"] { 
      background-color: ${colors[key].background};
      color: ${colors[key].foreground};
    }`;

        s.insertRule(rule, s.cssRules.length);
    }
};
