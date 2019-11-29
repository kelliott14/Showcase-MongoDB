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
            data.comment.forEach(function(item) {
                var eachComment = $("<div class='eachComment'>")
                eachComment.append("<button class='deleteComment modalButton' id=" + item._id + ">Delete</button>");
                eachComment.append('<p>"' + item.body + '"</p>');
                eachComment.append("<h4>Comment by:  " + item.name + "</h4>");
                $(".currentComments").append(eachComment);
            });
        });
    });

    $(".close").on("click", function() {
        $(".modal").css({"display":"none"});
    });

    $(".commentForm").submit(function(e) {
        var id = $(".commentForm").attr("id")
        $.ajax({
            method: "POST",
            url: "/submit/" + id,
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
                data.comment.forEach(function(item) {
                    var eachComment = $("<div class='eachComment'>")
                    eachComment.append("<button class='deleteComment modalButton' id=" + item._id + ">Delete</button>");
                    eachComment.append('<p>"' + item.body + '"</p>');
                    eachComment.append("<h4>Comment by:  " + item.name + "</h4>");  
                    $(".currentComments").append(eachComment);
                    $("#commenterName").val("");
                    $("#commentText").val("");
                });
            });
        });
        e.preventDefault()
    });

    $("body").on("click", ".deleteComment", function(){
        var id = $(this).attr("id");
        var articleId = $(this).parent().parent().parent();
        articleId = articleId.children("form").attr("id")
        $.ajax({
            method: "DELETE",
            url: "/comment/" + id,
        }).then(function(results) {
            $(".currentComments").empty();
            $.ajax({
                method: "GET",
                url: "/articles/" + articleId
            }).then(function(data) {
                data.comment.forEach(function(item) {
                    var eachComment = $("<div class='eachComment'>")
                    eachComment.append("<button class='deleteComment modalButton' id=" + item._id + ">Delete</button>");
                    eachComment.append('<p>"' + item.body + '"</p>');
                    eachComment.append("<h4>Comment by:  " + item.name + "</h4>");
                    $(".currentComments").append(eachComment);
                    $("#commenterName").val("");
                    $("#commentText").val("");
                });
            });
        });
    });

    $("#scrapeButton").on("click", function() {
        $(".articleHeader").append("<h4>Scrape is loading...</h4>")
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function(data) {
            location.reload();
        })
    })

});