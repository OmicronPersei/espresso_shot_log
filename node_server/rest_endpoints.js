const Roaster = "Roaster";
const RoasterBean = "Roaster/Bean";

const node_methods = require('./node_methods');

const mock_storage = require('./mock_data_storage')

const filterShots = function(filterObj, shots) {
    switch (filterObj.filterType.toLowerCase()) {
        case Roaster.toLowerCase():
            return shots.filter(r => r.roaster === filterObj.roaster);

        case RoasterBean.toLowerCase():
            return shots.filter(r => (r.roaster === filterObj.roaster) && (r.bean === filterObj.bean));

        default:
            throw new Error("Unknown filter type");
    }
}

const sortShots = function(sortOrder, sortedColId, shots) {
    const cols = [
        { id: "timestamp", sortAsNumber: true },
        { id: "roaster", sortAsNumber: false },
        { id: "bean", sortAsNumber: false },
        { id: "dose_amount_grams", sortAsNumber: true },
        { id: "brew_amount_grams", sortAsNumber: true },
        { id: "brew_ratio", sortAsNumber: true },
        { id: "brew_time_seconds", sortAsNumber: true },
        { id: "bitter_sour", sortAsNumber: false, compareFunc: (a,b) => {
            let aVal = a.replace(/\D*/g, "");
            let bVal = b.replace(/\D*/g, "");

            return aVal - bVal;
        } },
    ];

    const getValForSorting = val => val[sortedColId];
    let matchingCol = cols.find(col => col.id === sortedColId);
    let isAsc = sortOrder === "asc";

    return shots.sort((a,b) => {
        let aVal = getValForSorting(a);
        let bVal = getValForSorting(b);
        
        if (matchingCol.sortAsNumber) {
            if (isAsc) {
                let diff = aVal - bVal
                return diff;
            } else {
                let diff = bVal - aVal
                return diff;
            }
        } else if (matchingCol.compareFunc) {
            if (isAsc) {
                return matchingCol.compareFunc(aVal, bVal);
            } else {
                return matchingCol.compareFunc(bVal, aVal);
            }
        } else {
            if (isAsc) {
                if (aVal.toUpperCase() > bVal.toUpperCase()) {
                    return 1;
                } else if (aVal.toUpperCase() < bVal.toUpperCase()) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (aVal.toUpperCase() < bVal.toUpperCase()) {
                    return 1;
                } else if (aVal.toUpperCase() > bVal.toUpperCase()) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    });
}

module.exports.requestHandlers = {
    "/shots/find": {
        POST: (req, res) => {
            node_methods.getBodyFromRequest(req)
                .then(resolve => {
                    let parsedBody = JSON.parse(resolve);
                    let shots = mock_storage.mockShotStorage;

                    //append brew_ratio
                    shots.forEach(shot => shot.brew_ratio = shot.brew_amount_grams / shot.dose_amount_grams);
                    
                    if (parsedBody.filter.filterType) {
                        shots = filterShots(parsedBody.filter, shots);
                    }

                    let totalItems = shots.length;
                    
                    if (parsedBody.sortedColId && parsedBody.sortOrder) {
                        shots = sortShots(parsedBody.sortOrder, parsedBody.sortedColId, shots);
                    }
                    
                    let skipAmount = parsedBody.page * parsedBody.pageSize;
                    let takeAmount = parsedBody.pageSize;
                    shots = shots.filter((val,index) => 
                        index >= skipAmount && 
                        index < (skipAmount + takeAmount));
                    
                    let returnObj = {
                        shots: shots,
                        totalItems: totalItems
                    };
                    let returnObjJSON = JSON.stringify(returnObj);

                    node_methods.returnOk(res, returnObjJSON);
                });
        }
    },
    "/shots/add": {
        POST: (req, res) => {
            let newId = mock_storage.mockShotStorage.length + 1;
            node_methods.getBodyFromRequest(req)
                .then(resolve => {
                    let obj = JSON.parse(resolve);
                    obj.timestamp = new Date(obj.timestamp);
                    let newShotRecord = {
                        ...obj,
                        id: newId
                    };
                    mock_storage.mockShotStorage.push(newShotRecord);

                    node_methods.returnOk(res);
                });
        }
    },
    "/issues": {
        GET: (req, res) => {
            node_methods.respondOkWithJSON(res, mockShotStorage);
        }
    },
    "/issues/add": {
        POST: (req, res) => {
            node_methods.getBodyFromRequest(req)
                .then(resolve => {
                    let issue = resolve;
                    mock_storage.issues.push(issue);

                    returnOk(res);
                })
        }
    },
    "/metadata": {
        GET: (req, res) => {
            let roastersAndBeans = getUniqueRoastersAndBeans();

            let all = {
                roasters: roastersAndBeans.uniqueRoasters,
                beans: roastersAndBeans.uniqueRoasterBeans,
                issues: mock_storage.issues
            };

            node_methods.respondOkWithJSON(res, all);
        }
    }
};

const getUniqueRoastersAndBeans = function() {
    let uniqueRoasters = getUniqueRoasters();
    let uniqueRoasterBeans = {};
    uniqueRoasters.forEach(roaster => {
        uniqueRoasterBeans[roaster] = new Set();
    });

    mock_storage.mockShotStorage.forEach(shot => {
        let matchingRoasterSet = uniqueRoasterBeans[shot.roaster];

        if (!matchingRoasterSet.has(shot.bean)) {
            matchingRoasterSet.add(shot.bean);
        }
    });

    Object.getOwnPropertyNames(uniqueRoasterBeans).forEach(roaster => {
        uniqueRoasterBeans[roaster] = Array.from(uniqueRoasterBeans[roaster]);
    });

    return {
        uniqueRoasters: uniqueRoasters,
        uniqueRoasterBeans: uniqueRoasterBeans
    };
}

const getUniqueRoasters = function() {
    return Array.from(getUniqueItems(mock_storage.mockShotStorage, x => x.roaster));
}

const getUniqueItems = function(collection, delegate) {
    let uniqueItems = new Set();
    collection.forEach(record => {
        let item = undefined;
        if (delegate) {
            item = delegate(record);
        } else {
            item = record;
        }

        if (!uniqueItems.has(item)) {
            uniqueItems.add(item);
        }
    });

    return uniqueItems;
}