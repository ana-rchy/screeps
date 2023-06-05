const { assertStateMemory } = require("lib");

module.exports = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");

        let room = creep.room;

        if_collect: if (creep.memory.state == "collecting") {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "building";
                break if_collect;
            }


            let containers = room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getUsedCapacity(RESOURCE_ENERGY) != 0);
                }
            });
            let container = containers[0];

            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }

        if_build: if (creep.memory.state == "building") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
                break if_build;
            }


            let constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
            let needsRepair = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                    return structure.ticksToDecay <= 500;
                }
            });
            let structureToRepair = needsRepair[0];

            if (creep.room.find(FIND_CONSTRUCTION_SITES).length != 0) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else {
                if (creep.repair(structureToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRepair);
                } else {
                    creep.moveTo(6, 18);
                }
            }
        }
    }
}