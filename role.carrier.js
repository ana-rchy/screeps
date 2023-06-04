const { assertStateMemory } = require("lib");

var roleCarrier = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");

        let room = creep.room;

        if_collect: if (creep.memory.state == "collecting") {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "transferring";
                break if_collect;
            }


            let tombstone = room.find(FIND_TOMBSTONES)[0];
            let droppedResource = room.find(FIND_DROPPED_RESOURCES)[0];
            
            let containers = room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getUsedCapacity() != 0);
                }
            });
            let container = containers[0];


            if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstone);
            } else
            if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedResource)
            } else
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container)
            }
        }

        if_transfer: if (creep.memory.state == "transferring") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
                break if_transfer;
            }


            let spawn = Game.spawns["Spawn1"];

            let extension;
            let extensions = room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });
            if (extensions.length != 0) {
                extension = extensions[0];
            } else {
                return;
            }

            if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else
            if (extension.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension);
                }
            } else {
                creep.moveTo(6, 18);
            }
        }
    }
}

module.exports = roleCarrier;