const editBtn = document.querySelector('.edit-book-btn');
const cancelEditBtn = document.querySelector('.return-btn');
const veil = document.querySelector('.veil');
const editForm = document.querySelector('.book-form');
const commitBtn = document.querySelector('.commit-btn');
const validation = document.querySelector('.validator');
const valForm = document.querySelector('.validator form');
const valVeil = document.querySelector('.password-veil');
const cancelValBtn = document.querySelector('.cancel-btn');
const submitBtn = document.querySelector('.submit-btn');
function toggleVisibility(node) {
  if (node.classList.contains('inactive')) {
    node.classList.replace('inactive', 'active');
  } else {
    node.classList.replace('active', 'inactive');
  }

}
// Event listeners
if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    toggleVisibility(veil);
    toggleVisibility(editForm);
  })
}
if (editBtn) {
  editBtn.addEventListener('click', () => {
    toggleVisibility(veil);
    toggleVisibility(editForm);
  })
}
if (commitBtn) {
  commitBtn.addEventListener('click', () => {
    toggleVisibility(valVeil);
    toggleVisibility(validation);
    const actionInput = document.getElementById('protected-action');
    actionInput.value = 'edit';
  })
}
if (cancelValBtn) {
  cancelValBtn.addEventListener('click', () => {
    toggleVisibility(valVeil);
    toggleVisibility(validation);
  })
}
// Submit Edit Form with Validation

if (valForm && editForm) {
  valForm.addEventListener("submit", () => {

    valForm.querySelectorAll(".injected").forEach(input => input.remove());

    const editData = new FormData(editForm);

    for (const [key, value] of editData.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      input.classList.add("injected");

      valForm.appendChild(input);
    }
  });
}

