// API Configuration - Using Mock Data since backend is not responding
const USE_MOCK_DATA = true; // Set to false when you have a real backend
const API_BASE_URL = 'https://hotel-management-7-9x9s.onrender.com';

// Global State
let state = {
    rooms: [],
    guests: [],
    bookings: [],
    editingRoom: null,
    editingGuest: null,
    editingBooking: null,
    filteredRooms: [],
    filteredGuests: [],
    filteredBookings: []
};

// DOM Elements
const elements = {};

// Initialize DOM elements after page loads
function initializeElements() {
    // Sections
    elements.roomsSection = document.getElementById('roomsSection');
    elements.guestsSection = document.getElementById('guestsSection');
    elements.bookingsSection = document.getElementById('bookingsSection');
    
    // Lists
    elements.roomsList = document.getElementById('roomsList');
    elements.guestsList = document.getElementById('guestsList');
    elements.bookingsList = document.getElementById('bookingsList');
    
    // Forms
    elements.roomForm = document.getElementById('roomForm');
    elements.roomFormElement = document.getElementById('roomFormElement');
    elements.roomFormTitle = document.getElementById('roomFormTitle');
    
    elements.guestForm = document.getElementById('guestForm');
    elements.guestFormElement = document.getElementById('guestFormElement');
    elements.guestFormTitle = document.getElementById('guestFormTitle');
    
    elements.bookingForm = document.getElementById('bookingForm');
    elements.bookingFormElement = document.getElementById('bookingFormElement');
    elements.bookingFormTitle = document.getElementById('bookingFormTitle');
    
    // Error and Loading
    elements.errorBanner = document.getElementById('errorBanner');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.successBanner = document.getElementById('successBanner');
    elements.successMessage = document.getElementById('successMessage');
    elements.loading = document.getElementById('loading');
    
    // Modal
    elements.confirmationModal = document.getElementById('confirmationModal');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalMessage = document.getElementById('modalMessage');
    elements.modalConfirm = document.getElementById('modalConfirm');
    elements.modalCancel = document.getElementById('modalCancel');
    
    // Stats
    elements.totalRooms = document.getElementById('totalRooms');
    elements.totalGuests = document.getElementById('totalGuests');
    elements.totalBookings = document.getElementById('totalBookings');
    elements.availableRooms = document.getElementById('availableRooms');
    elements.occupiedRooms = document.getElementById('occupiedRooms');
    elements.activeGuests = document.getElementById('activeGuests');
    elements.todayRevenue = document.getElementById('todayRevenue');
}

