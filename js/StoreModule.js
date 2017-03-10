
(function($) {
	'use strict';

	var StringHash = {
		_chars: ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Z','1','2','3','4','5','6','7','8','9','0'],
		_getRandChar: function() {
			return this._chars[Math.floor(Math.random() * this._chars.length)];
		},
		generate: function(len) {
			if (!len) len = 17;
			var str = '';
			for (var i=0; i < len; i++) {
				str += this._getRandChar();
			}
			return str;
		}
	};
	
	var MD5 = function(string) {

		function RotateLeft(lValue, iShiftBits) {
				return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
				var lX4,lY4,lX8,lY8,lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
				if (lX4 & lY4) {
						return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
				}
				if (lX4 | lY4) {
						if (lResult & 0x40000000) {
								return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
						} else {
								return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
						}
				} else {
						return (lResult ^ lX8 ^ lY8);
				}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a,b,c,d,x,s,ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
				var lWordCount;
				var lMessageLength = string.length;
				var lNumberOfWords_temp1=lMessageLength + 8;
				var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
				var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
				var lWordArray=Array(lNumberOfWords-1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while ( lByteCount < lMessageLength ) {
						lWordCount = (lByteCount-(lByteCount % 4))/4;
						lBytePosition = (lByteCount % 4)*8;
						lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
						lByteCount++;
				}
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
				lWordArray[lNumberOfWords-2] = lMessageLength<<3;
				lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
				return lWordArray;
		};

		function WordToHex(lValue) {
				var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
				for (lCount = 0;lCount<=3;lCount++) {
						lByte = (lValue>>>(lCount*8)) & 255;
						WordToHexValue_temp = "0" + lByte.toString(16);
						WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
				}
				return WordToHexValue;
		};

		function Utf8Encode(string) {
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";

				for (var n = 0; n < string.length; n++) {

						var c = string.charCodeAt(n);

						if (c < 128) {
								utftext += String.fromCharCode(c);
						}
						else if((c > 127) && (c < 2048)) {
								utftext += String.fromCharCode((c >> 6) | 192);
								utftext += String.fromCharCode((c & 63) | 128);
						}
						else {
								utftext += String.fromCharCode((c >> 12) | 224);
								utftext += String.fromCharCode(((c >> 6) & 63) | 128);
								utftext += String.fromCharCode((c & 63) | 128);
						}

				}

				return utftext;
		};

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
				AA=a; BB=b; CC=c; DD=d;
				a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
				d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
				c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
				b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
				a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
				d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
				c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
				b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
				a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
				d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
				c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
				b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
				a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
				d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
				c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
				b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
				a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
				d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
				c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
				b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
				a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
				d=GG(d,a,b,c,x[k+10],S22,0x2441453);
				c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
				b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
				a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
				d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
				c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
				b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
				a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
				d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
				c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
				b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
				a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
				d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
				c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
				b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
				a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
				d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
				c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
				b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
				a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
				d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
				c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
				b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
				a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
				d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
				c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
				b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
				a=II(a,b,c,d,x[k+0], S41,0xF4292244);
				d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
				c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
				b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
				a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
				d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
				c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
				b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
				a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
				d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
				c=II(c,d,a,b,x[k+6], S43,0xA3014314);
				b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
				a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
				d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
				c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
				b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
				a=AddUnsigned(a,AA);
				b=AddUnsigned(b,BB);
				c=AddUnsigned(c,CC);
				d=AddUnsigned(d,DD);
			}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
		
		return temp.toLowerCase();
	};
	window.wbMD5 = MD5;

	/**
	 * Set price field value by taking fixed decimal format into account.
	 * Note: uses field attribute 'data-fixed-decimal'.
	 * @param {jQuery} priceField field to set value for.
	 * @param {number} priceValue value to set.
	 */
	var setPriceFieldValue = function(priceField, priceValue) {
		var fd, val = priceValue;
		if ((fd = parseInt(priceField.data('fixedDecimal'), 10)) && !isNaN(fd)) {
			val = val.toFixed(fd);
		}
		priceField.val(val);
	};
	
	var storeElements = [],
		cartElenents = [],
		cartItems = [],
		currency = {},
		storeUrl = null,
		cartBackBtnUrl = null,
		lastIndex = 0,
		StoreModule = {

		initStore: function(storeElementId, storeData) {
			currency = storeData.currency ? storeData.currency : {code: 'USD', postfix: '', prefix: '$'};
			var thisSelf = this,
				store = $('#' + storeElementId + ' .wb-store').eq(0),
				filters = store.find('.wb-store-filters').eq(0),
				cselect = store.find('.wb-store-cat-select').eq(0),
				list = store.children('.wb-store-list').eq(0),
				details = store.children('.wb-store-details'),
				cartDetails = store.children('.wb-store-cart-details').eq(0),
				cartDetailsForm = cartDetails.find('.wb-store-form'),
				cartDetailsTable = cartDetails.find('.wb-store-cart-table').eq(0),
				cartDetailsTableNoItems = cartDetailsTable.find('tbody tr:first').eq(0).detach(),
				cartDetailsOrderTpl = cartDetailsTable.find('tbody tr:first').eq(0).detach().text(),
				cartDetailsTableRow = cartDetailsTable.find('tbody tr').eq(0).detach(),
				cartDetailsTableTotal = cartDetailsTable.find('tfoot tr td').eq(0),
				payBtns = cartDetails.find('.wb-store-pay-btns').eq(0),
				payBtnPrices = payBtns.find("input[value='{{price}}']"),
				filterItems = function(id) {
					list.children('.wb-store-item').each(function() {
						var i, item = $(this), cats = item.attr('data-cids').split(','); cats.pop();
						var map = {}; for (i in cats) { map['#' + cats[i]] = true; }
						if (!id || (('#' + id) in map)) {
							item.show();
						} else {
							item.hide();
						}
					});
				};
			var removeItemClick = function(e, item) {
				for (var i = 0; i < cartItems.length; i++) {
					if (item.id == cartItems[i].id) {
						cartItems.splice(i, 1);
						StoreModule.updateCartView(true);
						StoreModule.showCart();
						if ('localStorage' in window) {
							localStorage.setItem('siteECommCartData', JSON.stringify(cartItems));
						}
					}
				}
			};
			
			payBtns.find('form').each(function() {
				$(this).on('submit', function() {
					var gatewayId = $(this).attr('data-gateway-id'),
						url = $('head base').attr('href') + '0/store-save-order',
						tnxId = $(this).data('transactionId'),
						price = cartDetailsTableTotal.text(),
						order = [];
					for (var i = 0; i < cartItems.length; i++) {
						var item = cartItems[i];
						order.push(cartDetailsOrderTpl
							.replace('{{name}}', item.name)
							.replace('{{sku}}', item.sku)
							.replace('{{price}}', item.price)
							.replace('{{qty}}', item.quantity));
					}
					$.post(url, {
						tnx_id: tnxId,
						gateway_id: gatewayId,
						order: order,
						price: price
					});
					if ('localStorage' in window) {
						localStorage.removeItem('siteECommCartData');
					}
				});
				var tmp;
				if ((tmp = $(this).attr('data-onload'))) {
					if ((tmp in window) && typeof window[tmp] === 'function') window[tmp](this);
				}
				if ((tmp = $(this).attr('data-onsubmit'))) {
					var thisForm = this;
					if ((tmp in window) && typeof window[tmp] === 'function') this.onsubmit = function() { return window[tmp](thisForm); };
				}
			});
			payBtns.find("input[value='{callbackUrl}']").each(function() {
				var gatewayId = $(this).parents('form').attr('data-gateway-id');
				var callbackUrl = $('head base').attr('href') + '0/store-callback/?gatewayId=' + gatewayId;
				this.value = callbackUrl;
			});
			payBtns.find("input[value='{transactionId}']").each(function() {
				var tnxId = StringHash.generate(17);
				this.value = tnxId;
				$(this).parents('form').data('transactionId', tnxId);
			});
			cartDetails.find('.wb-store-inquiry-btn').on('click', function() {
				$(this).hide();
				cartDetailsForm.show();
			});
			cartDetailsForm.children('.wb_form').on('submit', function() {
				var objInput = $($(this).prop('elements')['object']);
				var data = {items: []};
				for (var i = 0; i < cartItems.length; i++) {
					var item = cartItems[i];
					data.items.push({name: item.name, sku: item.sku, price: item.priceStr, qty: item.quantity});
				}
				data.totalPrice = cartDetailsTableTotal.text();
				objInput.val(JSON.stringify(data));
			});
			cselect.on('change', function() { filterItems(this.value); });
			list.children('.wb-store-item').on('click', function() {
				list.hide();
				filters.hide();
				var dItem = details.eq(parseInt($(this).attr('data-iid'), 10));
				dItem.find('.wb-store-inquiry-btn').off('click').on('click', function() {
					$(this).hide();
					dItem.find('.wb-store-form').show();
				});
				dItem.find('.wb-store-cart-add-btn').off('click').on('click', function() {
					thisSelf.addToCart($(this).parents('.wb-store-details').eq(0));
				});
				dItem.show();
				var offset = store.offset().top - 20;
				if ($('#wb_sbg_placeholder').length) {
					offset -= $('#wb_sbg_placeholder').outerHeight();
				}
				window.scrollTo(0, offset);
			});
			details.find('.wb-store-back').on('click', function() {
				details.hide();
				list.show();
				filters.show();
			});
			cartDetails.find('.wb-store-back').on('click', function() {
				if (cartBackBtnUrl) {
					location.href = cartBackBtnUrl;
				} else {
					cartDetails.hide();
					list.show();
					filters.show();
				}
			});
			storeElements.push({
				showCart: function() {
					var i, item, cItem, cItemCells, total = 0,
						tbody = cartDetailsTable.children('tbody').eq(0);
					list.hide();
					filters.hide();
					details.hide();
					$('.wb-store-cart-table-remove', tbody).unbind(removeItemClick);
					tbody.empty();
					if (!cartItems.length) {
						cartDetailsTable.addClass('empty');
						tbody.append(cartDetailsTableNoItems.clone());
						payBtns.hide();
					} else {
						cartDetailsTable.removeClass('empty');
						for (i = 0; i < cartItems.length; i++) {
							item = cartItems[i];
							cItem = cartDetailsTableRow.clone();
							cItemCells = cItem.children('td');
							if (item.image) cItemCells.eq(0).empty().append($('<img>').attr({src: item.image, alt: ''}));
							if (item.name) cItemCells.eq(1).html(item.name + ' <span>(' + item.priceStr + ')</span>');
							(function(el, item) {
								el.val(item.quantity).on('change keyup', function() {
									var i, total = new Big(0), quantity = parseInt($(this).val(), 10);
									if (isNaN(quantity) || quantity < 1) quantity = 1;
									item.quantity = quantity;
									el.parents('td').next('td').text(currency.prefix + ((new Big(item.quantity)).times(item.price)) + currency.postfix);
									for (i = 0; i < cartItems.length; i++) {
										total = total.plus((new Big(cartItems[i].quantity)).times(cartItems[i].price));
									}
									total = Math.round(total * 100) / 100;
									cartDetailsTableTotal.text(currency.prefix + total + currency.postfix);
									for (i = 0; i < payBtnPrices.length; i++) {
										setPriceFieldValue(payBtnPrices.eq(i), total);
										var tmp;
										if ((tmp = payBtnPrices.eq(i).attr('data-onchange'))) {
											if ((tmp in window) && typeof window[tmp] === 'function') window[tmp](payBtnPrices.get(i));
										}
									}
								});
//								setTimeout(function() { el.trigger('change'); }, 1);
							})(cItemCells.eq(2).children('input').eq(0), item);
							cItemCells.eq(3).text(currency.prefix + (new Big(item.quantity).times(item.price)) + currency.postfix);
							(function(item) {
								cItemCells.eq(4).find('span').eq(0).bind('click', function(e) {
									removeItemClick(e, item);
								});
							})(item);
							total += parseFloat(new Big(item.quantity).times(item.price));
							tbody.append(cItem);
						}
						payBtns.show();
					}
					total = total.toFixed(2);
					cartDetailsTableTotal.text(currency.prefix + total + currency.postfix);
					for (i = 0; i < payBtnPrices.length; i++) {
						setPriceFieldValue(payBtnPrices.eq(i), total);
						var tmp;
						if ((tmp = payBtnPrices.eq(i).attr('data-onchange'))) {
							if ((tmp in window) && typeof window[tmp] === 'function') window[tmp](payBtnPrices.get(i));
						}
					}
					cartDetails.show();
					$('body').animate({ scrollTop: store.offset().top - (('mainHeaderHeight' in window) ? window.mainHeaderHeight : 0) - 20 });
				}
			});
			if (cartBackBtnUrl) {
				storeElements[storeElements.length - 1].showCart();
			}
		},

		initStoreCart: function(storeCartElementId, storeData) {
			storeUrl = storeData.storeUrl ? storeData.storeUrl : null;
			var thisSelf = this,
				cart = $('#' + storeCartElementId).eq(0);
			cart.on('click', function() { thisSelf.showCart(); });
			cartElenents.push({
				updateView: function(noAnim) {
					if (!noAnim) {
						cart.addClass('cartanim');
						setTimeout(function() { cart.removeClass('cartanim'); }, 1000);
					}
					cart.find('.store-cart-counter').text('(' + cartItems.length + ')');
				}
			});
			this.updateCartView();
		},

		addToCart: function(item) {
			cartItems.push({
				id: (++lastIndex),
				image: item.attr('data-image'),
				name: item.attr('data-name'),
				sku: item.attr('data-sku'),
				priceStr: item.attr('data-price-str'),
				price: item.attr('data-price'),
				quantity: 1
			});
			if ('localStorage' in window) {
				localStorage.setItem('siteECommCartData', JSON.stringify(cartItems));
			}
			this.updateCartView();
		},
		
		removeFromCart: function(item) {
			
		},

		showCart: function() {
			if (storeElements.length) {
				for (var i = 0; i < storeElements.length; i++) {
					storeElements[i].showCart();
					break;
				}
			} else if (storeUrl) {
				if ('localStorage' in window) {
					localStorage.setItem('siteECommPageRef', location.pathname);
				}
				location.href = storeUrl;
			}
		},

		updateCartView: function(noAnim) {
			for (var i = 0; i < cartElenents.length; i++) {
				cartElenents[i].updateView(noAnim);
			}
		}
	};
	if ('localStorage' in window) {
		var cartData = JSON.parse(localStorage.getItem('siteECommCartData'));
		if ((typeof cartData === 'object') && cartData !== null && cartData.length > 0) {
			cartItems = cartData;
		}
		var refId = localStorage.getItem('siteECommPageRef');
		if (refId) {
			localStorage.removeItem('siteECommPageRef');
			cartBackBtnUrl = refId;
		}
	}

	window.WBStoreModule = StoreModule;
})(jQuery);
