const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
function distanceComparator(a,b){
    var distanceA = calculateDistance(a).toString();
    var distanceB = calculateDistance(b).toString();
    if (distanceA == distanceB){
        return a.date - b.date
    } else {
        return distanceA - distanceB
    }
}

function calculateDistance(direction) {
    var lat1 = direction.lat
    var lon1 = direction.lon
    var lat2 = -33.437673;
    var lon2 = -70.650479
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    return dist
  }
router.get('/', async (req,res) => {
    const response2 = await fetch('https://stage.allrideapp.com/ext/api/v1/recruiting/points?access_token=250bd75493c59e8146798e43fff8370893b1bd76052533a7428a4e182eddd8b4fd1eed201dbfdd19491b0595cd9b2acda44fc47fff0f0e28d5fe17c662ace665');
    const directions = await response2.json();
    directions.sort(distanceComparator)
    const newdirections = [];
    _.each(directions, (direction, i) => {
        const {name, date, lat, lon, district} = direction;
        var my_obj = Object.create({}, { getFoo: { value: function() { return this.district; } } });
        my_obj[district] = {name, date, lat, lon};
        newdirections.push(my_obj)
        return newdirections
    });
    
    res.json(newdirections)
});

module.exports = router;