// MOCK DATA SERVICE
const mockDataService = {
    // Initialize with sample data
    rooms: JSON.parse(localStorage.getItem('mockRooms')) || [
        {
            _id: '1',
            number: '101',
            type: 'single',
            price: 100,
            capacity: 1,
            status: 'available',
            amenities: ['WiFi', 'TV', 'AC']
        },
        {
            _id: '2',
            number: '102',
            type: 'double',
            price: 150,
            capacity: 2,
            status: 'occupied',
            amenities: ['WiFi', 'TV', 'AC', 'Mini Bar']
        },
        {
            _id: '3',
            number: '201',
            type: 'deluxe',
            price: 250,
            capacity: 3,
            status: 'available',
            amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony']
        }
    ],
    
    guests: JSON.parse(localStorage.getItem('mockGuests')) || [
        {
            _id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, New York, NY',
            nationality: 'American'
        },
        {
            _id: '2',
            name: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            phone: '+1 (555) 987-6543',
            address: '456 Oak Ave, Los Angeles, CA',
            nationality: 'Spanish'
        }
    ],
    
    bookings: JSON.parse(localStorage.getItem('mockBookings')) || [
        {
            _id: '1',
            guestId: '1',
            roomId: '2',
            checkIn: new Date(Date.now() + 86400000).toISOString(),
            checkOut: new Date(Date.now() + 259200000).toISOString(),
            status: 'checked-in',
            totalPrice: 450,
            notes: 'Early check-in requested'
        }
    ],

    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Rooms
    async getRooms() {
        await this.delay();
        return this.rooms;
    },

    async createRoom(roomData) {
        await this.delay();
        const newRoom = {
            _id: Date.now().toString(),
            ...roomData,
            createdAt: new Date().toISOString()
        };
        this.rooms.push(newRoom);
        localStorage.setItem('mockRooms', JSON.stringify(this.rooms));
        return newRoom;
    },

    async updateRoom(id, roomData) {
        await this.delay();
        const index = this.rooms.findIndex(room => room._id === id);
        if (index !== -1) {
            this.rooms[index] = { ...this.rooms[index], ...roomData };
            localStorage.setItem('mockRooms', JSON.stringify(this.rooms));
            return this.rooms[index];
        }
        throw new Error('Room not found');
    },

    async deleteRoom(id) {
        await this.delay();
        const index = this.rooms.findIndex(room => room._id === id);
        if (index !== -1) {
            this.rooms.splice(index, 1);
            localStorage.setItem('mockRooms', JSON.stringify(this.rooms));
            return { message: 'Room deleted successfully' };
        }
        throw new Error('Room not found');
    },

    // Guests
    async getGuests() {
        await this.delay();
        return this.guests;
    },

    async createGuest(guestData) {
        await this.delay();
        const newGuest = {
            _id: Date.now().toString(),
            ...guestData,
            createdAt: new Date().toISOString()
        };
        this.guests.push(newGuest);
        localStorage.setItem('mockGuests', JSON.stringify(this.guests));
        return newGuest;
    },

    async updateGuest(id, guestData) {
        await this.delay();
        const index = this.guests.findIndex(guest => guest._id === id);
        if (index !== -1) {
            this.guests[index] = { ...this.guests[index], ...guestData };
            localStorage.setItem('mockGuests', JSON.stringify(this.guests));
            return this.guests[index];
        }
        throw new Error('Guest not found');
    },

    async deleteGuest(id) {
        await this.delay();
        const index = this.guests.findIndex(guest => guest._id === id);
        if (index !== -1) {
            this.guests.splice(index, 1);
            localStorage.setItem('mockGuests', JSON.stringify(this.guests));
            return { message: 'Guest deleted successfully' };
        }
        throw new Error('Guest not found');
    },

    // Bookings
    async getBookings() {
        await this.delay();
        // Populate guest and room data for bookings
        return this.bookings.map(booking => ({
            ...booking,
            guestId: this.guests.find(g => g._id === booking.guestId) || booking.guestId,
            roomId: this.rooms.find(r => r._id === booking.roomId) || booking.roomId
        }));
    },

    async createBooking(bookingData) {
        await this.delay();
        const newBooking = {
            _id: Date.now().toString(),
            ...bookingData,
            createdAt: new Date().toISOString()
        };
        this.bookings.push(newBooking);
        localStorage.setItem('mockBookings', JSON.stringify(this.bookings));
        return newBooking;
    },

    async updateBooking(id, bookingData) {
        await this.delay();
        const index = this.bookings.findIndex(booking => booking._id === id);
        if (index !== -1) {
            this.bookings[index] = { ...this.bookings[index], ...bookingData };
            localStorage.setItem('mockBookings', JSON.stringify(this.bookings));
            return this.bookings[index];
        }
        throw new Error('Booking not found');
    },

    async deleteBooking(id) {
        await this.delay();
        const index = this.bookings.findIndex(booking => booking._id === id);
        if (index !== -1) {
            this.bookings.splice(index, 1);
            localStorage.setItem('mockBookings', JSON.stringify(this.bookings));
            return { message: 'Booking deleted successfully' };
        }
        throw new Error('Booking not found');
    }
};

