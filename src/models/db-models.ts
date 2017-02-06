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
  public visible_students: Array<String>;
  public therapy_type: String;
  public therapy_fav_ids: Array<String>;

  constructor(){
    this._id = "";
    this._rev = "";
    this.fName = "";
    this.lName = "";
    this.role = "";
    this.phone = "";
    this.visible_students = [];
    this.therapy_type = "";
    this.therapy_fav_ids = [];
  }
}

export class ClassRoomModel{
  public _id: String;
  public _rev: String;
  public teacher: string;
  public aides: Array<string>;
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
  public nap: String;
  public therapies: Array<TransactionTherapy>;

  constructor(){
    this.id = "";
    this.events = [];
    this.nap = "";
    this.therapies = [];
  }
}

export class TransactionTherapy{
  public start_time: String;
  public length: Number;
  public by_id: String;
}

export class TransactionEvent {
  public time: String;
  public time_readable: String;
  public by_id: String;
  public type: String;
}

export class BillingWeekModel{
  //these are metadata
  public start_date: Date;
  public room_number: String;
  
  //this is the data
  public students: Array<StudentBillingWeek>;

  //These are based on the data in days
  public billing_percent: Number;

  constructor(){
    this.room_number = "";
    this.students = [];
    this.billing_percent = -1;
  }
}

export class StudentBillingWeek{
  public student_id: String;

  public average_hours_billed_per_day: Number;
  public student_days: Array<BillingDay>;

}

export class BillingDay{
  public date: Date;
  public start_time: Number;
  public end_time: Number;
  public gross_hours: Number;
  public nap_hours: Number;
  public SP_therapy_hours: Number;
  public PT_therapy_hours: Number;
  public OT_therapy_hours: Number;
  public net_hours: Number;
  public billable_hours: Number;
  public total_billed: Number;

  public isLessThan7(){
    return this.gross_hours < 7;
  }
}