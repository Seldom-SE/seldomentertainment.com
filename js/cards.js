// Images: 2304x1440 or 576x360

$(function () {
    // Setup reference to other part of the dataset
    var other1;
    var other2;
    if (page == "seasons") {
        other1 = "projects";
        other2 = "contributors";
    }
    else if (page == "projects") {
        other1 = "contributors"
        other2 = "seasons";
    }
    else {
        other1 = "projects";
        other2 = "seasons";
    }

    // Nav bar
    $("#"+page+"-tab").addClass("col-sm-4 active-tab");
    $("#"+page+"-text").addClass("active-text");
    $("#"+other1+"-tab").addClass("col-sm-4 inactive-tab");
    $("#"+other1+"-text").addClass("inactive-text");
    $("#"+other2+"-tab").addClass("col-sm-4 inactive-tab");
    $("#"+other2+"-text").addClass("inactive-text");

    // Parse xml
    var $xml = $($.parseXML(xml));
    var $current = $xml.find("cards").find(page).find("card");
    var cardCount = 0;
    var contribs = [];
    var roles = [];

    // Display selection, if there is one
    if (id != "none") {
        var out = "";
        var linkTo = other1;
        // Find the selection's card
        $current.each(function () {
            if ($(this).find("id:first").text() == id) {
                // Get selection info
                var title = $(this).find("title:first").text();
                var time = $(this).find("time").text();
                var desc = $(this).find("long").text().replace(/\n/g, '<br />');
                if (desc == "") {
                    desc = $(this).find("desc").text();
                }
                var other1Label = other1.charAt(0).toUpperCase()+other1.slice(1);

                // Display misc selection info
                out += `<div class="row active py-2">
                            <div class="col-md-12">
                                <div class="selection-title">
                                    `+title+`
                                </div>
                                <div class="selection-heading">
                                    `+time+`
                                </div>
                                <div class="selection-contents pt-5 px-3">
                                    `+desc+`
                                </div>`

                // Display links
                var $links = $(this).find("links").find("link");
                linksCount = $links.length;
                $links.each(function (index) {
                    if (index == 0) {
                        out += `<div class="selection-heading">
                                    Links
                                </div>
                                <div class="selection-contents px-3">`
                    }

                    var linkTitle = $(this).find("title").text();
                    var linkPlain = $(this).find("plain").text();
                    var linkSrc = $(this).find("src").text();

                    // Link format depends on what info was provided
                    if (linkSrc.length > 0) {
                        if (linkPlain.length > 0) {
                            out += linkTitle+': <a href="'+linkSrc+'">'+linkPlain+'</a><br>';
                        }
                        else {
                            out += linkTitle+': <a href="'+linkSrc+'">Click Here</a><br>';
                        }
                    }
                    else {
                        out += linkTitle+': '+linkPlain+'<br>';
                    }

                    if (index == linksCount - 1) {
                        out += '</div>'
                    }
                });

                // Display images
                out += `<div class="selection-heading pt-4 pb-3">
                            Images
                        </div>
                        <div class="selection-album">`

                $(this).find("images").find("img").each(function () {
                    var imgSrc = $(this).text();
                    out += `<div class="selection-image">
                                <img src="images/`+imgSrc+`" alt="`+imgSrc+`">
                            </div>`;
                });

                // Generate array of cards to display
                if (page == "seasons" || page == "projects") {
                    $(this).find("contribs").find("contrib").each(function () {
                        var contrib = $(this);
                        $xml.find("cards").find(other1).find("card").each(function () {
                            if ($(this).find("id:first").text() == contrib.find("id:first").text()) {
                                cardCount++;
                                contribs.push($(this));
                                roles.push(contrib.find("role").text());
                            }
                        });
                    });
                }
                else {
                    $xml.find("cards").find(other1).find("card").each(function () {
                        var contrib = $(this);
                        $(this).find("contribs").find("contrib").each(function () {
                            if ($(this).find("id").text() == id) {
                                cardCount++;
                                contribs.push(contrib);
                                roles.push($(this).find("role").text());
                            }
                        });
                    });
                }

                // Display label for cards
                if (contribs.length > 0) {
                    out += `</div>
                            <br>
                            <div class="selection-title pt-4">
                                `+other1Label+`:
                            </div>
                        </div>
                    </div>`;
                }

                // Display to HTML
                $("#selection:first").append(out);
            }
        });

        // Swap card source
        $current = $xml.find("cards").find(other1).find("card");
    }
    else {
        var linkTo = page;
        // Gererate array of cards
        $current.each(function () {
            contribs.push($(this));
        });
    }

    var out = "";
    
    // Display cards
    contribs.forEach(function (element, index) {
        // Display in 2 columns
        if (index % 2 == 0) {
            out += '<div class="row active py-2">';
        }

        // Get card info
        var cardId = element.find("id:first").text();
        var imgSrc = element.find("images").find("img:first").text();
        var title = element.find("title:first").text();
        var time = element.find("time").text();
        var desc = element.find("desc").text();

        // Display card
        out += `<div class="col-md-6">
                    <div class="card-wrapper">
                        <div class="d-block d-md-none info-card-xs"></div>
                        <div class="d-none d-md-block d-lg-none info-card-md"></div>
                        <div class="d-none d-lg-block info-card-lg"></div>
                        <div class="card-contents pt-3">
                            <a href="`+linkTo+`.html?id=`+cardId+`">
                                <img src="images/`+imgSrc+`" alt="`+imgSrc+`">
                                <div class="card-title">
                                    `+title+`
                                </div>
                            </a>
                            <div class="card-time">
                                `+time+`
                            </div>`;
        if (id != "none") {
            out += `<div class="card-role">
                        `+roles[index]+`
                    </div>`;
        }
        out += `<p>`+desc+`</p>
            </div>
        </div>
    </div>`;

        // End row after 2 cards
        if (index % 2 == 1 || (index % 2 == 0 && index == cardCount - 1)) {
            out += '</div>';
        }
    });

    // Put everything into the HTML
    $("#cards:first").append(out);
});