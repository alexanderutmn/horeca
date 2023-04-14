(function ($) {
  window.addEventListener("DOMContentLoaded", function () {
    var avatar = document.getElementById("product-img-avatar");
    var image = document.getElementById("image");
    var input = document.getElementById("product-img-field");
    var $modal = $("#modal");
    var cropper;

    input.addEventListener("change", function (e) {
      var files = e.target.files;
      if(image){
      var done = function (url) {
        input.value = "";
        image.src = url;
        $modal.modal("show");
      };
    };
      var reader;
      var file;
      var url;

      if (files && files.length > 0) {
        file = files[0];

        if (URL) {
          done(URL.createObjectURL(file));
        } else if (FileReader) {
          reader = new FileReader();
          reader.onload = function (e) {
            done(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    });

    $modal
      .on("shown.bs.modal", function () {
        cropper = new Cropper(image, {
          // aspectRatio: 1,
          viewMode: 1,
          zoomOnWheel: false,
        });
      })
      .on("hidden.bs.modal", function () {
        cropper.destroy();
        cropper = null;
      });
    if(document.getElementById("crop")){
    document.getElementById("crop").addEventListener("click", function () {
      var initialAvatarURL;
      var canvas;
      var productId =
        window.location.href.split("/")[
          window.location.href.split("/").length - 2
        ];
      var urlSrc;
      document.getElementById("crop").style.display = "none";
      document.getElementById("croploading").style.display = "block";
      if (productId == "add") {
        urlSrc = "/admin/menu/add-cropp-image";
      } else {
        $("#product-img-old-field").val("es");
        urlSrc = "/admin/menu/update-cropp-image";
      }

      setTimeout(() => {
        if (cropper) {
          canvas = cropper.getCroppedCanvas({});
          initialAvatarURL = avatar.src;
          avatar.src = canvas.toDataURL("image/jpeg", 1);
          canvas.toBlob(function (blob) {
            var formData = new FormData();
            // formData.append('productId', productId);
            formData.append("new_img", blob, productId);
            fetch(urlSrc, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.text())
              .then((data) => {
                document.getElementById("crop").style.display = "block";
                document.getElementById("croploading").style.display = "none";
                $modal.modal("hide");
                $("#product-img-load").show();
                return data;
              })
              .catch(() => {
                document.getElementById("crop").style.display = "block";
                document.getElementById("croploading").style.display = "none";
                $modal.modal("hide");
              });
            // $.ajax(urlSrc, {
            //   method: 'POST',
            //   data: formData,
            //   processData: false,
            //   contentType: false,

            //   xhr: function () {
            //     var xhr = new XMLHttpRequest();
            //     return xhr;
            //   },

            //   success: function (c) {
            //     if(productId == 'add'){
            //       $('#product-img-old-field').val(c);

            //     }
            //   },

            //   error: function () {
            //     avatar.src = initialAvatarURL;
            //     document.getElementById('crop').style.display = 'block';
            //     document.getElementById('croploading').style.display = 'none';
            //     $modal.modal('hide');
            //   },

            //   complete: function (c) {
            //     document.getElementById('crop').style.display = 'block';
            //     document.getElementById('croploading').style.display = 'none';
            //     $modal.modal('hide');
            //   },
            // });
          });
        }
      }, 1000);
    });};
  });

  //
  // window.addEventListener('DOMContentLoaded', function () {
  //   var avatar = document.getElementById('avatar');
  //   var image = document.getElementById('image');
  //   var input = document.getElementById('input');
  //   var $progress = $('.progress');
  //   var $progressBar = $('.progress-bar');
  //   var $alert = $('.alert');
  //   var $modal = $('#modal');
  //   var cropper;
  //
  //   $('[data-toggle="tooltip"]').tooltip();
  //
  //   input.addEventListener('change', function (e) {
  //     var files = e.target.files;
  //     var done = function (url) {
  //       input.value = '';
  //       image.src = url;
  //       $alert.hide();
  //       $modal.modal('show');
  //     };
  //     var reader;
  //     var file;
  //     var url;
  //
  //     if (files && files.length > 0) {
  //       file = files[0];
  //
  //       if (URL) {
  //         done(URL.createObjectURL(file));
  //       } else if (FileReader) {
  //         reader = new FileReader();
  //         reader.onload = function (e) {
  //           done(reader.result);
  //         };
  //         reader.readAsDataURL(file);
  //       }
  //     }
  //   });
  //
  //   $modal.on('shown.bs.modal', function () {
  //     cropper = new Cropper(image, {
  //       aspectRatio: 1,
  //       viewMode: 3,
  //     });
  //   }).on('hidden.bs.modal', function () {
  //     cropper.destroy();
  //     cropper = null;
  //   });
  //
  //   document.getElementById('crop').addEventListener('click', function () {
  //     var initialAvatarURL;
  //     var canvas;
  //
  //     $modal.modal('hide');
  //
  //     if (cropper) {
  //       canvas = cropper.getCroppedCanvas({
  //         width: 160,
  //         height: 160,
  //       });
  //       initialAvatarURL = avatar.src;
  //       avatar.src = canvas.toDataURL();
  //       $progress.show();
  //       $alert.removeClass('alert-success alert-warning');
  //       canvas.toBlob(function (blob) {
  //         var formData = new FormData();
  //
  //         formData.append('avatar', blob, 'avatar.jpg');
  //         $.ajax('https://jsonplaceholder.typicode.com/posts', {
  //           method: 'POST',
  //           data: formData,
  //           processData: false,
  //           contentType: false,
  //
  //           xhr: function () {
  //             var xhr = new XMLHttpRequest();
  //
  //             xhr.upload.onprogress = function (e) {
  //               var percent = '0';
  //               var percentage = '0%';
  //
  //               if (e.lengthComputable) {
  //                 percent = Math.round((e.loaded / e.total) * 100);
  //                 percentage = percent + '%';
  //                 $progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
  //               }
  //             };
  //
  //             return xhr;
  //           },
  //
  //           success: function () {
  //             $alert.show().addClass('alert-success').text('Upload success');
  //           },
  //
  //           error: function () {
  //             avatar.src = initialAvatarURL;
  //             $alert.show().addClass('alert-warning').text('Upload error');
  //           },
  //
  //           complete: function () {
  //             $progress.hide();
  //           },
  //         });
  //       });
  //     }
  //   });
  // });

  $(".lazy").lazy();

  var tableOrders = $("#orders-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Нет заказов",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Нет заказов",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  var tableSales = $("#sales-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Нет акций",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Нет акций",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  var tableUsers = $("#users-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Нет пользователей",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Нет пользователя",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });

  var bookingSales = $("#booking-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Нет брони",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Нет брони",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  var tableMenu = $("#menu-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    // ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
    dom: 'l<"toolbar">frtip',
    initComplete: function () {
      $("div.toolbar").html(
        '<div class="button-display-table flaticon-381-equal-1 main-color-button"></div><div class="button-display-grid flaticon-381-pad main-color-button"></div>'
      );
    },
  });
  const dataTableMenu = document.getElementById("menu-table");
  if (dataTableMenu) {
    const lengthDataTableMenu = dataTableMenu.getAttribute(
      "data-lengthDataTableMenu"
    );
    const productMenuByCategory = dataTableMenu.getAttribute(
      "data-productMenuByCategory"
    );
    tableMenu.page.len(Number(lengthDataTableMenu)).draw();
    if (productMenuByCategory != "#") {
      $("#product-menu-category").val(productMenuByCategory);
      $("#product-menu-category").trigger("change");
    }
  }
  const dataTableMenuGrid = document.getElementById("menu-table-grid");
  if (dataTableMenuGrid) {
    const productMenuByCategory = dataTableMenuGrid.getAttribute(
      "data-productMenuByCategory"
    );
    if (productMenuByCategory != "#") {
      $("#product-menu-category").val(productMenuByCategory);
      $("#product-menu-category").trigger("change");
    }
  }
  $("#menu-table").on("length.dt", function (e, settings, len) {
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("lengthDataTableMenu");
    searchParams.append("lengthDataTableMenu", len);
    window.location.href = url.toString();
  });
  var categoryMenu = $("#categories-table").DataTable({
    searching: true,
    paging: true,
    select: false,
    // ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });

  const dataTableCategories = document.getElementById("categories-table");
  if (dataTableCategories) {
    const lengthDataTableCategories = dataTableCategories.getAttribute(
      "data-lengthDataTableCategories"
    );
    const productCategoriesByCategory = dataTableCategories.getAttribute(
      "data-productCategoriesByCategory"
    );
    categoryMenu.page.len(Number(lengthDataTableCategories)).draw();
    if (productCategoriesByCategory != "#") {
      $("#category-parent-category").val(productCategoriesByCategory);
      $("#category-parent-category").trigger("change");
    }
  }
  $("#categories-table").on("length.dt", function (e, settings, len) {
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("lengthDataTableCategories");
    searchParams.append("lengthDataTableCategories", len);
    window.location.href = url.toString();
  });

  $("#orders-table tbody").on("click", "tr", function () {
    var data = tableOrders.row(this).data();
    window.location.href = "/admin/orders/" + data[0];
  });

  $("body").on("click", "#menu-table td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/menu/" + data;
  });

  $("body").on("click", "#categories-table td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/categories/" + data;
  });
  // mofidiers for menu
  var categoryMenu = $("#menu-table-modifiers").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  $("body").on("click", "#menu-table-modifiers td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/modifiers/" + data;
  });
  //group-modifiers for menu
  var categoryMenu = $("#menu-table-group-modifiers").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  $("body").on("click", "#menu-table-group-modifiers td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/modifiers-categories/" + data;
  });
  // categories-modifiers
  var categoryMenuModifiers = $("#categories-table-modifiers").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  const dataTableModifiersCategories = document.getElementById(
    "categories-table-modifiers"
  );
  if (dataTableModifiersCategories) {
    const lengthDataTableModifiersCategories =
      dataTableModifiersCategories.getAttribute(
        "data-lengthDataTableModifiersCategories"
      );
    const productModifiersCategoriesByCategory =
      dataTableModifiersCategories.getAttribute(
        "data-productModifiersCategoriesByCategory"
      );
    categoryMenuModifiers.page
      .len(Number(lengthDataTableModifiersCategories))
      .draw();
    if (productModifiersCategoriesByCategory != "#") {
      $("#modifiers-category-parent-category").val(
        productModifiersCategoriesByCategory
      );
      $("#modifiers-category-parent-category").trigger("change");
    }
  }
  $("#categories-table-modifiers").on("length.dt", function (e, settings, len) {
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("lengthDataTableModifiersCategories");
    searchParams.append("lengthDataTableModifiersCategories", len);
    window.location.href = url.toString();
  });

  $("body").on("click", "#categories-table-modifiers td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/modifiers-categories/" + data;
  });

  // modifiers
  var menuModifiers = $("#table-modifiers").DataTable({
    searching: true,
    paging: true,
    select: false,
    ordering: false,
    //info: false,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "Все"],
    ],
    language: {
      lengthMenu: "Показать _MENU_",
      search: "Поиск:",
      zeroRecords: "Пусто",
      info: "Показано _PAGE_ из _PAGES_",
      infoEmpty: "Пусто",
      infoFiltered: "(filtered from _MAX_ total records)",
      paginate: {
        previous: "Предыдущая",
        next: "Следующая",
      },
    },
  });
  const dataTableModifiers = document.getElementById("table-modifiers");
  if (dataTableModifiers) {
    const lengthDataTableModifiers = dataTableModifiers.getAttribute(
      "data-lengthDataTableModifiers"
    );
    const productModifiersByCategory = dataTableModifiers.getAttribute(
      "data-productModifiersByCategory"
    );
    menuModifiers.page.len(Number(lengthDataTableModifiers)).draw();
    if (productModifiersByCategory != "#") {
      $("#modifiers-parent-category").val(productModifiersByCategory);
      $("#modifiers-parent-category").trigger("change");
    }
  }
  $("#table-modifiers").on("length.dt", function (e, settings, len) {
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("lengthDataTableModifiers");
    searchParams.append("lengthDataTableModifiers", len);
    window.location.href = url.toString();
  });

  $("body").on("click", "#table-modifiers td.click-td", function () {
    var data = $(this).attr("data-id");
    window.location.href = "/admin/modifiers/" + data;
  });

  // Daterange picker
  $(".input-daterange-datepicker.orders").daterangepicker({
    buttonClasses: ["btn", "btn-sm"],
    applyClass: "btn-danger",
    cancelClass: "btn-inverse",
    locale: {
      format: "YYYY-MM-DD",
    },
  });

  $(".input-daterange-datepicker.orders").on(
    "apply.daterangepicker",
    function (ev, picker) {
      //do something, like clearing an input
      var stringDate = $(".input-daterange-datepicker.orders").val().split(" "),
        getParams = getAllUrlParams(window.location.href),
        newUrl =
          "?getOrderFromDate=" +
          stringDate[0] +
          "&getOrderToDate=" +
          stringDate[2];

      if (getParams.getOrderByStatus != undefined) {
        newUrl += "&getOrderByStatus=" + getParams.getOrderByStatus;
      }
      window.location.href = newUrl;
    }
  );

  $(".input-daterange-datepicker.booking").daterangepicker({
    buttonClasses: ["btn", "btn-sm"],
    applyClass: "btn-danger",
    cancelClass: "btn-inverse",
    locale: {
      format: "YYYY-MM-DD",
    },
  });

  $(".input-daterange-datepicker.booking").on(
    "apply.daterangepicker",
    function (ev, picker) {
      //do something, like clearing an input
      var stringDate = $(".input-daterange-datepicker.booking")
          .val()
          .split(" "),
        getParams = getAllUrlParams(window.location.href),
        newUrl =
          "?getBookingFromDate=" +
          stringDate[0] +
          "&getBookingToDate=" +
          stringDate[2];

      window.location.href = newUrl;
    }
  );

  // single-select-placeholder
  $(".single-select-placeholder.order-status").select2({
    placeholder: "Select a state",
    allowClear: true,
  });

  if (getAllUrlParams().getOrderByStatus != undefined) {
    $(".single-select-placeholder.order-status").val(
      getAllUrlParams().getOrderByStatus
    ); // Select the option with a value of '1'
    $(".single-select-placeholder.order-status").trigger("change"); // Notify any JS components that the value changed
  }

  $(".single-select-placeholder.order-status").on(
    "select2:select",
    function (e) {
      console.log($(this).val());
      var status = $(this).val(),
        getParams = getAllUrlParams(window.location.href),
        newUrl = "?getOrderByStatus=" + status + "&";
      if (status == "100") {
        newUrl = "?";
      }
      if (getParams.getOrderFromDate != undefined) {
        newUrl += "getOrderFromDate=" + getParams.getOrderFromDate;
        newUrl += "&getOrderToDate=" + getParams.getOrderToDate;
      }
      window.location.href = newUrl;
    }
  );

  /*
    menu list
  */

  // single-select-placeholder
  $(".single-select-placeholder.product-category").select2({
    placeholder: "Выбрать категорию",
    allowClear: true,
  });

  /*if (getAllUrlParams().getProductByCategory != undefined) {
    $('#product-menu-category').val(getAllUrlParams().getProductByCategory); // Select the option with a value of '1'
    $('#product-menu-category').trigger('change'); // Notify any JS components that the value changed
  }*/

  $("body").on("change", "#product-menu-category", function () {
    let paramsUrl = new URL(document.location).searchParams;
    let gridUrl = paramsUrl.get("grid");
    var newUrl = "?getProductByCategory=" + $("#product-menu-category").val();
    if ($("#product-menu-category").val() == "#") {
      if (gridUrl) {
        window.location.href = "/admin/menu?getProductByCategory=ALL&grid=true";
      } else {
        window.location.href = "/admin/menu?getProductByCategory=ALL";
      }
    } else {
      if ($("#product-menu-category").val()) {
        if (gridUrl) {
          window.location.href = newUrl + "&grid=true";
        } else {
          window.location.href = newUrl;
        }
      }
    }
  });

  /*
    menu list
  */

  /*
    category list
  */

  // single-select-placeholder
  $(".single-select-placeholder.parent-category").select2({
    placeholder: "Выбрать категорию",
    allowClear: true,
  });

  /*if (getAllUrlParams().getCategoriesByParent != undefined) {
    $('#category-parent-category').val(getAllUrlParams().getCategoriesByParent); // Select the option with a value of '1'
    $('#category-parent-category').trigger('change'); // Notify any JS components that the value changed
  }*/

  $("body").on("change", "#category-parent-category", function () {
    const newUrl = $("#category-parent-category").val();
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("getCategoriesByParent");
    if ($("#category-parent-category").val() == "#") {
      searchParams.append("getCategoriesByParent", "None");
    } else if ($("#category-parent-category").val()) {
      searchParams.append("getCategoriesByParent", newUrl);
    }
    window.location.href = url.toString();
  });
  $("body").on("change", "#modifiers-category-parent-category", function () {
    const newUrl = $("#modifiers-category-parent-category").val();
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("getModifiersCategoriesByParent");
    if ($("#modifiers-category-parent-category").val() == "#") {
      searchParams.append("getModifiersCategoriesByParent", "None");
    } else if ($("#modifiers-category-parent-category").val()) {
      searchParams.append("getModifiersCategoriesByParent", newUrl);
    }
    window.location.href = url.toString();
  });
  $("body").on("change", "#modifiers-parent-category", function () {
    const newUrl = $("#modifiers-parent-category").val();
    const url = new URL(document.location);
    const searchParams = url.searchParams;
    searchParams.delete("getModifiersByParent");
    if ($("#modifiers-parent-category").val() == "#") {
      searchParams.append("getModifiersByParent", "None");
    } else if ($("#modifiers-parent-category").val()) {
      searchParams.append("getModifiersByParent", newUrl);
    }
    window.location.href = url.toString();
  });
  /*
    category list
  */

  /*
    detail product
  */
  $("body").on("change", '[name="unit"]', function () {
    $("#weight-text").html($('[name="unit"]:checked').attr("data-text"));
  });

  $("#product-img-delete").on("click", function () {
    $("#product-img-old-field").val("");
    $("#product-img-load").hide();
  });

  $("#product-img-delete-clone").on("click", function () {
    $("#product-img-field").val("");
    $("#product-img-label").html("Выбрать изображение");
    $("#product-img-delete-clone").hide();
  });

  $("#product-img-field").on("change", function () {
    var path = $(this).val(),
      pathAr = path.split("\\");
    $('#product-img-label').html(pathAr[pathAr.length - 1]);
    $('#product-img-delete-clone').show();
  });

  $("#product-img-delete-qr").on("click", function () {
    $("#product-img-old-field-qr").val("");
  });

  $("#product-img-delete-clone-qr").on("click", function () {
    $("#product-img-field-qr").val("");
    $("#product-img-label-qr").html("Выбрать изображение");
    $("#product-img-delete-clone-qr").hide();
  });

  $("#product-img-field-qr").on("change", function () {
    var path = $(this).val(),
      pathAr = path.split("\\");
    $('#product-img-label-qr').html(pathAr[pathAr.length - 1]);
    $('#product-img-delete-clone-qr').show();
  });
  /*
    detail product
  */

  /*
    add product
  */
  $("#product_id_category").select2({
    placeholder: "Выбрать категорию",
    // formatNoMatches: function () {
    // return "Нет результатов ... или что-то ещё";
    // }
  });

  /*
    add product
  */

  $("body").on("click", ".create-qr", function () {
    $("#qrcode").html("");
    var qrcode = new QRCode("qrcode", {
        width: 256,
        height: 256,
      }),
      url = $(this).attr("data-url");
    qrcode.makeCode(url);
  });

  /*
    colors control
  */

  $("body").on("click", ".set-default-color", function () {
    var target = $(this).attr("data-target"),
      color = $(this).attr("data-color");
    $("#" + target).val(color);
  });
  $("body").on("change", ".qr-dish-color-text", function () {
    var color = $(this).val();
    const sink = document.getElementById("sink");
    sink.style.color = color;
  });
  $("body").on("change", ".sink-text", function () {
    var textQrDescription = $(this).val();
    const sink = document.getElementById("sink-text");
    sink.innerHTML = textQrDescription;
  });
  $("#load-img-delete").on("click", function () {
    $("#load-img-old-field").val("false");
    $("#load-img-load").hide();
  });
  $("#load-img-delete-clone").on("click", function () {
    $("#load-img-field").val("");
    $("#load-img-old-field").val("false");
    $("#load-img-label").html("Выбрать изображение");
    $("#load-img-delete-clone").hide();
  });
  $("#load-img-field").on("change", function () {
    var path = $(this).val(),
      pathAr = path.split("\\");
    $("#load-img-old-field").val("true");
    $("#load-img-label").html(pathAr[pathAr.length - 1]);
    $("#load-img-delete-clone").show();
  });

  $("#background-img-delete").on("click", function () {
    $("#background-img-old-field").val("false");
    $("#background-img-load").hide();
  });
  $("#background-img-delete-clone").on("click", function () {
    $("#background-img-field").val("");
    $("#background-img-old-field").val("false");
    $("#background-img-label").html("Выбрать изображение");
    $("#background-img-delete-clone").hide();
  });
  $("#background-img-field").on("change", function () {
    var path = $(this).val(),
      pathAr = path.split("\\");
    $("#background-img-old-field").val("true");
    $("#background-img-label").html(pathAr[pathAr.length - 1]);
    $("#background-img-delete-clone").show();
  });
  /*
    colors control
  */
  // select-placeholder-sales-status
  $(".single-select-placeholder.sales-status").select2({
    placeholder: "Выбрать статус",
    allowClear: true,
  });

  if (getAllUrlParams().salesStatus != undefined) {
    $(".single-select-placeholder.sales-status").val(
      getAllUrlParams().salesStatus
    ); // Select the option with a value of '1'
    $(".single-select-placeholder.sales-status").trigger("change"); // Notify any JS components that the value changed
  }

  $(".single-select-placeholder.sales-status").on(
    "select2:select",
    function (e) {
      console.log($(this).val());
      var status = $(this).val(),
        getParams = getAllUrlParams(window.location.href),
        newUrl = "/admin/sales/?salesStatus=" + status;
      if (status == "100") {
        newUrl = "?";
      }
      window.location.href = newUrl;
    }
  );
})(jQuery);

