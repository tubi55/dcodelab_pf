(function($){
    $.defaults = {
        key : undefined,
        playList : undefined,
        count : 10,
    }

    $.fn.myYoutube = function(opt){
        opt = $.extend({}, $.defaults, opt);

        if(opt.key == undefined ||  opt.playList == undefined) {
            console.error("api와 playList는 필수 입력사항입니다.")
        };
        
        new MyYoutube(this, opt);
        return this;
    }

    function MyYoutube(el, opt){     
        this.init(el, opt);
        this.bindingEvent();
    }

    MyYoutube.prototype.init = function(el, opt){     
        this.frame = el;
        this.key = opt.key;
        this.playList = opt.playList;
        this.count = opt.count;
    }
 
    MyYoutube.prototype.bindingEvent = function(){

        //로딩시 유튜브 데이트 호출
        this.callData();

        //썸네일 클릭시 유튜브 영상팝업 호출
        $("body").on("click", "article a", function(e){
            e.preventDefault();
            var vidId = $(e.currentTarget).attr("href");         

            this.createPop({
                width: "100%",
                height: "100vh",
                bg: "rgba(0,0,0,1)",
                vidId : vidId
            });

            $("body").css({ overflow: "hidden" });
        }.bind(this));

        //팝업 닫기버튼 클릭시 팝업제거
        $("body").on("click", ".pop .close", function(e){
            e.preventDefault();
            $(this).parent(".pop").fadeOut(500, function(){
                $(this).remove();
            });
            $("body").css({ overflow: "auto"});
        });
    }

    MyYoutube.prototype.callData = function(){
        $.ajax({
            url : "https://www.googleapis.com/youtube/v3/playlistItems",
            dataType : "jsonp",
            data : {
                part : "snippet",
                key : this.key,
                maxResults : this.count,
                playlistId : this.playList
            }
        })
        .success(function(data){ 
            var items = data.items;   
            this.createList(items);
        }.bind(this))
        .error(function(err){
            console.error(err);
        })
    }

    MyYoutube.prototype.createList = function(items){  
        $(items).each(function(index, data){
            var p_txt = data.snippet.description;
            var len = p_txt.length;
            var date = data.snippet.publishedAt.split("T")[0];

            (len>80) ? p_txt = p_txt.substr(0,80)+"..."  :  p_txt;          

            this.frame
                .append(
                    $("<article>")                  
                        .append(
                            $("<a class='pic'>")
                                .attr({ href : data.snippet.resourceId.videoId })
                                .css({ 
                                    backgroundImage: "url("+data.snippet.thumbnails.high.url+")" ,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }),
                            $("<div class='con'>")
                                .append(
                                    $("<h2>").text(data.snippet.title),
                                    $("<p>").text(p_txt),
                                    $("<span>").text(date)
                                )                                
                        )                        
                )
        }.bind(this));
    } 

    MyYoutube.prototype.createPop = function(opt){    
        $("body")
            .append(
                $("<aside class='pop'>")
                    .css({
                        width: opt.width, 
                        height: opt.height,
                        backgroundColor: opt.bg,
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        boxSizing: "border-box",
                        padding: "4vw",
                        display: "none",
                        zIndex: 10
                    })
                    .append(
                        $("<a href='#' class='close'>")
                            .text("close")
                            .css({
                                position: "absolute", 
                                bottom: 20,
                                right: 20,
                                color: "#fff",
                                zIndex: 10
                            }),
                        $("<img src='img/loading.gif'>")
                            .css({
                                width: 80,
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }),
                        $("<div class='con'>")
                            .css({
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                display: "none"
                            })
                            .append(
                                $("<iframe>")
                                    .attr({
                                        src: "https://www.youtube.com/embed/"+opt.vidId,
                                        width: "100%",
                                        height: "100%",
                                        frameborder: 0,
                                        allowfullscreen: true
                                    })
                            )
                    ).fadeIn()
            );//append ends

            setTimeout(function(){
                $(".pop .con").fadeIn(500, function(){
                    $(".pop>img").remove();
                })
            },1000);
    }

})(jQuery);