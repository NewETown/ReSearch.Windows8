(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("searchBtn").onclick = function (e) {
                WinJS.Navigation.navigate("/pages/results/results.html", { terms: document.getElementById("searchTerms").value });
            };
        }
    });
})();