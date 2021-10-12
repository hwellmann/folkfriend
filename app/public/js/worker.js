import "/js/comlink.js";

import init, { FolkFriendWASM } from "/wasm/folkfriend.js";

class FolkFriendWASMWrapper {
    constructor() {
        this.folkfriendWASM = null;
        this.loadedWASM = new Promise(resolve => {
            this.setLoadedWASM = resolve;
        });
        this.loadedIndex = new Promise(resolve => {
            this.setLoadedIndex = resolve;
        });
        
        init().then(() => {
            this.folkfriendWASM = new FolkFriendWASM();
            this.setLoadedWASM();
        })
    }

    async version(cb) {
        await this.loadedWASM;
        cb(this.folkfriendWASM.version());
    }

    async loadIndexFromJSONObj(obj) {
        await this.loadedWASM;
        await this.folkfriendWASM.load_index_from_json_obj(obj);
        this.setLoadedIndex();
    }

    async runTranscriptionQuery(query, cb) {
        await this.loadedWASM;
        await this.loadedIndex;
        const response = await this.folkfriendWASM.run_transcription_query(query);
        cb(JSON.parse(response));
    }
    
    async runNameQuery(query, cb) {
        await this.loadedWASM;
        await this.loadedIndex;
        const response = await this.folkfriendWASM.run_name_query(query);
        cb(JSON.parse(response));
    }
    
    async contourToAbc(contour, cb) {
        await this.loadedWASM;
        const abc = await this.folkfriendWASM.contour_to_abc(contour);
        cb(abc);
    }

    // async loadJsonObjJS(obj) {
    //     this.index = obj;
    // }

    // async demoQueryJS() {
    //     let query = "xACEHCEAEACEFCAEACCAxAEACEFCHvvCECEAEACEFCCEACAxAEACEFCHvvCECEA";

    //     const ktup = 3;
    //     const queryNgrams = [];
    //     const searchResults = [];

    //     // Get an array of each three length string in the query name
    //     for (let i = 0; i < query.length - ktup; i++) {
    //         queryNgrams.push(query.slice(i, i + ktup));
    //     }

    //     for (let [setting_id, setting] of Object.entries(this.index.settings)) {
    //         let score = 0;

    //         queryNgrams.forEach(ngram => {
    //             if (setting.contour.includes(ngram)) {
    //                 score += 1;
    //             }
    //         });

    //         score /= Math.max(setting.contour.length, query.length);
    //         searchResults[setting_id] = score;
    //     }

    //     return searchResults;
    // }
}

const folkfriendWASMWrapper = new FolkFriendWASMWrapper();
Comlink.expose(folkfriendWASMWrapper);
