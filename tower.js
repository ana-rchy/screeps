const lib = require("lib");

module.exports = {
    run: function(tower) {
        let room = tower.room

        let enemyCreeps = room.find(FIND_HOSTILE_CREEPS, {filter: (creep) => {
            return !(creep.owner.username == "Christinayo" || creep.owner.username == "RayderBlitz");
        }});

        if (enemyCreeps.length > 0) {
            let enemyCreep = lib.minBy(enemyCreeps, (creep) => {  return creep.hits;  });

            tower.attack(enemyCreep);
        }
    }
}