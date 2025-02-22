export class ZemmParser {
    constructor() {
        this.zemms = [];
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
     * Parse ZEMM message header
     * @param {string} zemm - Raw ZEMM message
     * @returns {{section: number, maxSections: number, uuid: string}}
     */
    parseZemmHeader(zemm) {
        const raw = zemm.slice(0, 10);
        const section = parseInt(raw.slice(0, 3));
        const maxSections = parseInt(raw.slice(4, 6));
        const uuid = raw.slice(6, 10);

        return { section, maxSections, uuid };
    }

    /**
     * Parse ZEMM key-value pairs
     * @param {string} zemm - Raw ZEMM message
     * @returns {Object} Parsed key-value pairs
     */
    parseZemmKeyValue(zemm) {
        const kv = zemm.slice(10);
        const kv_raw = kv.split('|');
        const zemmJson = {};

        kv_raw.forEach((kva) => {
            const [key, value] = kva.split('ยง');
            if (key) zemmJson[key] = value;
        });

        return zemmJson;
    }

    /**
     * Parse complete ZEMM section
     * @param {string} contents - Raw ZEMM message
     * @returns {{headers: Object, data: Object}}
     */
    zemmSectionParser(contents) {
        return {
            headers: this.parseZemmHeader(contents),
            data: this.parseZemmKeyValue(contents)
        };
    }


    generateUUID() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let uuid = '';
        for (let i = 0; i < 4; i++) {
            uuid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return uuid;
    }

    /**
     * Parse ZEMM message
     * @param {string} contents - Raw ZEMM message
     * @returns {Object|Array} Parsed ZEMM data or error object
     * @throws {Error} If message is invalid
     */
    decode(contents) {
        if (contents.length > 160) {
            throw new Error("Invalid SMS: Message too long");
        }

        const headers = this.parseZemmHeader(contents);
        let zemm = this.zemms.find((z) => z.uuid === headers.uuid);

        if (!zemm) {
            zemm = { ...headers, raw: [] };
            this.zemms.push(zemm);
        }

        if (zemm.raw.length !== zemm.maxSections) {
            zemm.raw.push(contents);
            zemm.section = zemm.raw.length;
        }

        if (zemm.section === zemm.maxSections) {
            zemm.raw.sort((a, b) =>
                this.parseZemmHeader(a).section - this.parseZemmHeader(b).section
            );
            const zemmString = zemm.raw.join("");
            zemm.data = this.zemmSectionParser(zemmString).data;
            zemm.done = true;

            // Remove completed ZEMM from array and return it
            return this.zemms.splice(this.zemms.indexOf(zemm), 1)[0];
        }

        return zemm;
    }

    /**
     * Encode parsed data to Zemm-encoded string
     * @param {{data: Object}} zdata - object content of the data
     * @returns {String} zemm-encoded array string of the data
     * @throws {Error} If message is invalid
     * */
    encode(zdata) {
        const kv_sep = "ง";
        const property_sep = "|";
        const raw = []
        const MAX_LENGTH = 150
        const kvPairs = Object.keys(zdata.data)
            .map(d => `${d}${String.fromCharCode(167)}${zdata.data[d]}`)
            .join(property_sep);
        const uuid = zdata.uuid || this.generateUUID();

        let result = [];
        for (let i = 0; i < kvPairs.length; i += MAX_LENGTH) {
            result.push(kvPairs.slice(i, i + MAX_LENGTH));
        }

        result.forEach((entry, idx) => {
            const header = `${(idx + 1).toString().padStart(3, '0')}${result.length.toString().padStart(3, '0')}${uuid}`;
            const encoded = `${header}${entry}`;
            raw.push(encoded)
        })


        return raw;
    }

    /**
     * Clear all stored ZEMM messages
     */
    clear() {
        this.zemms = [];
    }
}
