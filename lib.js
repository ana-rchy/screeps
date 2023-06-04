module.exports = {
    spawnCreep: function(spawn, role, parts, limit, extraCondition = true) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

        if (creeps.length < limit && extraCondition) {
            spawn.spawnCreep(parts, role + Game.time, {memory: {role: role}});
        }
    },

    assertStateMemory: function(creep, state) {
        if (typeof creep.memory.state == "undefined") {
            creep.memory.state = state;
        }
    }
}