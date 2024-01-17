function populateCategoryTable() {
    fetch('/categories')
        .then(response => response.json())
        .then(category => {
            const tBody = document.getElementById('categoryTable').querySelector('tbody');
            tBody.innerHTML = '';
            category.forEach(category => {
                tBody.innerHTML += `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td>
                            <button onclick="editCategory(${category.id})" class="btn btn-primary"><i class="bi bi-pen"></i></button>
                            <button onclick="deleteCategory(${category.id})" class="btn btn-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

function addCategory() {
    const categoryName = prompt("Enter the name of the new brand:");
    if (categoryName) {
        fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: categoryName
                })
            })
            .then(response => response.json())
            .then(() => {
                populateCategoryTable();
            })
            .catch(error => console.error('Error:', error));
    }
}

function editCategory(categoryId) {
    const newName = prompt("Enter the new name of the category:");
    if (newName) {
        fetch(`/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName
                })
            })
            .then(response => response.json())
            .then(() => {
                populateCategoryTable();
            })
            .catch(error => console.error('Error:', error));
    }
}

function deleteCategory(categoryId) {
    fetch(`/categories/${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message);
                });
            }
            return response.json();
        })
        .then(() => {
            populateCategoryTable();
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
}
document.addEventListener('DOMContentLoaded', populateCategoryTable);