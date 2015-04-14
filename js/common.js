/**
 * Qwant embedded main view
 * @file common.js
 * @author Qwant
 * @class QwantEmbed
 * @param args
 * @constructor
 */
var QwantEmbed = function(args){
    this.preferredlanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "fr";
    this.languages = {
        'en':'en_US',
        'uk':'en_GB',
        'us':'en_US',
        'es':'es_ES',
        'it':'it_IT',
        'de':'de_DE',
        'fr':'fr_FR',
        'nl':'nl_NL',
        'pt':'pt_PT',
        'ru':'ru_RU',
        'ja':'ja_JP',
        'ar':'ar_XA',
        'pl':'pl_PL',
        'el':'el_GR',
        'tr':'tr_TR',
        'he':'he_IL',
        'fi':'fi_FI',
        'zh':'zh_CN'
    };
    this.target = args.target;
    this.query = args.query;
    this.disabledon = args.disabledon;
    this.ext = args.ext;
    if (!(this.ext in this.languages)){
        if (!(this.preferredlanguage in this.languages)){
            this.locale = 'en_US';
        } else {
            this.locale = this.languages[this.preferredlanguage];
        }
    } else {
        this.locale = this.languages[this.ext];
    }
};

/**
 * QwantEmbed prototype
 *
 * @mixin
 * @memberof QwantEmbed
 */
