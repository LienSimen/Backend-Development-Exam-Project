function populateProductsTable(products) {
    // Get the table body element
    const tBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    // Clear any existing rows
    tBody.innerHTML = '';
    // Iterate over each product to create a row for it in the table
    products.forEach(product => {
        // Adding the toggle switch for the delete column
        const toggleDelete = `<label class="switch">
        <input type="checkbox" ${product.isDeleted ? "checked" : "" } onclick="toggleDelete(${product.productId}, this)">
        <span class="slider round"></span>
        </label>`;
        // Set image and if no image url given display "no image"
        const image = product.imgURL ? `<img src="${product.imgURL}" alt="${product.name}" height="50">` : 'No image';

        const editButton = `<button onclick="editProduct(${product.productId})" class="btn btn-primary"><i class="bi bi-pen"></i></button>`;
        const deleteButton = `<button onclick="toggleDelete(${product.productId})" class="btn btn-danger"><i class="bi bi-trash"></i></button>`;

        const row = `<tr>
            <td>${product.productId}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${product.brandName}</td>
            <td>${product.categoryName}</td>
            <td>${product.imgURL}</td>
            <td>${image}</td>
            <td>${toggleDelete}</td>
            <td>${product.createdAt}</td>
            <td>${editButton} ${deleteButton}</td>
        </tr>`;
        tBody.innerHTML += row;
    });
}

// When page fully loaded, fetch products and populate the table
document.addEventListener('DOMContentLoaded', function() {
    fetch('/products')
        .then(response => response.json())
        .then(data => populateProductsTable(data));
    // Populating the dropdowns with the brands and categories from the database
    populateDropdowns('/brands', 'brandName');
    populateDropdowns('/categories', 'categoryName');
});

// Categories and brands dropdowns function
function populateDropdowns(endpoint, selectId, selectedValue = null) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Get the dropdown element by its ID
            const select = document.getElementById(selectId);
            // Adding a None field for the search function dropdowns
            select.innerHTML = '<option value="">None</option>';
            // Adding the options to the dropdown from the database
            data.forEach(item => {
                const option = new Option(item.name, item.id);
                select.add(option);
            });
            // Setting the selected value if given
            if (selectedValue) {
                select.value = selectedValue;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function addProduct() {
    // Clear existing values in the modal
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-isDeleted').checked = false;

    // Populate dropdowns
    populateDropdowns('/brands', 'product-brand');
    populateDropdowns('/categories', 'product-category');

    // Show the modal
    $('#productModal').modal('show');
}

function handleSearch() {
    // Getting the values from the search fields
    const productName = document.getElementById('productName').value;
    const categorySelect = document.getElementById('categoryName');
    const brandSelect = document.getElementById('brandName');
    // Get selected category and brand names and set it to an empty string if none is selected
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text === 'None' ? '' : categorySelect.options[categorySelect.selectedIndex].text;
    const brandName = brandSelect.options[brandSelect.selectedIndex].text === 'None' ? '' : brandSelect.options[brandSelect.selectedIndex].text;

    fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName,
                categoryName,
                brandName
            })
        })
        .then(response => response.json())
        .then(data => populateProductsTable(data.items))
        .catch(error => console.error('Search error:', error));
}

// Clearing the search fields and repopulating tables
function clearSearch() {
    document.getElementById('productName').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('brandName').value = '';

    fetch('/products')
        .then(response => response.json())
        .then(data => populateProductsTable(data))
        .catch(error => console.error('Cannot retrieve products', error));
}

// Submitting the modal add or edit product forms
function submitProduct() {
    // Collect data for the form fields
    const productData = {
        id: document.getElementById('product-id').value,
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        quantity: parseInt(document.getElementById('product-quantity').value),
        price: parseFloat(document.getElementById('product-price').value),
        brandId: parseInt(document.getElementById('product-brand').value),
        categoryId: parseInt(document.getElementById('product-category').value),
        imgURL: document.getElementById('product-image').value,
        isDeleted: document.getElementById('product-isDeleted').checked
    };
    // Determine if we are adding or editing
    const method = productData.id ? 'PUT' : 'POST';
    const endpoint = productData.id ? `/products/${productData.id}` : '/products';

    // Send request to the add or update endpoint
    fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => response.json())
        .then(() => {
            $('#productModal').modal('hide');
            // Repopulate the table
            fetch('/products')
                .then(response => response.json())
                .then(updatedProducts => populateProductsTable(updatedProducts));
        })
        .catch(error => console.error('Error saving product:', error));
}

function editProduct(productId) {
    fetch(`/products/${productId}`)
        .then(response => response.json())
        // Filling in the modal with the products details for the edit button.
        .then(product => {
            document.getElementById('product-id').value = product.productId;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-quantity').value = product.quantity;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.imgURL;
            document.getElementById('product-isDeleted').checked = product.isDeleted;

            populateDropdowns('/brands', 'product-brand', product.brandId);
            populateDropdowns('/categories', 'product-category', product.categoryId);

            $('#productModal').modal('show');
        })
        .catch(error => console.error('Error fetching product details:', error));
}
// Function for the delete switch
function toggleDelete(productId) {
    fetch(`/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Toggle the isDeleted status
            const newStatus = !product.isDeleted;
            return fetch(`/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isDeleted: newStatus
                })
            });
        })
        .then(response => response.json())
        .then(() => {
            return fetch('/products');
        })
        .then(response => response.json())
        .then(updatedProducts => populateProductsTable(updatedProducts))
        .catch(error => console.error('Error toggling delete status:', error));
}

// Bind enter key to search button
document.getElementById('productName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});