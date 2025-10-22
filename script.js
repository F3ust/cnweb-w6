/* Biến DOM cần dùng */
   const searchInput = document.getElementById("searchInput");   // Ô nhập từ khóa tìm kiếm
   const searchBtn = document.getElementById("searchBtn");       // Nút "Tìm"
   const addProductBtn = document.getElementById("addProductBtn"); // Nút mở form thêm sản phẩm
   const addProductForm = document.getElementById("addProductForm"); // Form thêm sản phẩm
   const productList = document.querySelectorAll(".product");    // Danh sách tất cả sản phẩm
   
   /* Xử lý sự kiện tìm kiếm*/
   searchBtn.addEventListener("click", function () {
       const keyword = searchInput.value.trim().toLowerCase(); // Lấy giá trị nhập vào và chuyển về chữ thường
   
       // Duyệt qua từng sản phẩm trong danh sách
       productList.forEach(function (product) {
           const name = product.querySelector("h3").innerText.toLowerCase(); // Lấy tên sản phẩm
   
           // So sánh tên sản phẩm với từ khóa tìm kiếm
           if (name.includes(keyword) || keyword === "") {
               product.style.display = ""; // Hiện lại nếu trùng hoặc từ khóa rỗng
           } else {
               product.style.display = "none"; // Ẩn nếu không trùng
           }
       });
   });
   
   /* Cho phép nhấn enter để tìm*/
   searchInput.addEventListener("keyup", function (event) {
       if (event.key === "Enter") {
           searchBtn.click(); // Kích hoạt hành động nút "Tìm"
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
   