var roleHarv = require('role.harvester');
var roleUpg = require('role.upgrader');
var roleBld = require('role.builder');

module.exports.loop = function() {
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log ('clearing inexistant creep: ', name);
        }
    }
    
    var harvs = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvs.length < 2) {
        newName = 'Harvester ' + Game.time;
        console.log('spawning: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'harvester'}});
    }
    var upgs = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgs.length < 2) {
        newName = 'Upgrader ' + Game.time;
        console.log('spawning: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
    }
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        if (creep.memory.role == 'harvester'){
            roleHarv.run(creep, Game.creeps.indexOf(name));
        } else if (creep.memory.role == 'upgrader') {
            roleUpg.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBld.run(creep);
        }
    }
}