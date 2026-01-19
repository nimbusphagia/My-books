// Utilities
function toggleVisibility(node) {
  node.classList.contains('inactive')
    ? node.classList.replace('inactive', 'active')
    : node.classList.replace('active', 'inactive');
}


// Main
const navBtn = document.querySelector('.toggle-active');
const formBtn = document.querySelector('.return-btn');
const veil = document.querySelector('.veil');
const createForm = document.querySelector('.publisher-form');

// Create Form toggle
[navBtn, formBtn].forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => [createForm, veil].forEach(toggleVisibility));
});
//Edit Form toggle
const publishersContainer = document.querySelector('.publishers-container');
const cancelEditBtn = document.querySelector('.cancel-edit-btn');
const sendEditBtn = document.querySelector('.send-edit-btn');
const editForm = document.querySelector('.edit-publisher-form');
const publisherIdInput = document.getElementById('form-id');
const validation = document.querySelector('.validator');
const cancelValBtn = document.querySelector('.cancel-validation-btn');
const valVeil = document.querySelector('.password-veil');
const actionInput = document.getElementById('protected-action');

cancelEditBtn.addEventListener('click', () => [veil, editForm].forEach(toggleVisibility));
cancelValBtn.addEventListener('click', () => [valVeil, validation].forEach(toggleVisibility));

publishersContainer.addEventListener('click', (e) => {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  if (editBtn) {
    // Toggle Update Form, Fill input values
    const parent = editBtn.parentNode.parentNode;
    const name = parent.querySelector('.name').textContent.trim();

    editForm.querySelector('input[name="publisher_name"]').value = name;
    publisherIdInput.value = editBtn.dataset.publisherId;

    [editForm, veil].forEach(toggleVisibility);

  } else if (deleteBtn) {
    // Delete Form toggle, passing id to form
    publisherIdInput.value = deleteBtn.dataset.publisherId;
    actionInput.value = 'delete';
    [validation, valVeil].forEach(toggleVisibility);
  }
});
//Pass data to validation form for Edit
// Toggle Validation
sendEditBtn.addEventListener('click', () => {
  actionInput.value = 'edit';
  [validation, valVeil].forEach(toggleVisibility);
})

if (validation && editForm) {
  // Submit all Data
  const valForm = validation.querySelector('form');
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





