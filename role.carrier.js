const { assertStateMemory } = require("lib");
const lib = require("lib");

module.exports = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");
        let room = creep.room;

        if (typeof creep.memory.collectingTarget == "undefined") {
            let viableTargets = room.find(FIND_STRUCTURES, {filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && (Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
                (Memory.harvesterContainers[structure.id] <= lib.mean(Object.values(Memory.harvesterContainers)));
            }});
            
            creep.memory.collectingTarget = viableTargets[0].id;
        }

        switch (creep.memory.state) {
            case "collecting":
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                let energy;
                
                let droppeds = room.find(FIND_DROPPED_RESOURCES);
                let dropped = lib.maxBy(droppeds, (a) => {  return a.store;  });

                let container = Game.getObjectById(creep.memory.collectingTarget);

                if (container != null) {
                if (droppeds.length > 0 && container.store.getUsedCapacity(RESOURCE_ENERGY) <= dropped.amount) {
                    energy = dropped;
                } else {
                    energy = container;
                }
                }


                if (room.find(FIND_TOMBSTONES).length > 0) {
                    let tombstones = room.find(FIND_TOMBSTONES).sort(function(a, b) {  return b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY);  });
                    energy = tombstones[0];
                }

                ////////////////////////////////////////////////

                if (creep.withdraw(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy);
                } else {
                    creep.moveTo(20, 26);
                }

                break;
            
            ////////////////////////////////////////////////////////////////////////////////////////////////
            case "transferring":
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                const spawn = Game.spawns["Spawn1"];

                let extensions = room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }});
                let usableContainers = room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (!Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
                    (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }});

                ////////////////////////////////////////////////

                let target;

                if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    target = spawn;
                } else
                if (extensions.length > 0) {
                    target = lib.minBy(extensions, (a) => {  return a.store.getFreeCapacity(RESOURCE_ENERGY);  });
                } else
                if (usableContainers.length > 0) {
                    target = lib.minBy(usableContainers, (a) => {  return a.store.getFreeCapacity(RESOURCE_ENERGY);  });
                } else {
                    break;
                }

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                break;
        }

        if (creep.memory.state == "searching") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
            } else
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "transferring";
            }
        }
    }
}