const lib = require("lib");
const { assertStateMemory } = require("lib");

module.exports = {
    run: function(creep) {
        assertStateMemory(creep, "collecting");
        const room = creep.room;
        let constructionSites;
        
        switch (creep.memory.state) {
            case "collecting":
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////

                var target;
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && (!Object.keys(Memory.harvesterContainers).includes(structure.id)) &&
                        (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
                    }
                });

                if (typeof container != "undefined") {
                    target = container;
                } else {
                    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                }

                ////////////////////////////////////////////////


                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                break;

            ////////////////////////////////////////////////////////////////////////////////////////////////
            case "building":
                constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 || constructionSites.length == 0) {
                    creep.memory.state = "searching";
                    break;
                }

                ////////////////////////////////////////////////
                
                let constructionSite = lib.maxBy(constructionSites, (a) => {  return (a.progress / a.progressTotal);  });

                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }

                break;

            case "repairing":
                constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 || constructionSites.length > 0) {
                    creep.memory.state = "searching";
                    break;
                }



                if (creep.memory.repairTarget == undefined || creep.memory.repairTarget == null) {
                    let repairSites = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                            return (structure.hits / structure.hitsMax) <= 0.5;
                        }
                    });
                    let repairSite = lib.minBy(repairSites, (a) => {  return a.hits;  });

                    if (repairSite != undefined && repairSite != null) {
                        creep.memory.repairTarget = repairSite.id;
                    }
                } else {
                    let repairTarget = Game.getObjectById(creep.memory.repairTarget);
                    if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairTarget);
                    }

                    if (repairTarget != null && repairTarget.hits == repairTarget.hitsMax) {
                        creep.memory.repairTarget = null;
                    }
                }

                break;
        }

        if (creep.memory.state == "searching") {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.state = "collecting";
            } else
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                if (constructionSites.length > 0) {
                    creep.memory.state = "building";
                } else {
                    creep.memory.state = "repairing";
                }
            }
        }
    }
}