// REAL API Service (for when you have a backend)
const apiService = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config = {
            method: options.method || 'GET',
            headers: headers,
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            console.log(`Making ${config.method} request to: ${url}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            if (config.method === 'DELETE' && response.status === 200) {
                return { message: 'Deleted successfully' };
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else if (response.status === 200 || response.status === 201) {
                return { success: true };
            } else {
                const text = await response.text();
                return text || { success: true };
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error(`Network error: ${error.message}`);
        }
    },

    // Rooms
    async getRooms() {
        return this.request('/rooms');
    },

    async createRoom(roomData) {
        return this.request('/rooms', {
            method: 'POST',
            body: roomData
        });
    },

    async updateRoom(id, roomData) {
        return this.request(`/rooms/${id}`, {
            method: 'PUT',
            body: roomData
        });
    },

    async deleteRoom(id) {
        return this.request(`/rooms/${id}`, {
            method: 'DELETE'
        });
    },

    // Guests
    async getGuests() {
        return this.request('/guests');
    },

    async createGuest(guestData) {
        return this.request('/guests', {
            method: 'POST',
            body: guestData
        });
    },

    async updateGuest(id, guestData) {
        return this.request(`/guests/${id}`, {
            method: 'PUT',
            body: guestData
        });
    },

    async deleteGuest(id) {
        return this.request(`/guests/${id}`, {
            method: 'DELETE'
        });
    },

    // Bookings
    async getBookings() {
        return this.request('/bookings');
    },

    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: bookingData
        });
    },

    async updateBooking(id, bookingData) {
        return this.request(`/bookings/${id}`, {
            method: 'PUT',
            body: bookingData
        });
    },

    async deleteBooking(id) {
        return this.request(`/bookings/${id}`, {
            method: 'DELETE'
        });
    }
};

// Use mock data service if real API is not available
const activeService = USE_MOCK_DATA ? mockDataService : apiService;

// UI Utilities
const uiUtils = {
    showLoading() {
        if (elements.loading) elements.loading.classList.remove('hidden');
    },

    hideLoading() {
        if (elements.loading) elements.loading.classList.add('hidden');
    },

    showError(message) {
        if (elements.errorMessage && elements.errorBanner) {
            elements.errorMessage.textContent = message;
            elements.errorBanner.classList.remove('hidden');
            setTimeout(() => this.hideError(), 5000);
        }
    },

    hideError() {
        if (elements.errorBanner) elements.errorBanner.classList.add('hidden');
    },

    showSuccess(message) {
        if (elements.successMessage && elements.successBanner) {
            elements.successMessage.textContent = message;
            elements.successBanner.classList.remove('hidden');
            setTimeout(() => this.hideSuccess(), 3000);
        }
    },

    hideSuccess() {
        if (elements.successBanner) elements.successBanner.classList.add('hidden');
    },

    showModal(title, message, onConfirm) {
        if (elements.modalTitle && elements.modalMessage && elements.confirmationModal) {
            elements.modalTitle.textContent = title;
            elements.modalMessage.textContent = message;
            elements.confirmationModal.classList.remove('hidden');
            
            elements.modalConfirm.onclick = () => {
                onConfirm();
                this.hideModal();
            };
            
            elements.modalCancel.onclick = () => {
                this.hideModal();
            };
        }
    },

    hideModal() {
        if (elements.confirmationModal) elements.confirmationModal.classList.add('hidden');
    },

    clearFormErrors(formPrefix) {
        const errorElements = document.querySelectorAll(`[id$="Error"]`);
        errorElements.forEach(element => {
            if (element.id.startsWith(formPrefix)) {
                element.textContent = '';
                const inputId = element.id.replace('Error', '');
                const input = document.getElementById(inputId);
                if (input) input.classList.remove('error');
            }
        });
    },

    showFormErrors(errors, formPrefix) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${formPrefix}${field.charAt(0).toUpperCase() + field.slice(1)}Error`);
            const inputElement = document.getElementById(`${formPrefix}${field.charAt(0).toUpperCase() + field.slice(1)}`);
            
            if (errorElement && inputElement) {
                errorElement.textContent = errors[field];
                inputElement.classList.add('error');
            }
        });
    },

    updateDashboardStats() {
        if (!state.rooms || !state.guests || !state.bookings) return;

        const totalRooms = state.rooms.length;
        const availableRooms = state.rooms.filter(room => room.status === 'available').length;
        const occupiedRooms = state.rooms.filter(room => room.status === 'occupied').length;
        
        const totalGuests = state.guests.length;
        const activeGuests = state.bookings.filter(booking => 
            booking.status === 'checked-in' || booking.status === 'confirmed'
        ).length;
        
        const totalBookings = state.bookings.length;
        const todayRevenue = state.bookings
            .filter(booking => {
                const today = new Date().toDateString();
                const checkIn = new Date(booking.checkIn).toDateString();
                return checkIn === today && booking.totalPrice;
            })
            .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        
        if (elements.totalRooms) elements.totalRooms.textContent = totalRooms;
        if (elements.totalGuests) elements.totalGuests.textContent = totalGuests;
        if (elements.totalBookings) elements.totalBookings.textContent = totalBookings;
        if (elements.availableRooms) elements.availableRooms.textContent = availableRooms;
        if (elements.occupiedRooms) elements.occupiedRooms.textContent = occupiedRooms;
        if (elements.activeGuests) elements.activeGuests.textContent = activeGuests;
        if (elements.todayRevenue) elements.todayRevenue.textContent = `$${todayRevenue.toFixed(2)}`;
    }
};

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section') || 
                           e.target.closest('.nav-link').getAttribute('data-section');
            
            if (!section) return;

            navLinks.forEach(nl => nl.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('active');
            });
            const targetSection = document.getElementById(`${section}Section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            hideAllForms();
        });
    });
}

function hideAllForms() {
    if (elements.roomForm) elements.roomForm.classList.add('hidden');
    if (elements.guestForm) elements.guestForm.classList.add('hidden');
    if (elements.bookingForm) elements.bookingForm.classList.add('hidden');
    state.editingRoom = null;
    state.editingGuest = null;
    state.editingBooking = null;
}

// Room Management
function showRoomForm(room = null) {
    state.editingRoom = room;
    if (elements.roomFormTitle) {
        elements.roomFormTitle.textContent = room ? 'Edit Room' : 'Add New Room';
    }
    if (elements.roomForm) {
        elements.roomForm.classList.remove('hidden');
    }
    
    if (room) {
        document.getElementById('roomNumber').value = room.number || '';
        document.getElementById('roomType').value = room.type || 'single';
        document.getElementById('roomPrice').value = room.price || '';
        document.getElementById('roomCapacity').value = room.capacity || '';
        document.getElementById('roomStatus').value = room.status || 'available';
        
        const amenities = room.amenities || [];
        document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
            checkbox.checked = amenities.includes(checkbox.value);
        });
    } else {
        if (elements.roomFormElement) elements.roomFormElement.reset();
        document.getElementById('roomStatus').value = 'available';
    }
    
    uiUtils.clearFormErrors('room');
}

function hideRoomForm() {
    if (elements.roomForm) elements.roomForm.classList.add('hidden');
    state.editingRoom = null;
}

async function handleRoomSubmit(e) {
    e.preventDefault();
    console.log('Room form submitted');
    
    const formData = new FormData(e.target);
    const roomData = {
        number: formData.get('number'),
        type: formData.get('type'),
        price: parseFloat(formData.get('price')),
        capacity: parseInt(formData.get('capacity')),
        status: formData.get('status')
    };

    const amenities = [];
    document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
        amenities.push(checkbox.value);
    });
    if (amenities.length > 0) {
        roomData.amenities = amenities;
    }

    const errors = {};
    if (!roomData.number || roomData.number.trim() === '') errors.number = 'Room number is required';
    if (!roomData.price || roomData.price <= 0) errors.price = 'Valid price is required';
    if (!roomData.capacity || roomData.capacity <= 0) errors.capacity = 'Valid capacity is required';

    if (Object.keys(errors).length > 0) {
        uiUtils.showFormErrors(errors, 'room');
        return;
    }

    try {
        uiUtils.showLoading();
        
        if (state.editingRoom) {
            await activeService.updateRoom(state.editingRoom._id, roomData);
            uiUtils.showSuccess('Room updated successfully!');
        } else {
            await activeService.createRoom(roomData);
            uiUtils.showSuccess('Room created successfully!');
        }
        
        await loadRooms();
        hideRoomForm();
    } catch (error) {
        uiUtils.showError(`Failed to save room: ${error.message}`);
    } finally {
        uiUtils.hideLoading();
    }
}

function deleteRoom(roomId) {
    uiUtils.showModal(
        'Delete Room',
        'Are you sure you want to delete this room? This action cannot be undone.',
        async () => {
            try {
                uiUtils.showLoading();
                await activeService.deleteRoom(roomId);
                await loadRooms();
                uiUtils.showSuccess('Room deleted successfully!');
            } catch (error) {
                uiUtils.showError(`Failed to delete room: ${error.message}`);
            } finally {
                uiUtils.hideLoading();
            }
        }
    );
}

function renderRooms() {
    if (!elements.roomsList) return;
    
    const roomsToRender = state.filteredRooms.length > 0 ? state.filteredRooms : state.rooms;
    
    if (!roomsToRender || roomsToRender.length === 0) {
        elements.roomsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-door-closed" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No Rooms Found</h3>
                <p>Get started by adding your first room</p>
            </div>
        `;
        return;
    }

    elements.roomsList.innerHTML = roomsToRender.map(room => {
        const amenities = room.amenities || [];
        const amenitiesDisplay = amenities.length > 0 
            ? amenities.slice(0, 3).join(', ') + (amenities.length > 3 ? '...' : '')
            : 'No amenities';
            
        return `
        <div class="card">
            <div class="card-header">
                <h4>Room ${room.number}</h4>
                <span class="status-badge status-${room.status}">${room.status}</span>
            </div>
            <div class="card-body">
                <p>
                    <strong>Type:</strong> 
                    <span>${room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</span>
                </p>
                <p>
                    <strong>Price:</strong> 
                    <span>$${room.price}/night</span>
                </p>
                <p>
                    <strong>Capacity:</strong> 
                    <span>${room.capacity} guests</span>
                </p>
                <p>
                    <strong>Amenities:</strong> 
                    <span>${amenitiesDisplay}</span>
                </p>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="showRoomForm(${escapeJson(room)})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-delete" onclick="deleteRoom('${room._id}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Guest Management
function showGuestForm(guest = null) {
    state.editingGuest = guest;
    if (elements.guestFormTitle) {
        elements.guestFormTitle.textContent = guest ? 'Edit Guest' : 'Add New Guest';
    }
    if (elements.guestForm) {
        elements.guestForm.classList.remove('hidden');
    }
    
    if (guest) {
        document.getElementById('guestName').value = guest.name || '';
        document.getElementById('guestEmail').value = guest.email || '';
        document.getElementById('guestPhone').value = guest.phone || '';
        document.getElementById('guestAddress').value = guest.address || '';
        document.getElementById('guestNationality').value = guest.nationality || '';
        document.getElementById('guestIdType').value = guest.idType || '';
        document.getElementById('guestIdNumber').value = guest.idNumber || '';
    } else {
        if (elements.guestFormElement) elements.guestFormElement.reset();
    }
    
    uiUtils.clearFormErrors('guest');
}

function hideGuestForm() {
    if (elements.guestForm) elements.guestForm.classList.add('hidden');
    state.editingGuest = null;
}

async function handleGuestSubmit(e) {
    e.preventDefault();
    console.log('Guest form submitted');
    
    const formData = new FormData(e.target);
    const guestData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        nationality: formData.get('nationality'),
        idType: formData.get('idType'),
        idNumber: formData.get('idNumber')
    };

    const errors = {};
    if (!guestData.name || guestData.name.trim() === '') errors.name = 'Name is required';
    if (!guestData.email || guestData.email.trim() === '') errors.email = 'Email is required';
    if (!guestData.phone || guestData.phone.trim() === '') errors.phone = 'Phone is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (guestData.email && !emailRegex.test(guestData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
        uiUtils.showFormErrors(errors, 'guest');
        return;
    }

    try {
        uiUtils.showLoading();
        
        if (state.editingGuest) {
            await activeService.updateGuest(state.editingGuest._id, guestData);
            uiUtils.showSuccess('Guest updated successfully!');
        } else {
            await activeService.createGuest(guestData);
            uiUtils.showSuccess('Guest created successfully!');
        }
        
        await loadGuests();
        hideGuestForm();
    } catch (error) {
        uiUtils.showError(`Failed to save guest: ${error.message}`);
    } finally {
        uiUtils.hideLoading();
    }
}

function deleteGuest(guestId) {
    uiUtils.showModal(
        'Delete Guest',
        'Are you sure you want to delete this guest? This action cannot be undone.',
        async () => {
            try {
                uiUtils.showLoading();
                await activeService.deleteGuest(guestId);
                await loadGuests();
                uiUtils.showSuccess('Guest deleted successfully!');
            } catch (error) {
                uiUtils.showError(`Failed to delete guest: ${error.message}`);
            } finally {
                uiUtils.hideLoading();
            }
        }
    );
}

function renderGuests() {
    if (!elements.guestsList) return;
    
    const guestsToRender = state.filteredGuests.length > 0 ? state.filteredGuests : state.guests;
    
    if (!guestsToRender || guestsToRender.length === 0) {
        elements.guestsList.innerHTML = '<tr><td colspan="5" class="no-data">No guests found</td></tr>';
        return;
    }

    elements.guestsList.innerHTML = guestsToRender.map(guest => `
        <tr>
            <td>
                <strong>${guest.name}</strong>
                ${guest.nationality ? `<br><small>${guest.nationality}</small>` : ''}
            </td>
            <td>
                <div>${guest.email}</div>
                <small>${guest.phone}</small>
            </td>
            <td>${guest.nationality || 'N/A'}</td>
            <td>
                <span class="status-badge status-available">Active</span>
            </td>
            <td class="actions">
                <button class="btn btn-edit" onclick="showGuestForm(${escapeJson(guest)})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-delete" onclick="deleteGuest('${guest._id}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Booking Management
function showBookingForm(booking = null) {
    state.editingBooking = booking;
    if (elements.bookingFormTitle) {
        elements.bookingFormTitle.textContent = booking ? 'Edit Booking' : 'Create New Booking';
    }
    
    populateGuestDropdown();
    populateRoomDropdown();
    
    if (booking) {
        document.getElementById('bookingGuest').value = booking.guestId?._id || booking.guestId || '';
        document.getElementById('bookingRoom').value = booking.roomId?._id || booking.roomId || '';
        document.getElementById('checkInDate').value = booking.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] : '';
        document.getElementById('checkOutDate').value = booking.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] : '';
        document.getElementById('bookingStatus').value = booking.status || 'confirmed';
        document.getElementById('totalPrice').value = booking.totalPrice || '';
        document.getElementById('bookingNotes').value = booking.notes || '';
    } else {
        if (elements.bookingFormElement) elements.bookingFormElement.reset();
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        document.getElementById('checkInDate').value = today;
        document.getElementById('checkOutDate').value = tomorrow;
        document.getElementById('bookingStatus').value = 'confirmed';
    }
    
    if (elements.bookingForm) {
        elements.bookingForm.classList.remove('hidden');
    }
    uiUtils.clearFormErrors('booking');
}

