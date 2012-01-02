var Inventory = function(){
  var self = this;
  var event_subscribers = [];
  self.event_store = null;

  var item_inventory = {};

  self.publish_events_to = function(subscriber_name, callback, event_name){
    event_subscribers.push({name:subscriber_name, callback:callback, event_name:event_name});
  };

  self.remove_all_subscribers = function(){
    event_subscribers = [];
  };

  self.hydrate = function(event){
    event_subscribers.map(function(subscriber){
      if(event.type === subscriber.event_name){
        subscriber.callback(event);
      }
    });
  };

  self.quantity_changed_for_crossroads = function(item_id, new_quantity){
    item_inventory[item_id].crossroads_quantity = new_quantity;

    notify({
      type: "crossroads quantity changed",
      item_id: item_id,
      new_quantity: new_quantity
    });
  };

  self.quantity_changed_for_pathways = function(item_id, new_quantity){
    item_inventory[item_id].pathways_quantity = new_quantity;

    notify({
      type: "pathways quantity changed",
      item_id: item_id,
      new_quantity: new_quantity
    });
  };

  self.add_inventory_item = function(item_name){
    var item_id = generate_guid();

    item_inventory[item_id] = {
      id: item_id,
      name: item_name,
      crossroads_quantity: 0,
      pathways_quantity: 0
    };

    notify({
      type: "inventory item added",
      item_id: item_id,
      item_name: item_name
    });
  };

  self.run_report = function(callback){
    for(var index in item_inventory){
      callback(item_inventory[index]);
    }
  };

  var notify = function(event){
    if(self.event_store == null){
      console.log("event store hasn't been set yet!");
    }
    self.event_store.store(event);
    event_subscribers.map(function(subscriber){
      if(event.type === subscriber.event_name){
        subscriber.callback(event);
      }
    });
  };
};

var generate_guid = function() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  var separator = "_";
  return (S4()+S4()+separator+S4()+separator+S4()+separator+S4()+separator+S4()+S4()+S4());
}