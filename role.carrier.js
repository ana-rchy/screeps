const { assertStateMemory } = require("lib");
const lib = require("lib");

module.exports = {
    run: function(creep) {
        let room = creep.room;
        let target;
        assertStateMemory(creep, "collecting");
        assertTarget(creep, room);

        switch (creep.memory.state) {
            case "collecting":
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                let tombstones = room.find(FIND_TOMBSTONES, {filter: (tombstone) => {
                    return tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }});
                
                let droppeds = room.find(FIND_DROPPED_RESOURCES);
                let dropped = lib.maxBy(droppeds, (a) => {  return a.amount;  });

                let harvContainer = Game.getObjectById(creep.memory.collectingTarget);



                if (tombstones.length > 0) {
                    target = lib.maxBy(tombstones, (tombstone) => {  return tombstone.store.getUsedCapacity(RESOURCE_ENERGY);  });
                } else
                if (droppeds.length > 0 && (harvContainer == null || harvContainer.store.getUsedCapacity(RESOURCE_ENERGY) <= dropped.amount)) {
                    target = dropped;
                } else {
                    target = harvContainer;
                }

                ////////////////////////////////////////////////

                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                break;
            
            ////////////////////////////////////////////////////////////////////////////////////////////////
            case "transferring":
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                let spawn = Game.spawns["Spawn1"];
                let extensions = room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }});

                let tower = Game.getObjectById("6481ce416f158a530eff7d40");

                let storages = room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }});

                let usableContainers = room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (!Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
                    (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }});



                if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    target = spawn;
                } else
                if (tower != null && typeof tower != "undefined" && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    target = tower;
                } else
                if (extensions.length > 0) {
                    target = lib.minBy(extensions, (a) => {  return a.store.getFreeCapacity(RESOURCE_ENERGY);  });
                } else
                if (storages.length > 0) {
                    target = lib.minBy(storages, (a) => {  return a.store.getFreeCapacity(RESOURCE_ENERGY);  });
                } else
                if (usableContainers.length > 0) {
                    target = lib.minBy(usableContainers, (a) => {  return a.store.getFreeCapacity(RESOURCE_ENERGY);  });
                } else {
                    break;
                }

                ////////////////////////////////////////////////

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                break;
        }

        if (creep.memory.state == "searching") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
            } else
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                creep.memory.state = "transferring";
            }
        }
    }
}

function assertTarget(creep, room) {
    if (typeof creep.memory.collectingTarget == "undefined") {

        let viableTargets = room.find(FIND_STRUCTURES, {filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) && (Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
            (Memory.harvesterContainers[structure.id] <= lib.mean(Object.values(Memory.harvesterContainers)));
        }});
        
        if (viableTargets.length > 0) {
            creep.memory.collectingTarget = viableTargets[0].id;
            Memory.harvesterContainers[viableTargets[0].id]++; // increment container's carrier assignment counter
        }
    }
}