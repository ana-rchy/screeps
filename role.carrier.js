const { assertStateMemory } = require("lib");
const roleUpgrader = require("role.upgrader");

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
            containers.sort(function (a, b) {  return b.store.getUsedCapacity() - a.store.getUsedCapacity();  });
            container = containers[0];


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
            }

            let container;
            let containers = _.filter(Memory.containers, (container) => {
                    return container.store.getFreeCapacity > 0;
                }
            );
            if (containers.length != 0) {
                container = containers[0];
            }

            if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else
            if (typeof extension != "undefined") {
                if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension);
                }
            } else
            if (typeof container != "undefined") {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
}

module.exports = roleCarrier;