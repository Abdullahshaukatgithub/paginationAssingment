
const form = document.getElementById('recordForm');
const tableBody = document.getElementById('recordTable').querySelector('tbody');
const editIndexInput = document.getElementById('editIndex');
const searchInput = document.getElementById('searchInput');

let currentPage = 1;
const recordsPerPage = 8;

function fetchRecords() {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    displayRecords();
}

function saveRecord(records) {
    localStorage.setItem('records', JSON.stringify(records));
}

function addRow(record, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${record.firstName}</td>
        <td>${record.lastName}</td>
        <td>${record.email}</td>
        <td>${record.phoneNumber}</td>
        <td>
            <button onclick="editRecord(${index})">Edit</button>
            <button onclick="deleteRecord(${index})">Delete</button>
            <button onclick="duplicateRecord(${index})">Duplicate</button>
        </td>
    `;
    tableBody.appendChild(row);
}

function displayRecords() {
    const searchTerm = searchInput.value.toLowerCase();
    const records = JSON.parse(localStorage.getItem('records')) || [];
    
    const filteredRecords = records.filter(record =>
        record.firstName.toLowerCase().includes(searchTerm) ||
        record.lastName.toLowerCase().includes(searchTerm) ||
        record.email.toLowerCase().includes(searchTerm) ||
        record.phoneNumber.toLowerCase().includes(searchTerm)
    );
    
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    paginatedRecords.forEach((record, index) => {
        addRow(record, startIndex + index);
    });

    const footer = document.querySelector('.footer span');
    footer.textContent = `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredRecords.length)} of ${filteredRecords.length} Entries`;

    updatePaginationButtons(filteredRecords.length);
}

function updatePaginationButtons(totalRecords) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const paginationContainer = document.querySelector('.index_button');
    
    paginationContainer.innerHTML = '';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        displayRecords();
    });
    paginationContainer.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayRecords();
        });
        paginationContainer.appendChild(pageButton);
    }
    
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        displayRecords();
    });
    paginationContainer.appendChild(nextButton);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const index = parseInt(editIndexInput.value, 10);

    let records = JSON.parse(localStorage.getItem('records')) || [];

    if (index == -1) {
        records.push({ firstName, lastName, email, phoneNumber });
    } else {
        records[index] = { firstName, lastName, email, phoneNumber };
        editIndexInput.value = -1;
    }

    saveRecord(records);
    displayRecords();
    form.reset();
});

function editRecord(index) {
    const records = JSON.parse(localStorage.getItem('records'));
    const record = records[index];
    document.getElementById('firstName').value = record.firstName;
    document.getElementById('lastName').value = record.lastName;
    document.getElementById('email').value = record.email;
    document.getElementById('phoneNumber').value = record.phoneNumber;
    editIndexInput.value = index;
}

function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem('records'));
    records.splice(index, 1);
    saveRecord(records);
    displayRecords();
}

function duplicateRecord(index) {
    const records = JSON.parse(localStorage.getItem('records'));
    const record = records[index];
    records.push({ ...record });
    saveRecord(records);
    displayRecords();
}

searchInput.addEventListener('input', displayRecords);

document.addEventListener('DOMContentLoaded', () => {
    fetchRecords();
});