function getAllUrlParams(url) {
  // извлекаем строку из URL или объекта window
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);

  // объект для хранения параметров
  var obj = {};

  // если есть строка запроса
  if (queryString) {
    // данные после знака # будут опущены
    queryString = queryString.split("#")[0];

    // разделяем параметры
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      // разделяем параметр на ключ => значение
      var a = arr[i].split("=");

      // обработка данных вида: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function (v) {
        paramNum = v.slice(1, -1);
        return "";
      });

      // передача значения параметра ('true' если значение не задано)
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      // преобразование регистра
      // paramName = paramName.toLowerCase();
      // paramValue = paramValue.toLowerCase();

      // если ключ параметра уже задан
      if (obj[paramName]) {
        // преобразуем текущее значение в массив
        if (typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
        }
        // если не задан индекс...
        if (typeof paramNum === "undefined") {
          // помещаем значение в конец массива
          obj[paramName].push(paramValue);
        }
        // если индекс задан...
        else {
          // размещаем элемент по заданному индексу
          obj[paramName][paramNum] = paramValue;
        }
      }
      // если параметр не задан, делаем это вручную
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}
// Выбираем кнопки для переключения стилей отображения в админке меню (списком или грид)
const buttonDisplaySpisok = document.querySelector(".button-display-table");
const buttonDisplayGrid = document.querySelector(".button-display-grid");
const isGridMenu = document.getElementById("gridMenu");
if (isGridMenu) {
  const gridMenu = isGridMenu.getAttribute("data-grid");
  if (gridMenu === "true") {
    if (buttonDisplayGrid) {
      buttonDisplayGrid.style.opacity = 1;
      buttonDisplaySpisok.style.opacity = 0.3;
    }
  } else {
    if (buttonDisplayGrid) {
      buttonDisplayGrid.style.opacity = 0.3;
      buttonDisplaySpisok.style.opacity = 1;
    }
  }
}
if (buttonDisplayGrid) {
  buttonDisplayGrid.addEventListener("click", handleClickChangeDisplayOnGrid);
}
if (buttonDisplaySpisok) {
  buttonDisplaySpisok.addEventListener(
    "click",
    handleClickChangeDisplayOffGrid
  );
}
function handleClickChangeDisplayOffGrid() {
  const url = new URL(document.location);
  const searchParams = url.searchParams;
  searchParams.delete("gridMenu");
  searchParams.append("gridMenuDelete", true);
  window.location.href = url.toString();
  //window.history.pushState({}, '', url.toString());
}
function handleClickChangeDisplayOnGrid() {
  const url = new URL(document.location);
  const searchParams = url.searchParams;
  searchParams.append("gridMenu", true);
  searchParams.delete("gridMenuDelete");
  window.location.href = url.toString();
}

