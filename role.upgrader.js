const lib = require("lib");
const { assertStateMemory } = require("lib");
const roleCarrier = require("role.carrier");

module.exports = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");
        let room = creep.room;

        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) && (!Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
            (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
        }});

        switch (creep.memory.state) {
            case "collecting":
                if (creep.store.getFreeCapacity() == 0 || container == null || typeof container == "undefined") {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }

                break;
            
            case "upgrading":
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.controller);
                }

                break;
        }

        
        if (creep.memory.state == "searching") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && container != null) {
                creep.memory.state = "collecting";
            } else
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                creep.memory.state = "upgrading";
            } else {
                creep.moveTo(21, 29);
            }
        }
    }
}