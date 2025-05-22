// DOM Elements
const userForm = document.getElementById('user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const usersTableBody = document.getElementById('users-tbody');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const toast = document.getElementById('toast');

// Global variables
let isEditing = false;
let editingUserId = null;

// API Base URL
const API_BASE = '/api/users';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Form submission handler
    userForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel button handler
    cancelBtn.addEventListener('click', resetForm);
});

// Load all users
async function loadUsers() {
    try {
        showLoading(true);
        hideError();
        
        const response = await fetch(API_BASE);
        const users = await response.json();
        
        if (!response.ok) {
            throw new Error(users.error || 'Failed to load users');
        }
        
        displayUsers(users);
        
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Failed to load users. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Display users in table
function displayUsers(users) {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <h3>No users found</h3>
                    <p>Add your first user using the form above.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = createUserRow(user);
        usersTableBody.appendChild(row);
    });
}

// Create a user table row
function createUserRow(user) {
    const row = document.createElement('tr');
    const createdAt = new Date(user.created_at).toLocaleDateString();
    
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${escapeHtml(user.name)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${createdAt}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" onclick="editUser(${user.id}, '${escapeHtml(user.name)}', '${escapeHtml(user.email)}')">
                    Edit
                </button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!name || !email) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = isEditing ? 'Updating...' : 'Adding...';
        
        if (isEditing) {
            await updateUser(editingUserId, { name, email });
        } else {
            await createUser({ name, email });
        }
        
        resetForm();
        loadUsers();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast(error.message || 'An error occurred', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? 'Update User' : 'Add User';
    }
}

// Create new user
async function createUser(userData) {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
    }
    
    showToast('User created successfully!', 'success');
    return result;
}

// Update existing user
async function updateUser(id, userData) {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
    }
    
    showToast('User updated successfully!', 'success');
    return result;
}

// Edit user - populate form
function editUser(id, name, email) {
    isEditing = true;
    editingUserId = id;
    
    nameInput.value = name;
    emailInput.value = email;
    
    formTitle.textContent = 'Edit User';
    submitBtn.textContent = 'Update User';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete user');
        }
        
        showToast('User deleted successfully!', 'success');
        loadUsers();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast(error.message || 'Failed to delete user', 'error');
    }
}

// Reset form to default state
function resetForm() {
    isEditing = false;
    editingUserId = null;
    
    userForm.reset();
    formTitle.textContent = 'Add New User';
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
}

// Show/hide loading indicator
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
}

// Show/hide error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}