// <<<<<<< HEAD

//Вешаем обработчик на кнопку по роуту /admin/qr-code/ для того чтобы менять название стола
const buttonTitleNameTable = document.querySelector(".change-title-name-table");
const inputTitleNameTable = document.querySelector(".input-title-name-table");
function changeTitleTable() {
  const titleTable = inputTitleNameTable.value;
  window.location.href = "/admin/changetitletable?TITLE_TABLE=" + titleTable;
}
if (buttonTitleNameTable) {
  buttonTitleNameTable.addEventListener("click", changeTitleTable);
}

// Создаем Select для выбора админом шрифтов для текста на qr-коде
const isAdminDishQrCode = document.getElementById("container");
if (isAdminDishQrCode) {
  var FragBuilder = (function () {
    var applyStyles = function (element, style_object) {
      for (var prop in style_object) {
        element.style[prop] = style_object[prop];
      }
    };
    var generateFragmentFromJSON = function (json) {
      var tree = document.createDocumentFragment();
      json.forEach(function (obj) {
        if (!("tagName" in obj) && "textContent" in obj) {
          tree.appendChild(document.createTextNode(obj["textContent"]));
        } else if ("tagName" in obj) {
          var el = document.createElement(obj.tagName);
          delete obj.tagName;
          for (part in obj) {
            var val = obj[part];
            switch (part) {
              case "textContent":
                el.appendChild(document.createTextNode(val));
                break;
              case "style":
                applyStyles(el, val);
                break;
              case "childNodes":
                el.appendChild(generateFragmentFromJSON(val));
                break;
              default:
                if (part in el) {
                  el[part] = val;
                }
                break;
            }
          }
          tree.appendChild(el);
        } else {
          throw "Error: Malformed JSON Fragment";
        }
      });
      return tree;
    };
    var generateFragmentFromString = function (HTMLstring) {
      var div = document.createElement("div"),
        tree = document.createDocumentFragment();
      div.innerHTML = HTMLstring;
      while (div.hasChildNodes()) {
        tree.appendChild(div.firstChild);
      }
      return tree;
    };
    return function (fragment) {
      if (typeof fragment === "string") {
        return generateFragmentFromString(fragment);
      } else {
        return generateFragmentFromJSON(fragment);
      }
    };
  })();

  function jsonp(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("body")[0].appendChild(script);
  }

  function replacestyle(url) {
    if (!document.getElementById("style_tag")) {
      var style_tag = document.createElement("link");
      style_tag.rel = "stylesheet";
      style_tag.id = "style_tag";
      style_tag.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(style_tag);
      replacestyle(url);
    }
    document.getElementById("style_tag").href = url;
  }

  function loadFonts(json) {
    var select_frag = [
      {
        name: "fontFamilyQr",
        tagName: "select",
        id: "font-selection",
        class: "single-select-placeholder",
        childNodes: [
          {
            tagName: "option",
            value: "default",
            textContent: "Default",
          },
        ],
      },
    ];
    const familyFontDish =
      document.querySelector(".fontFamilyDish").textContent;
    function SortArray(x, y) {
      return x.family.localeCompare(y.family);
    }
    const jsonSort = json["items"].sort(SortArray);
    jsonSort.forEach(function (item) {
      if (item.subsets.indexOf("cyrillic") !== -1) {
        var family_name = item.family,
          value = family_name.replace(/ /g, "+");

        if (item.variants.length > 0) {
          item.variants.forEach(function (variant) {
            value += ":" + variant;
          });
        }
        if (familyFontDish) {
          if (familyFontDish === value) {
            select_frag[0].childNodes.push({
              tagName: "option",
              value: value,
              textContent: family_name,
              selected: "selected",
            });
            document.getElementById("sink").style.fontFamily = family_name;
            replacestyle("https://fonts.googleapis.com/css?family=" + value);
          } else {
            select_frag[0].childNodes.push({
              tagName: "option",
              value: value,
              textContent: family_name,
            });
          }
        } else {
          select_frag[0].childNodes.push({
            tagName: "option",
            value: value,
            textContent: family_name,
          });
        }
      }
    });

    document.getElementById("container").appendChild(FragBuilder(select_frag));
    document.getElementById("font-selection").onchange = function (e) {
      var font = this.options[this.selectedIndex].value,
        name = this.options[this.selectedIndex].textContent;
      if (font === "default") {
        document.getElementById("sink").style.fontFamily = "inherit";
      } else {
        document.getElementById("sink").style.fontFamily = name;
        replacestyle("https://fonts.googleapis.com/css?family=" + font);
      }
    };
  }

  jsonp(
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAPta6wB8VKmHoWa63obHYImNc-5C5eeec&sort=trending&callback=loadFonts"
  );
}
