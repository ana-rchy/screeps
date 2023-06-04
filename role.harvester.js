module.exports = {
    run: function(creep) {
        let openSource = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(openSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(openSource);
        }
    }
}