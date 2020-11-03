module.exports = {
    writeToDB: (dataObj,fs,db) => {
        let dataJSON = JSON.stringify(dataObj);
        console.log(dataJSON);
        fs.writeFileSync(db, dataJSON);
        return dataJSON;
    },

    entityExists: (arr,property,target) => {
        for (let i = 0; i < arr.length; i++) {
            let curSupplier = arr[i][property];
            if (curSupplier == target) {
                return { exists: true, index: i};
            }
        }
        return { exists: false, index: -1};
    }
};