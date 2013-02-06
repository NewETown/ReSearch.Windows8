// xmGJ+CFOgZtjSJhZWOb0QnxTa3KBu3LFB1I8Fd+pQPU=
/// <reference path="/js/ocho.js"/>
(function () {
    "use strict";
    var resultsListView;
    var selected;

    WinJS.UI.Pages.define("/pages/results/results.html", {
        ready: function (element, options) {
            document.querySelector(".pagetitle").innerText = options.terms;
            var resultsList = new WinJS.Binding.List();
            /*var imageList = [];
            var imageListPointer = 0;
            WinJS.xhr({
                url: "https://api.datamarket.azure.com/Bing/Search/v1/Image?$format=json&Query=%27" + encodeURIComponent(options.terms+(options.meta ? " " + options.meta : "")) + "%27",
            }).then(
                function (i) {
                    var imageResults = JSON.parse(i.response).d.results.forEach(function (j) {
                        imageList.push(j.MediaUrl);
                    });*/
            WinJS.xhr({
                url: "https://api.datamarket.azure.com/Bing/Search/v1/Web?$format=json&Query=%27" + encodeURIComponent(options.terms + (options.meta ? " " + options.meta : "")) + "%27",
                user: " ",
                password: "xmGJ+CFOgZtjSJhZWOb0QnxTa3KBu3LFB1I8Fd+pQPU=",
            }).then(
				function (e) {
				    var results = JSON.parse(e.response).d.results.map(function (r) {
				        r.documentPromise = WinJS.xhr({ url: r.Url, responseType: "document" });
				        return r;
				    });
                            
				    results.forEach(function (r) {
				        r.documentPromise.then(function (x) {
				            r.Description = "description";
				            var keywordsElement;
				            if (x.response) {
				                keywordsElement = x.response.querySelector("head > meta[name=keywords]");
				            }
				            r.Keywords = (keywordsElement ? keywordsElement.content : "");
				            r.Keywords = r.Keywords.replace(/, /g, ",");
				            r.Keywords = r.Keywords.replace(/,/g, ", ");
				            if (keywordsElement) resultsList.push(r);
				            /*if (imageList.length > imageListPointer) {
				                r.imageUrl = imageList[imageListPointer];
				                imageListPointer++;
				            } else {
				                r.imageUrl = "http://www.crazythemes.com/images/cool-abstract-desktop-wallpaper.jpg";
				            }*/
				            var colors = ["rgb(202,234,234)", "rgb(213,249,249)", "rgb(233,251,251)", "rgb(209,226,226)"]
				            r.color = colors[Math.floor(Math.random() * colors.length)];
				        }, function (error) { /* gulp */ });
				    });
				},
				function (err) {
				    debugger;
				}
			//}
            );

            Ocho.AppBar.set({
                buttons: [{
                    label: "Re:Search",
                    icon: "rotate",
                    section: "selection",
                    click: function () {
                        resultsListView.selection.getItems().then(function (e) {
                            var q = options.meta;
                            for (var i = 0; i < e.length; i++) {
                                var keywords = e[i].data.Keywords;
                                q += " " + (keywords != "" ? keywords : e[i].data.Title);
                            }
                            var metaArray = q.split(",");
                            metaArray.forEach(function (a) {
                                //a = a.trim();
                                console.log(a);
                            });
                            WinJS.Navigation.navigate("/pages/results/results.html", { terms: options.terms, meta: q });
                        }, function (err) {
                            debugger;
                        });
                    }
                }, {
                    label: "Open All",
                    icon: "globe",
                    section: "selection",
                    click:  function () {
                        resultsListView.selection.getItems().then(function (e) {
                            for (var i = 0; i < e.length; i++) {
                                Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(e[i].data.Url));
                            }
                        })
                    }
                }]
            });

            resultsListView = document.getElementById("resultsListView").winControl;
            resultsListView.itemDataSource = resultsList.dataSource;
            resultsListView.itemTemplate = document.getElementById("itemTemplate");
            resultsListView.oniteminvoked = function (e) {
                e.detail.itemPromise.then(function (item) {
                    location.href = item.data.Url;
                });
            };
            resultsListView.onselectionchanged = function (e) {
                if (resultsListView.selection.count() >= 1) {
                    document.getElementById("appbar").winControl.show();
                    document.getElementById("appbar").winControl.sticky = true;
                } else {
                    document.getElementById("appbar").winControl.hide();
                    document.getElementById("appbar").winControl.sticky = false;
                }
            };
        }
    });
})();
