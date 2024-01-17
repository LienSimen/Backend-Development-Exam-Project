function populateOrderTable() {
    fetch('/orders/all')
        .then(response => response.json())
        .then(orders => {
            const tBody = document.getElementById('ordersTable').querySelector('tbody');
            tBody.innerHTML = '';

            orders.forEach(order => {
                const statusDropdown = `
                    <select onchange="updateOrderStatus(${order.orderId}, this.value)">
                        <option value="In Progress" ${order.orderStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Ordered" ${order.orderStatus === 'Ordered' ? 'selected' : ''}>Ordered</option>
                        <option value="Completed" ${order.orderStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                `;

                tBody.innerHTML += `
                    <tr>
                        <td>${order.orderId}</td>
                        <td>${order.OrderNumber}</td>
                        <td>${order.createdAt}</td>
                        <td>${order.updatedAt}</td>
                        <td>${order.userId}</td>
                        <td>${statusDropdown}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

function updateOrderStatus(orderId, newStatus) {
    fetch(`/orders/status/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus
            })
        })
        .then(response => response.json())
        .catch(error => console.error('Error updating order status:', error));
}

document.addEventListener('DOMContentLoaded', populateOrderTable);