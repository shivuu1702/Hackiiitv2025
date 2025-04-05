// public/js/login.js - Handle login form submission

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect to home page
            window.location.href = '/';
          } else {
            // Display error message
            alert(data.msg || 'Login failed. Please check your credentials.');
          }
        } catch (err) {
          console.error('Login error:', err);
          alert('An error occurred during login. Please try again.');
        }
      });
    }
    
    // Check if user is logged in
    function checkAuth() {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Update UI for logged-in state
        document.querySelectorAll('.login-button').forEach(button => {
          button.textContent = 'My Account';
          button.href = '/profile.html';
        });
        
        // Fetch user data
        fetch('/api/auth/user', {
          headers: {
            'x-auth-token': token
          }
        })
        .then(res => res.json())
        .then(user => {
          // You can update UI with user info here
          console.log('Logged in as:', user.name);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          // If token is invalid, clear it
          if (err.status === 401) {
            localStorage.removeItem('token');
          }
        });
      }
    }
    
    // Check auth status when page loads
    checkAuth();
  });