function hideBookingForm() {
    if (elements.bookingForm) elements.bookingForm.classList.add('hidden');
    state.editingBooking = null;
}

function populateGuestDropdown() {
    const select = document.getElementById('bookingGuest');
    if (!select) return;
    
    if (!state.guests || state.guests.length === 0) {
        select.innerHTML = '<option value="">No guests available</option>';
        return;
    }
    
    select.innerHTML = '<option value="">Select Guest</option>' +
        state.guests.map(guest => 
            `<option value="${guest._id}">${guest.name} - ${guest.email}</option>`
        ).join('');
}

function populateRoomDropdown() {
    const select = document.getElementById('bookingRoom');
    if (!select) return;
    
    if (!state.rooms || state.rooms.length === 0) {
        select.innerHTML = '<option value="">No rooms available</option>';
        return;
    }
    
    select.innerHTML = '<option value="">Select Room</option>' +
        state.rooms.map(room => 
            `<option value="${room._id}">Room ${room.number} - ${room.type} ($${room.price}/night)</option>`
        ).join('');
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    console.log('Booking form submitted');
    
    const formData = new FormData(e.target);
    const bookingData = {
        guestId: formData.get('guestId'),
        roomId: formData.get('roomId'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        status: formData.get('status'),
        notes: formData.get('notes')
    };

    const totalPrice = formData.get('totalPrice');
    if (totalPrice) {
        bookingData.totalPrice = parseFloat(totalPrice);
    }

    const errors = {};
    if (!bookingData.guestId) errors.guest = 'Guest is required';
    if (!bookingData.roomId) errors.room = 'Room is required';
    if (!bookingData.checkIn) errors.checkIn = 'Check-in date is required';
    if (!bookingData.checkOut) errors.checkOut = 'Check-out date is required';

    if (bookingData.checkIn && bookingData.checkOut) {
        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);
        
        if (checkOutDate <= checkInDate) {
            errors.checkOut = 'Check-out date must be after check-in date';
        }
    }

    if (Object.keys(errors).length > 0) {
        uiUtils.showFormErrors(errors, 'booking');
        return;
    }

    try {
        uiUtils.showLoading();
        
        if (state.editingBooking) {
            await activeService.updateBooking(state.editingBooking._id, bookingData);
            uiUtils.showSuccess('Booking updated successfully!');
        } else {
            await activeService.createBooking(bookingData);
            uiUtils.showSuccess('Booking created successfully!');
        }
        
        await loadBookings();
        hideBookingForm();
    } catch (error) {
        uiUtils.showError(`Failed to save booking: ${error.message}`);
    } finally {
        uiUtils.hideLoading();
    }
}

