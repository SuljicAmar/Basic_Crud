import axios from 'axios';

/**
 * Convenience class to invoke operations on the jsonbox API
 */
export default class JsonBox {
    constructor(url, collection = null) {
        this.url = url;
        this.collection = collection;
    }

    async add(data) {
        const resp = await axios.post(this.endpoint, data);
        return resp.data;
    }

    async ofId(id) {
        const resp = await axios.get(this.endpoint + '/' + id);
        return resp.data;
    }

    async all() {
        const resp = await axios.get(this.endpoint);
        return resp.data;
    }

    async update(id, data) {
        await axios.put(this.endpoint + '/' + id, data);
    }

    async delete(id) {
        await axios.delete(this.endpoint + '/' + id);
    }

    async search(params) {
        const queryString = this.buildQueryString(params);


        // Resulting URL looks like https://jsonbox.io/box_11111/notes?q=....
        const resp = await axios.get(this.endpoint, {
            params: {
                q: queryString
            }
        });

        return resp.data;
    }

    get endpoint() {
        return this.url + (this.collection ? '/' + this.collection : '');
    }

    /**
     * Builds the query string for get request containing a search.
     * 
     * Receives an object with search parameters and transforms to
     * query string described at https://github.com/vasanthv/jsonbox#readme
     * under the "filter" section.
     * 
     * i.e. receives
     * 
     * params = {
     *  title: '*Urgent*',
     *  content: '*Pick up Note*'
     * } 
     * 
     * returns 'title:*Urgent*,content:*pickup up note*'
     */
    buildQueryString(params) {
        let query = '';
        for (let prop in params) {
            query += `${prop}:${params[prop]},`;
        }

        query = query.slice(0, -1);

        return query;
    }
}