lib = require("lib");
const roleHarvester = require("role.harvester");
const roleCarrier = require("role.carrier");
const roleBuilder = require("role.builder");
const roleUpgrader = require("role.upgrader");


module.exports.loop = function() {
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log ('clearing inexistant creep: ', name);
        }
    }

    let spawn = Game.spawns["Spawn1"];
    let sourceCount = spawn.room.find(FIND_SOURCES).length;

    let harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    let carrierCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier').length;

    lib.spawnCreep(spawn, "harvester", [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], sourceCount);
    lib.spawnCreep(spawn, "carrier", [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], sourceCount * 2);
    lib.spawnCreep(spawn, "builder", [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], sourceCount * 2, harvesterCount == sourceCount && carrierCount == sourceCount * 2);
    lib.spawnCreep(spawn, "upgrader", [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], sourceCount * 4, harvesterCount == sourceCount && carrierCount == sourceCount * 2);


    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == "harvester") {
            roleHarvester.run(creep, sourceCount);
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