let files;

function updateCounter(el) {
    $('#test_cnt').html($(el).val().length + "/2200");

    // 글자수 제한
    if ($(el).val().length > 2200) {
        $(el).val($(el).val().substring(0, 2200));
        $('#test_cnt').html("2200 / 2200");
    };
};

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
    let user_id = JSON.parse(document.getElementById('user_nickname').textContent);
    let profile_image = JSON.parse(document.getElementById('user_profile_image').textContent);

    let formdata = new FormData();
    formdata.append('file', file);
    formdata.append('image', image);
    formdata.append('content', content);
    formdata.append('user_id', user_id);
    formdata.append('profile_image', profile_image);

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
            location.replace('/main');
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