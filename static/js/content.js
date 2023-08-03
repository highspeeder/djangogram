let files;

function updateCounter(el) {
    $('#test_cnt').html($(el).val().length + "/2200");

    // 글자수 제한
    if ($(el).val().length > 2200) {
        $(el).val($(el).val().substring(0, 2200));
        $('#test_cnt').html("2200 / 2200");
    };
};

$("textarea.post_comment_textarea").on('keydown keyup', function () {
    $(this).height(1).height($(this).prop('scrollHeight'));

    let scrollHeight = $(this).prop('scrollHeight');

    if (scrollHeight < 90) {
        $(this).css({
            "overflow-y": "hidden",
        });
    }
    else {
        $(this).css({
            "overflow-y": "visible",
        });
    }

    if ($(this).val().length > 0) {
        $(this).next().css({
            "display": "inline-block",
        })
    }
    else {
        $(this).next().css({
            "display": "None",
        })
    }
});

function second_modal_back() {
    $('#first_modal').css({ "display": "flex" });
    $('#second_modal').css({ "display": "none" });
    $('#upload_icon').css({ "color": "rgb(0, 0, 0)" });
    $('#first_modal_image_upload').css({ "background-color": "transparent" });
}

function close_modal_event(el) {
    document
        .querySelector(".second_modal_window")
        .classList
        .toggle("open");
    $(el)
        .parent()
        .css({ 'display': 'none' });
    $(document.body).css({ overflow: "auto" });
}

$('#sidenav_addbox_button').click(function () {
    $('#first_modal').css({
        "top": window.scrollY + "px",
        "display": "flex"
    });
    $(document.body).css({ overflow: "hidden" });
});

$('#first_modal')
    .on("dragover", dragOver)
    .on("dragleave", dragleave)
    .on("drop", uploadFiles);

function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.type == "dragover") {
        $('#upload_icon').css({ "color": "rgb(0, 149, 246)" });
        $('#first_modal_image_upload').css({ "background-color": "rgb(245, 245, 245)" });
    }

}

function dragleave(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.type == "dragleave") {
        $('#upload_icon').css({ "color": "rgb(0, 0, 0)" });
        $('#first_modal_image_upload').css({ "background-color": "transparent" });
    }
}

function uploadFiles(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer = e.originalEvent.dataTransfer;
    files = e.target.files || e.dataTransfer.files;
    console.log('파일이 올라옴.' + files[0].name);
    if (files.length > 1) {
        alert('파일은 한개만 올려주세요.');
        return;
    }
    if (files[0].type.match(/image.*/)) {
        $('.modal_image_upload').css({
            "background-image": "url(" + window
                .URL
                .createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "cover",
            "background-position": "center"
        });
        $('#second_modal_image_upload').css({
            "background-image": "url(" + window
                .URL
                .createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "cover",
            "background-position": "center"
        });
        $('#first_modal').css({ display: "none" });
        $('#second_modal').css({
            top: window.scrollY + "px",
            display: "flex"
        });
        document.querySelector('.second_modal_window').classList.toggle("open");
    } else {
        alert('이미지가 아닙니다.');
        return;
    }
}

$('#feed_share_button').click(function () {
    let file = files[0];
    let image = files[0].name;
    let content = $('#share_textbox').val();

    let formdata = new FormData();
    formdata.append('file', file);
    formdata.append('image', image);
    formdata.append('content', content);

    $.ajax({
        url: '/content/upload/',
        data: formdata,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('성공');
        },
        error: function (request, status, error) {
            console.log('에러');
        },
        complete: function () {
            console.log('완료');
            location.replace('/content/main');
        }
    })

});

$('#button_profile_upload').click(function () {
    $('#input_profile_upload').click();
});

function profile_upload() {
    let file = $('#input_profile_upload')[0].files[0];
    let email = JSON.parse(document.getElementById('useremail').textContent);

    let formdata = new FormData();
    formdata.append('file', file);
    formdata.append('email', email);

    $.ajax({
        url: '/user/profile/upload/',
        data: formdata,
        method: 'POST',
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('성공');
        },
        error: function (request, status, error) {
            console.log('에러');
        },
        complete: function () {
            console.log('완료');
            location.replace('/content/profile');
        }
    })
}


$('#button_feed_upload').click(function () {
    $('#input_feed_upload').click();
});

