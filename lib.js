module.exports = {
    determineParts: function(role) {
        let room = Game.spawns["Spawn1"].room;
        let parts = [];
        let extensions = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});

        if (extensions.length >= 20 && Object.keys(Game.creeps).length > 5 && room.controller.level >= 4) {
            switch (role) {
                case "harvester":
                    parts = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "carrier":
                    parts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "builder":
                    parts = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "upgrader":
                    parts = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
            }
        } else
        if (extensions.length >= 10 && Object.keys(Game.creeps).length > 3 && room.controller.level >= 3) {
            switch (role) {
                case "harvester":
                    parts = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "carrier":
                    parts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "builder":
                    parts = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "upgrader":
                    parts = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                    break;
            }
        } else
        if (extensions.length >= 5 && Object.keys(Game.creeps).length > 2 && room.controller.level >= 2) {
            switch (role) {
                case "harvester":
                    parts = [WORK, WORK, WORK, WORK, WORK, MOVE];
                    break;
                case "carrier":
                    parts = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    break;
                case "builder":
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                    break;
                case "upgrader":
                    parts = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                    break;
            }
        } else {
            switch (role) {
                case "harvester":
                    parts = [WORK, WORK, MOVE, MOVE];
                    break;
                case "carrier":
                    parts = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                    break;
                case "builder":
                    parts = [WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
                case "upgrader":
                    parts = [WORK, CARRY, CARRY, MOVE, MOVE];
                    break;
            }
        }

        return parts;
    },

    assertStateMemory: function(creep, state) {
        if (typeof creep.memory.state == "undefined") {
            creep.memory.state = state;
        }
    },

    refreshMemory: function(room) {
        const harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        const carrierCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier').length;
        const builderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        const upgraderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;

        Memory.spawnOrder[0].count = harvesterCount;
        Memory.spawnOrder[1].count = carrierCount;
        Memory.spawnOrder[2].count = builderCount;
        Memory.spawnOrder[3].count = upgraderCount;

        Memory.spawnOrder[0].parts = this.determineParts(room, "harvester");
        Memory.spawnOrder[1].parts = this.determineParts(room, "carrier");
        Memory.spawnOrder[2].parts = this.determineParts(room, "builder");
        Memory.spawnOrder[3].parts = this.determineParts(room, "upgrader");
    },

    minBy: function(array, pluck) {
        return array.reduce((min, x) => min && pluck(min) <= pluck(x) ? min : x, null)
    },
    
    maxBy: function(array, pluck) {
        return array.reduce((max, x) => max && pluck(max) >= pluck(x) ? max : x, null)
    },

    mean: function(array) {
        if (array.length == 0) {
            return NaN;
        }

        let sum = 0;

        for (let i of array) {
            sum += i;
        }

        console.log(sum, array.length);

        return sum / array.length;
    }
}