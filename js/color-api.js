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
