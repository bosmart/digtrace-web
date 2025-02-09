$(".dropdown-menu").on('click', 'li a', function(){
            var selText = $(this).children("h4").html();


            $(this).parent('li').siblings().removeClass('active');
            $('#vl').val($(this).attr('data-value'));
            $(this).parents('.btn-group').find('.selection').html(selText);
            $(this).parents('li').addClass("active");

        });

        $(".dropdown-menu li").click(function(){
            $(this).parents(".btn-group").find('.btn').html(
                $(this).text()+" <span class=\"caret\"></span>"
            );
            var selected_text =  $(this).text()

            document.querySelector("#filter").value = selected_text;

        });


