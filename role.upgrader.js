const { assertStateMemory } = require("lib");

module.exports = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");
          
        let room = creep.room;

        if_collect: if (creep.memory.state == "collecting") {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "upgrading";
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
        
        if_upgrade: if (creep.memory.state == "upgrading") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
                break if_upgrade;
            }


            if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller);
            } else {
                creep.moveTo(6, 18);
            }
        }
    }
}