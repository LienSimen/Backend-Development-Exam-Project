function populateRolesTable() {
    fetch('/roles')
        .then(response => response.json())
        .then(roles => {
            const tBody = document.getElementById('rolesTable').querySelector('tbody');
            tBody.innerHTML = '';

            roles.forEach(role => {
                tBody.innerHTML += `
                    <tr>
                        <td>${role.id}</td>
                        <td>${role.name}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', populateRolesTable);