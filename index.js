let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch and load products
fetch("db.json")
    .then((response) => response.json())
    .then((datas) => {
        allProducts = datas;
        filteredProducts = [...allProducts];
        displayProducts();
    })
    .catch((error) => console.error("Error fetching data:", error));

// Display products in grid and table
function displayProducts() {
    displayGridView();
    displayTableView();
    displayPagination();
}

// Display products in grid view (5 per row)
function displayGridView() {
    const productsGrid = document.getElementById("productsGrid");
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = paginatedProducts.map(data => `
        <div class="col">
            <div class="card product-card">
                <img src="${data.images[0]}" class="card-img-top product-image" alt="${data.title}" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                <div class="card-body">
                    <h6 class="card-title text-truncate" title="${data.title}">
                        ${data.title}
                    </h6>
                    <p class="card-text text-muted small" style="height: 60px; overflow: hidden;">
                        ${data.description.substring(0, 80)}...
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-tag">$${data.price}</span>
                        <span class="badge bg-secondary">${data.category.name}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

// Display products in table view
function displayTableView() {
    const productsTable = document.getElementById("productsTable");
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsTable.innerHTML = paginatedProducts.map(data => `
        <tr>
            <td>${data.id}</td>
            <td>
                <img src="${data.images[0]}" alt="${data.title}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            </td>
            <td>${data.title}</td>
            <td style="max-width: 300px;">
                <small>${data.description.substring(0, 100)}...</small>
            </td>
            <td>
                <span class="badge bg-info">${data.category.name}</span>
            </td>
            <td><strong class="text-danger">$${data.price}</strong></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${data.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${data.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

// Search function using onChange
function handleSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    if (searchTerm === "") {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1; // Reset to first page
    displayProducts();
}

// Sort products
function sortProducts(type, order) {
    if (type === 'name') {
        filteredProducts.sort((a, b) => {
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            
            if (order === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    } else if (type === 'price') {
        filteredProducts.sort((a, b) => {
            if (order === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }
    
    displayProducts();
}

// Edit product (placeholder)
function editProduct(id) {
    alert(`Chỉnh sửa sản phẩm ID: ${id}`);
}

// Delete product (placeholder)
function deleteProduct(id) {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm ID: ${id}?`)) {
        filteredProducts = filteredProducts.filter(p => p.id !== id);
        allProducts = allProducts.filter(p => p.id !== id);
        displayProducts();
    }
}

// Display pagination
function displayPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginationHTML = generatePaginationHTML(totalPages);
    
    document.getElementById("paginationGrid").innerHTML = paginationHTML;
    document.getElementById("paginationTable").innerHTML = paginationHTML;
}

// Generate pagination HTML
function generatePaginationHTML(totalPages) {
    if (totalPages <= 1) return '';
    
    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="bi bi-chevron-left"></i> Trước
            </a>
        </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        html += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
            </li>
        `;
        if (startPage > 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        html += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                Sau <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    return html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}