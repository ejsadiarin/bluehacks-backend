/**
 * Class representing a ZemmParser.
 */
export class ZemmParser {
    /**
     * Create a ZemmParser instance.
     */
    constructor() {
        /**
         * @type {Array<Object>} List of active zemms.
         */
        this.zemms = [];
    }

    /**
     * Get the active zemms.
     * @returns {Array<Object>} The list of active zemms.
     */
    get getActiveZemms() {
        return this.zemms;
    }

    /**
     * Retrieve a zemm by UUID.
     * @param {string} uuid - The UUID of the zemm.
     * @returns {Object|undefined} The found zemm or undefined if not found.
     */
    getZemmByUUID(uuid) {
        return this.zemms.find(z => z.uuid === uuid);
    }

    /**
     * Parse the header of a zemm.
     * @param {string} zemm - The zemm string.
     * @returns {Object} The parsed header containing section, maxSections, and UUID.
     */
    parseHeader(zemm) {
        const raw = zemm.slice(0, 10);
        return {
            section: parseInt(raw.slice(0, 3)),
            maxSections: parseInt(raw.slice(4, 6)),
            uuid: raw.slice(6, 10)
        };
    }

    /**
     * Parse key-value pairs from a zemm string.
     * @param {string} zemm - The zemm string.
     * @returns {Object} The parsed key-value pairs.
     */
    parseKeyValue(zemm) {
        const kv = zemm.slice(10);
        const kvPairs = kv.split('|');
        const zemmJson = {};

        kvPairs.forEach(kva => {
            const [key, value] = kva.split('§');
            if (key) zemmJson[key] = value;
        });

        return zemmJson;
    }

    /**
     * Parse a zemm section.
     * @param {string} contents - The zemm section contents.
     * @returns {Object} The parsed section containing headers and data.
     */
    parseSection(contents) {
        return {
            headers: this.parseHeader(contents),
            data: this.parseKeyValue(contents)
        };
    }

    /**
     * Parse a zemm message.
     * @param {string} contents - The zemm message contents.
     * @returns {Object} The parsed zemm or an error object.
     */
    parse(contents) {
        if (contents.length > 160) {
            return { error: "Invalid sms" };
        }

        const headers = this.parseHeader(contents);
        let zemm = this.zemms.find(z => z.uuid === headers.uuid);

        if (!zemm) {
            this.zemms.push(headers);
            return this.parse(contents);
        }

        if (!zemm.raw) {
            zemm.raw = [];
        }

        if (zemm.raw.length !== zemm.maxSections) {
            zemm.raw.push(contents);
            zemm.section = zemm.raw.length;
        }

        if (zemm.section === zemm.maxSections) {
            zemm.raw.sort((a, b) => this.parseHeader(a).section - this.parseHeader(b).section);
            const zemmString = zemm.raw.join("");

            zemm.data = this.parseSection(zemmString).data;
            zemm.done = true;
        }

        if (zemm.done) {
            this.zemms.splice(this.zemms.indexOf(zemm), 1);
            return zemm;
        }

        return zemm;
    }
}