function feed_upload() {
    files = $('#input_feed_upload')[0].files;
    console.log('파일이 올라옴.' + files[0].name);
    if (files.length > 1) {
        alert('파일은 한개만 올려주세요.');
        return;
    }
    if (files[0].type.match(/image.*/)) {
        $('.modal_image_upload').css({
            "background-image": "url(" + window
                .URL
                .createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "cover",
            "background-position": "center"
        });
        $('#second_modal_image_upload').css({
            "background-image": "url(" + window
                .URL
                .createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "cover",
            "background-position": "center"
        });
        $('#first_modal').css({ display: "none" });
        $('#second_modal').css({
            top: window.scrollY + "px",
            display: "flex"
        });
        document.querySelector('.second_modal_window').classList.toggle("open");
    } else {
        alert('이미지가 아닙니다.');
        return;
    }
}

$('.feed_reply_submit_button').click(function (e) {
    let feed_id = e.target.attributes.getNamedItem("feed_id").value;
    let currentuser_nickname = JSON.parse(document.getElementById('user_nickname').textContent);
    let reply_id = 'reply_' + feed_id;
    let reply_content = $('#' + reply_id).val();

    if (reply_content.length <= 0) {
        return;
    }

    $.ajax({
        url: '/content/reply/',
        data: {
            feed_id: feed_id,
            reply_content: reply_content,
        },
        method: 'POST',
        success: function (data) {
            console.log('성공');
            //페이지 전체를 refresh하지 않고, 댓글부분만 refresh한다.
            //location.replace('/main')
            $('#reply_list_' + feed_id).append(
                "<p><b>" + currentuser_nickname + "</b>&nbsp; " + reply_content + "</p>"
            );
        },
        error: function (request, status, error) {
            console.log('에러');
        },
        complete: function () {
            console.log('완료');
            $('#' + reply_id).val('');
        }
    })

});

function animateHeart(element) {
    if ($(element).hasClass("favorite_fill")) {
        element.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.3)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 300,
                easing: "ease"
            }
        );
    }
}

$(function () {
    // 즉시 실행 함수 구문 사용
    //느낌표 2개는 형변환하여 boolean으로 표현
    $('.favorite').each(function () {
        var isLiked = !!$(this).data('liked');
        $(this).toggleClass('favorite_border', !isLiked).toggleClass('favorite_fill', isLiked);
    });

    $('.bookmark').each(function () {
        var ismarked = !!$(this).data('marked');
        $(this).toggleClass('bookmark_border', !ismarked).toggleClass('bookmark_fill', ismarked);
    });
});

$(".favorite").click(function (e) {
    if ($(this).hasClass("favorite_fill")) {
        $(this).html("favorite_border");
        $(this).toggleClass("favorite_fill favorite_border");
    } else {
        $(this).html("favorite");
        $(this).toggleClass("favorite_fill favorite_border");
        animateHeart(this);
    }

    let feed_id = e.target.attributes.getNamedItem('feed_id').value;
    let favorite_id = e.target.id;
    let favorite_text = $.trim($('#' + favorite_id).html());

    $.ajax({
        url: '/content/like/',
        data: {
            feed_id: feed_id,
            favorite_text: favorite_text,
        },
        method: 'POST',
        dataType: 'json',
        success: function (data) {
            $('#p_like_count_' + feed_id).html('<b>춘식이</b>님 <b>외' + data.like_count + '명</b>이 좋아합니다.');
            console.log('성공')
        },
        error: function (request, status, error) {
            console.log('에러');
        },
        complete: function () {
            console.log('완료');
        }
    })
});

$(".bookmark").click(function (e) {
    if ($(this).hasClass("bookmark_fill")) {
        $(this).html("bookmark_border");
        $(this).toggleClass("bookmark_fill bookmark_border");
    } else {
        $(this).html("bookmark");
        $(this).toggleClass("bookmark_fill bookmark_border");
    }

    let feed_id = e.target.attributes.getNamedItem('feed_id').value;
    let bookmark_id = e.target.id;
    let bookmark_text = $.trim($('#' + bookmark_id).html());

    $.ajax({
        url: '/content/bookmark/',
        data: {
            feed_id: feed_id,
            bookmark_text: bookmark_text,
        },
        method: 'POST',
        success: function (data) {
            console.log('성공')
        },
        error: function (request, status, error) {
            console.log('에러');
        },
        complete: function () {
            console.log('완료');
        }
    })
});