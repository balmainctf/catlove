/**
 * Created by soraping on 15/11/11.
 */
$(function(){
    $('#addNew').on('click',function(){
        var data = {

        };

        $.ajax({
            url:'/create',
            type:'post',
            dataType: 'json',
            success:function(res){

            },
            error:function(e){

            }
        });

    });
});