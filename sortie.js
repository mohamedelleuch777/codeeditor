/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Wed Mar 16 2022 @ 12:25
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */
function die(msg = "") {
	throw msg != "" ? msg : "dead!!!";
}
if (window.isLibLoaded) {
	console.warn("Script Lib was already loaded");
	die();
}
console.info('%c Script Lib was loaded successfully! ', 'background: #222; color: #bada55');
window.isLibLoaded = true;
window.block3DaysFunc = false;



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Thu Mar 24 2022 @ 16:25
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */
class ScriptLibFunctions { 
constructor() {if (!scriptLib.runThisFunctionOnlyInTestMode("49789d65-3cb6-4ed5-9d15-dcfefcfd1c02")) return;
// ddf HIDConnectionEvent
console.log("fiction list called");
}

testModeFunction() {if (!scriptLib.runThisFunctionOnlyInTestMode("610a1d9e-6052-4822-ad93-e0e65dbcdd7a")) return;
// 610a1d9e-6052-4822-ad93-e0e65dbcdd7a ====> this is the UUID of this test function
/**
	*) to set the test mode:
	add SCRIPT_LIB_TEST_UUID to the request url forwarded by the equal sign and the function UUID example:
	https://www.mediamarkt.com.tr/tr/product/_samsung-galaxy-a52-128-gb-ak%C4%B1ll%C4%B1-telefon-siyah-1215223.html?ga_query=1215223&SCRIPT_LIB_TEST_UUID=610a1d9e-6052-4822-ad93-e0e65dbcdd7a
	
	*) to unset the test mode:
	add SCRIPT_LIB_TEST_UUID_END to the request url example:
	https://www.mediamarkt.com.tr/tr/product/_samsung-galaxy-a52-128-gb-ak%C4%B1ll%C4%B1-telefon-siyah-1215223.html?ga_query=1215223&SCRIPT_LIB_TEST_UUID_END
*/
console.log("the function has been called successfully from test mode\nAdd &SCRIPT_LIB_TEST_UUID_END to the url to exit test mode");
}

async setKargoExpectedDate() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
let f = new Intl.DateTimeFormat('tr-TR',
	{
		weekday: 'long',
		day: '2-digit',
		month: 'long'
	}
);
// cancel when a specific date:
const isForceMessageInThisPeriod = (a, b) => {

	let d = new Date();
	let c1 = d > new Date(a)
	let c2 = d < new Date(b)
	let c3 = c1 && c2
	return c3
}
//---------------------------
let d = new Date();
let text = "En geç " + f.format(scriptLib.getNextWorkDay(d)) + " günü kargoya verilir.";
if (new Date().getHours() < 14) {
	// 13 Temmuz Tarihinde Kargoda!
	text = "Saat 14:00’a kadar sipariş verin bugün kargoda!";
	block3DaysFunc = false;
}
if (isForceMessageInThisPeriod("Jul 8 2022 12:00", "Jul 12 2022 14:00")) {
	// 13 Temmuz Tarihinde Kargoda!
	text = "13 Temmuz Tarihinde Kargoda!";
	block3DaysFunc = true;
}
if (scriptLib.isDesktop) {
	if (await scriptLib.waitUntilFieldCreated('.price-sidebar .infobox .send-stock')) {
		$('.price-sidebar .infobox .send-stock').html(text + "<span class=\"icon icon-info\" data-layer=\"StoktanGonderi\"></span>");
		$('.price-sidebar .infobox .send-stock').css("font-weight", "400");
		$('.price-sidebar .infobox .send-stock').css("font-size", "14px");
	}
} else if (scriptLib.isMobile) {
	if (await scriptLib.waitUntilFieldCreated('#type-standard-delivery h2.green')) {
		$('#type-standard-delivery h2.green').text(text);
		$('.mrh-delivery-type .delivery-type-item h2').css("margin-left", "25px");
		$('#delivery-type').css('flex-direction', 'column');
		if ($('#delivery-type .stok-sorgu').length === 1) {
			$('#delivery-type').css('height', '60px');
		}
	}
}
}

async showIphoneWarning() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
if (scriptLib.isDesktop) {
	// 644527
	function isIphone() {
		return new Promise((resolve) => {
			if ($('h1[itemprop="name"]').text().toLowerCase().includes("iphone")) {
				resolve(true);
			}
			resolve(false);
		});
	}
	if (await isIphone()) {
		$('div[data-cms-id="product_detail-content_social_media_snippet"]').prepend('<h3>iPhone ürün kutusu içerisinde kulaklık ve adaptör bulunmamaktadır.</h3>');
	}
} else if (scriptLib.isMobile) {
	if (await scriptLib.waitUntilFieldCreated('#swogo-bundle-1 .swogo-bundle-title')) {
		let divGrid = $('#add-to-basket-buttons').parent();
		if ($('.product-overview-title span').text().toLowerCase().includes("iphone")) {
			divGrid.after('<h3 style="margin-bottom:10px;color:#df0000;padding:0 10px;">iPhone ürün kutusu içerisinde kulaklık ve adaptör bulunmamaktadır.</h3><div class="bundle-wrapper"></div>');
		} else {
			divGrid.after('<div class="bundle-wrapper"></div>');
		}
	}
}
}

async manageAssistBox() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
let time = new Date();
let currentHour = time.toLocaleString('tr-TR', { hour: 'numeric', hour12: false });
currentHour = parseInt(currentHour);
if (currentHour < 10 || currentHour >= 22) {
	if (await scriptLib.waitUntilFieldCreated("#assistboxConnectButton", 30)) {
		$('#assistboxConnectButton').addClass("hide-assistbox");
	}
}
}

async setKargo3DaysAfter() {
if (window.block3DaysFunc) {
	return
}
if (!scriptLib.isPDP) return; // quit when page is not PDP
let brandList = [
	"bosch", "siemens", "profilo"
];
let itemList = [
	"çamaşır mak",
	"buzdolabı",
	"bulaşık",
	"kurutma mak",
	"ocak",
	"fırın",
	"davlumbaz",
	"ankastre",
	"aspiratör",
	"dondurucu"
];
let brand = scriptLib.getProductBrand();
let title = await scriptLib.getProductTitle();

function isItemExist() {
	return new Promise((resolve) => {
		itemList.forEach((el) => {
			if (title.toLowerCase().includes(el)) {
				resolve(true);
			}
		});
		resolve(false);
	});
}

let isBrandTrue = brandList.includes(brand.toLowerCase());
let isItemTrue = await isItemExist();

setTimeout(async () => {
	if (isBrandTrue && isItemTrue) {
		if (scriptLib.isDesktop) {
			if (! await scriptLib.waitUntilFieldCreated('.price-sidebar .infobox .send-stock')) return;
			$('.price-sidebar .infobox .send-stock').html("3 iş günü içerisinde kargoya verilecektir<span style=\"display:none;\" class=\"icon icon-info\" data-layer=\"StoktanGonderi\"></span>");
		}
		if (scriptLib.isMobile) {
			if (! await scriptLib.waitUntilFieldCreated('#type-standard-delivery h2.green')) return;
			$('#type-standard-delivery h2.green').html("3 iş günü içerisinde kargoya verilecektir<a data-layer=\"StoktanGonderi\"><span style=\"display:none;\" class=\"icon icon-info\"></span></a>");
		}

	}

}, 150);
}

async removePickupStoreBtnForOutletProducts() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
let sku = scriptLib.getProductSKU();
if (sku[0] === '3') { // outlet products start with '3'
	if (await scriptLib.waitUntilFieldCreated('.store-delivery')) {
		$('.store-delivery').remove();
	}
}
}

