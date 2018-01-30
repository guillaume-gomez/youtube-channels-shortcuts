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
    let error = false;
    const rowSize = 3;
    for(let i = 0; i < (inputs.length / rowSize); ++i) {

      const name = inputs[rowSize * i].value;
      const url = inputs[(rowSize * i) + 1].value;
      const category = inputs[(rowSize * i) + 2].value || "Personnal";

      if(name.length > 0 && url.length > 0) {
        channels.push({name, url, category});
      } else {
        error = true;
        addNotification("Line: "+(i + 1)+" could not saved( youtube channel and url is mandatory)", "danger", 5000);
      }
    }
    if(!error) {
      saveChannels(channels);
    }
  });

  const table = document.getElementById("myTable");
  fillTable(table);
});

function insertRow(table, name = "", url = "", category="") {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);

  let deleteButton = document.createElement("BUTTON");
  let textButton = document.createTextNode("-");
  deleteButton.appendChild(textButton);
  deleteButton.setAttribute('class', 'removeButton btn btn-danger');
  deleteButton.addEventListener("click", (e) => {
    deleteRow(e.target);
  });
  cell1.appendChild(deleteButton);
  cell1.setAttribute('scope', "row");

  let input = document.createElement("input");
  input.setAttribute('type', "text");
  input.setAttribute('class', "form-control");
  input.setAttribute('value', name);
  input.setAttribute('placeholder', 'My awesome channel');
  cell2.appendChild(input);

  cell3.innerHTML = "<input class='form-control' type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False' value='"+url+"'>";
  cell4.innerHTML = "<input class='form-control' type='text' id='category' name='category' placeholder='Personnal' value='"+category+"'>";
}

function deleteRow(button) {
  const tr = button.parentNode.parentElement;
  tr.remove();
}

function fillTable(table) {
  getChannels( (channels) => {
    if(channels) {
      channels.forEach(param => {
        insertRow(table, param.name, param.url, param.category);
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

function saveChannels(items) {
  chrome.storage.sync.set({channels: items}, () => {
    addNotification("Successfully saved !", "success", 3000);
  });
}

function addNotification(message, type, timer) {
  const notifDiv = document.getElementById('notification');
    notifDiv.innerHTML += "<div class='alert alert-"+type+"' role='alert'>"+message+"</div>";
    setTimeout(() => {
      notifDiv.innerHTML = "";
    }, timer);
}