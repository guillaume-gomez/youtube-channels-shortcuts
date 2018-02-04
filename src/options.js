document.addEventListener('DOMContentLoaded', () => {

  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', () => {
    const table =  document.getElementById("main-table");
    insertRowMainTable(table);
  });

  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    saveChannels();
    saveCategories();
  });

  const table = document.getElementById("main-table");
  fillMainOptionTable(table);

  const categoryTable = document.getElementById("categoriesTable");
  fillCategoriesTable(categoryTable);
});

function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}

function saveChannels() {
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
    chrome.storage.sync.set({channels}, () => {
      addNotification("Successfully saved !", "success", 3000);
    });
  }
}

function saveCategories() {
  const categoriesTags = document.getElementsByClassName("category-name");
  const categories = [].slice.call(categoriesTags).map((category, index) => {
    return {position: index + 1, name: category.innerHTML};
  });
  console.log(categories);
  chrome.storage.sync.set({categories}, () => {
    addNotification("Successfully saved !", "success", 3000);
  });
}

function getCategories(callback) {
  chrome.storage.sync.get("categories", (items) => {
    callback(chrome.runtime.lastError ? null : items["categories"]);
  });
}

function addNotification(message, type, timer) {
  const notifDiv = document.getElementById('notification');
    notifDiv.innerHTML += "<div class='alert alert-"+type+"' role='alert'>"+message+"</div>";
    setTimeout(() => {
      notifDiv.innerHTML = "";
    }, timer);
}


function fillCategoriesTable(table) {
  getCategories((categories) => {
    categories.forEach((category, index) => {
      inserRowCategories(table, category);
    });
  });
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
    //moveUp(e.target);
  });

  let downButton = document.createElement("BUTTON");
  textButton = document.createTextNode("Down");
  downButton.appendChild(textButton);
  downButton.setAttribute('class', 'btn btn-outline-primary');
  downButton.addEventListener("click", (e) => {
    //moveUp(e.target);
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
  input.setAttribute('class', "form-control");
  input.setAttribute('value', name);
  input.setAttribute('placeholder', 'My awesome channel');
  cell1.appendChild(input);

  cell2.innerHTML = "<input class='form-control' type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False' value='"+url+"'>";
  cell3.innerHTML = "<input class='form-control' type='text' id='category' name='category' placeholder='Personnal' value='"+category+"'>";

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

function deleteRow(button) {
  const tr = button.parentNode.parentElement;
  tr.remove();
}

function fillMainOptionTable(table) {
  getChannels( (channels) => {
    if(channels) {
      channels.forEach(param => {
        insertRowMainTable(table, param.name, param.url, param.category);
      });
    }
  });
}
