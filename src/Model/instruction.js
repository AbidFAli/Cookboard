import uniqueId from 'lodash/uniqueId';

class Instruction{

  constructor(text){
    this.mText = text;
    this.mId = uniqueId("INSTR_")
  }
  get text() {
    return this.mText;
  }
  set text(newText){
    this.mText = newText
  }
  get id(){
    return this.mId;
  }
  
  static copy(otherInstruction){
    let instr = new Instruction(otherInstruction.text)
    instr.mId = uniqueId()
    return instr
  }
  
}

export default Instruction;