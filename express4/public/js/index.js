/**
 * Created by soraping on 15/11/11.
 */
$(function(){
    $('#addNew').on('click',function(){
        var data = {
            uid:$("input[name='uid']").val(),
            title:$("input[name='title']").val(),
            content:$("textarea[name='content']").val()
        };

        //console.log(data);

        $.ajax({
            url:'/create',
            type:'post',
            data:data,
            dataType:'json',
            success:function(res){
                console.log(res);
                location.href = '/';
            },
            error:function(e){
                console.log(e);
            }
        });

    });

    function delData(id){
        console.log(id);
    };
});