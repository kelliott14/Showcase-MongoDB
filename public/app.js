$(document).ready(function() {
    $(".favIcon").on("click", function() {
        var id = $(this).attr("id");
        var favState = $(this).attr("data-state")
        $.ajax({
            method: "PUT",
            url: "/articles/" + favState + "/" + id
        }).then(function(data) {
            location.reload();
        })
    });

    $(".collapseIcon").on("click", function(){
        if ($(".favBox").attr("visible-status") == "show"){
            $(".favBox").hide("slow", function(){});
            $(".favBox").attr("visible-status", "hide");
            $(".collapseIcon").css({"transform": "rotate(-180deg)"});
        }else {
            $(".favBox").show("slow", function(){});
            $(".favBox").attr("visible-status", "show");
            $(".collapseIcon").css({"transform": "rotate(0deg)"});
        }
    });

    $(".commentIcon").on("click", function() {
        $(".modal").css({"display":"block"});
    });

    $(".close").on("click", function() {
        $(".modal").css({"display":"none"});
    });
});