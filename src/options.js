document.addEventListener('DOMContentLoaded', () => {

  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', () => {
    const table =  document.getElementById("myTable");
    insertRow(table);
  });

  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    const inputs = document.getElementsByTagName('input');
    let channels = [];
    for(let i = 0; i < (inputs.length / 2); ++i) {
      channels.push({name: inputs[2 * i].value, url: inputs[(2 * i) + 1].value});
    }
    savechannels(channels);
  });

  const table = document.getElementById("myTable");
  fillTable(table);
});

function insertRow(table, name = "", url = "") {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);

  let deleteButton = document.createElement("BUTTON");
  let textButton = document.createTextNode("-");
  deleteButton.appendChild(textButton);
  deleteButton.setAttribute('class', 'removeButton');
  deleteButton.setAttribute('data-row', table.rows.length - 1);
  deleteButton.addEventListener("click", (e) => {
    deleteRow(table, e.target);
  });
  cell1.appendChild(deleteButton);

  let input = document.createElement("input");
  input.setAttribute('type', "text");
  input.setAttribute('value', name);
  input.setAttribute('placeholder', 'My awesome channel');
  cell1.appendChild(input);

  cell2.innerHTML = "<input type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False' value='"+url+"'>";


}

function deleteRow(table, button) {
  table.deleteRow(button.dataset.row);
}

function fillTable(table) {
  getChannels( (channels) => {
    if(channels) {
      channels.forEach(param => {
        insertRow(table, param.name, param.url);
      });
    }
  });
}

function getChannels(callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}

function savechannels(items) {
  chrome.storage.sync.set({channels: items}, () => {
    const notifDiv = document.getElementById('notification');
    notifDiv.innerHTML += '<p id="notif">Successfully saved !<p>';
    setTimeout(() => {
      notifDiv.innerHTML = "";
    }, 3000);
  });
}
