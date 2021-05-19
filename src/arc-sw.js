/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable no-shadow */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-var */
/* eslint-disable no-undef */
!(function(e) {
	const t = {};
	function n(r) {
		if (t[r]) return t[r].exports;
		const o = (t[r] = { i: r, l: !1, exports: {} });
		return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
	}
	(n.m = e),
	(n.c = t),
	(n.d = function(e, t, r) {
		n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
	}),
	(n.r = function(e) {
		typeof Symbol !== 'undefined' &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
		Object.defineProperty(e, '__esModule', { value: !0 });
	}),
	(n.t = function(e, t) {
		if ((1 & t && (e = n(e)), 8 & t)) return e;
		if (4 & t && typeof e === 'object' && e && e.__esModule) return e;
		const r = Object.create(null);
		if (
			(n.r(r),
			Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
			2 & t && typeof e !== 'string')
		) {
			for (const o in e) {
				n.d(
					r,
					o,
					function(t) {
						return e[t];
					}.bind(null, o),
				);
			}
		}
		return r;
	}),
	(n.n = function(e) {
		const t =
        e && e.__esModule
        	? function() {
        		return e.default;
        	}
        	: function() {
        		return e;
        	};
		return n.d(t, 'a', t), t;
	}),
	(n.o = function(e, t) {
		return Object.prototype.hasOwnProperty.call(e, t);
	}),
	(n.p = ''),
	n((n.s = 99));
})({
	2: function(e, t, n) {
		'use strict';
		n.d(t, 'a', function() {
			return r;
		}),
		n.d(t, 'f', function() {
			return c;
		}),
		n.d(t, 'j', function() {
			return i;
		}),
		n.d(t, 'i', function() {
			return a;
		}),
		n.d(t, 'b', function() {
			return d;
		}),
		n.d(t, 'k', function() {
			return f;
		}),
		n.d(t, 'c', function() {
			return p;
		}),
		n.d(t, 'd', function() {
			return s;
		}),
		n.d(t, 'e', function() {
			return l;
		}),
		n.d(t, 'g', function() {
			return m;
		}),
		n.d(t, 'h', function() {
			return v;
		});
		var r = {
			images: [
				'bmp',
				'jpeg',
				'jpg',
				'ttf',
				'pict',
				'svg',
				'webp',
				'eps',
				'svgz',
				'gif',
				'png',
				'ico',
				'tif',
				'tiff',
				'bpg',
			],
			video: [
				'mp4',
				'3gp',
				'webm',
				'mkv',
				'flv',
				'f4v',
				'f4p',
				'f4bogv',
				'drc',
				'avi',
				'mov',
				'qt',
				'wmv',
				'amv',
				'mpg',
				'mp2',
				'mpeg',
				'mpe',
				'm2v',
				'm4v',
				'3g2',
				'gifv',
				'mpv',
			],
			audio: [
				'mid',
				'midi',
				'aac',
				'aiff',
				'flac',
				'm4a',
				'm4p',
				'mp3',
				'ogg',
				'oga',
				'mogg',
				'opus',
				'ra',
				'rm',
				'wav',
				'webm',
				'f4a',
				'pat',
			],
			interchange: [
				'json',
				'yaml',
				'xml',
				'csv',
				'toml',
				'ini',
				'bson',
				'asn1',
				'ubj',
			],
			documents: [
				'pdf',
				'ps',
				'doc',
				'docx',
				'ppt',
				'pptx',
				'xls',
				'otf',
				'xlsx',
			],
			other: ['swf'],
		};
		const o = 'arc:';
		var c = {
			COMLINK_INIT: ''.concat(o, 'comlink:init'),
			NODE_ID: ''.concat(o, ':nodeId'),
			CDN_CONFIG: ''.concat(o, 'cdn:config'),
			P2P_CLIENT_READY: ''.concat(o, 'cdn:ready'),
			STORED_FIDS: ''.concat(o, 'cdn:storedFids'),
			SW_HEALTH_CHECK: ''.concat(o, 'cdn:healthCheck'),
			WIDGET_CONFIG: ''.concat(o, 'widget:config'),
			WIDGET_INIT: ''.concat(o, 'widget:init'),
			WIDGET_UI_LOAD: ''.concat(o, 'widget:load'),
			BROKER_LOAD: ''.concat(o, 'broker:load'),
			RENDER_FILE: ''.concat(o, 'inlay:renderFile'),
			FILE_RENDERED: ''.concat(o, 'inlay:fileRendered'),
		};
		var i = 'serviceWorker';
		var a = '/'.concat('shared-worker', '.js');
		var d = '/'.concat('dedicated-worker', '.js');
		var f = '/'.concat('arc-sw-core', '.js');
		const u = ''.concat('arc-sw', '.js');
		var p = ('/'.concat(u), '/'.concat('arc-sw'), 'arc-db');
		var s = 'key-val-store';
		var l = 2 ** 17;
		var m = ''.concat('https://overmind.arc.io', '/api/propertySession');
		var v = ''.concat('https://warden.arc.io', '/mailbox/propertySession');
	},
	99: function(e, t, n) {
		'use strict';
		n.r(t);
		const r = n(2);
		if (typeof ServiceWorkerGlobalScope !== 'undefined') {
			const o = 'https://arc.io' + r.k;
			importScripts(o);
		} else if (typeof SharedWorkerGlobalScope !== 'undefined') {
			const c = 'https://arc.io' + r.i;
			importScripts(c);
		} else if (typeof DedicatedWorkerGlobalScope !== 'undefined') {
			const i = 'https://arc.io' + r.b;
			importScripts(i);
		}
	},
});
