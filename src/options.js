document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', () => {
    const table =  document.getElementById("main-table");
    insertRowMainTable(table);
  });

  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    const error = saveChannels();
    saveCategories();
    saveActions();

    if(!error) {
      const categoriesTable = document.getElementById("categories-table");
      fillCategoriesTable(categoriesTable);
    }
  });

  fillTables();

  const importDataButton = document.getElementById("import-data");
  importDataButton.addEventListener("click", () => {
    const textarea = document.getElementById("import-export-data");
    const data = JSON.parse(textarea.value);
    importData(data);
    fillTables();
  });

  const exportDataButton = document.getElementById("export-data");
  exportDataButton.addEventListener("click", () => {
    getChannels((channels) => {
      getCategories(categories => {
        getActions((actions) => {
          const textarea = document.getElementById("import-export-data");
          textarea.value = JSON.stringify({ channels, categories, actions });
        });
      });
    });
  });

});


function saveChannels() {
  const inputs = document.getElementsByClassName('channel-input');
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
    chrome.storage.sync.set({channels}, () => {
      addNotification("Successfully saved !", "success", 3000);
    });
  }
  return error;
}

function saveCategories() {
  const categoriesTags = document.getElementsByClassName("category-name");
  const categories = [].slice.call(categoriesTags).map((category, index) => {
    return {position: index + 1, name: category.innerHTML};
  });
  chrome.storage.sync.set({categories}, () => {
    //addNotification("Successfully saved !", "success", 3000);
  });
}

function saveActions() {
  const actionCheckboxes = document.getElementsByClassName("toggle-actions");
  getActions( actions => {
    const newActions = [].slice.call(actionCheckboxes).map((action) => {
      const actionHash = actions.find(actionObj => actionObj.title === action.dataset.title);
      return Object.assign({}, actionHash, { enabled: action.checked });
    });
    chrome.storage.sync.set({actions: newActions}, () => {
      //addNotification("Successfully saved !", "success", 3000);
    });
  });
}

function importData(data) {
  const { channels, categories, actions } = data;
  chrome.storage.sync.set({channels}, () => {
    addNotification("Successfully saved !", "success", 3000);
  });
  chrome.storage.sync.set({categories}, () => {
    //addNotification("Successfully saved !", "success", 3000);
  });
  chrome.storage.sync.set({actions}, () => {
    //addNotification("Successfully saved !", "success", 3000);
  });
}

function addNotification(message, type, timer) {
  const notifDiv = document.getElementById('notification');
    notifDiv.innerHTML += "<div class='alert alert-"+type+"' role='alert'>"+message+"</div>";
    setTimeout(() => {
      notifDiv.innerHTML = "";
    }, timer);
}

function fillMainOptionTable(table) {
  clearTbody(table);
  getChannels( (channels) => {
    if(channels) {
      channels.forEach(param => {
        insertRowMainTable(table, param.name, param.url, param.category);
      });
    }
  });
}

function fillCategoriesTable(table) {
  clearTbody(table);
  getCategories((categories) => {
    categories.forEach((category, index) => {
      inserRowCategories(table, category);
    });
  });
}

function fillActionsTable(table) {
  clearTbody(table);
  getActions((actions) => {
    actions.forEach(action => {
      insertRowAction(table, action);
    });
  });
}

function clearTbody(table) {
  const rowCount = table.rows.length;
  for(let i = rowCount; i > 1; i--) {
    table.deleteRow(1);
  }
}

function inserRowCategories(table, category) {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.innerHTML = category.position;
  cell1.setAttribute('class', "category-position");

  cell2.innerHTML = category.name;
  cell2.setAttribute('class', "category-name");

  let divButtons = document.createElement("div");
  divButtons.setAttribute('class', 'col-md-12');

  let upButton = document.createElement("BUTTON");
  let textButton = document.createTextNode("Up");
  upButton.appendChild(textButton);
  upButton.setAttribute('class', 'btn btn-outline-primary');
  upButton.addEventListener("click", (e) => {
    moveRowUp(e.target);
  });

  let downButton = document.createElement("BUTTON");
  textButton = document.createTextNode("Down");
  downButton.appendChild(textButton);
  downButton.setAttribute('class', 'btn btn-outline-primary');
  downButton.addEventListener("click", (e) => {
    moveRowDown(e.target);
  });

  divButtons.appendChild(upButton);
  divButtons.appendChild(downButton);

  cell3.appendChild(divButtons);
  cell3.setAttribute('scope', "row");
}

function insertRowMainTable(table, name = "", url = "", category="") {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);


  let input = document.createElement("input");
  input.setAttribute('type', "text");
  input.setAttribute('class', "form-control channel-input");
  input.setAttribute('value', name);
  input.setAttribute('placeholder', 'My awesome channel');
  cell1.appendChild(input);

  cell2.innerHTML = "<input class='form-control channel-input' type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False' value='"+url+"'>";
  cell3.innerHTML = "<input class='form-control channel-input category-channel' type='text' id='category' name='category' placeholder='Personnal' value='"+category+"'>";

  let deleteButton = document.createElement("BUTTON");
  let textButton = document.createTextNode("-");
  deleteButton.appendChild(textButton);
  deleteButton.setAttribute('class', 'removeButton btn btn-danger');
  deleteButton.addEventListener("click", (e) => {
    deleteRow(e.target);
  });
  cell4.appendChild(deleteButton);
  cell4.setAttribute('scope', "row");
}

function insertRowAction(table, action) {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);

  cell1.innerHTML = action.title;
  if(action.enabled) {
    cell2.innerHTML = "<input class='form-check toggle-actions' type='checkbox' value='"+action.enabled+"' checked data-title='"+action.title+"'>";
  } else {
    cell2.innerHTML = "<input class='form-check toggle-actions' type='checkbox' value='"+action.enabled+"' data-title='"+action.title+"'>";
  }
}

function deleteRow(button) {
  const tr = button.parentNode.parentElement;
  tr.remove();
}


function moveRowUp(button) {
  const row = button.parentNode.parentNode.parentNode;
  const sibling = row.previousElementSibling;
  const parent = row.parentNode;

  if(sibling.rowIndex == 0) {
    return;
  }
  parent.insertBefore(row, sibling);
}

function moveRowDown(button) {
  const row = button.parentNode.parentNode.parentNode;
  const anchor = row.nextElementSibling;
  const parent = row.parentNode;

  if(!anchor) {
    return;
  }
  parent.insertBefore(anchor, row);
}

function fillTables() {
  const mainTable = document.getElementById("main-table");
  const categoriesTable = document.getElementById("categories-table");
  const actionsTable = document.getElementById("actions-table")
  
  fillMainOptionTable(mainTable);
  fillCategoriesTable(categoriesTable);
  fillActionsTable(actionsTable);
}