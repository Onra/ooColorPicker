$(document).ready(function() {
  $(".btn-upload").click(function() {
    console.log("upload");
    $(this).button("loading");
    $("#imageInput").trigger("click");
  });

  $("#imageInput").on("change", function(evt) {
    handleFileSelect(evt);
  });

  $("#canvas").mousemove(function(event) {
    var x = event.pageX - this.offsetLeft;
    var y = event.pageY - this.offsetTop;

    var imgData = $("#canvas").get(0).getContext('2d').getImageData(x, y, 1, 1).data;
    var R = imgData[0];
    var G = imgData[1];
    var B = imgData[2];

    var rgb =  R + ", " + G + ", " + B;
    var hex = rgbToHex(R, G, B)
    console.log("RGB : " + rgb);
    console.log("Hex : #" + hex);

    $("#rgb-color").text("RGB Color : " + rgb);
    $("#hex-color").text("HEX Color : #" + hex);

    $(".color-sample").css("background-color", "#" + hex);
    $(".color-sample").css("outline", "5px #" + hex + " dashed");
  });
});

function handleFileSelect(evt) {
  var files = evt.target.files;
  var uploadedImage = files[0];

  if (!uploadedImage.type.match('image.*')) {
    notAnImage();
    return;
  }

  var reader = new FileReader();
  var canvas = $("#canvas").get(0);
  var img = document.createElement("img");

  reader.onload = (function(theFile) {
    return function(e) {
      var MAX_WIDTH = 400;
      var MAX_HEIGHT = 300;
      
      img.src = e.target.result;

      img.onload = function() {
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        showImage();
      }
    };
  })(uploadedImage);

  reader.readAsDataURL(uploadedImage);
}

function showImage() {
  console.log("show");
  $(".btn-upload").button('reset');
  $(".btn-upload").hide();

  $("#canvas").slideDown("slow", function() {
    $(".after-image-uploaded").slideDown("slow");
  });
}

function notAnImage() {
  $("#not-an-image").show();
  $(".btn-upload").button('reset');
  $(".btn-upload").text("Try again");
}

function rgbToHex(R,G,B) {
  return toHex(R)+toHex(G)+toHex(B)
}

function toHex(n) {
  n = parseInt(n,10);
  if (isNaN(n)) return "00";
  n = Math.max(0,Math.min(n,255));return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}
