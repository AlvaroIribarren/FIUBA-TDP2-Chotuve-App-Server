async function sortArrayByImportance(array) {
    array.sort((a, b) => {
        if (a.importance < b.importance)
            return 1;
        if (a.importance > b.importance)
            return -1;
        return 0;
    })
}

module.exports = sortArrayByImportance;