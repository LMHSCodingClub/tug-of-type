//var prompt = "Test string";
//var c;
//var wrong_c;

export function validate(input) {
    if (input != prompt[c] || wrong_c > 0) {
        wrong_c++;
        //highlight red
    } else {
        //highlight none
    }
    //move_cursor;
    c++;
    if (input == "Backspace" && wrong_c > 0) {
        //move_cursor_back, deletes highlight
        wrong_c--;
        c--;
    }
}