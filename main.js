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
    lib.spawnCreep(spawn, "upgrader", [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], sourceCount * 2, harvesterCount == sourceCount && carrierCount == sourceCount * 2);


    // let spawn = Game.spawns['Spawn1'];

    // let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // let carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');

    // let enough_harvesters = harvesters.length == spawn.room.find(FIND_SOURCES).length;
    // if (harvesters.length < spawn.room.find(FIND_SOURCES).length && harvesters.length <= carriers.length) {
    //     spawn.spawnCreep([WORK, MOVE, WORK, MOVE], "harvester" + Game.time, {memory: {role: "harvester", sourceTarget: harvesters.length}});
    // }

    // let enough_carriers = carriers.length == spawn.room.find(FIND_SOURCES).length * 2;
    // if (carriers.length < spawn.room.find(FIND_SOURCES).length * 2 && harvesters.length > 1) {
    //     spawn.spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "carrier" + Game.time, {memory: {role: "carrier"}});
    // }

    // let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    // if (builders.length < spawn.room.find(FIND_SOURCES).length * 2 && enough_harvesters && enough_carriers) {
    //     spawn.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], "builder" + Game.time, {memory: {role: "builder"}});
    // }

    // let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    // if (upgraders.length < spawn.room.find(FIND_SOURCES).length * 2 && enough_harvesters && enough_carriers) {
    //     spawn.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], "upgrader" + Game.time, {memory: {role: "upgrader"}});
    // }


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