import { reactive } from "vue";

const handleSubmit = () => {
  const firstInvalidInput = document.querySelector(".invalid.customInput");

  if (firstInvalidInput) {
    firstInvalidInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

const defaultErrorObject = {
  isDirty: false,
  errors: [],
}; //create a default object with an error for each input

export const errorsFormData = reactive({}); //create a reactive object to store errors

export function createErrorObj(name) {
  errorsFormData[name] = { ...defaultErrorObject }; //create a function that will create a default object with errors where the object key is the name of the input
}
export function validateField(value, name, message) {
  //we check the input fields where the name parameter is the name of the input, the value parameter is the input value, password is the password input value for comparison

  if (!errorsFormData[name]) {
    createErrorObj(name);
  }

  errorsFormData[name].errors = []; //reset the error value in the object so that errors are not duplicated

  // Is required
  if (!value) {
    errorsFormData[name].errors.push("Поле не може буди порожнім !");
    handleSubmit();
  }

  // Min  length
  if (!!value && value.length <= 3 && name !== "file") {
    errorsFormData[name].errors.push("Мінімальна кількість символів 3");
    handleSubmit();
  }

  //phone validation
  if (!!value && name == "phone" && value.length < 13) {
    errorsFormData[name].errors = [];
    errorsFormData[name].errors.push("Введіть повний номер телефону");
    handleSubmit();
  }

  //file validation
  if (!!value && name == "file" && value.length == 0) {
    errorsFormData[name].errors = [];
    errorsFormData[name].errors.push("Потрібно додати картинку");
  }

  if (
    (!!value && message === "User not found") ||
    message === "Password is incorrect" ||
    message === "Ошибка при получении данных администратора"
  ) {
    errorsFormData[name].errors = [];
    errorsFormData[name].errors.push("Невірне имʼя або пароль");
  }
}
