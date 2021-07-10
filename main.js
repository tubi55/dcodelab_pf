$("header ul li").on( "click", function(){
    let num = $(this).index()+1;
    console.log(num);

    $("main").removeClass();
    $("main").addClass("face"+num);

    $("header ul li").removeClass();
    $("header ul li").eq(num-1).addClass("on");

    $("main section").removeClass();
    $("main section").eq(num-1).addClass("on");
} );