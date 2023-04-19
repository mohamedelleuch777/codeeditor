/*
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 **************																											************
 **************																											************
 **************											SCRIPT LIB														************
 **************																											************
 **************																											************
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Mon Mar 21 2022 @ 12:25
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
 class ScriptLib {
    constructor() {
        // Member List:
        this.isApplication = this.getCookie("MC_DEVICE_ID") == "-111" ? true : false;
        this.isMobile = this.getCookie("MC_DEVICE_ID") == "-11" ? true : false;
        this.isDesktop = this.getCookie("MC_DEVICE_ID") == "-1" ? true : false;
        this.isMainPage = dataLayer[0].pageType === "Home" ? true : false;
        this.isPDP = window.location.pathname.indexOf("/tr/product") >= 0 ? true : false;
        this.isBasketPage = window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelDisplayBasket") >= 0 ? true : false;
        this.isCategoryPage = window.location.pathname.indexOf("/tr/category") >= 0 ? true : false;
        this.isOutlet = window.location.pathname.indexOf("/tr/category/_outlet") >= 0 ? true : false; // outlet page is also category page
        this.isSearchPage = (
            window.location.pathname.indexOf("/tr/search") >= 0 /* ||
            window.location.pathname.indexOf("/tr/shop") >= 0 */
            ) ? true : false;
        this.isInstallationPage = window.location.pathname.indexOf("/tr/shop/urun-kurulumu.html") >= 0 ? true : false;
        this.isWishListPage = window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelMAWishlist") >= 0 ? true : false;
        this.isThankyouPage =  window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelOrderSent") >= 0 ? true : false;
        this.isRegisterBasketPage = window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelOrderSummary") >= 0 ||
            window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelOrderRegistration") >= 0 ? true : false;
        this.isBasketSummaryPage = this.isRegisterBasketPage;
        this.isRegisterPage = window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelMARegister") >= 0 ||
            window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelUserRegistrationAdd") >= 0 ? true : false;
        this.isPLP = this.isCategoryPage || this.isSearchPage;
        this.isLoginPage =  window.location.pathname.indexOf("/webapp/wcs/stores/servlet/LogonForm") >= 0 ? true : false;
        this.isCheckoutLoginPage =  window.location.pathname.indexOf("/webapp/wcs/stores/servlet/MultiChannelOrderAuthentication") >= 0 ? true : false;
        this.userData = mcs.user;
        this.isTestModeActive = false;
        this.keyMap = [];
        this.userInfo = this.readUserInfo();
        // End of member list
        this.injectCSS("https://ux.mediamarkt.com.tr/MMFrontend/ecomm/scripts/scriptLib/script_lib.min.css");
        this.ListenToLoading();
        this.ListenToLoadingMobile();
        this.ListenMobilePlpLazyLoad();
        this.ListenCarouselSliding();
        this.setTestMode();
        this.unsetTestMode();
        this.setGuiMode();
        this.unsetGuiMode();
        this.overwriteConsoleLog();
        this.KeyState();
        this.CompareArrays();
        this.ActivateGuiMode();
        // End of method list
        $('body').append('<div id="script-lib-popup" style="display:none;"></div>');
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Mar 21 2022 @ 16:40
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    waitUntilFieldCreated(fieldSelector, waitingDelay = 10 /* time in seconds*/ ) {
        return new Promise((resolve, reject) => {
            let timeout = waitingDelay * 1000;
            let finderWorker = setInterval(() => {
                // console.log("searching field");
                if ($(fieldSelector).length) {
                    clearInterval(finderWorker);
                    resolve(true);
                }
                if (timeout <= 0) {
                    clearInterval(finderWorker);
                    resolve(false);
                }
                timeout -= 10;
            }, 10);
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Sep 22 2022 @ 14:46
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    executeWhenFieldCreated(fieldSelector, callBack, repeat = 0) {
        console.info("controle started");
        let innerRepeat = repeat - 1;
        let finderWorker = setInterval(() => {
            // console.log("searching field");
            if ($(fieldSelector).length) {
                callBack();
            }
            if (innerRepeat === 0) {
                clearInterval(finderWorker);
            }
            if (innerRepeat > 0) {
                innerRepeat--;
            }
        }, 10);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Mar 16 2022 @ 12:25
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    die(msg = "") {
        throw msg != "" ? msg : "dead!!!";
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Mar 21 2022 @ 16:54
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    injectCSS(url) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        link.media = "all";
        head.appendChild(link);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Thu Mar 24 2022 @ 08:39
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    injectJS(src) {
        return new Promise(function(resolve, reject) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", resolve);
            script.addEventListener("error", function(e) {
                reject(e.error);
            });
            document.head.appendChild(script);
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Apr 12 2022 @ 15:49
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    injectBrutJS(js_code) {
        return new Promise(function(resolve, reject) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.innerHTML = js_code;
            script.addEventListener("load", resolve);
            script.addEventListener("error", function(e) {
                reject(e.error);
            });
            document.head.appendChild(script);
        });
    }

    SetLoadingLayer(status = true) {
        var loadingLayer = $("#loading-wrapper");
        if (status) {
            loadingLayer.css('display', 'flex');
        } else {
            loadingLayer.css('display', 'none');
        }
    }   

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Mar 13 2023 @ 15:49
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    KeyState() {
        // var x = document.createEvent("KeyboardEvent");
        // x.initEvent("onKeyChange", false, false, { keyMap: this.keyMap });
        // x.initCustomEvent('onKeyChange', false, false, { keyMap: this.keyMap });
        let oldKeyMap = []
        jQuery(window).keydown( e => {
            if(!this.keyMap.filter( f => f == e.keyCode).length)
                this.keyMap.push(e.keyCode)
            if(localStorage.debugKeyMap==='true') {
                if(!oldKeyMap.equals(this.keyMap)) {
                    // document.dispatchEvent(x);
                    const myEvent = new CustomEvent("onKeyChange",  { detail: { keyMap: this.keyMap, }, data: { keyMap: this.keyMap, } });
                    document.dispatchEvent(myEvent);
                }
            }
            oldKeyMap = structuredClone(this.keyMap);
        });
        jQuery(window).keyup( e => {
            let pos = this.keyMap.indexOf(e.keyCode);
            if(pos>=0)
                this.keyMap.splice(pos,1);
            if(localStorage.debugKeyMap==='true') {
                // document.dispatchEvent(x);
                const myEvent = new CustomEvent("onKeyChange",  { detail: { keyMap: this.keyMap, }, data: { keyMap: this.keyMap, } });
                document.dispatchEvent(myEvent);
            }
            oldKeyMap = structuredClone(this.keyMap);
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Apr 12 2022 @ 15:49
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    StartDebugger() {
        $(document).on('onKeyChange', () => {
            if(localStorage.debugKeyMap === 'true' || localStorage.debug === 'true') {
                console.info(scriptLib.keyMap);
                if(scriptLib.keyMap.equals([17,112])) { // CTRL + F1
                    debugger
                }
            }
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Apr 12 2022 @ 15:49
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    injectBrutCSS(css_code) {
        return new Promise(function(resolve, reject) {
            css_code = `
            <style>
                ${css_code}
            </style>
            `;
            document.head.insertAdjacentHTML("beforeend", css_code);
            resolve(true);
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Mar 23 2022 @ 09:59
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    ListenToLoading() {
        var x = document.createEvent("MouseEvent");
        x.initEvent("onLoadingStarted");
        var y = document.createEvent("MouseEvent");
        y.initEvent("onLoadingFinished");
        var loadingWin = false;
        setInterval(function() {
            if (
                $("#loading-bar-spinner").length + $("#loading").length > 0 &&
                !loadingWin
            ) {
                loadingWin = true;
                document.dispatchEvent(x);
            }
            if (
                $("#loading-bar-spinner").length + $("#loading").length == 0 &&
                loadingWin
            ) {
                loadingWin = false;
                document.dispatchEvent(y);
            }
        }, 50);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Mar 15 2023 @ 14:28
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    ListenToLoadingMobile() {
        var x = document.createEvent("MouseEvent");
        x.initEvent("onLoadingStarted");
        var y = document.createEvent("MouseEvent");
        y.initEvent("onLoadingFinished");
        var loadingWinVir = false;
        setInterval(function() {
            if (
                $(".mrh-page-overlay-spinner").css('display') === 'block' &&
                !loadingWinVir
            ) {
                loadingWinVir = true;
                document.dispatchEvent(x);
            }
            if (
                $(".mrh-page-overlay-spinner").css('display') === 'none' &&
                loadingWinVir
            ) {
                loadingWinVir = false;
                document.dispatchEvent(y);
            }
        }, 50);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Dec 30 2022 @ 19:32
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    ListenMobilePlpLazyLoad() {
        window.ListenMobilePlpLazyLoadState = false;
        // mrh-endless-scroll-end loading
        var x = document.createEvent("MouseEvent");
        x.initEvent("onPlpLoadNewItemsFinished");
        var y = document.createEvent("MouseEvent");
        y.initEvent("onPlpLoadNewItemsStarted");
        window.lastProductListLength = 0
        setInterval( () => {
            if($('.mrh-endless-scroll-end.loading').length>0) {
                if(!window.ListenMobilePlpLazyLoadState) {
                    document.dispatchEvent(y);
                    window.ListenMobilePlpLazyLoadState = true;
                }
            }
            let currentProdListLength = $('.product-list-container .product-list li').length;
            if(currentProdListLength > lastProductListLength) {
                lastProductListLength = currentProdListLength;
                window.ListenMobilePlpLazyLoadState = false;
                document.dispatchEvent(x);
            }
        },100);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Jan 2 2023 @ 09:12
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    async ListenCarouselSliding() {
        var x = document.createEvent("MouseEvent");
        x.initEvent("onSlideCarousel");
        if(this.isDesktop) {
            if(await this.waitUntilFieldCreated('#homepage-content .product-container .prev')) {
                $('#homepage-content .product-container .prev, #homepage-content .product-container .next').click( () => {
                    setTimeout(()=>{
                        document.dispatchEvent(x);
                    },500);
                });
            }
        }
        else if(this.isMobile || this.isApplication) {
            let fields = '#wrapper-main > div:nth-child(8) > div:nth-child(4) > div > div.swiper-wrapper > div';
            if (await this.waitUntilFieldCreated(fields)) {
                let prevCount;
                const worker = () => {
                    if(prevCount != $(fields).length) {
                        setTimeout(()=>{
                            document.dispatchEvent(x);
                            prevCount = $(fields).length
                        },100);
                    }
                }
                setInterval(worker, 250);
            }
        }
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Mar 23 2022 @ 17:03
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Mar 23 2022 @ 17:03
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Wed Apr 13 2022 @ 18:51
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getNextWorkDay(date) {
        let d = new Date(+date);
        let day = d.getDay() || 7;
        d.setDate(d.getDate() + (day > 5 ? 8 - day : 1));
        return d;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Sal Apr 19 2022 @ 14:32
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    async getProductTitle() {
        if (this.isDesktop) {
            if (await this.waitUntilFieldCreated('h1[itemprop="name"]')) {
                return $('h1[itemprop="name"]').text();
            }
        }
        if (this.isMobile || this.isApplication) {
            if (await this.waitUntilFieldCreated(".product-overview-title span")) {
                return $(".product-overview-title span").text();
            }
        }
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Sal Apr 19 2022 @ 14:43
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getProductBrand() {
        return $('meta[itemprop="brand"]').attr("content");
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Sal Apr 19 2022 @ 16:36
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getProductSKU() {
        if(this.isDesktop)
            return $('#product-details span[itemprop="sku"]').text();
        else
            return $('meta[itemprop="sku"]').attr('content').split(':')[1];
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Feb 17 2023 @ 16:36
     *** Developed By Yahya Bulca
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getProductsSKU() {
        var items = [];

        if (scriptLib.isDesktop) {
            $(".products-list > li").each(function(i, item){
                if(!$(item).hasClass("with-contenspot")){
                    items.push($(item).find(".product-wrapper").attr('data-modelnumber'));
                }
            })
        }
        else if(scriptLib.isMobile){
            $(".product-list > li").each(function(i, item){
                items.push($(item).find(".product-teaser-container").attr('data-modelnumber'));
            })
        }

        return items;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Feb 17 2023 @ 16:36
     *** Developed By Yahya Bulca
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
     async getPlpFilter() {
        var filtersJSON = [];

        if (scriptLib.isDesktop) {
            await $(".headline > a").each(async function () {
                if ($(this).html() == "Marka") {
                    var brandItems = $(this).parents("fieldset").find("ul.options > li");

                    filtersJSON.push(
                        {
                            "name": "brand",
                            "operator": "eq",
                            "value": ""
                        }
                    )

                    await brandItems.each(function () {
                        if ($(this).attr("class") == "active") {
                            filtersJSON[0].value += "|" + $(this).find(".facet-text").html().split('<em class')[0].trim()
                        }
                    })
                    if(filtersJSON[0].value)
                    filtersJSON[0].value = filtersJSON[0].value.substring(filtersJSON[0].value.indexOf("|")+1);
                }
            });

            filtersJSON.push({
                "name": "price",
                "operator": "ge",
                "value": $("input.price-from").val()
            });

            filtersJSON.push({
                "name": "price",
                "operator": "le",
                "value": $("input.price-to").val()
            });
        }
        else if (scriptLib.isMobile) {
            $(".mrh-accordion-headline > a").each(function () {
                if ($(this).find("span").html() == "Marka") {
                    var brandItems = $(this).parents(".facettes-container").find(".mrh-accordion-container");

                    filtersJSON.push(
                        {
                            "name": "brand",
                            "operator": "eq",
                            "value": ""
                        }
                    )
                    /*
                    filtersJSON.push(
                        {
                            "name": "others",
                            "operator": "eq",
                            "value": ""
                        }
                    )
                    */
                    brandItems.each(function () {
                        if ($(this).hasClass("selected")) {
                            $(this).find(".mrh-accordion-content > ul").each(function(){
                                if ($(this).find("li input").is(":checked")) {
                                    if($(this).find("li > label").attr('for').startsWith('brand-')===true) {
                                        filtersJSON[0].value += "|" + $(this).find("li > label").html().split('<span class')[0].trim();
                                    } else {
                                        filtersJSON[1].value += "|" + $(this).find("li > label").html().split('<span class')[0].trim();
                                    }
                                }
                            })
                        }
                    })
                    if(filtersJSON[0].value)
                        filtersJSON[0].value = filtersJSON[0].value.substring(filtersJSON[0].value.indexOf("|")+1);
                    // if(filtersJSON[1].value)
                    //     filtersJSON[1].value = filtersJSON[1].value.substring(filtersJSON[1].value.indexOf("|")+1);
                }
            });

            filtersJSON.push({
                "name": "price",
                "operator": "ge",
                "value": $("input.input-lower-value").val()
            });

            filtersJSON.push({
                "name": "price",
                "operator": "le",
                "value": $("input.input-upper-value").val()
            });
        }
        
        return filtersJSON;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Apr 22 2022 @ 09:12
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    runThisFunctionOnlyInTestMode(uuid) {
        let divHtml = `
        <div id="test-popup" class="move-to-right">
            %HTML%
        </div>
        `;
        const showTestPopup = (uuid) => {
            let html = `
				<button id="quit"></button>
				<h3>ScriptLib Test Mode</h3>
				<p>
					If you see this popup that means you are on test mode. Current test UUID is: 
					<span class="uuid-container">${uuid}</span>
				</p>
				<button id="btn-exit-text">Exit Test</button>
			`;
            if($('#test-popup').length) {
                // $("#test-popup").html(html);
            } else {
                divHtml = divHtml.replace('%HTML%',html);
                $("body").append(divHtml);
                $("body #test-popup #quit").click(() => {
                    if ($("#test-popup").hasClass("move-to-left")) {
                        $("#test-popup").removeClass("move-to-left");
                        $("#test-popup").addClass("move-to-right");
                    } else if ($("#test-popup").hasClass("move-to-right")) {
                        $("#test-popup").removeClass("move-to-right");
                        $("#test-popup").addClass("move-to-left");
                    }
                });
                this.waitUntilFieldCreated("body #test-popup #btn-exit-text").then(() => {
                    $("body #test-popup #btn-exit-text").click(() => {
                        localStorage.removeItem("SCRIPT_LIB_TEST_UUID");
                        $("body #test-popup").remove();
                    });
                });
                var mousePosition;
                var offset = [
                    localStorage.getItem("test-popup:x"),
                    localStorage.getItem("test-popup:y"),
                ];
                var isDown = false;

                let div = document.getElementById("test-popup");

                div.style.left = offset[0] + "px";
                div.style.top = offset[1] + "px";

                div.addEventListener(
                    "mousedown",
                    function(e) {
                        isDown = true;
                        offset = [div.offsetLeft - e.clientX, div.offsetTop - e.clientY];
                    },
                    true
                );

                document.addEventListener(
                    "mouseup",
                    function() {
                        isDown = false;
                    },
                    true
                );

                document.addEventListener(
                    "mousemove",
                    function(event) {
                        event.preventDefault();
                        if (isDown) {
                            mousePosition = {
                                x: event.clientX,
                                y: event.clientY,
                            };
                            localStorage.setItem("test-popup:x", mousePosition.x);
                            localStorage.setItem("test-popup:y", mousePosition.y);
                            div.style.left = mousePosition.x + offset[0] + "px";
                            div.style.top = mousePosition.y + offset[1] + "px";
                        }
                    },
                    true
                );
            }
        };
        let currentPageUUID = localStorage.getItem("SCRIPT_LIB_TEST_UUID");
        if (uuid === currentPageUUID) {
            showTestPopup(uuid);
            this.isTestModeActive = true;
            return true;
        }
        return false;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Apr 22 2022 @ 09:43
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    setTestMode() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var uuid = url.searchParams.get("SCRIPT_LIB_TEST_UUID");
        if (uuid !== null) {
            localStorage.setItem("SCRIPT_LIB_TEST_UUID", uuid);
        }
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Apr 22 2022 @ 10:07
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    unsetTestMode() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var uuid_end = url.searchParams.get("SCRIPT_LIB_TEST_UUID_END");
        if (uuid_end !== null) {
            localStorage.removeItem("SCRIPT_LIB_TEST_UUID");
        }
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Mar 23 2023 @ 08:52
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    setGuiMode() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var uuid = url.searchParams.get("SCRIPT_LIB_GUI");
        localStorage.setItem("SCRIPT_LIB_GUI", new Date().getTime());
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Mar 23 2023 @ 08:52
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    unsetGuiMode() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var uuid_end = url.searchParams.get("SCRIPT_LIB_GUI_END");
        if (uuid_end !== null) {
            localStorage.removeItem("SCRIPT_LIB_GUI");
        }
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Sep 22 2022 @ 14:54
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    overwriteConsoleLog() {
        //https://www.mediamarkt.com.tr/?SCRIPT_LIB_TEST_UUID=0a5376ff-ddc4-44c1-9364-92337a1622b9
        /*
                if (!this.runThisFunctionOnlyInTestMode(
                    "0a5376ff-ddc4-44c1-9364-92337a1622b9"
                ))
                return;
        */
        window.pauseConsoleMessage = new Date().getTime();
        /*
                window.originalConsoleLog = console.info;
                window.newConsoleLog  = function () { // this must be declared as function and not as arrow function cuz ES6 has no 'arguments' keyword
                    for (let i = 0; i < arguments.length; i++) {
                        const currentArg = arguments[i];
                        window.originalConsoleLog(currentArg);
                    }
                }
                console.log = newConsoleLog;
                console.info = newConsoleLog;
        */
        let condition = this.isTestModeActive || localStorage.debug === 'true';
        if (!condition) {
            window.originalConsoleLog = console.info;
            window.newConsoleLog = function() { // this must be declared as function and not as arrow function cuz ES6 has no 'arguments' keyword
                if (window.pauseConsoleMessage + 3000 < new Date().getTime()) { // only log this message once per 3 seconds
                    window.originalConsoleLog(
                        "%cConsole Messages has been disabled. You can see them only in TEST MODE or when debug flag is activated",
                        "background: #222; color: #bada55"
                    );
                    window.pauseConsoleMessage = new Date().getTime();
                }
            }
            console.log = newConsoleLog;
            console.info = newConsoleLog;
        }
    }


    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Mon Mar 13 2023 @ 10:54
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    getCategoryPath() {
        //https://www.mediamarkt.com.tr/?SCRIPT_LIB_TEST_UUID=0a5376ff-ddc4-44c1-9364-92337a1622b9
        /*
                if (!this.runThisFunctionOnlyInTestMode(
                    "0a5376ff-ddc4-44c1-9364-92337a1622b9"
                ))
                return;
        */
        let res = "";
        let myObj;
        if(this.isSearchPage){
            myObj = dataLayer.filter( s => s.pageType && (s.pageType=="Search Results"))[0];
        }
        else if(this.isCategoryPage){
            myObj = dataLayer.filter( s => s.pageType && (s.pageType=="Category"))[0];
        }
        else if(this.isPDP){
            if(this.isDesktop){
                myObj = dataLayer.filter( s => s.pageType && (s.pageType=="Productdetail"))[0];
            }
            else if(this.isMobile){
                myObj = dataLayer.filter( s => s.pageType && (s.pageType=="ProductdetailNew"))[0];
            }
        }
        if(myObj) {
            let zax = Object.keys(myObj).filter( r => r.indexOf("dimension")>= 0)
            res = [myObj.category]
            zax.forEach( it => {
                res.push(myObj[it])
            })
        }
        return res;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jun 27 2022 @ 14:30
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */

    CompareArrays() {
        // Warn if overriding existing method
        if(Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
        // attach the .equals method to Array's prototype to call it on any array
        Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;
        // if the argument is the same array, we can be sure the contents are same as well
        if(array === this)
            return true;
        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;       
            }           
            else if (this[i] != array[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
        }
        // Hide method from for-in loops
        Object.defineProperty(Array.prototype, "equals", {enumerable: false});
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jun 27 2022 @ 14:30
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    async addItemToCart(catEntryId, cat, storeId = 103452, extraParams = "") {
        //////////////////////////
        // get request:
        //////////////////////////
        function httpGet(theUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }
        // var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId="+storeId+"&langId=-14&catEntryId_"+catEntry+"="+catEntry+"&categoryId_"+catEntry+"="+cat+"&quantity_"+catEntry+"=1";
        var link =
            "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?catEntryId=" +
            catEntryId +
            "&categoryId=" +
            cat +
            "&langId=-14&storeId=" +
            storeId +
            "&quantity=1" +
            extraParams;
        //console.info("item added to the cart",link)
        return httpGet(link);
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jan 26 2023 @ 09:54
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
    */
    productsInCart() {
        return dataLayer.filter(a=>a.event=="EECcheckout")[0].ecommerce.checkout.products;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jul 04 2022 @ 14:53
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    productsInCartCount() {
        /*
        let rest = await this.waitUntilFieldCreated(".ctable-wrapper table.ctable");
        if (rest) {
            return $('.ctable-wrapper table.ctable tbody[product="product"]').length;
        }
        return null;
        */
        return this.productsInCart().length
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jan 26 2023 @ 09:58
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2023 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
    */
    productsPurchased() { // Thankyou Page
        return dataLayer.filter(a=>a.event=='EECpurchase')[0].ecommerce.purchase.products;
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Fri Jul 07 2022 @ 16:28
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */
    API_getProductPrice(sku) {
        return new Promise((resolve) => {
            let metaPath = "product:price:amount";
            if (scriptLib.isMobile) {
                // change to desktop version
                scriptLib.setCookie("MC_DEVICE_ID", "-1", 125);
            }
            fetch(`https://www.mediamarkt.com.tr/catentry/${sku}`).then(
                async(res) => {
                    if (scriptLib.isMobile) {
                        // return back to mobile version
                        scriptLib.setCookie("MC_DEVICE_ID", "-11", 125);
                    }
                    let pdpPageHtml = $(await res.text());
                    pdpPageHtml.each((i, element) => {
                        element = $(element);
                        if (element[0].nodeName == "META") {
                            if (element.attr("property") == metaPath) {
                                let price = element.attr("content");
                                resolve(price);
                            }
                        }
                    });
                    resolve(undefined);
                }
            );
        });
    }

    /***********************************************************************************************************************************
     ************************************************************************************************************************************
     *** Created on Tue Nov 01 2022 @ 13:13
     *** Developed By Mohamed Elleuch
     *** Copyright (c) 2022 - MIT
     ************************************************************************************************************************************
     ************************************************************************************************************************************
     */

    GtmDispatchEvent(eventName, objectClassName, objectId, object) {
        dataLayer.push({
            "event": eventName,
            "gtm.element": {
                "jQuery111306991843893108853": 236,
                "sizzle1666354906431": {
                    "parentNode": [
                        4411,
                        122,
                        false
                    ]
                }
            },
            "gtm.elementClasses": objectClassName,
            "gtm.elementId": objectId,
            "gtm.elementTarget": "",
            "gtm.elementUrl": "",
            "gtm.uniqueEventId": new Date().getTime(),
            ...object
        })
    }

    AreWeInThisPeriod = (a, b) => {
        let d = new Date();
        let c1 = d > new Date(a);
        let c2 = d < new Date(b);
        let c3 = c1 && c2;
        return c3;
    }



    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Tue Mar 16 2023 @ 17:29
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    Sleep(ms)
    {
        return(
            new Promise(function(resolve, reject)
            {
                setTimeout(function() { resolve(); }, ms);
            })
        );
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Tue Mar 20 2023 @ 11:38
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    ActivateGuiMode() {
        return;
        if(localStorage.SCRIPT_LIB_GUI===undefined) return;
        let html = `
        <div id="gui-editor">
            <h3>ScriptLib GUI Editor</h3>
            <p id="sabboura">
                
            </p>
            <button id="btn-exit-text">Exit Test</button>
        </div>
        <div id="overlay-blurry"></div>
        `;
        $("body #gui-editor #quit").click(() => {
            if ($("#gui-editor").hasClass("move-to-left")) {
                $("#gui-editor").removeClass("move-to-left");
                $("#gui-editor").addClass("move-to-right");
            } else if ($("#gui-editor").hasClass("move-to-right")) {
                $("#gui-editor").removeClass("move-to-right");
                $("#gui-editor").addClass("move-to-left");
            }
        });
        this.waitUntilFieldCreated("body #gui-editor #btn-exit-text").then(() => {
            $("body #gui-editor #btn-exit-text").click(() => {
                localStorage.removeItem("SCRIPT_LIB_GUI");
                $("body #gui-editor").remove();
            });
        });
        if($('#gui-editor').length==0) {
            $('body').append(html);
        }
        let k = this.keyMap;
        document.body.addEventListener("mousemove", function(e) {
            if(k.equals([17])) {
                $('#overlay-blurry').show();
                return;
            } else {
                $('#overlay-blurry').hide();
            }
    		let x=e.clientX;
    		let y=e.clientY;
            if(y<window.innerHeight*0.3) {
                $("body #gui-editor").addClass('louta');
            }
            else if(y>window.innerHeight*0.6) {
                $("body #gui-editor").removeClass('louta');
            }
    		let cursor=`
            <strong>Mouse Position Is :</strong> ${x} and ${y}<br>
            <u style="color:red;font-weight: 700;">Current Element:</u><br>
            <strong>Tagname:</strong> ${window.current.tagName.toLowerCase()}<br>
            <strong>ID:</strong> ${window.current.id}<br>
            <strong>Class:</strong> ${window.current.getAttribute('class')}<br>
            `;
    		document.getElementById("sabboura").innerHTML=cursor
        })
        document.body.addEventListener("mouseover", function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.target.addEventListener("mouseout", function (e) {
                e.target.className = e.target.className.replace(new RegExp(" highlight\\b", "g"), "");
                window.current = e.target;
            });
            e.target.className += " highlight";
        });
        this.injectBrutCSS(`.highlight { outline: 4px solid #07C; transition: all 400ms; background-color: #0077cc3b; }`);
        // this.StopAllEvents();
        /*
        let stop = setInterval(this.StopAllEvents, 750);
        $(window).load(function () {
            setTimeout( () => clearInterval(stop),3000);
          });
        */
        document.body.addEventListener("click", function(e) {
            e.stopPropagation();
            $(e.target).off();
            console.warn(e.target);
        });
    }



    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Tue Mar 20 2023 @ 16:16
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    StopAllEvents() {
        $("a").click(function(e) { e.preventDefault(); e.stopPropagation(); });
        $("button").click(function(e) { e.preventDefault(); e.stopPropagation(); });
        $("div").click(function(e) { e.preventDefault(); e.stopPropagation(); });
        $("span").click(function(e) { e.preventDefault(); e.stopPropagation(); });
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Tue Mar 28 2023 @ 10:55
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    limitExecutionByTime(time) {
        let t1 = new Date().getTime();
        if(typeof(t0)==='undefined') {
            window.t0 = t1;
            return false; // executed first time ... not limited
        } else {
            if(t1-window.t0>=time) {
                window.t0 = t1;
                return false; // period bigger than time passed ... not limited
            } else {
                return true; // period less than time passed ... limited
            }
        }
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Wed Mar 29 2023 @ 09:32
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    SendEvent(eventName, eventData=null) {
        const myEvent = new CustomEvent(eventName,  eventData);
        document.dispatchEvent(myEvent);
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Thu Apr 04 2023 @ 12:54
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    readUserInfo() {
        return {

                    timeOpened:new Date(),
                    timezone:(new Date()).getTimezoneOffset()/60,
                
                    pageon(){return window.location.pathname},
                    referrer(){return document.referrer},
                    previousSites(){return history.length},
                
                    browserName(){return navigator.appName},
                    browserEngine(){return navigator.product},
                    browserVersion1a(){return navigator.appVersion},
                    browserVersion1b(){return navigator.userAgent},
                    browserLanguage(){return navigator.language},
                    browserOnline(){return navigator.onLine},
                    browserPlatform(){return navigator.platform},
                    javaEnabled(){return navigator.javaEnabled()},
                    dataCookiesEnabled(){return navigator.cookieEnabled},
                    dataCookies1(){return document.cookie},
                    dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
                    dataStorage(){return localStorage},
                
                    sizeScreenW(){return screen.width},
                    sizeScreenH(){return screen.height},
                    sizeDocW(){return document.width},
                    sizeDocH(){return document.height},
                    sizeInW(){return innerWidth},
                    sizeInH(){return innerHeight},
                    sizeAvailW(){return screen.availWidth},
                    sizeAvailH(){return screen.availHeight},
                    scrColorDepth(){return screen.colorDepth},
                    scrPixelDepth(){return screen.pixelDepth},
                
                /*
                    latitude(){return position.coords.latitude},
                    longitude(){return position.coords.longitude},
                    accuracy(){return position.coords.accuracy},
                    altitude(){return position.coords.altitude},
                    altitudeAccuracy(){return position.coords.altitudeAccuracy},
                    heading(){return position.coords.heading},
                    speed(){return position.coords.speed},
                    timestamp(){return position.timestamp},
                */
        
            };
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Thu Apr 19 2023 @ 16:18
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    SetPopupInnerHtml(htmlContent) {
        $('#script-lib-popup').html(htmlContent);
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Wed Apr 19 2023 @ 17:07
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    SetPopupVisibility(status=true) {
        if(status) {
            $('#script-lib-popup').show();
            $('html').css('overflow','hidden');
        }
        else {
            $('#script-lib-popup').hide();
            $('html').css('overflow','initial');
        }
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Wed Apr 19 2023 @ 17:24
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    SetPopupProperty(prop) {
        $('#script-lib-popup').addClass(prop);
    }




    /***********************************************************************************************************************************
     ************************************************************************************************************************************
    *** Created on Wed Apr 19 2023 @ 17:28
    *** Developed By Mohamed Elleuch
    *** Copyright (c) 2023 - MIT
    ************************************************************************************************************************************
    ************************************************************************************************************************************
    */
    UnsetPopupProperty(prop) {
        $('#script-lib-popup').removeClass(prop);
    }
}
window.scriptLib = new ScriptLib();


// ###___END_OF_CLASS___###


/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Mar 8 2022 @ 11:00
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */

 window.blockFakeEmails = (text) => {
    const regex = /(\.{2,}|-{2,}|(\+\d*))/gm;
    const subst = ``;
    const result = text.replace(regex, subst);

    return result;
};

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Mar 16 2022 @ 15:37
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
if (
    window.location.pathname ===
    "/webapp/wcs/stores/servlet/MultiChannelOrderSummary"
) {
    let failed = 0;
    let timerHandler = setInterval(() => {
        if ($(".delivery-type-container .panel.panel-default").length > 0) {
            clearInterval(timerHandler);
            $(".delivery-type-container .panel.panel-default").after(`
				<div class="form-group pickup-message-container">
					<a href="#/checkout/summary/delivery-address" ng-if="pickupData.selected" class="pickup-message-link edit-location-link ng-scope" ng-click="openPickupModal(); $event.stopPropagation(); $event.preventDefault();">
						<p class="pickup-message-title user-address-title ng-binding">Mağazadan Teslim Al</p>
						<p class="pickup-message-paragraph">Ürününüzü mağazadan teslim almak ister misiniz?</p>
					</a>
				</div>
			`);
            $(".form-group .pickup-message-link").click(() => {
                setTimeout(() => {
                    $(
                        '.panel-pickup span.accordion-state-indicator[ng-click="toggleOpen()"]'
                    ).trigger("click");
                    setTimeout(() => {
                        $(".panel-title a.edit-location-link.ng-scope").trigger("click");
                    }, 400);
                }, 700);
            });
        } else {
            if (failed >= 100) {
                clearInterval(timerHandler);
            }
            failed++;
        }
    }, 200);
}

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Mar 21 2022 @ 17:02
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
if (
    window.location.pathname.indexOf(
        "/webapp/wcs/stores/servlet/MultiChannelDisplayBasket"
    ) === 0
) {
    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("returnCode")) {
        var ids = searchParams.get("returnCode").split("l");
        var catId = ids[0];
        var catEntry = ids[1];

        // test link
        // https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14&returnCode=797527l7788401

        var uri = `/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId=103452&langId=-14&catEntryId=${catEntry}&categoryId=${catId}`;

        var a =
            '<a href="#" class="button add-to-cart dr" data-href="' + uri + '"></a>';

        $("body").append(a);

        setTimeout(function() {
            $(".add-to-cart.dr").trigger("click");
            setTimeout(() => {
                window.location.href = `https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14`;
            }, 500);
        }, 10);
    }
}

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Mar 22 2022 @ 13:47
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
if (
    window.location.pathname.indexOf(
        "/webapp/wcs/stores/servlet/MultiChannelOrderSummary"
    ) === 0
) {
    $(window).ready(() => {
        //$('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header').each((i, e) => e.click());
    });
}

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Mar 23 2022 @ 13:20
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
document.addEventListener("onLoadingFinished", function() {
    let intVar;
    //setTimeout(() => {
    //	$('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header').each((i, e) => e.click());
    //}, 500);
    const CheckIfFieldsAreClosed = async() => {
        if (
            (await scriptLib.waitUntilFieldCreated(
                    ".ctable-wrapper .ctable .cart-product-table .single-services-table .cservice"
                ),
                20)
        ) {
            clearInterval(intVar);
            return;
        }
        var classList = $(
                ".ctable-wrapper .ctable .cart-product-table .single-services-table .cservice"
            )
            .attr("class")
            .split(/\s+/);
        let state = true;
        $.each(classList, function(index, item) {
            // debugger
            if (item === "expanded") {
                state = false;
            }
        });
        return state;
    };
    intVar = setInterval(() => {
        if (CheckIfFieldsAreClosed()) {
            $(
                ".ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header"
            ).each((i, e) => e.click());
        } else {
            clearInterval(intVar);
        }
    }, 500);
});

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Apr 06 2022 @ 13:35
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
$(window).ready(() => {
    if (scriptLib.isMobile || !scriptLib.isPDP) {
        return; // this should not be executed on mobile
    }

    console.info("store delivery desktop started.");
    scriptLib
        .waitUntilFieldCreated(".box.infobox.availability ul")
        .then((res) => {
            $(".box.infobox.availability ul").append(
                '<li class="stock-info"><a data-type="link" href="#" class="stok-bilgisi">Mağaza Stok Durumu</a></li>'
            );
        });
    scriptLib
        .waitUntilFieldCreated("#product-details > div.price-sidebar .price-button")
        .then((res) => {
            if (!res) {
                // throw "Add To Card button was not found!!!";
            }
            $("#product-details > div.price-sidebar .price-button").after(
                '<div class="store-delivery button-green-pdp"><a href="#">Mağazadan Teslim Al</a></div>'
            );

            $(".store-delivery , .stok-bilgisi").click(function(evt) {
                console.info("link clicked");
                if ($(".stock-mdl").length && false) {
                    // always refresh iframe content
                    $(".stock-mdl").show();
                } else {
                    var sku = $("[itemprop='sku']").attr("content") || "";
                    sku = sku.replace("sku:", "");
                    var uri =
                        "https://ux.mediamarkt.com.tr/store-delivery/index.html?id=" + sku;
                    if ($(evt.target).attr("data-type") === "link") {
                        uri =
                            "https://ux.mediamarkt.com.tr/stok-takip/index.html?id=" + sku;
                    }
                    var clsIcon =
                        '<svg class="stock-cls-icn" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path></g></g></svg>';
                    var iframe =
                        ' <div style="display:flex;" class="stock-mdl"><div>' +
                        clsIcon +
                        '<iframe src="' +
                        uri +
                        '" title="Stok Durumu Görüntüle"></iframe></div></div>';
                    $("body").append(iframe);

                    setTimeout(() => {
                        $("#cboxOverlay").hide();

                        $(".stock-cls-icn").click(function() {
                            $(".stock-mdl").hide();
                            $(".stock-mdl").remove();
                            $("#cboxOverlay").hide();
                        });
                    }, 100);
                }
            });
        });

    /***********************************************************************************************************************************/

    if (window.addEventListener) {
        window.addEventListener("message", handleIFrameEvent, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", handleIFrameEvent, false);
    }
    //window.addEventListener("message", handleIFrameEvent, false);

    async function handleIFrameEvent(e) {
        let evtName = e.data.func;
        // console.info(e);
        if (evtName !== "callSetPickupStore") {
            return;
        }
        if (e.origin === "https://ux.mediamarkt.com.tr") {
            let store_id = e.data.store_id;
            var urlStr = $("#hidden-pdp-add-to-cart").attr("data-href");
            // here new func**************************************
            urlStr = urlStr.replace(/_\d*/gm, "");
            const catEntryIdArray = RegExMatchAll(urlStr, /catEntryId=\d*/gm);
            const categoryIdArray = RegExMatchAll(urlStr, /categoryId=\d*/gm);
            console.info("add item to cart", catEntryIdArray, categoryIdArray);
            await CartAddItem(
                catEntryIdArray[0].split("=")[1],
                categoryIdArray[0].split("=")[1]
            );
            await SetPickupStore(store_id);
            setTimeout(function() {
                window.location.href =
                    "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14";
            }, 1500);
        } else {
            throw "unknown origin";
        }
    }

    async function SetPickupStore(pickupStoreId) {
        // 129953
        // 33361
        // orderId = await GetOrderId();
        orderId = pickupStoreId;
        // console.info(pickupStoreId,orderId);
        await fetch(
            "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummaryController", {
                headers: {
                    accept: "application/json",
                    "accept-language": "tr,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                },
                referrer: "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummary?storeId=103452&orderId=" +
                    orderId +
                    "&langId=-14&rememberMe=true",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: "storeId=103452&langId=-14&orderId=" +
                    orderId +
                    "&pickUpStoreId=" +
                    pickupStoreId +
                    "&pickUpStopGo=false&method=marketSelected",
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );
    }

    async function GetOrderId() {
        res = await fetch(
            "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14"
        );
        var html = await res.text();
        html = $(html);
        let link = $(html)
            .find(
                "#js-cart-app > div.cobuttons.cobuttons-cart > div > .cocheckout-actions > a"
            )
            .attr("href");
        var url = new URL(link);
        var orderId = url.searchParams.get("orderId");
        return orderId;
    }

    function RegExMatchAll(str, regex) {
        let arrMatch = [];
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
                arrMatch.push(match);
            });
        }
        return arrMatch;
    }

    //////////////////////////
    // add item to cart:
    //////////////////////////

    //call example: CartAddItem(7669647,797524) : asus computer

    function CartAddItem(catEntryId, cat, storeId = 103452, extraParams = "") {
        // var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId="+storeId+"&langId=-14&catEntryId_"+catEntry+"="+catEntry+"&categoryId_"+catEntry+"="+cat+"&quantity_"+catEntry+"=1";
        var link =
            "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?catEntryId=" +
            catEntryId +
            "&categoryId=" +
            cat +
            "&langId=-14&storeId=" +
            storeId +
            "&quantity=1" +
            extraParams;
        //console.info("item added to the cart",link)
        return httpGet(link);
    }

    //////////////////////////
    // get request:
    //////////////////////////

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################

    async function GetFullStoreList() {
        let res = await fetch(
            "https://ux.mediamarkt.com.tr/store-delivery/stores-list.json"
        );
        let data = res.json();
        return data;
    }

    async function GetFullStoreList_old() {
        //debugger
        res = await fetch("https://www.mediamarkt.com.tr/tr/marketselection.html");
        var html = await res.text();
        html = $(html);
        let attr = "href";
        let nodeListStores = $(html).find(".all-markets-list li a");
        if ((nodeListStores.length = 0)) {
            nodeListStores = $(html).find("#dropdown-market-list option");
            attr = "data-link";
        }
        let listStores = [];
        nodeListStores.each((index, element) => {
            element = $(element);
            let text = element.text();
            var storeId = element
                .attr(attr)
                .split("/")[element.attr("href").split("/").length - 1].split(",")[1];
            let city = text.split("|")[0]; //.replaceAll(' ','');
            let store = text.split("|")[1];
            //store && (store = store.replaceAll(' ',''));
            listStores.push(
                JSON.parse(`
				{
					"city": "${city}",
					"store": "${store}",
					"storeId": "${storeId}"
				}
			`)
            );
        });
        return listStores;
    }

    async function GetStoreId(wantedStoreName) {
        let list = await GetFullStoreList();
        let res = list.filter((item) => {
            return (
                wantedStoreName.indexOf(item.city) > -1 &&
                wantedStoreName.indexOf(item.store) > -1
            );
        });
        if (res.length === 1) {
            return res[0];
        } else {
            throw "more than store where found";
        }
    }

    const onNotificationFromIframe = async(store_name) => {
        let store = await GetStoreId(store_name);
        let store_id = store.storeId;
        let res = await SetPickupStore(store_id);
        console.info(store_id);
    };
});

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Apr 08 2022 @ 16:03
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
$(window).ready(() => {
    if (scriptLib.isDesktop) {
        return; // this should not be executed on desktop
    }

    console.info("store delivery mobile started.");
    $(".gridbox.column-1-1.buyback").length &&
        $(".gridbox.column-1-1.buyback").after(
            '<div class="gridbox column-1-1 store-delivery-mobile"><a href="#">Mağazadan Teslim Al</a></div>'
        );
    $(".gridbox.column-1-1.buyback").length ||
        $("#add-to-basket-buttons").after(
            '<div class="gridbox column-1-1 store-delivery-mobile"><a href="#">Mağazadan Teslim Al</a></div>'
        );

    $(".store-delivery-mobile").click(function() {
        console.info("link clicked");
        //if($('.stock-mdl').length) {
        //    $('.stock-mdl').show();
        //} else
        {
            var sku = $("[itemprop='sku']").attr("content") || "";
            sku = sku.replace("sku:", "");
            var uri =
                "https://ux.mediamarkt.com.tr/store-delivery/index.html?id=" + sku;
            var clsIcon =
                '<svg class="stock-cls-icn" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path></g></g></svg>';
            var iframe =
                ' <div class="stock-mdl"><div>' +
                clsIcon +
                '<iframe src="' +
                uri +
                '" title="Stok Durumu Görüntüle"></iframe></div></div>';
            $("body").append(iframe);
            setTimeout(() => {
                $("#cboxOverlay").hide();
            }, 100);
        }
    });

    $(".stock-cls-icn").click(function() {
        $(".stock-mdl").hide();
        $("#cboxOverlay").hide();
    });

    /*****************************************************************************************************/

    if (window.addEventListener) {
        window.addEventListener("message", handleIFrameEvent, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", handleIFrameEvent, false);
    }
    //window.addEventListener("message", handleIFrameEvent, false);

    async function handleIFrameEvent(e) {
        let evtName = e.data.func;
        // console.info(e);
        if (evtName !== "callSetPickupStore") {
            return;
        }
        if (e.origin === "https://ux.mediamarkt.com.tr") {
            let store_id = e.data.store_id;
            var urlStr = $("#addToBasket").attr("data-request-url");
            // here new func**************************************
            urlStr = urlStr.replace(/_\d*/gm, "");
            const catEntryIdArray = RegExMatchAll(urlStr, /catEntryId=\d*/gm);
            const categoryIdArray = RegExMatchAll(urlStr, /categoryId=\d*/gm);
            console.info("add item to cart", catEntryIdArray, categoryIdArray);
            await CartAddItem(
                catEntryIdArray[0].split("=")[1],
                categoryIdArray[0].split("=")[1]
            );
            await SetPickupStoreMobile(store_id);
            setTimeout(function() {
                window.location.href =
                    "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14";
            }, 1500);
        } else {
            throw "unknown origin";
        }
    }

    async function SetPickupStoreMobile(pickupStoreId) {
        // 129953
        // 33361
        let orderId = await GetOrderIdMobile();

        await fetch(
            "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummaryController?storeId=103452&orderId=" +
            orderId +
            "&langId=-14", {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,tr;q=0.8,de-DE;q=0.7,de;q=0.6",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummary?storeId=103452&orderId=" +
                    orderId +
                    "&langId=-14&rememberMe=true",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: "method=saveDeliveryData&pickUpStoreId=" +
                    pickupStoreId +
                    "&shipModeId=-136002&value=PICKUP",
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );
    }

    async function GetOrderIdMobile() {
        res = await fetch(
            "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14"
        );
        var html = await res.text();
        html = $(html);
        let link = $(html)
            .find(
                "#wrapper-main section.bg-white.total-price-container > form.proceed-to-checkout"
            )
            .attr("action");
        html.each((i, el) => {
            if (el.getAttribute && el.getAttribute("id") === "wrapper-main") {
                link ||
                    (link = el
                        .querySelector(
                            "section.bg-white.total-price-container > form.proceed-to-checkout"
                        )
                        .getAttribute("action"));
            }
        });
        var url = new URL(link);
        var orderId = url.searchParams.get("orderId");
        return orderId;
    }

    function RegExMatchAll(str, regex) {
        let arrMatch = [];
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
                arrMatch.push(match);
            });
        }
        return arrMatch;
    }

    //////////////////////////
    // add item to cart:
    //////////////////////////

    //call example: CartAddItem(7669647,797524) : asus computer

    function CartAddItem(catEntryId, cat, storeId = 103452, extraParams = "") {
        // var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId="+storeId+"&langId=-14&catEntryId_"+catEntry+"="+catEntry+"&categoryId_"+catEntry+"="+cat+"&quantity_"+catEntry+"=1";
        var link =
            "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?catEntryId=" +
            catEntryId +
            "&categoryId=" +
            cat +
            "&langId=-14&storeId=" +
            storeId +
            "&quantity=1" +
            extraParams;
        //console.info("item added to the cart",link)
        return httpGet(link);
    }

    //////////////////////////
    // get request:
    //////////////////////////

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################
    //##################################################################################

    async function GetFullStoreList() {
        let res = await fetch(
            "https://ux.mediamarkt.com.tr/store-delivery/stores-list.json"
        );
        let data = res.json();
        return data;
    }

    async function GetFullStoreList_old() {
        //debugger
        res = await fetch("https://www.mediamarkt.com.tr/tr/marketselection.html");
        var html = await res.text();
        html = $(html);
        let attr = "href";
        let nodeListStores = $(html).find(".all-markets-list li a");
        if ((nodeListStores.length = 0)) {
            nodeListStores = $(html).find("#dropdown-market-list option");
            attr = "data-link";
        }
        let listStores = [];
        nodeListStores.each((index, element) => {
            element = $(element);
            let text = element.text();
            var storeId = element
                .attr(attr)
                .split("/")[element.attr("href").split("/").length - 1].split(",")[1];
            let city = text.split("|")[0]; //.replaceAll(' ','');
            let store = text.split("|")[1];
            //store && (store = store.replaceAll(' ',''));
            listStores.push(
                JSON.parse(`
				{
					"city": "${city}",
					"store": "${store}",
					"storeId": "${storeId}"
				}
			`)
            );
        });
        return listStores;
    }

    async function GetStoreId(wantedStoreName) {
        let list = await GetFullStoreList();
        let res = list.filter((item) => {
            return (
                wantedStoreName.indexOf(item.city) > -1 &&
                wantedStoreName.indexOf(item.store) > -1
            );
        });
        if (res.length === 1) {
            return res[0];
        } else {
            throw "more than store where found";
        }
    }

    const onNotificationFromIframe = async(store_name) => {
        let store = await GetStoreId(store_name);
        let store_id = store.storeId;
        let res = await SetPickupStore(store_id);
        console.info(store_id);
    };
});

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Apr 12 2022 @ 13:42
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
$(window).ready(() => {
    if (scriptLib.isPDP) {
        if (scriptLib.isDesktop) {
            if ($('h1[itemprop="name"]').text().indexOf("PHILIPS") >= 0) {
                scriptLib.injectJS(
                    "https://tracking.channelsight.com/api/tracking/v2/Init"
                );
            }
        } else if (scriptLib.isMobile) {
            if ($(".product-overview-title span").text().indexOf("PHILIPS") >= 0) {
                scriptLib.injectJS(
                    "https://tracking.channelsight.com/api/tracking/v2/Init"
                );
            }
        } else { // case of mobile app
            if ($(".product-overview-title span").text().indexOf("PHILIPS") >= 0) {
                scriptLib.injectJS(
                    "https://tracking.channelsight.com/api/tracking/v2/Init"
                );
            }
        }
    }

    if (scriptLib.isThankyouPage) {
        let data = [];
        $(".checkout-container .co-product").each((x, i) => {
            let sku = $(i).attr("data-reco-pid");
            let title = $(i).find(".product-title").text();
            if (title.indexOf("PHILIPS") == -1) return;
            let price_qnty = $(i).find(".product-amount").text();
            let price = 0; //price_qnty.split(' : ')[0];
            let qnty = price_qnty.split(" : ")[1];
            data.push({
                Name: title,
                ProductCode: sku,
                Category: "####",
                Price: price,
                Quantity: parseInt(qnty),
            });
        });
        let code = `
		ChannelSight_Type = "OrderTracking"; ChannelSight_Separator = ".";
		var CS_Products = ${JSON.stringify(data)};
		varCS_Order = {Currency:"TRY"};
		`;
        scriptLib.injectBrutJS(code);
        scriptLib.injectJS(
            "https://tracking.channelsight.com/api/tracking/v2/Init"
        );
    }
});

/***********************************************************************************************************************************
 ************************************************************************************************************************************
 *** Created on Tue Apr 14 2022 @ 15:44
 *** Developed By Mohamed Elleuch
 *** Copyright (c) 2022 - MIT
 ************************************************************************************************************************************
 ************************************************************************************************************************************
 */
