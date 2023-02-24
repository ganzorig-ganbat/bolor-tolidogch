/* Copyright (c) 2017 Kenzo. All rights reserved. */

import { bolorLocales } from "../scripts/locales.js";
import { updateWindow } from "../scripts/window.js";

const direction_key = "direction";

const selectChange = async (event) => {
  chrome.storage.local.set({ [direction_key]: event.target.value });
};

const getSelectBox = async () => {
  const select_box = document.createElement("select");
  select_box.id = "selected_lang";
  select_box.classList.add("select-lang");
  const default_direction_obj = await chrome.storage.local.get([direction_key]);

  for (const { direction, title } of bolorLocales) {
    const option = document.createElement("option");
    option.value = direction;
    option.textContent = title;
    if (direction === default_direction_obj.direction) {
      option.selected = true;
    }
    select_box.appendChild(option);
  }

  select_box.addEventListener("change", selectChange);

  return select_box;
};

const showError = () => {
  const messageElement = document.getElementById("message");
  messageElement.classList.add("error-message");

  setTimeout(() => {
    messageElement.classList.remove("error-message");
  }, 1000);
};

const buttonClick = (e) => {
  e.preventDefault();
  const input = document.getElementById("search_field");
  const select = document.getElementById("selected_lang");

  if (input.value.trim() == "") {
    showError();
    return;
  }

  updateWindow(input.value.trim(), select.value);
  input.value = "";
};

const getButton = () => {
  const button = document.createElement("button");
  button.classList.add("inline-block");
  button.classList.add("sw-button");
  button.classList.add("sw-button-action");

  button.addEventListener("click", buttonClick);
  return button;
};

const getTextBox = () => {
  const text_box = document.createElement("input");
  text_box.type = "text";
  text_box.name = "q";
  text_box.id = "search_field";
  text_box.classList.add("text-input");
  text_box.placeholder = "Хайх...";
  text_box.autofocus = true;
  return text_box;
};

const createForm = async () => {
  const form = document.getElementById("search-form");
  form.appendChild(await getSelectBox());
  form.appendChild(getTextBox());
  form.appendChild(getButton());
};

createForm().catch(console.error);