QwantEmbed.prototype = {
/**
 * Initialization.
 * @function init
 * @param state
 */
    init: function(state){
    },
/**
 * Returns time elapsed since result was posted.
 * @function timeAgo
 * @param time
 * @returns {*}
 */
    timeAgo: function(time){
        if (!time || time === null)
            return '';

        if(isNaN(time)){
            var date = new Date(time.replace(/-/g,"/").replace(/[TZ]/g," "));
            time = date.getTime();
        }

        var diff = (((new Date()).getTime() - time) / 1000);

        var day_diff = Math.floor(diff / 86400);

        if ( isNaN(day_diff) || day_diff < 0 ) // || day_diff >= 31
            return '';

        return day_diff === 0 && (
            diff < 60 && chrome.i18n.getMessage("timeAgo_just_now") ||
                diff < 120 && chrome.i18n.getMessage("timeAgo_few_seconds_ago") ||
                diff < 3600 && chrome.i18n.getMessage("timeAgo_ago_prefix") + Math.floor( diff / 60 ) + chrome.i18n.getMessage("timeAgo_minutes_ago_suffix") ||
                diff < 7200 && chrome.i18n.getMessage("timeAgo_one_hour_ago") ||
                diff < 86400 && chrome.i18n.getMessage("timeAgo_ago_prefix") + Math.floor( diff / 3600 ) + chrome.i18n.getMessage("timeAgo_hours_ago_suffix")) ||
            day_diff == 1 && chrome.i18n.getMessage("timeAgo_yesterday") ||
            day_diff < 7 && chrome.i18n.getMessage("timeAgo_ago_prefix") + day_diff + chrome.i18n.getMessage("timeAgo_days_ago_suffix") ||
            day_diff < 31 && chrome.i18n.getMessage("timeAgo_ago_prefix") + Math.ceil( day_diff / 7 ) + chrome.i18n.getMessage("timeAgo_weeks_ago_suffix") ||
            day_diff < 365 && chrome.i18n.getMessage("timeAgo_ago_prefix") + Math.ceil( day_diff / 30 ) + chrome.i18n.getMessage("timeAgo_months_ago_suffix") ||
            chrome.i18n.getMessage("timeAgo_ago_prefix") + Math.ceil( day_diff / 30 ) + chrome.i18n.getMessage("timeAgo_years_ago_suffix");
    },
/**
 * Fill the embedded Qwant object.
 * @function fillEmbed
 * @param qwtEmbed
 * @param qwtSpinner
 * @param results
 */
	fillEmbed: function(qwtEmbed, qwtSpinner, results) {
		if (results === null) {
			qwtEmbed.appendChild(qwtSpinner);
		} else {
			var qwtResults = document.createElement('div'),
				qwtFragment = document.createDocumentFragment(),
				sortedResults = this.sortResults(results);

			qwtResults.setAttribute('class', 'qwt-results');

			if (sortedResults.web.length > 0) {
				var webResults = this.createWeb(sortedResults.web);
				qwtResults.appendChild(webResults);
			}
			if (sortedResults.news.length > 0) {
				var newsResults = this.createNews(sortedResults.news);
				qwtResults.appendChild(newsResults);
			}
			if (sortedResults.media.length > 0) {
				var mediaResults = this.createMedia(sortedResults.media);
				qwtResults.appendChild(mediaResults);
			}
			if (sortedResults.social.length > 0) {
				var socialResults = this.createSocial(sortedResults.social);
				qwtResults.appendChild(socialResults);
			}

			qwtFragment.appendChild(this.createHeader());
			qwtFragment.appendChild(qwtResults);
			qwtFragment.appendChild(this.createFooter());
			qwtEmbed.removeChild(qwtSpinner);
			qwtEmbed.appendChild(qwtFragment.cloneNode(true));
		}
	},
/**
 * Sort the results.
 * @function sortResults
 * @param results
 * @returns {{web: Array, news: Array, media: Array, social: Array}}
 */
	sortResults: function(results) {
		var sorted	= {
				web		: [],
				news	: [],
				media	: [],
				social	: []
			};
		for (var i = 0; i < results.length; ++i) {
			switch (results[i]._type) {
				case 'web' :
					sorted.web.push(results[i]);
					break;
				case 'news' :
					sorted.news.push(results[i]);
					break;
				case 'media' :
					sorted.media.push(results[i]);
					break;
				case 'social' :
					sorted.social.push(results[i]);
					break;
			}
		}
		return sorted;
	},
/**
 * Create a loading spinner.
 * @function createSpinner
 * @returns {HTMLElement}
 */
	createSpinner: function() {
		var qwtSpinner = document.createElement('div');
		qwtSpinner.setAttribute('class', 'qwt-spinner');
		return qwtSpinner;
	},
/**
 * Create the header section.
 * @function createHeader
 * @returns {HTMLElement}
 */
	createHeader: function() {
		var qwtHeader = document.createElement('div');
		qwtHeader.setAttribute('class', 'qwt-header');

		var qwtOptions = document.createElement('a');
		qwtOptions.setAttribute('class', 'qwt-options');
		qwtOptions.setAttribute('title', 'options');
		qwtOptions.setAttribute('href', '#');

		var qwtOptionsImg = document.createElement('img');
		qwtOptionsImg.setAttribute('src', chrome.extension.getURL("img/options-icon.png"));

		qwtHeader.appendChild(qwtOptions);
		qwtOptions.appendChild(qwtOptionsImg);

		return qwtHeader;
	},
/**
 * Create the Web results section.
 * @param webResults
 * @returns {HTMLElement}
 */
	createWeb: function(webResults) {
		var qwtWeb = document.createElement('div');
		qwtWeb.setAttribute('class', 'qwt-web');

		for (var i = 0; i < 1; ++i) {
			var qwtWebResultLink = document.createElement('div'),
				qwtLink = document.createElement('a'),
				qwtLinkInfo = document.createElement('div'),
				qwtLinkUrl = document.createElement('span'),
				urlParser = document.createElement('a');

			urlParser.href = webResults[i].url;

			qwtWebResultLink.setAttribute('class', 'qwt-web-result-link');

			qwtLink.setAttribute('class', 'qwt-link');
			qwtLink.setAttribute('data-src', webResults[i]['url_csrf']);
			//qwtLink.setAttribute('onmousedown', 'change');
			qwtLink.setAttribute('href', webResults[i].url);
			qwtLink.textContent = webResults[i].title;

			qwtLinkInfo.setAttribute('class', 'qwt-link-info');

			qwtLinkUrl.setAttribute('class', 'qwt-link-url');
			qwtLinkUrl.textContent = urlParser.hostname;

			qwtLinkInfo.appendChild(qwtLinkUrl);
			qwtWebResultLink.appendChild(qwtLink);
			qwtWebResultLink.appendChild(qwtLinkInfo);
			qwtWeb.appendChild(qwtWebResultLink);
		}
		return qwtWeb;
	},
/**
 * Create the News results section.
 * @function createNews
 * @param newsResults
 * @returns {HTMLElement}
 */
	createNews: function(newsResults) {
		var qwtNews = document.createElement('div');
		qwtNews.setAttribute('class', 'qwt-news');

		for (var i = 0; i < newsResults.length; ++i) {
			var qwtNewsResultLink = document.createElement('div'),
				qwtLink = document.createElement('a'),
				qwtLinkInfo = document.createElement('div'),
				qwtLinkUrl = document.createElement('span'),
				qwtLinkInfoSeparator = document.createElement('p'),
				qwtLinkDate = document.createElement('span'),
				urlParser = document.createElement('a');

			urlParser.href = newsResults[i].url;

			qwtNewsResultLink.setAttribute('class', 'qwt-news-result-link');

			qwtLink.setAttribute('class', 'qwt-link');
			qwtLink.setAttribute('data-src', newsResults[i]['url_csrf']);
			//qwtLink.setAttribute('onmousedown', 'change');
			qwtLink.setAttribute('href', newsResults[i].url);
			qwtLink.textContent = newsResults[i].title;

			qwtLinkInfo.setAttribute('class', 'qwt-link-info');

			qwtLinkUrl.setAttribute('class', 'qwt-link-url');
			qwtLinkUrl.textContent = urlParser.hostname;
			
			qwtLinkInfoSeparator.textContent = ' - ';

			qwtLinkDate.setAttribute('class', 'qwt-link-date');
			qwtLinkDate.textContent = this.timeAgo(parseInt(newsResults[i].date) * 1000);

			qwtLinkInfo.appendChild(qwtLinkUrl);
			qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
			qwtLinkInfo.appendChild(qwtLinkDate);
			qwtNewsResultLink.appendChild(qwtLink);
			qwtNewsResultLink.appendChild(qwtLinkInfo);
			qwtNews.appendChild(qwtNewsResultLink);
		}
		return qwtNews;
	},
/**
 * Create the Media section.
 * @function createMedia
 * @param mediaResults
 * @returns {HTMLElement}
 */
	createMedia: function(mediaResults) {
		var qwtMedia = document.createElement('div');
		qwtMedia.setAttribute('class', 'qwt-media');

		for (var i = 0; i < mediaResults.length; ++i) {
			var qwtMediaThumb = document.createElement('div'),
				qwtMediaThumbImg = document.createElement('img'),
				qwtMediaThumbLink = document.createElement('a'),
				qwtMediaThumbLinkImg = document.createElement('img'),
				qwtMediaResultLink = document.createElement('div'),
				qwtLink = document.createElement('a'),
				qwtLinkInfo = document.createElement('div'),
				qwtLinkUrl = document.createElement('span'),
				qwtLinkInfoSeparator = document.createElement('p'),
				qwtLinkDate = document.createElement('span'),
				urlParser = document.createElement('a');

			urlParser.href = mediaResults[i].url;

			qwtMediaThumb.setAttribute('class', 'qwt-media-thumb');

			qwtMediaThumbImg.setAttribute('src', mediaResults[i].img);

			qwtMediaThumbLink.setAttribute('title', mediaResults[i].title);
			qwtMediaThumbLink.setAttribute('href', mediaResults[i].url);

			qwtMediaThumbLinkImg.setAttribute('src', chrome.extension.getURL('img/play-icon.png'));

			qwtMediaResultLink.setAttribute('class', 'qwt-media-result-link');

			qwtLink.setAttribute('class', 'qwt-link');
			qwtLink.setAttribute('data-src', mediaResults[i]['url_csrf']);
			//qwtLink.setAttribute('onmousedown', 'change');
			qwtLink.setAttribute('href', mediaResults[i].url);
			qwtLink.textContent = mediaResults[i].title;

			qwtLinkInfo.setAttribute('class', 'qwt-link-info');

			qwtLinkUrl.setAttribute('class', 'qwt-link-url');
			qwtLinkUrl.textContent = urlParser.hostname;

			qwtLinkInfoSeparator.textContent = ' - ';

			qwtLinkDate.setAttribute('class', 'qwt-link-date');
			qwtLinkDate.textContent = this.timeAgo(parseInt(mediaResults[i].date) * 1000);

			qwtMediaThumbLink.appendChild(qwtMediaThumbLinkImg);
			qwtMediaThumb.appendChild(qwtMediaThumbImg);
			qwtMediaThumb.appendChild(qwtMediaThumbLink);

			qwtLinkInfo.appendChild(qwtLinkUrl);
			qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
			qwtLinkInfo.appendChild(qwtLinkDate);
			qwtMediaResultLink.appendChild(qwtMediaThumb);
			qwtMediaResultLink.appendChild(qwtLink);
			qwtMediaResultLink.appendChild(qwtLinkInfo);
			qwtMedia.appendChild(qwtMediaResultLink);
		}
		return qwtMedia;
	},
/**
 * Create the Social section.
 * @function createSocial
 * @param socialResults
 * @returns {HTMLElement}
 */
	createSocial: function(socialResults) {
		var qwtSocial = document.createElement('div');
		qwtSocial.setAttribute('class', 'qwt-social');

		for (var i = 0; i < socialResults.length; ++i) {
			var qwtSocialAccountLink = document.createElement('a'),
				qwtSocialAccountImg = document.createElement('div'),
				qwtSocialResultLink = document.createElement('div'),
				qwtLink = document.createElement('a'),
				qwtLinkInfo = document.createElement('div'),
				qwtLinkAuthor = document.createElement('span'),
				qwtLinkAuthorSeparator = document.createElement('p'),
				qwtLinkUrl = document.createElement('span'),
				qwtLinkInfoSeparator = document.createElement('p'),
				qwtLinkDate = document.createElement('span'),
				urlParser = document.createElement('a');

			urlParser.href = socialResults[i].url;

			qwtSocialAccountLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
			qwtSocialAccountLink.setAttribute('title', socialResults[i].post);
			
			qwtSocialAccountImg.setAttribute('class', 'qwt-social-author-thumb');
			qwtSocialAccountImg.setAttribute('style', 'background:url(' + socialResults[i].img + ')');

			qwtSocialResultLink.setAttribute('class', 'qwt-social-result-link');

			qwtLink.setAttribute('class', 'qwt-link');
			qwtLink.setAttribute('data-src', socialResults[i]['url_csrf']);
			//qwtLink.setAttribute('onmousedown', 'change');
			qwtLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
			qwtLink.textContent = socialResults[i].desc;

			qwtLinkInfo.setAttribute('class', 'qwt-link-info');

			qwtLinkAuthor.setAttribute('class', 'qwt-author');
			qwtLinkAuthor.textContent = '@' + socialResults[i].url.split('/').pop();

			qwtLinkAuthorSeparator.textContent = ' via ';

			qwtLinkUrl.setAttribute('class', 'qwt-link-url');
			qwtLinkUrl.textContent = urlParser.hostname;

			qwtLinkInfoSeparator.textContent = ' - ';

			qwtLinkDate.setAttribute('class', 'qwt-link-date');
			qwtLinkDate.textContent = this.timeAgo(parseInt(socialResults[i].date) * 1000);

			qwtLinkInfo.appendChild(qwtLinkAuthor);
			qwtLinkInfo.appendChild(qwtLinkAuthorSeparator);
			qwtLinkInfo.appendChild(qwtLinkUrl);
			qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
			qwtLinkInfo.appendChild(qwtLinkDate);
			qwtSocialResultLink.appendChild(qwtSocialAccountLink);
			qwtSocialResultLink.appendChild(qwtSocialAccountImg);
			qwtSocialResultLink.appendChild(qwtLink);
			qwtSocialResultLink.appendChild(qwtLinkInfo);
			qwtSocial.appendChild(qwtSocialResultLink);
		}
		return qwtSocial;
	},
/**
 * Create the footer section.
 * @function createFooter
 * @returns {HTMLElement}
 */
	createFooter: function() {
		var qwtFooter = document.createElement('div'),
			qwtFooterLink = document.createElement('a');
		
		qwtFooter.setAttribute('class', 'qwt-footer');
		
		qwtFooterLink.setAttribute('href', 'https://www.qwant.com/?q=' + this.query);
		qwtFooterLink.textContent = chrome.i18n.getMessage("all_results_on_qwant");

		qwtFooter.appendChild(qwtFooterLink);

		return qwtFooter;
	},
/**
 * Show results.
 * @function show
 * @param state
 */
    show: function(state){
        var search = window.location.search;

        if (state == 'true' && (this.disabledon === "" || search.indexOf(this.disabledon) === -1) && this.query !== "") {

			var qwtEmbed = document.createElement('div'),
				qwtSpinner = this.createSpinner(),
				qwtParent = document.querySelector(this.target);

			qwtEmbed.setAttribute('class', 'qwt-embed');
			
			if (typeof this.flagAlready === 'undefined') {
				this.flagAlready = false;
			}
			if (this.flagAlready === true) {
				qwtParent.removeChild(qwtParent.firstChild);
			}

			this.fillEmbed(qwtEmbed, qwtSpinner, null);
            qwtParent.insertBefore(qwtEmbed, qwtParent.firstChild);
			this.flagAlready = true;

			$.ajax({
				url : 'https://api.qwant.com/api/search/smart/',
				type : 'GET',
				data : 'q=' + encodeURIComponent(this.query) + '&locale=' + this.locale + '&client=chrome-ext',
				context : this,
				success : function(json, statut){
					this.fillEmbed(qwtEmbed, qwtSpinner, json.result.items);

					$(document).on('click', 'a.qwt-options', function(e){
						e.preventDefault();
						chrome.extension.sendMessage({options: "openOptions"}, function(){});
					});
					$(document).on('mousedown', '.qwt-link', function(e){
						$(this).attr('href', $(this).attr('data-src'));
					});
				}
			});
        }
    },
    /**
     * Close.
     * @function close
     */
    close: function(){
    }
};
