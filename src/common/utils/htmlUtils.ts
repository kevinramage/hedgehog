import { v4 } from "uuid";
import { HtmlControl, CONTROL_TYPE } from "../business/control/htmlControl";
import { HtmlAttribute } from "../business/control/htmlAttribute";
import { StringUtils } from "./StringUtils";

/**
 * @class
 * Class to extract Html element from Html page
 */
export class HtmlUtils {


	/**
	 * Analyze the html code and extract control from tag name provided
	 * @param tagName tag name to search
	 * @param controlType control type to assign on control built
	 * @param html html code to analyze
	 */
	private static extractTag(tagName : string, controlType : string, html : string) : HtmlControl[] {
		// winston.debug("HtmlUtils.extractTag: ", tagName);

		// Remove endline characters
		html = html.replace(/\r/g, "").replace(/\n/g, " ");

		// Prepare regex
		let doubleTagRegexString = "<##TAG##((\\s*[\\w|:|_|-]*=(\\\"|')[\\w|\\.|:|\\/|\\s|\\?|=|_|&|;|#|+|!|(|)|,|-]*(\\\"|'))*)>(((?!<\\/##TAG##>).)*)<\\/##TAG##>";
		let singleTagRegexString = "<##TAG##((\\s*[\\w|:|_|-]*=(\\\"|')[\\w|\\.|:|\\/|\\s|\\?|=|_|&|;|#|+|!|(|)|,|-]*(\\\"|'))*)\\/?>";
		doubleTagRegexString = doubleTagRegexString.replace(/##TAG##/g, tagName);
		singleTagRegexString = singleTagRegexString.replace(/##TAG##/g, tagName);
		const doubleTagRegex = new RegExp(doubleTagRegexString, 'gi');
		const singleTagRegex = new RegExp(singleTagRegexString, 'gi');


		// Collect control
		let controls = this.extractTagWithRegex(tagName, controlType, html, doubleTagRegex);
		if (controls.length === 0) {
			controls = this.extractTagWithRegex(tagName, controlType, html, singleTagRegex);
		}

		return controls;
	}

	/**
	 * Analyze the html code and extract control from tag name and regex provided
	 * @param tagName tag name to search
	 * @param controlType control type to assign on control built
	 * @param html html code to analyze
	 * @param regex regex to use
	 */
	private static extractTagWithRegex(tagName: string, controlType: string, html: string, regex : RegExp) : HtmlControl[] {
		// winston.debug("HtmlUtils.extractTagWithRegex: ", tagName, regex);

		const attributeRegex = /\s*([\w|:|_|-]*)=(\"|')([\w|\.|:|\/|\s|\?|=|_|&|;|#|+|!|(|)|,|-]*)(\"|')/g;
		const controls : HtmlControl[] = [];
		let match = regex.exec(html);
		while (match) {

			// Build control
			const control : HtmlControl = new HtmlControl(controlType);
			control.html = match.length > 0 ? match[0] : undefined;
			control.text = match.length > 4 ? match[4] : undefined;

			// Collect attribute
			if (match.length > 1) {
				let matchAttribute = attributeRegex.exec(match[1]);
				while (matchAttribute) {
					const key = matchAttribute.length > 1 ? matchAttribute[1] : null;
					const value = matchAttribute.length > 3 ? matchAttribute[3] : null;
					const htmlCode = matchAttribute.length > 0 ? matchAttribute[0] : null;

					const attribute = new HtmlAttribute(key, value, htmlCode);
					control.addAttribute(attribute);
					matchAttribute = attributeRegex.exec(match[1]);
				}
			}

			// Collect children
			if (controlType === CONTROL_TYPE.FORM && match.length > 5) {

				// Inputs
				let subControls = HtmlUtils.extractInputs(match[5]);
				subControls.forEach(c => { c.parent = control; });
				control.addChildren(subControls);

				// Textarea
				subControls = HtmlUtils.extractTextArea(match[5]);
				subControls.forEach(c => { c.parent = control; });
				control.addChildren(subControls);
			}

			controls.push(control);
			match = regex.exec(html)
		}

		return controls;
	}

    /**
     * Extract form present in html code
     * @param html the HTML string to analyze
     * @returns a list of forms found
     */
	public static extractForm(html : string) : HtmlControl[] {
		return HtmlUtils.extractTag("form", CONTROL_TYPE.FORM, html);
	}

    /**
     * Extract inputs present in html code
     * @param html the HTML string to analyze
     * @returns a list of inputs found
     */
	private static extractInputs(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("input", CONTROL_TYPE.INPUT, html);
    }

    /**
     * Extract textarea present in html code
     * @param html the HTML string to analyze
     * @returns a list of textarea found
     */
	private static extractTextArea(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("textarea", CONTROL_TYPE.TEXTAREA, html);
    }

    /**
     * Extract links present in html code
     * @param html the HTML string to analyze
     * @returns a list of links found
     */
	public static extractLinks(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("a", CONTROL_TYPE.LINK, html);
	}

    /**
     * Extract H1 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H1 found
     */
	public static extractH1(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h1", CONTROL_TYPE.H1, html);
	}

    /**
     * Extract H2 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H2 found
     */
	public static extractH2(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h2", CONTROL_TYPE.H2, html);
	}

    /**
     * Extract H3 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H3 found
     */
	public static extractH3(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h3", CONTROL_TYPE.H3, html);
	}

    /**
     * Extract H4 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H4 found
     */
	public static extractH4(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h4", CONTROL_TYPE.H4, html);
	}

    /**
     * Extract H5 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H5 found
     */
	public static extractH5(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h5", CONTROL_TYPE.H5, html);
	}

    /**
     * Extract H6 present in html code
     * @param html the HTML string to analyze
     * @returns a list of H6 found
     */
	public static extractH6(html : string) : HtmlControl[] {
        return HtmlUtils.extractTag("h6", CONTROL_TYPE.H6, html);
	}

	/**
	 * Extract all words of an HTML page
	 * @param html html code to analyze
	 */
	public static extractWords(html : string) : string [] {
		const words : string[] = [];
		const symbols = [ ",", "?", ";", ".", ":", "/", "!", "$", "*", "_", "-", "|", "(", "[", ")", "]", "="];

		const regexWord = /(?<=>)[^<>]+(?=<)/g;
		let results = regexWord.exec(html);
		while (results !== null) {
			results.forEach(r => {
				const wordsText = r.replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
				wordsText.split(" ").forEach(wt => {
					if (wt.trim() !== "") {
						if (!StringUtils.equalsOneOf(wt, symbols)) {
							words.push(wt);
						}
					}
				});
			});
			results = regexWord.exec(html);
		}

		return words;
	}

	/**
	 * Extract title tag
	 * Return the title text or undefined if tag not found
	 * @param html html to analyze
	 */
	public static extractTitle(html : string) : string | undefined {
		// winston.debug("HtmlUtils.extractTitle");
		html = html.replace(/\r/g, "").replace(/\n/g, " ");
		const regexTitle = /<title>(.*)<\/?title>/gi;
		const matches = regexTitle.exec(html);
		if (matches !== null && matches.length > 1) {
			return matches[1];
		} else {
			return undefined;
		}
	}

	/**
	 * Check if the content is HTML content
	 * @param html html
	 */
	public static isHTMLContent(html : string) : boolean {
		// winston.debug("HtmlUtils.extractTitle");
		html = html.replace(/\r/g, "").replace(/\n/g, " ");
		return /<[a-z][\s\S]*>/i.test(html);
	}

}