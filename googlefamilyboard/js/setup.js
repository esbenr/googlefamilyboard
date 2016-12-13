
const renderCalendarSetup = (remove, calender) => {

    let removeButton = ``;
    if(remove == true) {
        removeButton = `<a href="#" class="remove_field">Remove</a>`
    }

    let nameValue = ``;
    let aliasValue = ``;

    if (calender != undefined) {
        if (calender.name.length > 0) {
            nameValue = calender.name;
        }

        if (calender.alias.length > 0) {
            aliasValue = calender.alias;
        }
    }

    return `<fieldset class="cal">
        <legend class="legend">Calendar data</legend>
        <div>
            <span>Calendar name*:</span>
            <input type="text" name="name[]" required value="${nameValue}">
        </div>
        <div>
            <span>Calendar alias:</span>
            <input type="text" name="alias[]" required value="${aliasValue}">
        </div>
        ${removeButton}
    </fieldset>`
};