function deleteBooking(bookingId) {
    uiUtils.showModal(
        'Delete Booking',
        'Are you sure you want to delete this booking? This action cannot be undone.',
        async () => {
            try {
                uiUtils.showLoading();
                await activeService.deleteBooking(bookingId);
                await loadBookings();
                uiUtils.showSuccess('Booking deleted successfully!');
            } catch (error) {
                uiUtils.showError(`Failed to delete booking: ${error.message}`);
            } finally {
                uiUtils.hideLoading();
            }
        }
    );
}

function renderBookings() {
    if (!elements.bookingsList) return;
    
    const bookingsToRender = state.filteredBookings.length > 0 ? state.filteredBookings : state.bookings;
    
    if (!bookingsToRender || bookingsToRender.length === 0) {
        elements.bookingsList.innerHTML = '<p class="no-data">No bookings found</p>';
        return;
    }

    elements.bookingsList.innerHTML = bookingsToRender.map(booking => {
        const guestName = booking.guestId?.name || 'Unknown Guest';
        const roomNumber = booking.roomId?.number || 'Unknown Room';
        const checkIn = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A';
        const checkOut = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A';
        
        return `
        <div class="card">
            <div class="card-header">
                <h4>Booking #${booking._id ? booking._id.slice(-6) : 'N/A'}</h4>
                <span class="status-badge status-${booking.status}">${booking.status}</span>
            </div>
            <div class="card-body">
                <p><strong>Guest:</strong> ${guestName}</p>
                <p><strong>Room:</strong> ${roomNumber}</p>
                <p><strong>Check-in:</strong> ${checkIn}</p>
                <p><strong>Check-out:</strong> ${checkOut}</p>
                ${booking.totalPrice ? `<p><strong>Total Price:</strong> $${booking.totalPrice}</p>` : ''}
                ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="showBookingForm(${escapeJson(booking)})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-delete" onclick="deleteBooking('${booking._id}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Search and Filter Functions
function searchRooms() {
    const searchTerm = document.getElementById('roomSearch')?.value.toLowerCase() || '';
    state.filteredRooms = state.rooms.filter(room => 
        room.number.toLowerCase().includes(searchTerm) ||
        room.type.toLowerCase().includes(searchTerm) ||
        room.status.toLowerCase().includes(searchTerm)
    );
    renderRooms();
}

function searchGuests() {
    const searchTerm = document.getElementById('guestSearch')?.value.toLowerCase() || '';
    state.filteredGuests = state.guests.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm) ||
        guest.email.toLowerCase().includes(searchTerm) ||
        guest.phone.toLowerCase().includes(searchTerm) ||
        (guest.nationality && guest.nationality.toLowerCase().includes(searchTerm))
    );
    renderGuests();
}

function searchBookings() {
    const searchTerm = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
    state.filteredBookings = state.bookings.filter(booking => {
        const guestName = booking.guestId?.name || '';
        const roomNumber = booking.roomId?.number || '';
        return (
            guestName.toLowerCase().includes(searchTerm) ||
            roomNumber.toLowerCase().includes(searchTerm) ||
            booking.status.toLowerCase().includes(searchTerm)
        );
    });
    renderBookings();
}

function setupFilterButtons() {
    document.querySelectorAll('#roomsSection .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            document.querySelectorAll('#roomsSection .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (filter === 'all') {
                state.filteredRooms = [...state.rooms];
            } else {
                state.filteredRooms = state.rooms.filter(room => room.status === filter);
            }
            renderRooms();
        });
    });
    
    document.querySelectorAll('#bookingsSection .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            document.querySelectorAll('#bookingsSection .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (filter === 'all') {
                state.filteredBookings = [...state.bookings];
            } else {
                state.filteredBookings = state.bookings.filter(booking => booking.status === filter);
            }
            renderBookings();
        });
    });
}

// Data Loading
async function loadRooms() {
    try {
        state.rooms = await activeService.getRooms();
        state.filteredRooms = [...state.rooms];
        renderRooms();
        uiUtils.updateDashboardStats();
    } catch (error) {
        console.error('Error loading rooms:', error);
        state.rooms = [];
        state.filteredRooms = [];
        renderRooms();
        if (!USE_MOCK_DATA) {
            uiUtils.showError('Failed to load rooms. Please check your backend connection.');
        }
    }
}

async function loadGuests() {
    try {
        state.guests = await activeService.getGuests();
        state.filteredGuests = [...state.guests];
        renderGuests();
        uiUtils.updateDashboardStats();
    } catch (error) {
        console.error('Error loading guests:', error);
        state.guests = [];
        state.filteredGuests = [];
        renderGuests();
    }
}

async function loadBookings() {
    try {
        state.bookings = await activeService.getBookings();
        state.filteredBookings = [...state.bookings];
        renderBookings();
        uiUtils.updateDashboardStats();
    } catch (error) {
        console.error('Error loading bookings:', error);
        state.bookings = [];
        state.filteredBookings = [];
        renderBookings();
    }
}

async function loadAllData() {
    uiUtils.showLoading();
    try {
        await Promise.all([
            loadRooms(),
            loadGuests(),
            loadBookings()
        ]);
        if (USE_MOCK_DATA) {
            uiUtils.showSuccess('Demo data loaded successfully! Using mock data for demonstration.');
        }
    } catch (error) {
        if (!USE_MOCK_DATA) {
            uiUtils.showError('Failed to load data. Please check your backend connection.');
        }
    } finally {
        uiUtils.hideLoading();
    }
}

// Utility function to safely escape JSON for onclick
function escapeJson(obj) {
    if (!obj) return 'null';
    return JSON.stringify(obj).replace(/"/g, '&quot;').replace(/'/g, "\\'");
}

// Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    if (elements.roomFormElement) {
        elements.roomFormElement.addEventListener('submit', handleRoomSubmit);
    }
    if (elements.guestFormElement) {
        elements.guestFormElement.addEventListener('submit', handleGuestSubmit);
    }
    if (elements.bookingFormElement) {
        elements.bookingFormElement.addEventListener('submit', handleBookingSubmit);
    }
    
    if (elements.confirmationModal) {
        elements.confirmationModal.addEventListener('click', (e) => {
            if (e.target === elements.confirmationModal) {
                uiUtils.hideModal();
            }
        });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate) checkInDate.min = today;
    if (checkOutDate) checkOutDate.min = today;

    if (checkInDate && checkOutDate) {
        checkInDate.addEventListener('change', function() {
            checkOutDate.min = this.value;
        });
    }
}

// Initialize App
function init() {
    console.log('Initializing app...');
    console.log('Using mock data:', USE_MOCK_DATA);
    initializeElements();
    setupNavigation();
    setupEventListeners();
    setupFilterButtons();
    loadAllData();
    console.log('App initialized successfully');
}

// Make functions globally available
window.showRoomForm = showRoomForm;
window.hideRoomForm = hideRoomForm;
window.showGuestForm = showGuestForm;
window.hideGuestForm = hideGuestForm;
window.showBookingForm = showBookingForm;
window.hideBookingForm = hideBookingForm;
window.deleteRoom = deleteRoom;
window.deleteGuest = deleteGuest;
window.deleteBooking = deleteBooking;
window.hideError = uiUtils.hideError;
window.hideSuccess = uiUtils.hideSuccess;
window.searchRooms = searchRooms;
window.searchGuests = searchGuests;
window.searchBookings = searchBookings;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);