async swogoForCategoryAndSearchPages() {if (!scriptLib.runThisFunctionOnlyInTestMode("9b6bed7b-2cb9-470b-a41c-9b954a2e7db7")) return;
// https://www.mediamarkt.com.tr/?SCRIPT_LIB_TEST_UUID=9b6bed7b-2cb9-470b-a41c-9b954a2e7db7
let currentPage = scriptLib.isCategoryPage || scriptLib.isSearchPage;
if (!currentPage) return; // exits if the current page is different than category or search pages
// insert a swogo dom in production for swogo's develooppers test and shpıld be deleted later:
setInterval(() => {
	$('#swogo-bundle-0').length || $('#basket-flyout div[data-cms-id="precheckout-layer"]').after('<div id="swogo-bundle-0" class="swogo-box"></div>');
}, 50)
// end of this block
//
if (!window.isOnLoadingFinishedEventMounted) {
	window.isOnLoadingFinishedEventMounted = true;
	document.addEventListener("onLoadingFinished", function () {
		// console.log("event onLoadingFinished: create swogo btns");
		scriptLibFunctions.swogoForCategoryAndSearchPages();
	})
}
const fillDataLayer = (id, name, price, brand) => {
	let obj = {
		"ecommerce": {
			"add": {
				"products": [
					{
						"id": id,
						"name": name,
						"price": price.replace('-', '00'),
						"dimension9": '',
						"dimension10": '',
						"dimension24": '',
						"dimension25": 'InStock',
						"brand": brand
					}
				]
			}
		},
		"event": "EECaddToCart"
	};

	let ndx = -1;
	[...dataLayer].findIndex((layer, i) => {
		layer.event === 'EECaddToCart' && (ndx = i)
	})
	if (ndx > -1) {
		dataLayer[ndx] = obj;
	} else {
		dataLayer.push(obj);
	}
}
//scriptLib.injectJS('https://ui.swogo.net/bundles/v4/mediamarktComTr/swogo.js');
let buttonList = $('.product-wrapper .product-price a.button.add-to-cart');
buttonList.hide();
$('.product-wrapper .button.new-add-2-cart').remove();
buttonList.after(`<button class="button new-add-2-cart">Sepete Ekle</button>`);
let html = `<div id="mm-popup" style="display:none;"><div class="overlay" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#0000004f;z-index:9999;"></div><div class="content" style="width:100%;top:0;z-index:10000;position:fixed;padding:20px 40px;"><svg class="cls-icn" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path></g></g></svg><div class="precheckout-header"><h3>Ürün Sepete Eklenmiştir</h3><div><img src="//assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_89722915/fee_325_225_png/APPLE-iPhone-11-128GB-Ak%C4%B1ll%C4%B1-Telefon-Siyah"><div class="basket-items"><div><span class="prod-title">APPLE iPhone 11 128GB Akıllı Telefon Siyah</span><span class="prce">13499₺</span></div></div></div></div><div class="buy-with-wrapper"><div id="swogo-bundle-0" class="swogo-box"></div><span class="left-arrw" style="display:block;"></span><span class="right-arrw" style="display:block;"></span></div><div class="buttons-container"><div class="button-white">&#9664; Alişverişe Devam Et</div><div class="button-green-pdp" id="add-item-to-basket">Sepete Git</div></div></div></div>`;
html += `<style>#mm-popup .cls-icn {position: absolute;right: -21px;top: -21px;background: #fff;border-radius: 100%;border: 1px solid #ddd;padding: 5px;cursor: pointer;}#mm-popup>div.content{background:#fff;border:1px solid #ddd;font-size:18px;display:flex;justify-content:center;flex-direction:column;align-items:center;width:90%;max-width:956px;box-sizing:border-box;border-radius:5px;box-shadow:0 0 3px 0 #ccc;position:relative;max-height:90vh;margin:5vh auto 0;padding-bottom:30px}#swogo-bundle-0 .swogo-bundle-products{max-width:756px}.precheckout-header{width:100%;background:#f8f8f8;padding:0 30px 10px;box-sizing:border-box;border-radius:10px;border: 1px solid #aaaaaa;}.precheckout-header>div{display:flex;align-items:center;justify-content:space-between;margin:15px 0 10px}.precheckout-header img{max-width:80px;max-height:60px}.precheckout-header h3{color:#000;font-size:24px;line-height:50px}#colorbox .prce{display:inline-block;font-weight:700}#colorbox .precheckout-content .prce{font-weight:700;font-size:18px}.sub-products{font-size:16px;padding-left:20px;margin-top:5px;position:relative;line-height:18px;font-weight:400}.sub-products .del{background:url(http://data.mediamarkt.com.tr/ux/spritescd.png) no-repeat;background-position:-243px -67px;width:16px;height:16px;position:absolute;right:-25px;top:0;cursor:pointer}.precheckout-body{display:flex;flex-direction:column;width:100%;box-sizing:border-box;position:relative;max-height:calc(90vh - 127px);overflow-y:auto;padding-bottom:30px}.precheckout-content{padding:0 50px 30px 130px;position:relative}.precheckout-content>p{color:#444;font-size:22px;margin:25px 0 15px;font-weight:700}.chckbx-row{display:flex;justify-content:space-between;padding:2px 0;align-items:center;position:relative}.precheckout-body label{display:flex;align-items:center}.precheckout-body input{width:24px;height:24px;margin-right:15px}.precheckout-body .precheckout-action{justify-content:space-around;margin-top:30px;display:flex}.precheckout-btn{padding:10px 40px;color:#fff;background:green;border:1px solid green;border-radius:4px}.precheckout-btn.passive{color:#4f4f4f;background:#fff}.left-arrw,.right-arrw{position:absolute;left:20px;width:40px;height:40px;border:1px solid #ddd;top:50%;margin-top:-20px;border-radius:5px;cursor:pointer;background:#f8f8f8}.right-arrw{left:auto;right:20px}.left-arrw:before,.right-arrw:before{background:url(http://data.mediamarkt.com.tr/ux/spritescd.png) -106px -18px no-repeat transparent;width:10px!important;height:19px!important;display:inline-block;content:'';transform:translate(-50%,-50%);left:50%;top:50%;position:absolute}.right-arrw:before{background-position:-116px -18px}.pre-mess{position:absolute;bottom:5px;padding:10px;background:green;color:#fff;min-width:70%;border-radius:4px;display:none}.pre-mess.gray{background:#918e8c}.garanti-koruma-frame footer,.garanti-koruma-frame header{display:none}.garanti-koruma-frame{width:100%;min-height:3800px}.read-mr{padding:0 20px 20px}.read-mr:not(.service){text-indent:9px;padding-bottom:10px}.read-mr span{text-decoration:underline}#colorbox .cls-icn{position:absolute;right:-21px;top:-21px;background:#fff;border-radius:100%;border:1px solid #ddd;padding:5px;cursor:pointer}.buy-with-wrapper{display:flex;padding:20px 100px;background: url(https://data.mediamarkt.com.tr/uploads/loading.gif);min-width:85%;background-size:150px;background-repeat:no-repeat;background-position:center;filter:brightness(1.1)}.buy-with{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;width:33%}.buy-with img{max-width:100%}.buy-with .price{background:url(//css.redblue.de/fee/BaseSkin/images/currency-tr.png) left 26px no-repeat;display:inline-block!important;margin:-30px 0 0 0!important;width:auto!important;height:auto}.buy-with a{font-weight:700;font-size:20px;line-height:22px;height:44px;margin:10px;overflow:hidden}.buy-with button{padding:10px 20px;background:#4f4f4f;color:#fff;border:1px solid #4f4f4f;border-radius:4px}.basket-items{flex:1;padding:0 20px;font-weight:700;font-size:21px;line-height:25px}.basket-items span::not(.prce){max-width:80px}.basket-items>div{display:flex;justify-content:space-between}.iiiinfo,.iinfo{background:url(https://csscdn.redblue.de/fee/mobile_mrh/images/icon-64x64-info.png) no-repeat;width:14px;height:14px;background-size:14px 14px;margin-left:5px;flex:1}.g-img{display:none;position:absolute;left:0;top:calc(100% + 5px)}.button-green-pdp{background:#090!important;text-shadow:none;text-transform:none;font-family:mm-text-bold,Arial;font-weight:400!important;text-align:center;padding:12px;color:#fff;font-size:20px;border-radius:4px;cursor:pointer;line-height:18px;border-radius:24px}#swogo-bundle-0 .swogo-product.swogo-accessory .swogo-atc{border-radius:24px!important}#colorbox .button-green-pdp{width:100%;max-width:186px;margin-top:30px}.sidebar-form .cf .price-button{width:calc(100% - 120px)!important;margin-top:-50px!important}span.left-arrw.disabled,span.right-arrw.disabled{pointer-events:none;cursor:default;filter:opacity(.4)}input[type=checkbox]{filter:hue-rotate(251deg) brightness(1)}.layer-content{margin-top:20px}.layer-content .fg-container{visibility:visible}.fg-box.mpy1{position:relative}#product-details>div.price-sidebar>div.price-details>span{text-decoration:underline;color:#090;cursor:pointer}.#swogo-bundle-0 .swogo-product.swogo-accessory .swogo-atc{border-radius: 100vh !important;}#mm-popup>div.content>.buttons-container{display: flex;width: 100%;justify-content: space-between;align-content: space-around;}#add-item-to-basket{width:300px}.buttons-container .button-white{border: 2px solid #bfbfbf;padding: 0 40px;border-radius: 100vh;font-size:14px;line-height:38px}#mm-popup{display: flex;width: 100vw;justify-content: center;}.precheckout-header h3{color: #f00;}#mm-popup .button-white{cursor:pointer;}#swogo-bundle-0 .swogo-bundle-title{display:none}#swogo-bundle-0{min-height:344px}#swogo-bundle-0 .swogo-bundle-products{background-color:#fff}</style>`;
setTimeout(() => {
	//console.log(swogo);
	$('body').append(html);
	$('#mm-popup .cls-icn').click((e) => {
		$('#mm-popup').hide();
		$('#swogo-bundle-0').html('');
	});
	$('#mm-popup .button-white').click((e) => {
		$('#mm-popup').hide();
		$('#swogo-bundle-0').html('');
	});
	$('#add-item-to-basket').click((e) => {
		window.location.href = "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14";
	});
	$('.button.new-add-2-cart').click(async (e) => {
		let data = $(e.target).parent().find('a.button.add-to-cart').attr('data-href');
		let price = $(e.target).parent().parent().find('.price-box .price').text();
		let title = $(e.target).parent().parent().parent().find('.content h2 a').text().replace(/\t|\n/gm, '');
		let imgPath = $(e.target).parent().parent().parent().find('.product-photo .photo-wrapper img').attr('src');
		$('#mm-popup .basket-items .prod-title').text(title);
		$('#mm-popup .basket-items .prce').text(price);
		$('#mm-popup img').attr('src', imgPath);
		let sku = $(e.target).parent().parent().parent().find(".content .article-number")[0].innerText.split(": ")[1];
		let brand = $(e.target).parent().parent().parent().find(".content .manufacturer img").attr("alt");
		fillDataLayer(sku, title, price, brand);
		/*await*/ fetch(data);
		$('#mm-popup').show();
	});
}, 1000);
}

