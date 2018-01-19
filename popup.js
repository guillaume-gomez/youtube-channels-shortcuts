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
    chrome.tabs.update({url: 'https://www.youtube.com/my_videos?o=U'});
    window.close();
  }, 2000);
  chrome.tabs.update({url: url});
}

document.addEventListener('DOMContentLoaded', () => {
  var dropdown = document.getElementById('dropdown');

  fillDropdown();
  dropdown.addEventListener('change', () => {
    connectToChannel(dropdown.value);
  });
});
