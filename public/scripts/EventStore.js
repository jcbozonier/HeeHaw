var EventStore = function(){
  var self = this;
  var events = [];
  var ignore_events = true;

  self.on_hydration = function(event){};

  self.store = function(event){
    if(!ignore_events){
      events.push(event);
    }
  };

  self.hydrate = function(){
    ignore_events = true;
    events.map(function(event){
      self.on_hydration(event);
    });
    ignore_events = false;
  };
};