SwogoHeroPDP() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
scriptLib.waitUntilFieldCreated('.store-delivery.button-green-pdp').
	then(() => $('.store-delivery.button-green-pdp').after('<div id="swogo-bundle-0" class="swogo-box"></div>'));
}

async loadTvSliderFiles() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
if (scriptLib.isDesktop) {
	if (await scriptLib.waitUntilFieldCreated('.breadcrumbs li'), 20) {
		if ($('ul.breadcrumbs').html().indexOf('465019.html') !== -1) {
			scriptLib.injectCSS('https://data.mediamarkt.com.tr/ux/tv-slide-desc/tv-slider-desc.css');
			scriptLib.injectJS('https://data.mediamarkt.com.tr/ux/tv-slide-desc/tv-slider-desc.js');
		}
	}
} else if (scriptLib.isMobile) {
	if (await scriptLib.waitUntilFieldCreated('.breadcrumbs li'), 20) {
		var ct = $('meta[property="prudsys:recomm:parentcategory"]').attr('content');
		if (ct && ct === '465019') {
			scriptLib.injectCSS('https://data.mediamarkt.com.tr/ux/tv-slide-desc/tv-slider-desc-m.css');
			scriptLib.injectJS('https://data.mediamarkt.com.tr/ux/tv-slide-desc/tv-slider-desc-m.js');
		}
	}
}
}

async changeMoreClickableLink() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
if (scriptLib.isDesktop) {
	if (await $('a.more.clickable'), 20) {
		$('a.more.clickable').text('İade koşulları için tıklayınız')
		$('a.more.clickable').removeAttr('href')
		$('a.more.clickable').removeAttr('data-clickable-href')
		$('a.more.clickable').attr('href', 'https://www.mediamarkt.com.tr/tr/shop/yardim/iade.html')
		$('a.more.clickable').attr('target', '_blank')
	}
} else if (scriptLib.isMobile) {
	if (await $('#type-standard-delivery'), 20) {
		$('#type-standard-delivery').after('<a class="return-condition" href="https://www.mediamarkt.com.tr/tr/shop/yardim/iade.html" target="_blank">İade koşulları için tıklayınız</a>');
	}
}
}

