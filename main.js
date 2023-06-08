lib = require("lib");
const roleHarvester = require("role.harvester");
const roleCarrier = require("role.carrier");
const roleBuilder = require("role.builder");
const roleUpgrader = require("role.upgrader");


module.exports.loop = function() {
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            if (Memory.creeps[name].role == "carrier") {
                Memory.harvesterContainers[Memory.creeps[name].collectingTarget]--;
            }

            delete Memory.creeps[name];
            console.log('clearing inexistant creep: ', name);
            lib.refreshMemory(Game.creeps[name]);
        }
    }

    let spawn = Game.spawns["Spawn1"];
    const sourceCount = spawn.room.find(FIND_SOURCES).length;

    if (typeof Memory.spawnOrder == "undefined") {
        Memory.spawnOrder = [
            {name: "harvester", priority: 1, count: 0, parts: [], limit: sourceCount},
            {name: "carrier", priority: 2, count: 0, parts: [], limit: sourceCount * 2},
            {name: "builder", priority: 3, count: 0, parts: [], limit: sourceCount * 3},
            {name: "upgrader", priority: 4, count: 0, parts: [], limit: sourceCount * 4}
        ];
    }

    for (let i = 0; i < Memory.spawnOrder.length; i++) {
        lib.refreshMemory(Memory.spawnOrder[i].name);
        
        if (Memory.spawnOrder[i].count < Memory.spawnOrder[i].limit) {
            spawn.spawnCreep(Memory.spawnOrder[i].parts, Memory.spawnOrder[i].name + Game.time, {memory: {role: Memory.spawnOrder[i].name}});
            break;
        }
    }


    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == "harvester") {
            roleHarvester.run(creep);
        } else
        if (creep.memory.role == "carrier") {
            roleCarrier.run(creep);
        } else
        if (creep.memory.role == "builder") {
            roleBuilder.run(creep);
        } else
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
        }
    }
}