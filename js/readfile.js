const inputFile = document.getElementById('file');
const editor = document.getElementById('input');
inputFile.addEventListener('change', function () {
  if (inputFile.files.length > 0) {
    readFile(inputFile.files[0]);
  }
});

function readFile(file) {
  const reader = new FileReader();
  reader.onload = function() {
    editor.value= reader.result; 
  }
  reader.readAsText(file);
}