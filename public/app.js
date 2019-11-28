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
    })
});