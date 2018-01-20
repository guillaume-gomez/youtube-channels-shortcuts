document.addEventListener('DOMContentLoaded', () => {

  const button = document.getElementById('addButton');
  button.addEventListener('click', () => {
    const table =  document.getElementById("myTable");
    let  row = table.insertRow(table.length);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    cell1.innerHTML = "<input type='text' id='name' name='name' placeholder='My awesome channel'>";
    cell2.innerHTML = "<input type='text' id='url' name='name' placeholder='https://www.youtube.com/signin?feature=masthead_switcher&next=%2Fdashboard%3Fo%3DU&action_handle_signin=true&authuser=0&skip_identity_prompt=False'>";
  });


});
