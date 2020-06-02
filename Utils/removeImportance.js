async function removeImportance(array){
    for (let element of array){
        delete element.importance;
    }
}

module.exports = removeImportance;