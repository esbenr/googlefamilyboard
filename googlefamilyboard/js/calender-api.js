/**
 * Created by esbenrasmussen on 29/10/2016.
 */

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'YOUR_API_KEY',
        'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
        // clientId and scope are optional if auth is not required.
        'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
        'scope': 'profile',
    }).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.people.people.get({
            resourceName: 'people/me'
        });
    }).then(function(resp) {
        console.log(resp.result);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}

