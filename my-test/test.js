;(function($) {
  $.extend($, {
    min: function(a, b) {
      return a < b ? a : b;
    },
    max: function(a, b) {
      return a > b ? a : b;
    },
    trimAll: function(str) {
      var str2 = str + "";
      return str2.replace(/\s*|\s*/g, "");
    },
    trimL: function(str) {
      var newStr = str + "";
      return newStr.replace(/^\s*/, "");
    },
    trimR: function(str) {
      var newStr = str + "";
      return newStr.replace(/\s*$/, "");
    }
  });
  $.extend($.fn, {
    bold: function() {
      return this.css({ fontWeight: "bold" });
    }
  });
})($);
