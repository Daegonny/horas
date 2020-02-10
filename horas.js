function timeTable(h,m,o) {
    var self = this;
    self.h = ko.observable(h);
    self.m = ko.observable(m);
    self.o = ko.observable(o);
    self.get_h = ko.computed(function() {
      return h;
    }, this);
    self.get_m = ko.computed(function() {
      return m;
    }, this);
    self.to_string = ko.computed(function(){
      return o+" "+h+":"+m;
    }, this);
}

var ViewModel = function() {
  var self = this;

  self.current_text = ko.observable("");
  self.current = ko.observable();
  self.has_dot = ko.observable(false);
  self.is_valid = ko.observable(false);
  self.symbol = ko.observable("");
  self.next_symbol = ko.observable("");
  self.current(new timeTable("00","00"," "));

  self.calculations = ko.observableArray([]);

  self.clear_display = function(){
    self.calculations.removeAll();
    self.current(new timeTable("00","00"," "));
  };

  self.put_dot = function(){
    self.has_dot(true);
  }

  self.write_up = function(data){
    self.is_valid(true);
    if(self.has_dot()){
      if(self.current().m() == "00") self.current().m("");
      self.current(new timeTable(self.current().h(), self.current().m()+data," "));
    }
    else{
      if(self.current().h() == "00") self.current().h("");
      self.current(new timeTable(self.current().h()+data,"00"," "));
    }
  };

  self.add_sub = function(data){
      self.symbol(self.next_symbol());
      self.next_symbol(data);
      self.calculations.push(new timeTable(self.current().h(), self.current().m(), self.symbol()));
      self.current(new timeTable("00","00"," "));
      self.has_dot(false);
      self.is_valid(false);
  }

  self.calculate_result = function(){
    var partial_m = parseInt(self.calculations()[0].m());
    for (var i = 1; i < self.calculations().length; i++) {
      if(self.calculations()[i].o() == "+"){
        partial_m += parseInt(self.calculations()[i].m());
      }
      else if(self.calculations()[i].o() == "-"){
        partial_m -= parseInt(self.calculations()[i].m());
      }
    }

    var final_m = partial_m % 60;
    var partial_h = parseInt(self.calculations()[0].h()) + (parseInt(partial_m/60));

    for (var j = 1; j < self.calculations().length; j++) {
      if(self.calculations()[j].o() == "+"){
        partial_h += parseInt(self.calculations()[j].h());
      }
      else if(self.calculations()[j].o() == "-"){
        partial_h -= parseInt(self.calculations()[j].h());
      }
    }

    var final_h = partial_h.toString();
    if(final_m < 10){
      final_m = "0"+final_m.toString();
    }
    else{
      final_m = final_m.toString();
    }

    return new timeTable(final_h, final_m, "=");
  }

  self.get_result = function(){
    self.symbol(self.next_symbol());
    self.next_symbol("");
    self.calculations.push(new timeTable(self.current().h(), self.current().m(), self.symbol()));
    self.calculate_result();
    self.current(self.calculate_result());
    self.has_dot(false);
    self.is_valid(false);
  }

  $(document).keypress(function(event) {
    if(event.charCode == 55){
      self.write_up("7");
    }
    else if(event.charCode == 56){
      self.write_up("8");
    }
    else if(event.charCode == 57){
      self.write_up("9");
    }
    else if(event.charCode == 52){
      self.write_up("4");
    }
    else if(event.charCode == 53){
      self.write_up("5");
    }
    else if(event.charCode == 54){
      self.write_up("6");
    }
    else if(event.charCode == 49){
      self.write_up("1");
    }
    else if(event.charCode == 50){
      self.write_up("2");
    }
    else if(event.charCode == 51){
      self.write_up("3");
    }
    else if(event.charCode == 48){
      self.write_up("0");
    }
    else if(event.charCode == 44){
      self.clear_display(); //del
    }
    else if(event.charCode == 13 && self.is_valid()){
      self.get_result(); //enter
    }
    else if(event.charCode == 46){
      self.put_dot(); // :
    }
    else if(event.charCode == 43 && self.is_valid()){
      self.add_sub("+"); // +
    }
    else if(event.charCode == 45 && self.is_valid()){
      self.add_sub("-"); // -
    }
  });

};

ko.applyBindings(new ViewModel());
