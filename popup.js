// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const channels = [
  {name: "Guillaume Gomez", url: "https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False"},
  {name: "Tom la depanneuse", url: "https://www.youtube.com/signin?pageid=103054960866031661194&authuser=0&action_handle_signin=true&next=%2F&feature=masthead_switcher&skip_identity_prompt=False"},
  {name: "Amuse Production", url: "https://www.youtube.com/signin?content_owner=8_tcxbkqifWJhg_qQZilBg&authuser=0&action_handle_signin=true&next=%2Fdashboard%3Fo%3D8_tcxbkqifWJhg_qQZilBg&feature=masthead_switcher&skip_identity_prompt=False"},
  {name: "Troisieme et derniere chaine", url: "https://www.youtube.com/signin?pageid=113499566998840367996&authuser=0&action_handle_signin=true&next=%2F&feature=masthead_switcher&skip_identity_prompt=False"},
  {name: "SecondeChaine test", url: "https://www.youtube.com/signin?pageid=108822329699081727760&authuser=0&action_handle_signin=true&next=%2F&feature=masthead_switcher&skip_identity_prompt=False"},
  {name: "Apprendre avec dino", url: "https://www.youtube.com/signin?pageid=117039495347400891925&authuser=0&action_handle_signin=true&next=%2F&feature=masthead_switcher&skip_identity_prompt=False"}
]

function fillDropdown(id = "dropdown") {
  let dropdown = document.getElementById(id);
  channels.forEach(item => {
    const added = document.createElement('option');
    added.text = item.name;
    added.value = item.url;
    dropdown.append(added);
  });
}

function connectToChannel(url) {
  setTimeout(function() {
    window.location = 'https://www.youtube.com/my_videos?o=U';
  }, 2000);
  window.location = url;
}

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('dropdown');

    fillDropdown();
    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
      connectToChannel(dropdown.value);
      //changeBackgroundColor(dropdown.value);
      //saveBackgroundColor(url, dropdown.value);
    });
  });
});
