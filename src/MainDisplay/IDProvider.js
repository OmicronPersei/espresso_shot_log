export class IDProvider {
    constructor() {
        this.index = 0;
    }
    
    appendIDs(data) {
        data.forEach(element => {
            this.appendID(element);
        });
    }

    appendID(data) {
        data.id = ++this.index;
    }
}

export default IDProvider;