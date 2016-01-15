/**
 * Created by soraping on 15/11/11.
 */
$(function(){
    //添加数据
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

    //跟新数据
    $('#updateData').on('click',function(){

        var data = {
            _id:$("input[name='hiddenId']").val(),
            uid:$("input[name='uidUpd']").val(),
            title:$("input[name='titleUpd']").val(),
            content:$("textarea[name='contentUpd']").val()
        };

        //console.log(data);

        $.ajax({
            url:'/update',
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


});


//删除数据
function delData(id){
    console.log(id);
    var data = {
       id:id
    };

    $.ajax({
        url:'/del',
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


};