async setTabMenuPDP() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
if (scriptLib.isDesktop) {

	var tabsHtml = ['<div class="contentspot "><div id="pdp-tab"><div class="pdp-tabs">',
		'<span id="pdp-tab1" class="active" style="display: none;">Tamamlayıcı Ürünler</span>',
		'<span id="pdp-tab2" style="display: none;">Sigorta ve Artı Hizmetler</span>',
		'<span id="pdp-tab3" style="display: none;">Teknik Özellikler</span>',
		'<span id="pdp-tab4" style="display: none;">Ürün Açıklaması</span>',
		'<span id="pdp-tab5" style="display: none;">Ürün Yorumları</span>',
		'<span id="pdp-tab6" style="display: none;">Taksit/Kredi Seçenekleri</span>',
		'</div>',
		'<div class="tab-content">',
		'<div class="content1">',
		'</div>',
		'<div class="content2" style="display: none">',
		'</div>',
		'<div class="content3" style="display: none">',
		'</div>',
		'<div class="content4" style="display: none">',
		'</div>',
		'<div class="content5" style="display: none">',
		'</div>',
		'<div class="content6" style="display: none">',
		'</div>',
		'</div></div></div>'].join('');

	$('#product-details').after(tabsHtml);
	$('#product-sidebar').removeClass('stickable').removeClass('sticky');

	var rcmCount = 0;
	var rcmInterval = setInterval(function () {
		if ($('#rcm-container') && $('#pdp-tab').length) {
			$('.content4').append($('#rcm-container'));
		}
		if ($('div[id^="ins-custom-container"]').length) {
			$('.content4').append($('div[id^="ins-custom-container"]'));
			$('#pdp-tab4').show();
		}
		if ($('#flix-inpage').length) {
			$('.content4').append($('#flix-inpage'));
			$('#pdp-tab4').show();
		}
		rcmCount++;
		if (rcmCount === 10) {
			clearInterval(rcmInterval);
		}
	}, 1000);

	if (await $('#product_detail_page_14-content_stage_bottom'), 20) {
		$('.content1').append($('#product_detail_page_14-content_stage_bottom'));
		$('#pdp-tab1').show();
	}
	if (await $('#product-details .premiumboxes'), 20) {
		$('.content2').append($('#product-details .premiumboxes'));
		$('#pdp-tab2').show();
	}
	if (await $('#product-details #product-service'), 20) {
		$('.content2').append($('#product-details #product-service'));
		$('#product-service').addClass('premiumopts');
		$('#product-service li').removeClass('even').addClass('cf');
		$('#pdp-tab2').show();
	}
	if (await $('#teknik-bilgiler'), 20) {
		$('.content3').append($('#teknik-bilgiler'));
		$('#pdp-tab3').show();
	}
	if (await $('#features'), 20) {
		$('.content3').append($('#features'));
		$('.content3').append($('.features-wrapper'));
		$('#pdp-tab3').show();
	}
	if (await $('#produktdetail_seite_3-bottom_right'), 20) {
		$('.content4').append($('#produktdetail_seite_3-bottom_right'));
		$('#pdp-tab4').show();
	}
	if (await $('#_C3_BCr_C3_BCn-detaylar_C4_B1'), 20) {
		$('.content4').append($('#_C3_BCr_C3_BCn-detaylar_C4_B1'));
		$('#pdp-tab4').show();
	}
	if (await $('#yorumlar-'), 20) {
		$('.content5').append($('#yorumlar-'));
		$('#pdp-tab5').show();
	}
	if (await $('#Taksit'), 20) {
		$('.content6').append($('#Taksit'));
		$('#pdp-tab6').show();
	}

	$('.pdp-tabs span').click(function () {
		$('.pdp-tabs span').removeClass('active');
		var index = $(this).attr('id').replace('pdp-tab', '');
		$(this).addClass('active');
		if (index) {
			$('.tab-content > div').hide();
			$('.content' + index).show();
			window.dispatchEvent(new Event('resize'));
		}
	});

	$(document).on('click', '.bv_button_buttonFull', function () {
		$('#pdp-tab5').click()
		$('html').animate({
			scrollTop: $("#pdp-tab").offset().top - 200
		}, 2000, function () {
			setTimeout(function () {
				window.scroll(0, $("#pdp-tab").offset().top - 200);
			}, 200);
		});
	});

}
else if (scriptLib.isMobile) {

	var tabsHtml = ['<div class="contentspot"><div id="pdp-tab-m"><div class="pdp-tabs-m">',
		'<span id="pdp-tab-m-1" class="active">Tamamlayıcı Ürünler</span>',
		'<div class="tab-content-m tab-content-m1"></div>',
		'<span id="pdp-tab-m-3">Teknik Özellikler</span>',
		'<div class="tab-content-m tab-content-m3" style="display: none"></div>',
		'<span id="pdp-tab-m-4" style="display: none;">Ürün Açıklaması</span>',
		'<div class="tab-content-m tab-content-m4" style="display: none"></div>',
		'<span id="pdp-tab-m-5" style="display: none;">Ürün Yorumları</span>',
		'<div class="tab-content-m tab-content-m5" style="display: none"></div>',
		'<span id="pdp-tab-m-6" style="display: none;">Taksit/Kredi Seçenekleri</span>',
		'<div class="tab-content-m tab-content-m6" style="display: none"></div>',
		'</div>',
		'</div></div>'].join('');

	if (!$('#pdp-tab-m').length) {
		$('input[name="catalogEntryId"]').closest('form').after(tabsHtml);

		if (await $('#swogo-bundle-2'), 20) {
			$('.tab-content-m1').append($('#swogo-bundle-2'));
			$('#pdp-tab-m-1').show();
		}
		if (await $('.additional-services-list'), 20) {
			$('.tab-content-m2').append($('.additional-services-list'));
			$('#pdp-tab-m-2').show();
		}
		if (await $('#product-ratings'), 20) {
			$('.tab-content-m5').append($('#product-ratings'));
			$('#pdp-tab-m-5').show();
		}
		if (await $('#rcm-container'), 20) {
			$('.tab-content-m4').append($('#rcm-container'));
			$('#pdp-tab-m-4').show();
		}
		if (await $('#flix-inpage'), 20) {
			$('.tab-content-m4').append($('#flix-inpage'));
			$('#pdp-tab-m-4').show();
		}
		if (await $('#pdp-taksit-kredi'), 20) {
			$('.tab-content-m6').append($('#pdp-taksit-kredi'));
			$('#pdp-tab-m-6').show();
		}
	}

	var rcmCount = 0;
	var rcmInterval = setInterval(function () {
		if ($('#product-details').length) {
			$('.tab-content-m3').append($('#product-details'));
			$('#pdp-tab-m-3').show();
			if ($('#flix-inpage').length) {
				$('.tab-content-m4').append($('#flix-inpage'));
				$('#pdp-tab-m-4').show();
			}
		}
		if ($('#product-ratings').length) {
			$('.tab-content-m5').append($('#product-ratings'));
			$('#pdp-tab-m-5').show();
		}
		if ($('.seg-reco-wrapper').length) {
			$('.tab-content-m1').append($('.seg-reco-wrapper'));
			$('#pdp-tab-m-1').show();
		}
		if ($('#rcm-container').length) {
			$('.tab-content-m4').append($('#rcm-container'));
			$('#pdp-tab-m-4').show();
		}
		if ($('#flix-inpage').length) {
			$('.tab-content-m4').append($('#flix-inpage'));
			$('#pdp-tab-m-4').show();
		}
		rcmCount++;
		if (rcmCount === 10) {
			clearInterval(rcmInterval);
		}
	}, 1000);


	$('.pdp-tabs-m span').click(function () {
		if ($(this).hasClass('active')) {
			$('.pdp-tabs-m > span').removeClass('active');
			$('.tab-content-m').hide();
		} else {
			$('.pdp-tabs-m > span').removeClass('active');
			$(this).addClass('active');
			var index = $(this).attr('id').replace('pdp-tab-m-', '');
			if (index) {
				$('.tab-content-m').hide();
				$('.tab-content-m' + index).show();
				window.dispatchEvent(new Event('resize'));
			}
		}
	});
}
}

async addPlus90() {
if (scriptLib.isRegisterPage) {
	if (scriptLib.isDesktop) {
		if ($('input#phone2').val() == '') {
			$('input#phone2').val('+90');
		}
	}
	else if (scriptLib.isMobile) {
		if ($('input#user-mobile-phone-id').val() == '') {
			$('input#user-mobile-phone-id').val('+90');
		}
	}
}
else if (scriptLib.isRegisterBasketPage) {
	if (scriptLib.isDesktop) {
		if ($('input#name[name="mobile"]').val() == '') {
			$('input#name[name="mobile"]').val('+90');
		}
	}
	else if (scriptLib.isMobile) {
		if ($('input#idbillingAddressCellPhone').val() == '') {
			$('input#idbillingAddressCellPhone').val('+90');
		}
	}
}
}

add13IsGunu() {
function check() {
	var inf = $('.market-later td.status').html()
	if (inf && inf.indexOf('Siparişiniz, 1-3 iş günü') !== -1) {
		var imgExist = $('.market-later').find('.img-1-3').length;
		if (!imgExist) {
			$('.market-later td.status').html('<img class="img-1-3" src="http://data.mediamarkt.com.tr/ux/1-3-is-gunu-sepet.png" alt="1-3 iş gününde teslim" /><div>' + inf + '</div>')
		}
	}
}
if (scriptLib.isRegisterBasketPage) {

	var count13 = 0;
	var countInterv = setInterval(function () {
		if (scriptLib.isDesktop) {
			check();
			$(document).on('change', '#marketSelector', function () {
				setTimeout(function () {
					check();
				}, 1500);
			});
		}
		else if (scriptLib.isMobile) {
			$('.store-availability').each(function (i, v) {
				var inf = $(v).html();
				if (inf && inf.indexOf('Siparişiniz, 1-3 iş günü') !== -1) {
					var imgExist = $(v).closest('address').find('.img-1-3').length;
					if (!imgExist) {
						$(v).before('<div><img class="img-1-3" src="http://data.mediamarkt.com.tr/ux/1-3-is-gunu-sepet.png" alt="1-3 iş gününde teslim" /></div>')
					}
				}
			});
		}
		count13++;
		if (count13 === 15) {
			clearInterval(countInterv);
		}
	}, 1000);

}
}

addRcmContent() {
if (!scriptLib.isPDP) return; // quit when page is not PDP
if (scriptLib.isDesktop) {

	var url = new URL(window.location.href);
	var c = url.searchParams.get("rcmTest");

	if(!c) {
		return;
	}

	var sku = $("[itemprop='sku']").attr("content") || "";
	sku = sku.replace("sku:", "");
	fetch("https://ux.mediamarkt.com.tr/rcmApi/api/RcmProduct/RCMProduct?productId=" + sku)
		.then(response => response.json())
		.then(data => {
			if (data && data.Layouts) {
				var htmlMedia = '';
				for (var i = 0; i < data.Layouts.length; i++) {
					htmlMedia += '<div class="row ' + data.Layouts[i].LayoutInfo.LayoutClass + '">' + getLayoutContent(data.Layouts[i].Contents) + '</div>';
				}
				$('.content4').html('<div class="ux-media"> ' + htmlMedia + '</div>');
			}
		});


	function getLayoutContent(contentArr) {
		var rowHtml = '';

		for (var i = 0; i < contentArr.length; i++) {
			const type = contentArr[i].Content.ContentType;

			if (type === 'Image') {
				rowHtml += getImageContent(contentArr[i].Content);
			}
			if (type === 'Youtube') {
				rowHtml += getYoutubeContent(contentArr[i].Content);
			}
			if (type === 'Text') {
				rowHtml += getTextContent(contentArr[i].Content);
			}
			if (type === 'Title') {
				rowHtml += '<div class="h2-title ' + contentArr[i].Content.ContentClass + '"><h2> ' + contentArr[i].Content.Title + '</h2></div>';
			}
		}
		return rowHtml;
	}

	function getImageContent(content) {
		let alt = content.alts || '';
		return '<div class="' + content.ContentClass + '"><img src="' + content.images + '" alt="' + alt + '" /></div>';
	}

	function getYoutubeContent(content) {
		var ifr = '<iframe src="' + content.embedUrl + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
		return '<div class="' + content.ContentClass + '">' + ifr + '</div>';
	}

	function getTextContent(content) {
		return '<div class="' + content.ContentClass + '">' + content.Text + '</div>';
	}
}
}

