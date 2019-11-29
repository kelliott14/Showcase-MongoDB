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
        var id = $(this).attr("id");
        $(".commentForm").attr("id", id);
        $(".currentComments").empty();
        $.ajax({
            method: "GET",
            url: "/articles/" + id
        }).then(function(data) {
            console.log(data);
            // data.forEach(function(item) {
            //     var eachComment = $("<p>" + item.body + "</p>");
            //     var eachName = $("<h4>" + item.name + "</h4>");
            //     $(".currentComments").append(eachComment + eachName);
            // });
        });
    });

    $(".close").on("click", function() {
        $(".modal").css({"display":"none"});
    });

    $(".commentForm").submit(function(e) {
        var id = $(".commentForm").attr("id")
        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: {
                name: $("#commenterName").val().trim(),
                body: $("#commentText").val().trim()
            }
        }).then(function(results) {
            $(".currentComments").empty();
            $.ajax({
                method: "GET",
                url: "/articles/" + id
            }).then(function(data) {
                console.log(data);
                // data.forEach(function(item) {
                //     var eachComment = $("<p>" + item.body + "</p>");
                //     var eachName = $("<h4>" + item.name + "</h4>");
                //     $(".currentComments").append(eachComment + eachName);
                // });
            });
        })
        e.preventDefault()
    });


    
});