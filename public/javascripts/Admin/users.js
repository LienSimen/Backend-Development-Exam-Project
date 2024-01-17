function populateUsersTable() {
  fetch('/users')
      .then(response => response.json())
      .then(users => {
          const tBody = document.getElementById('usersTable').querySelector('tbody');
          tBody.innerHTML = '';

          users.forEach(user => {
              tBody.innerHTML += `
                  <tr>
                      <td>${user.userId}</td>
                      <td>${user.username}</td> 
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.address}</td>
                      <td>${user.telephoneNumber}</td>
                      <td>${user.email}</td>
                      <td>${user.Role.name}</td>
                      <td>${user.MembershipStatus.statusName}</td>
                      <td>
                          <button onclick="editUser(${user.userId})" class="btn btn-primary"><i class="bi bi-pen"></i></button>
                      </td>
                  </tr>
              `;
          });
      })
      .catch(error => console.error('Error:', error));
}

function editUser(userId) {
  fetch(`/users/${userId}`)
      .then(response => response.json())
      .then(user => {
          document.getElementById('edit-userId').value = user.userId;
          document.getElementById('edit-firstName').value = user.firstName;
          document.getElementById('edit-lastName').value = user.lastName;
          document.getElementById('edit-email').value = user.email;
          document.getElementById('edit-address').value = user.address;
          document.getElementById('edit-telephone').value = user.telephoneNumber;

          populateDropdowns('/roles', 'edit-role', user.roleId);
          $('#editUserModal').modal('show');
      })
      .catch(error => console.error('Error:', error));
}

function submitUserEdit() {
  const userId = document.getElementById('edit-userId').value;
  const updatedDetails = {
      firstName: document.getElementById('edit-firstName').value,
      lastName: document.getElementById('edit-lastName').value,
      email: document.getElementById('edit-email').value,
      roleId: document.getElementById('edit-role').value,
      address: document.getElementById('edit-address').value,
      telephoneNumber: document.getElementById('edit-telephone').value,
  };

  fetch(`/users/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDetails)
      })
      .then(response => response.json())
      .then(() => {
          $('#editUserModal').modal('hide');
          populateUsersTable();
      })
      .catch(error => console.error('Error:', error));
}

function populateDropdowns(endpoint, selectId, selectedValue = null) {
  fetch(endpoint)
      .then(response => response.json())
      .then(data => {
          const select = document.getElementById(selectId);
          select.innerHTML = '';

          data.forEach(item => {
              const option = new Option(item.name, item.id);
              select.add(option);
          });

          if (selectedValue) {
              select.value = selectedValue;
          }
      })
      .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', populateUsersTable);