function adminLogin() {
        const identifier = $('#identifier').val();
        const password = $('#password').val();

        fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token && data.isAdmin) {
                    window.location.href = '/admin/products';
                } else if (data.token && !data.isAdmin) {
                    alert('Only for admins');
                } else {
                    alert(data.message || 'Login failed.');
                }
            })
            .catch(error => {
                alert('Login failed: ' + error.message);
            });
        }

        // Allowing enter button to submit login form
        document.getElementById('identifier').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                adminLogin();
            }
        });
        document.getElementById('password').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                adminLogin();
            }
        });