function pager(callFuncName, totalPage, curPage) {
  $(".pager").replaceWith("<ul class='pager'></ul>");
  pagePre = $("<a>«</a>");
  if (curPage === 1)
    pagePre.attr("class", "previous disabled");
  else
    pagePre.attr("onclick", callFuncName + "(" + (curPage - 1) + ")").attr("href", "javascript:void(0);");
  pagePreLi = $("<li></li>").append(pagePre);
  $(".pager").append(pagePreLi);
  for (var i = 1; i <= totalPage; i++) {
    pageNum = $("<a>" + i + "</a>")
      .attr("onclick", callFuncName + "(" + i + ")")
      .attr("href", "javascript:void(0);");
    pageNumLi = $("<li></li>").append(pageNum);
    $(".pager").append(pageNumLi);
    if (i === curPage) {
      pageNumLi.attr("class", "active");
      pageNumLi.children().removeAttr("onclick");
    }

  }
  pageNext = $("<a>»</a>");
  if (curPage === totalPage)
    pageNext.attr("class", "next disabled");
  else
    pageNext.attr("onclick", callFuncName + "(" + (curPage + 1) + ")")
      .attr("href", "javascript:void(0);");
  pageNextLi = $("<li></li>").append(pageNext);
  $(".pager").append(pageNextLi);
}

function checkLoginStatus(callback) {
  $.ajax({
    url: "/api/userinfo",
    success: function (userinfo) {
      if (userinfo.code === "200" && userinfo.data.verified === 1)
        callback(userinfo.data.username);
      else callback(false);
    }
  });
}

function navLoginStatus(username) {
  if (username) {
    $("#nav_login").hide();
    $("#nav_register").hide();
    var newUserStatus = $("<a class='dropdown-toggle' data-toggle='dropdown'></a>")
      .attr("href", "#")
      .text(username);
    var newUserLogoutUl =$("<li></li>").append("<ul class='dropdown-menu' role='menu'></ul>").children();
    var newUserLogoutA = $("<a href='http://rblist/logout'></a>")
      .attr("onclick","event.preventDefault();$('#logout-form').submit()")
      .text("注销")
    var newUserLogout = $("<li></li>")
    .html("<form id=\"logout-form\" action=\"http://rblist/logout\" method=\"POST\" style=\"display: none;\">"+
          "<input type=\"hidden\" name=\"_token\"></form>")
    .append(newUserLogoutA);
    newUserLogoutUl.append(newUserLogout);
    var newUserLi = $("<li class='dropdown'></li>").append(newUserStatus).append(newUserLogoutUl);
    $("#status").append(newUserLi);
  }
}

$.ajaxSetup({
  // headers: {
  //   'X-XSRF-TOKEN': $.cookie('XSRF-TOKEN')
  // },
  type: "POST",
  dataType: "json",
});

$(document).ready(function () {
  checkLoginStatus(navLoginStatus);

  $.ajax({
    url: "/api/categorylist",
    success: function (list) {
      if (list.code === "200") {
        $.each(list.data, function (i, item) {
          var categoryName = item.category_list.name;
          var categoryId = item.category_list.id;
          var content = $("<li></li>").append("<a></a>").find("a")
            .attr("href", "javascript:void(0)")
            .attr("id", categoryId)
            .text(categoryName)
            .end();
          $("#allCategory").append(content);
        })
      }
    }
  });
});

$(document).on({
  ajaxStart: function () { $("body").addClass("loading"); },
  ajaxStop: function () { $("body").removeClass("loading"); }
});