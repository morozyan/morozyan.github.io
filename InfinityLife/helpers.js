var getRandomIntNumber = function (start, end) {
    if (end <= start)
        throw Error("end less than start");
    return Math.round(Math.random() * (end - start - 1)) + start;
};
//# sourceMappingURL=helpers.js.map