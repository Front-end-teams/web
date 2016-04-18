var cover = document.querySelector('.contaniner');

var pop2 = document.querySelector('.p2');

var pop3 = document.querySelector('.p3');

//type值可以为error、success和warning

var pop = Popuper({
    wrap: cover,
    type: 'error',
    confirm: function() {
        alert('success');
    },
    cancel: function() {
        alert('cancel');
    }
});

var p2 = Popuper({

    wrap: pop2,
    type: 'success',
    confirm: function() {
        alert('confirm callback');
    },
    cancel: function() {
        alert('cancel callback');
    }

}).edit({

    title: '提示',
    content: '文章上传成功'

}).show();

var p3 = Popuper({
    wrap: pop3,
    type: 'warning',
    confirm: function() {
        alert('success');
    },
    cancel: function() {
        alert('cancel');
    }
});

/*btn.addEventListener('click', function() {
    pop.toggle();
});
btn2.addEventListener('click', function() {
    p2.toggle().edit({
        type: 'info'
    });
});
btn3.addEventListener('click', function() {
    p3.toggle();
});*/