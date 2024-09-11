const direction = (direction) => {
    if (direction === 0) {
        return "东";
    }
    if (direction === 1) {
        return "南";
    }
    if (direction === 2) {
        return "西";
    }
    if (direction === 3) {
        return "北";
    }
};

module.exports = direction;