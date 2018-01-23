/*
 license: The MIT License, Copyright (c) 2016 YUKI "Piro" Hiroshi
 original:
   http://github.com/piroor/webextensions-lib-l10n
*/

document.addEventListener('DOMContentLoaded', function onReady() {
	document.removeEventListener('DOMContentLoaded', onReady);

	function apply(aString)
	{
		return aString.replace(/__MSG_(.+?)__/g, function(aMatched) {
			var key = aMatched.slice(6, -2);
			return chrome.i18n.getMessage(key);
		});
	}

	function $log(aMessage, ...aArgs)
	{
		aMessage = 'l10s ' + aMessage;
		if (typeof log === 'function')
			log(aMessage, ...aArgs);
	}

	var texts = document.evaluate(
			'descendant::text()[contains(self::text(), "__MSG_")]',
			document,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null
		);
	for (let i = 0, maxi = texts.snapshotLength; i < maxi; i++)
	{
		let text = texts.snapshotItem(i);
		text.nodeValue = apply(text.nodeValue);
	}

	var attributes = document.evaluate(
			'descendant::*/attribute::*[contains(., "__MSG_")]',
			document,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null
		);
	for (let i = 0, maxi = attributes.snapshotLength; i < maxi; i++)
	{
		let attribute = attributes.snapshotItem(i);
		$log('apply', attribute);
		attribute.value = apply(attribute.value);
	}
});
