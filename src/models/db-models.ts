export class StudentModel{
  public _id: String;
  public _rev: String;
  public fName: String;
  public lName: String;
  public icon: String;
  public note: String;
  public location: String;
  public dietNeed: boolean;

  constructor(){
    this._id = '';
    this._rev = '';
    this.fName = '';
    this.lName = '';
    this.icon = '';
    this.note = '';
    this.location = '';
    this.dietNeed = false;
  }

  setFields(t__id: String, t__rev: String, t_fName: String, t_lName: String,
              t_icon: String, t_note: String, t_loc: String){
    this._id = t__id;
    this._rev = t__rev;
    this.fName = t_fName;
    this.lName = t_lName;
    this.icon = t_icon;
    this.note = t_note;
    this.location = t_loc;
  }
}

export class UserModel{
  public _id: String;
  public _rev: String;
  public fName: String;
  public lName: String;
  public role: String;
  public phone: String;
  public therapy_type: String;
  public therapy_fav_ids: Array<String>;

  constructor(){
    this._id = "-1";
    this._rev = "";
    this.fName = "";
    this.lName = "";
    this.role = "";
    this.phone = "";
    this.therapy_type = "";
    this.therapy_fav_ids = [];
  }
}

export class ClassRoomModel{
  public _id: String;
  public _rev: String;
  public roomNumber: String;
  public students: Array<String>;

  constructor(){

  }
}

export class TransactionModel{
  public _id: String;
  public _rev: String;
  public date: String;
  public students: Array<TransactionStudentModel>;

  constructor(){

  }
}

export class TransactionStudentModel{
  public id: String;
  public events: Array<TransactionEvent>;
}

export class TransactionEvent {
  public time: String;
  public time_readable: String;
  public by_id: String;
  public type: String;
}