async NewBasketPage() {if (!scriptLib.runThisFunctionOnlyInTestMode("7ba4faec-cd3c-44fc-adf0-532c57c3a15d")) return;
if (scriptLib.isBasketPage) {
	if (scriptLib.isDesktop) {
		scriptLib.injectCSS('//csscdn.redblue.de/msp/patternlibrary/deployable/static/style-red_af95546e3c64f536e81bf61cf8ddadf5cd0b3dbf-nofonts.min.css');
		scriptLib.injectCSS('//data.mediamarkt.com.tr/uploads/static/scriptLib/basketTopBar.min.css');
		scriptLib.injectJS('//data.mediamarkt.com.tr/uploads/static/scriptLib/basketLogicDesktop.min.js');
	}
	else if (scriptLib.isMobile) {
		scriptLib.injectJS('//data.mediamarkt.com.tr/uploads/static/scriptLib/basketLogicMobile.min.js');

	}
}
}

mustafa() {if (!scriptLib.runThisFunctionOnlyInTestMode("e6f263de-2e60-40c4-a19c-479c1cde571c")) return;
console.log('açıldı')
}

ShareButtonsOnPDP() {
if(!scriptLib.runThisFunctionOnlyInTestMode("b26fb1b1-33d7-454f-8752-84bc87162459")) return;
if(scriptLib.isPDP) {
	let pdpSharePopup = `
		<div class="pdp-share-popup">
			<div class="head-pdp" >
				<p> paylaş </p>
			</div> 
			<div class="icons-pdp"> 
				<li> <a href=""/><img src="" alt=""></a> </li>
				<li> <a href=""/><img src="" alt=""></a> </li>
				<li> <a href=""/><img src="" alt=""></a> </li>
				<li> <a href=""/><img src="" alt=""></a> </li>
				<li> <a href=""/><img src="" alt=""></a> </li>
			</div>
		</div>
	`
	let popupEl = document.querySelector('.pdp-share-popup')
	
	let bodyEl = document.querySelector('body')
	bodyEl.innerHTML += pdpSharePopup;

	let upperClass = document.querySelector('.options');

	let shareEl = document.createElement('li');
	shareEl.classList.add('share-btn-pdp');

	let linkEl = document.createElement('a');
	linkEl.textContent = "paylaş";

	upperClass.append(shareEl);
	shareEl.append(linkEl);

	let shareClickEventItem = document.querySelector('.share-btn-pdp')
	shareClickEventItem.addEventListener('click', function(){
		popupEl[0].classList.add('active')		
	})
}
}

myTest1() {if (!scriptLib.runThisFunctionOnlyInTestMode("34b485b8-6506-41fc-ae78-945b9c48c57a")) return;
// This is the new fiction:
// ok 
console.log("test is successfull");
}


}
// ###___END_OF_CLASS___###
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
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */
class ScriptLib {

