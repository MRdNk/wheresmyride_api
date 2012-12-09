
function Stop () {

  var that = {
    naptan : null
  };
  return that;
}

Stop.prototype.setNaptan = function (naptan) {
  this.naptan = naptan;
};

module.exports = Stop;