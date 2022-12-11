const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const result = document.getElementById("result");

//Show input error messages
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-group error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

//show success colour
function showSucces(input) {
  const formControl = input.parentElement;
  formControl.className = "form-group success";
}

//check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSucces(input);
    return true;
  } else {
    showError(input, "Email is not invalid");
    return false;
  }
}

//checkRequired fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      return false;
    } else {
      showSucces(input);
      return true;
    }
  });
  return true;
}

//check input Length
function checkLength(input, min = 5, max = 15) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be les than ${max} characters`
    );
    return false;
  } else {
    showSucces(input);
    return true;
  }
}

//check iF Contines Number first or last

function containsNumbersFirst() {
  return /[0-9]/.test(username.value.charAt(0));
}
function containsNumbersLast() {
  return /[0-9]/.test(username.value.charAt(username.value.length - 1));
}

function checkTexts(input, min = 5, max = 15) {
  if (containsNumbersFirst() || containsNumbersLast()) {
    showError(
      input,
      `${getFieldName(input)} It must neither begin nor end with a number`
    );
    return false;
  } else if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be les than ${max} characters`
    );
    return false;
  } else {
    showSucces(input);
    return true;
  }
}

//get FieldName
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// check passwords match
function checkPasswordMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  } else {
    showSucces(input1, input2);
    return true;
  }
}

// Event Listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    checkRequired([username, email, password, password2]) &&
    checkLength(password, 8, 8) &&
    checkEmail(email) &&
    checkPasswordMatch(password, password2) &&
    checkTexts(username, 5, 15)
  ) {
    const formData = new FormData(form);
    console.log([...formData]);
    e.preventDefault();
    var object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    var json = JSON.stringify(object);
    result.innerHTML = "Please wait...";

    fetch("https://goldblv.com/api/hiring/tasks/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (
          response.status == 200 ||
          response.status == 201 ||
          response.status == 204
        ) {
          result.innerHTML = json.message;
          result.classList.remove("text-mute");
          result.classList.add("text-success");

          document.getElementsByTagName("img")[0].src = "./images/product3.png";
          window.localStorage.setItem("email", email.value);
          var emailStorage = localStorage.getItem("email");
          document.querySelector('div[class="welcome-page-text"]').innerHTML =
            '<h1>Successfully logged in</h1><a href="" class="text-email">' +
            emailStorage +
            "</a>";
        } else {
          console.log(response);
          result.innerHTML = json.message;
          result.classList.remove("text-mute");
          result.classList.add("text-danger");
        }
      })
      .catch((error) => {
        console.log(error);
        result.innerHTML = "Something went wrong!";
      })
      .then(function () {
        form.reset();
        setTimeout(() => {
          result.style.display = "none";
        }, 3000);
      });
  } else {
    console.log("error");
    checkRequired([username, email, password, password2]);
    checkLength(username, 5, 15);
    checkLength(password, 8, 8);
    checkEmail(email);
    checkPasswordMatch(password, password2);
    checkTexts(username, 5, 15);
  }
});