	constructor() {
		// Member List:
		this.isMobile = (this.getCookie("MC_DEVICE_ID") == '-11' || this.getCookie("MC_DEVICE_ID") == '-111') ? true : false;
		this.isDesktop = this.getCookie("MC_DEVICE_ID") == '-1' ? true : false;
		this.isPDP = window.location.pathname.indexOf('/tr/product') >= 0 ? true : false;
		this.isBasketPage = window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelDisplayBasket') >= 0 ? true : false;
		this.isCategoryPage = window.location.pathname.indexOf('/tr/category') >= 0 ? true : false;
		this.isSearchPage = window.location.pathname.indexOf('/tr/search') >= 0 ? true : false;
		this.isThankyouPage = window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelOrderSent') >= 0 ? true : false;
		this.isRegisterBasketPage = ((window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelOrderSummary') >= 0) || (window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelOrderRegistration') >= 0)) ? true : false;
		this.isRegisterPage = window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelMARegister') >= 0 ? true : false;
		this.userData = mcs.user;
		// End of member list
		this.injectCSS('https://data.mediamarkt.com.tr/uploads/static/scriptLib/script_lib.min.css');
		this.ListenToLoading();
		this.setTestMode();
		this.unsetTestMode();
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Mon Mar 21 2022 @ 16:40
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	 */
	waitUntilFieldCreated(fieldSelector, waitingDelay = 10 /* time in seconds*/) {
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
	*** Created on Wed Mar 16 2022 @ 12:25
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
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
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	injectCSS(url) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		link.media = 'all';
		head.appendChild(link);
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Thu Mar 24 2022 @ 08:39
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	injectJS(src) {
		return new Promise(function (resolve, reject) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			script.addEventListener('load', resolve);
			script.addEventListener('error', function (e) { reject(e.error) });
			document.head.appendChild(script);
		});
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Tue Apr 12 2022 @ 15:49
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	injectBrutJS(js_code) {
		return new Promise(function (resolve, reject) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML = js_code;
			script.addEventListener('load', resolve);
			script.addEventListener('error', function (e) { reject(e.error) });
			document.head.appendChild(script);
		});
	}

	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Wed Mar 23 2022 @ 09:59
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	ListenToLoading() {
		var x = document.createEvent("MouseEvent");
		x.initEvent("onLoadingStarted");
		var y = document.createEvent("MouseEvent");
		y.initEvent("onLoadingFinished");
		var loadingWin = false;
		setInterval(function () {
			if (($('#loading-bar-spinner').length + $('#loading').length) > 0 && !loadingWin) {
				loadingWin = true;
				document.dispatchEvent(x);
			}
			if (($('#loading-bar-spinner').length + $('#loading').length) == 0 && loadingWin) {
				loadingWin = false;
				document.dispatchEvent(y);
			}
		}, 20);
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Wed Mar 23 2022 @ 17:03
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
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
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Wed Apr 13 2022 @ 18:51
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
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
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	async getProductTitle() {
		if (this.isDesktop) {
			if (await this.waitUntilFieldCreated('h1[itemprop="name"]')) {
				return $('h1[itemprop="name"]').text();
			}
		}
		if (this.isMobile) {
			if (await this.waitUntilFieldCreated('.product-overview-title span')) {
				return $('.product-overview-title span').text();
			}
		}
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Sal Apr 19 2022 @ 14:43
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	getProductBrand() {
		return $('meta[itemprop="brand"]').attr('content');
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Sal Apr 19 2022 @ 16:36
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	getProductSKU() {
		return $('#product-details span[itemprop="sku"]').text();
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Fri Apr 22 2022 @ 09:12
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	runThisFunctionOnlyInTestMode(uuid) {
		const showTestPopup = (uuid) => {
			let html = `
			<div id="test-popup" class="move-to-right">
				<button id="quit"></button>
				<h3>ScriptLib Test Mode</h3>
				<p>
					If you see this popup that means you are on test mode. Current test UUID is: 
					<span class="uuid-container">${uuid}</span>
				</p>
				<button id="btn-exit-text">Exit Test</button>
			</div>
			`;
			$('body').append(html);
			$('body #test-popup #quit').click(() => {
				if ($('#test-popup').hasClass('move-to-left')) {
					$('#test-popup').removeClass('move-to-left');
					$('#test-popup').addClass('move-to-right');
				}
				else if ($('#test-popup').hasClass('move-to-right')) {
					$('#test-popup').removeClass('move-to-right');
					$('#test-popup').addClass('move-to-left');
				}
			});
			$('body #test-popup #btn-exit-text').click(() => {
				localStorage.removeItem("SCRIPT_LIB_TEST_UUID");
				$('body #test-popup').remove();
			});
			var mousePosition;
			var offset = [
				localStorage.getItem("test-popup:x"),
				localStorage.getItem("test-popup:y")
			];
			var isDown = false;

			let div = document.getElementById("test-popup");

			div.style.left = offset[0] + 'px';
			div.style.top = offset[1] + 'px';



			div.addEventListener('mousedown', function (e) {
				isDown = true;
				offset = [
					div.offsetLeft - e.clientX,
					div.offsetTop - e.clientY
				];
			}, true);

			document.addEventListener('mouseup', function () {
				isDown = false;
			}, true);

			document.addEventListener('mousemove', function (event) {
				event.preventDefault();
				if (isDown) {
					mousePosition = {

						x: event.clientX,
						y: event.clientY

					};
					localStorage.setItem("test-popup:x", mousePosition.x);
					localStorage.setItem("test-popup:y", mousePosition.y);
					div.style.left = (mousePosition.x + offset[0]) + 'px';
					div.style.top = (mousePosition.y + offset[1]) + 'px';
				}
			}, true);
		}
		let currentPageUUID = localStorage.getItem("SCRIPT_LIB_TEST_UUID");
		if (uuid === currentPageUUID) {
			showTestPopup(uuid);
			return true;
		}
		return false;
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Fri Apr 22 2022 @ 09:43
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
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
	*** Copyright (c) 2022 - MediaMarkt Turkey
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
	*** Created on Fri Jun 27 2022 @ 14:30
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
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
	*** Created on Fri Jul 04 2022 @ 14:53
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	async productsInCartCount() {
		let rest = await this.waitUntilFieldCreated('.ctable-wrapper table.ctable');
		if (rest) {
			return $('.ctable-wrapper table.ctable tbody[product="product"]').length
		}
		return null;
	}


	/***********************************************************************************************************************************
	************************************************************************************************************************************
	*** Created on Fri Jul 07 2022 @ 16:28
	*** Developed By Mohamed Elleuch
	*** Copyright (c) 2022 - MediaMarkt Turkey
	************************************************************************************************************************************
	************************************************************************************************************************************
	*/
	API_getProductPrice(sku) {
		return new Promise((resolve) => {
			let metaPath = "product:price:amount";
			if (scriptLib.isMobile) {
				// change to desktop version 
				scriptLib.setCookie("MC_DEVICE_ID", "-1", 125)
			}
			fetch(`https://www.mediamarkt.com.tr/catentry/${sku}`)
				.then(async (res) => {
					if (scriptLib.isMobile) {
						// return back to mobile version
						scriptLib.setCookie("MC_DEVICE_ID", "-11", 125)
					}
					let pdpPageHtml = $(await res.text());
					pdpPageHtml.each((i, element) => {
						element = $(element);
						if (element[0].nodeName == "META") {
							if (element.attr('property') == metaPath) {

								let price = element.attr('content');
								resolve(price);
							}
						}
					});
					resolve(undefined);
				});
		});
	}




}
window.scriptLib = new ScriptLib();
window.scriptLibFunctions = new ScriptLibFunctions();



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Mar 8 2022 @ 11:00
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */

window.blockFakeEmails = (text) => {

	const regex = /(\.{2,}|-{2,}|(\+\d*))/gm;
	const subst = ``;
	const result = text.replace(regex, subst);

	return result;

}


/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Mar 16 2022 @ 15:37
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */
if (window.location.pathname === '/webapp/wcs/stores/servlet/MultiChannelOrderSummary') {
	let failed = 0;
	let timerHandler = setInterval(() => {
		if ($('.delivery-type-container .panel.panel-default').length > 0) {
			clearInterval(timerHandler);
			$('.delivery-type-container .panel.panel-default').after(`
				<div class="form-group pickup-message-container">
					<a href="#/checkout/summary/delivery-address" ng-if="pickupData.selected" class="pickup-message-link edit-location-link ng-scope" ng-click="openPickupModal(); $event.stopPropagation(); $event.preventDefault();">
						<p class="pickup-message-title user-address-title ng-binding">Mağazadan Teslim Al</p>
						<p class="pickup-message-paragraph">Ürününüzü mağazadan teslim almak ister misiniz?</p>
					</a>
				</div>
			`);
			$('.form-group .pickup-message-link').click(() => {
				setTimeout(() => {
					$('.panel-pickup span.accordion-state-indicator[ng-click="toggleOpen()"]').trigger('click');
					setTimeout(() => {
						$('.panel-title a.edit-location-link.ng-scope').trigger('click');
					}, 400);
				}, 700);
			})
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
*** Created on Tue Mar 21 2022 @ 16:11
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
 */
if (window.location.pathname.indexOf('/tr/product') === 0) {
	// category list:
	let categoryListPhones = [
		504171,
		644527,
		675172,
	];
	const isThisMobile = () => {
		// debugger
		//const regex = /504171|644527|675172/gm;
		const regex = new RegExp(categoryListPhones.join("|"), 'gm');
		const str = $('html').html();
		let m;
		let count = 0;
		let res = false;

		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				count++;
				// console.info(`Found match, group ${groupIndex}: ${match}`);
			});
		}
		if (count > 1) {
			res = true
		}
		return res;
	}
	setTimeout(async function () {

		var buyback = 0;
		if (scriptLib.isDesktop) {
			if (await scriptLib.waitUntilFieldCreated('.breadcrumbs li'), 20) {
				$('.breadcrumbs li').each(function () {
					var a = $(this).find('a').attr('href');
					// if(a && (a.indexOf('504926') !==-1 || a.indexOf('639520') !==-1 || a.indexOf('504171') !==-1)) {
					categoryListPhones.forEach((it) => {
						if (a && a.indexOf(it) !== -1) buyback = 1;
					});
				});
			}
		}
		else if (scriptLib.isMobile) {
			//$('.site-navigation2__child-list li')
			// if(await scriptLib.waitUntilFieldCreated('#wrapper-main .category-breadcrumb-container .category-breadcrumb-wrapper a'), 20) {
			// 	$('#wrapper-main .category-breadcrumb-container .category-breadcrumb-wrapper').each(function() {
			// 		var a = $(this).find('a').attr('href');
			// 		// if(a && (a.indexOf('504926') !==-1 || a.indexOf('639520') !==-1 || a.indexOf('504171') !==-1)) {
			// 		categoryListPhones.forEach((it)=> {
			// 			if(a && a.indexOf(it)!==-1) buyback = 2;
			// 		});
			// 	});
			// }
			// if(await scriptLib.waitUntilFieldCreated('#wrapper-main .category-breadcrumb-container .category-breadcrumb-wrapper a'), 20) {
			// $('#wrapper-main .category-breadcrumb-container .category-breadcrumb-wrapper').each(function() {
			// var a = $(this).find('a').attr('href');
			var category = $('meta[property="prudsys:recomm:category"]').attr('content');
			// if(a && (a.indexOf('504926') !==-1 || a.indexOf('639520') !==-1 || a.indexOf('504171') !==-1)) {
			categoryListPhones.forEach((it) => {
				if (category && category.indexOf(it) !== -1) buyback = 2;
			});

			// });
			// }
		}

		if (buyback == 1) { // desktop
			if (! await scriptLib.waitUntilFieldCreated('.n-more .options', 20)) return;
			$('.n-more .options').append('<li><a class="buyback" href="#">Eski Cihazını Yenile</a></li>');
		}
		else if (buyback == 2) { // mobile
			if (! await scriptLib.waitUntilFieldCreated('#add-to-basket-buttons', 20)) return;
			$('#add-to-basket-buttons').after('<div class="gridbox column-1-1 buyback"><a href="#">Eski Cihazını Yenile</a></div>');
		}

		$(document).on('click', '.buyback', function () {

			console.info('Processing your request');
			// let uri = $('#addToBasket').data('data-request-url');
			let uri;
			(buyback == 1) && (uri = $('#hidden-pdp-add-to-cart').data('href'));
			(buyback == 2) && (uri = $('#addToBasket').data().requestUrl);
			let searchParams = new URLSearchParams(uri);
			const cat = searchParams.get('categoryId') || '';
			const catEntry = searchParams.get('catEntryId') || '';

			// var src="https://bayi.fintegre.com/OnlineBuyback?id=6912&requestID="+uId*2+"&returnCode=" + cat + "l"+ catEntry +"&userId="+uId;
			var src = "https://www.mediamarkt.com.tr/tr/shop/eski-cihazini-yenile.html?returnCode=" + cat + "l" + catEntry;
			window.location.href = src;
		});

	}, 500);
}



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Mar 21 2022 @ 17:02
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
if (window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelDisplayBasket') === 0) {
	let searchParams = new URLSearchParams(window.location.search);

	if (searchParams.has('returnCode')) {

		var ids = searchParams.get('returnCode').split('l');
		var catId = ids[0];
		var catEntry = ids[1];

		// test link
		// https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14&returnCode=797527l7788401

		var uri = `/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId=103452&langId=-14&catEntryId=${catEntry}&categoryId=${catId}`;

		var a = '<a href="#" class="button add-to-cart dr" data-href="' + uri + '"></a>';

		$('body').append(a);

		setTimeout(function () {
			$('.add-to-cart.dr').trigger('click');
			setTimeout(() => {
				window.location.href = `https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14`
			}, 500)
		}, 10);
	}
}



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Mar 22 2022 @ 13:47
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
if (window.location.pathname.indexOf('/webapp/wcs/stores/servlet/MultiChannelOrderSummary') === 0) {
	$(window).ready(() => {
		//$('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header').each((i, e) => e.click());
	});
}



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Mar 23 2022 @ 13:20
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
document.addEventListener("onLoadingFinished", function () {
	let intVar;
	//setTimeout(() => {
	//	$('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header').each((i, e) => e.click());
	//}, 500);
	const CheckIfFieldsAreClosed = async () => {
		if (await scriptLib.waitUntilFieldCreated('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice'), 20) {
			clearInterval(intVar);
			return;
		}
		var classList = $('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice').attr('class').split(/\s+/);
		let state = true;
		$.each(classList, function (index, item) {
			// debugger
			if (item === "expanded") {
				state = false;
			}
		});
		return state;
	}
	intVar = setInterval(() => {
		if (CheckIfFieldsAreClosed()) {
			$('.ctable-wrapper .ctable .cart-product-table .single-services-table .cservice .cservice-table .c-header.th-title .cservice-header').each((i, e) => e.click());
		} else {
			clearInterval(intVar);
		}
	}, 500)
})



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Apr 06 2022 @ 13:35
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
$(window).ready(() => {
	if (scriptLib.isMobile) {
		return; // this should not be executed on mobile
	}

	console.info('store delivery desktop started.');
	scriptLib.waitUntilFieldCreated("#product-details > div.price-sidebar .price-button")
		.then((res) => {
			if (!res) {
				throw "Add To Card button was not found!!!";
			}
			$('#product-details > div.price-sidebar .price-button').after('<div class="store-delivery button-green-pdp"><a href="#">Mağazadan Teslim Al</a></div>');

			$('.store-delivery').click(function () {
				console.info('link clicked');
				//if($('.stock-mdl').length) {
				//    $('.stock-mdl').show();
				//} else 
				{
					var sku = $("[itemprop='sku']").attr("content") || "";
					sku = sku.replace("sku:", "");
					var uri = 'https://ux.mediamarkt.com.tr/store-delivery/index.html?id=' + sku;
					var clsIcon = '<svg class="stock-cls-icn" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path></g></g></svg>';
					var iframe = ' <div class="stock-mdl"><div>' + clsIcon + '<iframe src="' + uri + '" title="Stok Durumu Görüntüle"></iframe></div></div>';
					$('body').append(iframe);
					setTimeout(() => {
						$('#cboxOverlay').hide();
					}, 100);
				}
			});

			$('.stock-cls-icn').click(function () {
				$('.stock-mdl').hide();
				$('#cboxOverlay').hide();
			});
		});



	/***********************************************************************************************************************************/

	if (window.addEventListener) {
		window.addEventListener("message", handleIFrameEvent, false);
	}
	else if (window.attachEvent) {
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
			urlStr = urlStr.replace(/_\d*/gm, '');
			const catEntryIdArray = RegExMatchAll(urlStr, /catEntryId=\d*/gm);
			const categoryIdArray = RegExMatchAll(urlStr, /categoryId=\d*/gm);
			console.info('add item to cart', catEntryIdArray, categoryIdArray);
			await CartAddItem(catEntryIdArray[0].split('=')[1], categoryIdArray[0].split('=')[1]);
			await SetPickupStore(store_id);
			setTimeout(function () { window.location.href = "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14"; }, 1500);
		} else {
			throw 'unknown origin';
		}
	};


	async function SetPickupStore(pickupStoreId) {
		// 129953
		// 33361
		// orderId = await GetOrderId();
		orderId = pickupStoreId;
		// console.info(pickupStoreId,orderId);
		await fetch("https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummaryController", {
			"headers": {
				"accept": "application/json",
				"accept-language": "tr,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
				"content-type": "application/x-www-form-urlencoded",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Microsoft Edge\";v=\"98\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-requested-with": "XMLHttpRequest"
			},
			"referrer": "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummary?storeId=103452&orderId=" + orderId + "&langId=-14&rememberMe=true",
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "storeId=103452&langId=-14&orderId=" + orderId + "&pickUpStoreId=" + pickupStoreId + "&pickUpStopGo=false&method=marketSelected",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
	}



	async function GetOrderId() {
		res = await fetch("https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14")
		var html = await res.text();
		html = $(html);
		let link = $(html).find("#js-cart-app > div.cobuttons.cobuttons-cart > div > .cocheckout-actions > a").attr('href');
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

	function CartAddItem(catEntryId, cat, storeId = 103452, extraParams = '') {
		// var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId="+storeId+"&langId=-14&catEntryId_"+catEntry+"="+catEntry+"&categoryId_"+catEntry+"="+cat+"&quantity_"+catEntry+"=1";
		var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?catEntryId=" + catEntryId + "&categoryId=" + cat + "&langId=-14&storeId=" + storeId + "&quantity=1" + extraParams;
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
		let res = await fetch('https://ux.mediamarkt.com.tr/store-delivery/stores-list.json');
		let data = res.json();
		return data;
	}

	async function GetFullStoreList_old() {
		//debugger
		res = await fetch("https://www.mediamarkt.com.tr/tr/marketselection.html")
		var html = await res.text();
		html = $(html);
		let attr = 'href';
		let nodeListStores = $(html).find(".all-markets-list li a");
		if (nodeListStores.length = 0) {
			nodeListStores = $(html).find("#dropdown-market-list option");
			attr = 'data-link';
		}
		let listStores = [];
		nodeListStores.each((index, element) => {
			element = $(element);
			let text = element.text();
			var storeId = element.attr(attr).split('/')[element.attr('href').split('/').length - 1].split(',')[1];
			let city = text.split('|')[0]//.replaceAll(' ','');
			let store = text.split('|')[1];
			//store && (store = store.replaceAll(' ',''));
			listStores.push(JSON.parse((`
				{
					"city": "${city}",
					"store": "${store}",
					"storeId": "${storeId}"
				}
			`)));
		});
		return listStores;
	}


	async function GetStoreId(wantedStoreName) {
		let list = await GetFullStoreList();
		let res = list.filter((item) => {
			return ((wantedStoreName.indexOf(item.city) > -1) && (wantedStoreName.indexOf(item.store) > -1))
		});
		if (res.length === 1) {
			return res[0];
		} else {
			throw 'more than store where found';
		}
	}

	const onNotificationFromIframe = async (store_name) => {

		let store = await GetStoreId(store_name);
		let store_id = store.storeId;
		let res = await SetPickupStore(store_id);
		console.info(store_id);
	}


})



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Apr 08 2022 @ 16:03
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
$(window).ready(() => {
	if (scriptLib.isDesktop) {
		return; // this should not be executed on desktop
	}

	console.info('store delivery mobile started.');
	$('.gridbox.column-1-1.buyback').length && $('.gridbox.column-1-1.buyback').after('<div class="gridbox column-1-1 store-delivery-mobile"><a href="#">Mağazadan Teslim Al</a></div>');
	$('.gridbox.column-1-1.buyback').length || $('#add-to-basket-buttons').after('<div class="gridbox column-1-1 store-delivery-mobile"><a href="#">Mağazadan Teslim Al</a></div>');


	$('.store-delivery-mobile').click(function () {
		console.info('link clicked');
		//if($('.stock-mdl').length) {
		//    $('.stock-mdl').show();
		//} else 
		{
			var sku = $("[itemprop='sku']").attr("content") || "";
			sku = sku.replace("sku:", "");
			var uri = 'https://ux.mediamarkt.com.tr/store-delivery/index.html?id=' + sku;
			var clsIcon = '<svg class="stock-cls-icn" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"></path></g></g></svg>';
			var iframe = ' <div class="stock-mdl"><div>' + clsIcon + '<iframe src="' + uri + '" title="Stok Durumu Görüntüle"></iframe></div></div>';
			$('body').append(iframe);
			setTimeout(() => {
				$('#cboxOverlay').hide();
			}, 100);
		}
	});

	$('.stock-cls-icn').click(function () {
		$('.stock-mdl').hide();
		$('#cboxOverlay').hide();
	});

	/*****************************************************************************************************/

	if (window.addEventListener) {
		window.addEventListener("message", handleIFrameEvent, false);
	}
	else if (window.attachEvent) {
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
			urlStr = urlStr.replace(/_\d*/gm, '');
			const catEntryIdArray = RegExMatchAll(urlStr, /catEntryId=\d*/gm);
			const categoryIdArray = RegExMatchAll(urlStr, /categoryId=\d*/gm);
			console.info('add item to cart', catEntryIdArray, categoryIdArray);
			await CartAddItem(catEntryIdArray[0].split('=')[1], categoryIdArray[0].split('=')[1]);
			await SetPickupStoreMobile(store_id);
			setTimeout(function () { window.location.href = "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14"; }, 1500);
		} else {
			throw 'unknown origin';
		}
	};


	async function SetPickupStoreMobile(pickupStoreId) {
		// 129953
		// 33361
		let orderId = await GetOrderIdMobile();

		await fetch("https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummaryController?storeId=103452&orderId=" + orderId + "&langId=-14", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9,tr;q=0.8,de-DE;q=0.7,de;q=0.6",
				"content-type": "application/x-www-form-urlencoded",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin"
			},
			"referrer": "https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelOrderSummary?storeId=103452&orderId=" + orderId + "&langId=-14&rememberMe=true",
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "method=saveDeliveryData&pickUpStoreId=" + pickupStoreId + "&shipModeId=-136002&value=PICKUP",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
	}



	async function GetOrderIdMobile() {
		res = await fetch("https://www.mediamarkt.com.tr/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=103452&langId=-14")
		var html = await res.text();
		html = $(html);
		let link = $(html).find("#wrapper-main section.bg-white.total-price-container > form.proceed-to-checkout").attr('action');
		html.each((i, el) => {
			if (el.getAttribute && el.getAttribute('id') === 'wrapper-main') {
				link || (link = el.querySelector("section.bg-white.total-price-container > form.proceed-to-checkout").getAttribute('action'))
			}
		})
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

	function CartAddItem(catEntryId, cat, storeId = 103452, extraParams = '') {
		// var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId="+storeId+"&langId=-14&catEntryId_"+catEntry+"="+catEntry+"&categoryId_"+catEntry+"="+cat+"&quantity_"+catEntry+"=1";
		var link = "/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?catEntryId=" + catEntryId + "&categoryId=" + cat + "&langId=-14&storeId=" + storeId + "&quantity=1" + extraParams;
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
		let res = await fetch('https://ux.mediamarkt.com.tr/store-delivery/stores-list.json');
		let data = res.json();
		return data;
	}

	async function GetFullStoreList_old() {
		//debugger
		res = await fetch("https://www.mediamarkt.com.tr/tr/marketselection.html")
		var html = await res.text();
		html = $(html);
		let attr = 'href';
		let nodeListStores = $(html).find(".all-markets-list li a");
		if (nodeListStores.length = 0) {
			nodeListStores = $(html).find("#dropdown-market-list option");
			attr = 'data-link';
		}
		let listStores = [];
		nodeListStores.each((index, element) => {
			element = $(element);
			let text = element.text();
			var storeId = element.attr(attr).split('/')[element.attr('href').split('/').length - 1].split(',')[1];
			let city = text.split('|')[0]//.replaceAll(' ','');
			let store = text.split('|')[1];
			//store && (store = store.replaceAll(' ',''));
			listStores.push(JSON.parse((`
				{
					"city": "${city}",
					"store": "${store}",
					"storeId": "${storeId}"
				}
			`)));
		});
		return listStores;
	}


	async function GetStoreId(wantedStoreName) {
		let list = await GetFullStoreList();
		let res = list.filter((item) => {
			return ((wantedStoreName.indexOf(item.city) > -1) && (wantedStoreName.indexOf(item.store) > -1))
		});
		if (res.length === 1) {
			return res[0];
		} else {
			throw 'more than store where found';
		}
	}

	const onNotificationFromIframe = async (store_name) => {

		let store = await GetStoreId(store_name);
		let store_id = store.storeId;
		let res = await SetPickupStore(store_id);
		console.info(store_id);
	}

})



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Apr 12 2022 @ 13:42
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
$(window).ready(() => {
	if (scriptLib.isPDP) {
		if (scriptLib.isDesktop) {
			if ($('h1[itemprop="name"]').text().indexOf("PHILIPS") >= 0) {
				scriptLib.injectJS("https://tracking.channelsight.com/api/tracking/v2/Init")
			}
		} else if (scriptLib.isMobile) {
			if ($(".product-overview-title span").text().indexOf("PHILIPS") >= 0) {
				scriptLib.injectJS("https://tracking.channelsight.com/api/tracking/v2/Init")
			}
		} else {
			throw "script lib desktop/mobile error"
		}
	}

	if (scriptLib.isThankyouPage) {

		let data = [];
		$('.checkout-container .co-product').each((x, i) => {
			let sku = $(i).attr('data-reco-pid');
			let title = $(i).find('.product-title').text();
			if (title.indexOf("PHILIPS") == -1) return;
			let price_qnty = $(i).find('.product-amount').text();
			let price = 0;//price_qnty.split(' : ')[0];
			let qnty = price_qnty.split(' : ')[1];
			data.push({
				Name: title,
				ProductCode: sku,
				Category: "####",
				Price: price,
				Quantity: parseInt(qnty)
			});
		})
		let code = `
		ChannelSight_Type = "OrderTracking"; ChannelSight_Separator = ".";
		var CS_Products = ${JSON.stringify(data)};
		varCS_Order = {Currency:"TRY"};
		`;
		scriptLib.injectBrutJS(code)
		scriptLib.injectJS("https://tracking.channelsight.com/api/tracking/v2/Init")
	}
});



/***********************************************************************************************************************************
************************************************************************************************************************************
*** Created on Tue Apr 14 2022 @ 15:44
*** Developed By Mohamed Elleuch
*** Copyright (c) 2022 - MediaMarkt Turkey
************************************************************************************************************************************
************************************************************************************************************************************
*/
$(window).ready(() => {
scriptLibFunctions.testModeFunction()
scriptLibFunctions.setKargoExpectedDate()
scriptLibFunctions.showIphoneWarning()
scriptLibFunctions.manageAssistBox()
scriptLibFunctions.setKargo3DaysAfter()
scriptLibFunctions.removePickupStoreBtnForOutletProducts()
scriptLibFunctions.swogoForCategoryAndSearchPages()
scriptLibFunctions.SwogoHeroPDP()
scriptLibFunctions.loadTvSliderFiles()
scriptLibFunctions.changeMoreClickableLink()
scriptLibFunctions.setTabMenuPDP()
scriptLibFunctions.addPlus90()
scriptLibFunctions.add13IsGunu()
scriptLibFunctions.addRcmContent()
scriptLibFunctions.NewBasketPage()
scriptLibFunctions.mustafa()
scriptLibFunctions.ShareButtonsOnPDP()
scriptLibFunctions.myTest1()

})
