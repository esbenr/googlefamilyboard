const loadColors = () => {
    console.log("load colors");
    let request = gapi.client.request({
        'path': 'https://www.googleapis.com/calendar/v3/colors'
    });

    request.then(function(response) {
        makeStyleSheet(response.result.calendar, 'data-cal-color');
        makeStyleSheet(response.result.event, 'data-e-color');
    }, function(reason) {
        console.log('Loading colors failed. ' + reason);
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
