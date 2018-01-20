document.addEventListener('DOMContentLoaded', () => {

  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', () => {
    const table =  document.getElementById("myTable");
    insertRow(table);
  });

  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    const inputs = document.getElementsByTagName('input');
    let params = [];
    for(let i = 0; i < (inputs.length / 2); ++i) {
      params.push({name: inputs[2 * i].value, url: inputs[(2 * i) + 1].value});
    }
    saveParams(params);
  });

  const table = document.getElementById("myTable");
  fillTable(table);
});

function insertRow(table, name = "", url = "") {
  let row = table.insertRow(table.length);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  console.log(name)
  console.log(url)
  cell1.innerHTML = "<input type='text' id='name' name='name' placeholder='My awesome channel' value='"+name+"'>";
  cell2.innerHTML = "<input type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False' value='"+url+"'>";
}

function fillTable(table) {
  getParams( (params) => {
    if(params) {
      params.forEach(param => {
        insertRow(table, param.name, param.url);
      });
    }
  });
}

function getParams(callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get("params", (items) => {
    callback(chrome.runtime.lastError ? null : items["params"]);
  });
}

function saveParams(items) {
  chrome.storage.sync.set({params: items}, () => {
    const notifDiv = document.getElementById('notification');
    notifDiv.innerHTML += '<p id="notif">Successfully saved !<p>';
    setTimeout(() => {
      notifDiv.innerHTML = "";
    }, 3000);
  });
}