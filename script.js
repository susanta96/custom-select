import Select from "./select.js";

const selectElements = document.querySelectorAll('[data-select]');

selectElements.forEach(el => {
  new Select(el)
});