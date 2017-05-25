/**
 * Created by Tim on 2017-05-25.
 */
/*
 JavaScript Password Prompt by Luc (luc@ltdinteractive.com)
 Originaly posted to http://stackoverflow.com/questions/9554987/how-can-i-hide-the-password-entered-via-a-javascript-dialog-prompt
 This code is Public Domain :)

 Syntax:
 password_prompt(label_message, button_message, callback);
 password_prompt(label_message, button_message, width, height, callback);

 Example usage:
 password_prompt("Please enter your password:", "Submit", function(password) {
 alert("Your password is: " + password);
 });
 */
window.password_prompt = function(label_message, button_message, arg3, arg4, arg5) {

    if (typeof label_message !== "string") let label_message = "Password:";
    if (typeof button_message !== "string") let button_message = "Submit";
    if (typeof arg3 === "function") {
        let callback = arg3;
    }
    else if (typeof arg3 === "number" && typeof arg4 === "number" && typeof arg5 === "function") {
        let width = arg3;
        let height = arg4;
        let callback = arg5;
    }
    if (typeof width !== "number") let width = 200;
    if (typeof height !== "number") let height = 100;
    if (typeof callback !== "function") let callback = function(password){};

    let submit = function() {
        callback(input.value);
        document.body.removeChild(div);
        window.removeEventListener("resize", resize, false);
    };
    let resize = function() {
        div.style.left = ((window.innerWidth / 2) - (width / 2)) + "px";
        div.style.top = ((window.innerHeight / 2) - (height / 2)) + "px";
    };

    let div = document.createElement("div");
    div.id = "password_prompt";
    div.style.background = "white";
    div.style.color = "black";
    div.style.border = "1px solid black";
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.padding = "16px";
    div.style.position = "fixed";
    div.style.left = ((window.innerWidth / 2) - (width / 2)) + "px";
    div.style.top = ((window.innerHeight / 2) - (height / 2)) + "px";

    let label = document.createElement("label");
    label.id = "password_prompt_label";
    label.innerHTML = label_message;
    label.for = "password_prompt_input";
    div.appendChild(label);

    div.appendChild(document.createElement("br"));

    let input = document.createElement("input");
    input.id = "password_prompt_input";
    input.type = "password";
    input.addEventListener("keyup", function(e) {
        if (event.keyCode == 13) submit();
    }, false);
    div.appendChild(input);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    let button = document.createElement("button");
    button.innerHTML = button_message;
    button.addEventListener("click", submit, false);
    div.appendChild(button);

    document.body.appendChild(div);
    window.addEventListener("resize", resize, false);
};