# Content Security Policy

## Controls

* Header or meta tag must be present to restrict resources loaded by browser.
* Header must be present to to set frame-ancestor directive

Provided some security option to reduce attack surface of XSS or Click Jacking
* Apply only on HTML resources

* If a frame / iframe tag detected on HTML page, the frame-src directive must be present (+child-src CSP 2)
* If a audio / video tag detected on HTML page, the media-src directive must be present
* If a object / embed / applet tag detected on HTML page, the object-src directive must be present (+plugin-types)
* If a @font-face statement detected on HTML page, the font-src directive must be present
* If a img tag detected on HTML page, the img-src directive must be present
* If a style tag detected on HTML page, the style-src directive must be present
* If a src tag detected on HTML page, the script-src directive must be present
* If a form tag detected on HTML page, the form-action directive must be present
* The directive frame-ancestors must be present to limit the usage of the HTML page (avoid wildcare)
* If window.location statement detected, the navigate-to directive must be present
* Navigate-to directive can't contains only wildcare source
* Script-src can't contains the unsafe-inline source
* Script-src can't contains the unsafe-eval source

## Compatibility

Chrome
* Content-Security-Policy CSP Level 3 - Chrome 59+ Partial Support
* Content-Security-Policy CSP Level 2 - Chrome 40+ Full Support Since January 2015
* Content-Security-Policy CSP 1.0 - Chrome 25+
* X-Webkit-CSP Deprecated - Chrome 14-24

FireFox
* Content-Security-Policy CSP Level 3 - Firefox 58+ Partial Support
* Content-Security-Policy CSP Level 2 - FireFox 31+ Partial Support since July 2014
* Content-Security-Policy CSP 1.0 - FireFox 23+ Full Support
* X-Content-Security-Policy Deprecated - FireFox 4-22

Safari
* Content-Security-Policy CSP Level 2 - Safari 10+
*Content-Security-Policy CSP 1.0 - Safari 7+
* X-Webkit-CSP Deprecated - Safari 6

Edge
* Content-Security-Policy CSP Level 3 - Edge 79+ Partial Support
* Content-Security-Policy CSP Level 2 - Edge 15+ Partial, 76+ Full
* Content-Security-Policy CSP 1.0 - Edge 12+

Internet Explorer
* X-Content-Security-Policy Deprecated - IE 10-11 support sandbox only

## IE

* X-XSS-Protection
* X-Frame-Options
* X-Content-Security-Policy