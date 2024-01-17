function populateBrandTable() {
    fetch('/brands')
        .then(response => response.json())
        .then(brands => {
            const tBody = document.getElementById('brandsTable').querySelector('tbody');
            tBody.innerHTML = '';

            brands.forEach(brand => {
                tBody.innerHTML += `
                    <tr>
                        <td>${brand.id}</td>
                        <td>${brand.name}</td>
                        <td>
                            <button onclick="editBrand(${brand.id})" class="btn btn-primary"><i class="bi bi-pen"></i></button>
                            <button onclick="deleteBrand(${brand.id})" class="btn btn-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

function addBrand() {
    const brandName = prompt("Enter the name of the new brand:");
    if (brandName) {
        fetch('/brands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: brandName })
        })
        .then(response => response.json())
        .then(() => {
            populateBrandTable();
        })
        .catch(error => {
            alert('Error: ' + error.message, 'danger');
        });
    }
}

function editBrand(brandId) {
    const newName = prompt("Enter the new name of the brand:");
    if (newName) {
        fetch(`/brands/${brandId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName })
        })
        .then(response => response.json())
        .then(() => {
            populateBrandTable();
        })
        .catch(error => console.error('Error:', error));
    }
}

function deleteBrand(brandId) {
    fetch(`/brands/${brandId}`, {
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
        populateBrandTable();
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', populateBrandTable);