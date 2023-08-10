$(document).ready(function () {
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

$('#singup_button').click(function () {
    let email = $('#input_email').val();
    let name = $('#input_name').val();
    let nickname = $('#input_nickname').val();
    let password = $('#input_password').val();

    $.ajax({
        url: '/user/signup/',
        data: {
            email: email,
            name: name,
            nickname: nickname,
            password: password,
        },
        method: 'POST',
        success: function (data) {
            console.log('성공');
            alert('회원가입에 성공했습니다. 로그인해주세요.')
            location.replace('/user/login/')
        },
        error: function (request, status, error) {
            console.log('에러 -' + 'status: ' + status + ', error: ' + error);
        },
        complete: function () {
            console.log('완료');
        }
    })
});

$('#login_button').click(function () {
    let email = $('#input_email').val();
    let password = $('#input_password').val();

    $.ajax({
        url: '/user/login/',
        data: {
            email: email,
            password: password,
        },
        method: 'POST',
        success: function (data) {
            console.log('성공');
            location.replace('/content/main')
        },
        error: function (xhr, status, error) {
            var response = JSON.parse(xhr.responseText);
            console.log('에러');
            alert(response.message);
        },
        complete: function () {
            console.log('완료');
        }
    })
});