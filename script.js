
/* Biến DOM cần dùng */
   const searchInput = document.getElementById("searchInput");   // Ô nhập từ khóa tìm kiếm
   const searchBtn = document.getElementById("searchBtn");       // Nút "Tìm"
   const addProductBtn = document.getElementById("addProductBtn"); // Nút mở form thêm sản phẩm
   const addProductForm = document.getElementById("addProductForm"); // Form thêm sản phẩm
   const productList = document.querySelectorAll(".product");    // Danh sách tất cả sản phẩm
   
/* Xử lý sự kiện tìm kiếm */
searchBtn.addEventListener("click", function () {
    const keyword = searchInput.value.trim().toLowerCase(); // Lấy từ khóa tìm kiếm

    // ⚠️ Lấy lại danh sách sản phẩm mỗi lần tìm, để bao gồm cả sản phẩm mới thêm
    const allProducts = document.querySelectorAll(".product:not(.blank)");

    // Duyệt qua từng sản phẩm và kiểm tra tên
    allProducts.forEach(function (product) {
        const name = product.querySelector("h3")?.innerText.toLowerCase() || "";

        // So sánh với từ khóa
        if (name.includes(keyword) || keyword === "") {
            product.style.display = ""; // Hiện nếu trùng
        } else {
            product.style.display = "none"; // Ẩn nếu không trùng
        }
    });
});

/* Cho phép nhấn Enter để tìm */
searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
   /* Xử lý hiển thị form thêm sản phẩm */
   addProductBtn.addEventListener("click", function () {
       // Nếu form đang ẩn thì hiện lên, ngược lại thì ẩn đi
       if (addProductForm.style.display === "none" || addProductForm.style.display === "") {
           addProductForm.style.display = "block";
       } else {
           addProductForm.style.display = "none";
       }
   });

/* Tính năng thêm */

   function getProductRows() {
    // Hàng hợp lệ = .grid-container có .col8 chứa .product-list
    return Array.from(document.querySelectorAll('#products .grid-container'))
      .filter(row => row.querySelector(':scope > .col8 .product-list'));
  }
  
  /* Lấy product-list đầu tiên (hàng mẫu) và class card mẫu */
  function getTemplates() {
    const rows = getProductRows();
    const baseRow = rows[0];                                         // hàng mẫu
    if (!baseRow) return null;
  
    const baseList = baseRow.querySelector(':scope > .col8 .product-list');
    const sampleCard = baseList.querySelector('.product');           // card mẫu
    const productClass = sampleCard ? sampleCard.className : 'product col4';
  
    // clone hàng mẫu, rồi rút ruột product-list để dùng làm row mới
    const newRow = baseRow.cloneNode(true);
    const newList = newRow.querySelector(':scope > .col8 .product-list');
    while (newList.firstChild) newList.removeChild(newList.firstChild);
  
    return { baseRow, productClass, newRow, newList };
  }
  
  /* Tạo card sản phẩm mới từ class mẫu */
  function createProductCard(productClass, name, priceNumber, desc) {
    const card = document.createElement('article');
    card.className = productClass;                       // ví dụ "product col4"
    card.innerHTML = `
      <img class="product-image"
           src="https://placehold.co/616x353?text=${encodeURIComponent(name)}"
           alt="${name}">
      <h3 class="title-3">${name}</h3>
      <p class="text">${desc || 'New product added manually.'}</p>
      <p class="price">${Number(priceNumber).toLocaleString('en-US')} VNĐ</p>
    `;
    return card;
  }
  
  /* Tạo article trắng giữ chỗ (đúng class mẫu + thêm .blank) */
  function createBlank(productClass) {
    const blank = document.createElement('article');
    blank.className = productClass + ' blank';
    blank.innerHTML = `<div class="product-placeholder"></div>`;
    return blank;
  }
  
  /* ===== Submit form: validate + chèn đúng chỗ, đúng class ===== */
  addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('newName')?.value.trim() || '';
    const priceRaw = document.getElementById('newPrice')?.value.trim() || '';
    const desc = document.getElementById('newDesc')?.value.trim() || '';
  
    if (!name || !priceRaw) { alert('Please enter both product name and price!'); return; }
    const priceNumber = Number(priceRaw.replace(/[^\d]/g, ''));
    if (isNaN(priceNumber) || priceNumber <= 0) { alert('Price must be a valid number greater than 0!'); return; }
  
    const tpl = getTemplates();
    if (!tpl) { console.error('Cannot find products template'); return; }
  
    const { productClass } = tpl;
    const card = createProductCard(productClass, name, priceNumber, desc);
  
    // Xác định hàng cuối hợp lệ trong #products
    const rows = getProductRows();
    const lastRow = rows[rows.length - 1];
    const lastList = lastRow.querySelector(':scope > .col8 .product-list');
  
    // Có .blank -> thay thế cái đầu tiên
    const blanks = lastList.querySelectorAll('article.blank');
    if (blanks.length) {
      blanks[0].replaceWith(card);
    } else {
      const count = lastList.querySelectorAll('.product').length;
  
      //Đủ 3 thì tạo hàng mới bằng cách clone hàng mẫu
      if (count >= 3) {
        const { newRow, newList } = getTemplates(); // clone tươi mới mỗi lần để giữ class
        newList.appendChild(card);
        newList.appendChild(createBlank(productClass));
        newList.appendChild(createBlank(productClass));
        // chèn NGAY SAU hàng cuối
        lastRow.insertAdjacentElement('afterend', newRow);
      } else {
        // Chưa đủ 3 -> append vào và bổ sung blank cho đủ
        lastList.appendChild(card);
        const after = lastList.querySelectorAll('.product').length;
        for (let i = after; i < 3; i++) {
          lastList.appendChild(createBlank(productClass));
        }
      }
    }
  
    addProductForm.reset();
    addProductForm.style.display = 'none';
  });
   