let url = window.location.origin; // lấy full origin (http://localhost:3000 hoặc online)

// ---------------- ADD DRUG ----------------
$("#add_drug").submit(function (event) {
  event.preventDefault(); // chặn reload mặc định

  let unindexed_array = $(this).serializeArray();
  let data = {};
  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  $.ajax({
    url: `${url}/api/drugs`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function () {
      alert(`${data.name} added successfully!`);
      window.location.href = "/manage";
    },
    error: function (xhr) {
      alert("Failed to add drug: " + xhr.responseText);
    }
  });
});

// ---------------- UPDATE DRUG ----------------
$("#update_drug").submit(function (event) {
  event.preventDefault();

  let unindexed_array = $(this).serializeArray();
  let data = {};
  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  // lấy id từ hidden input
  let drugId = data.id;

  $.ajax({
    url: `${url}/api/drugs/${drugId}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function () {
      alert(`${data.name} updated successfully!`);
      window.location.href = "/manage";
    },
    error: function (xhr) {
      console.error("Error updating drug:", xhr.responseText);
      alert("Failed to update drug!");
    }
  });
});

// ---------------- DELETE DRUG ----------------
if (window.location.pathname === "/manage") {
  $("table tbody td a.delete").click(function () {
    let id = $(this).attr("data-id");

    if (confirm("Do you really want to delete this drug?")) {
      $.ajax({
        url: `${url}/api/drugs/${id}`,
        method: "DELETE",
        success: function () {
          alert("Drug deleted successfully!");
          location.reload();
        },
        error: function (xhr) {
          alert("Failed to delete drug: " + xhr.responseText);
        }
      });
    }
  });
}

// ---------------- PURCHASE DRUG ----------------
if (window.location.pathname === "/purchase") {
    $("#drug_days").submit(function (event) {
      event.preventDefault();
  
      let days = +$("#days").val(); // số ngày nhập vào
  
      // Gọi API purchase
      $.ajax({
        url: `${url}/api/purchase?days=${days}`, // backend bạn cần có route này
        method: "GET",
        success: function (response) {
          $("#purchase_table").show();
          let tbody = $("#purchase_table tbody");
          tbody.empty();
  
          // render dữ liệu trả về
          response.forEach((drug, index) => {
            tbody.append(`
              <tr>
                <td>${index + 1}</td>
                <td>${drug.name}</td>
                <td>${drug.quantity}</td>
                <td>${drug.price}</td>
                <td>${drug.exp_date}</td>
              </tr>
            `);
          });
  
          alert("Drugs for " + days + " days!");
        },
        error: function (xhr) {
          alert("Failed to fetch drugs: " + xhr.responseText);
        }
      });
    });
  }
  