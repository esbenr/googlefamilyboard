
const renderAddCalenderSetupButton = () => {
    return `<button class="add_field_button">Add More Fields</button>`
};

const renderCalendarSetup = (remove) => {

    let removeButton = ``;
    if(remove == true) {
        removeButton = `<a href="#" class="remove_field">Remove</a>`
    }
    return `<fieldset class="cal"><legend>Calendar data</legend><div><span>Calendar name:</span><input type="text" name="name[]" required></div><div><span>Calendar alias:</span><input type="text" name="alias[]" required></div>${removeButton}</fieldset>`
};
