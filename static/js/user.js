$(function () {
    $('#s1').css('display', 'block');
    fadeplay();
});

var slideIndex = 0;

function fadeplay() {
    var images = document.getElementsByClassName("slideshow-image");

    fadeInImage(slideIndex, images);

    for (let index = 0; index < images.length; index++) {
        if (index != slideIndex) {
            fadeOutImage(index, images);
        }
    }

    slideIndex++;
    if (slideIndex > images.length - 1) {
        slideIndex = 0;
    }

    setTimeout(() => {
        fadeplay();
    }, 4000);
};

function fadeInImage(idx, images) {
    return new Promise(function () {
        $(images[idx]).fadeIn(2000);
    });
}

function fadeOutImage(idx, images) {
    return new Promise(function () {
        $(images[idx]).fadeOut(2000);
    });
}