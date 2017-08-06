
export default class Buffer {
  readonly data : Uint8Array;
  private pointer = 0;
  constructor(data : Uint8Array){
    this.data = data;
  }

  get pos(){
    return this.pointer;
  }

  next() : number
  next(length : number) : Uint8Array
  next(length? : number) {
    if(length !== undefined){
      length = Math.min(length, this.data.length - this.pointer);
      const result = new Uint8Array(this.data.buffer, this.pointer, length);
      this.pointer += length;
      return result;
    }else{
      return this.data[this.pointer++];
    }
  }

  nextInt32() : number {
    let result = 0;
    for(let i=0; i<4; i++){
      result = (result << 8) | this.next();
    }
    return result;
  }

  write(byte : number) : void
  write(bytes : Uint8Array) : void
  write(bytes : Uint8Array, offset : number, size : number) : void
  write(value : number | Uint8Array, offset? : number, size? : number) {
    if(typeof value === 'number'){
      this.data[this.pointer++] = value;
    }else{
      if(offset !== undefined){
        this.data.set(new Uint8Array(value.buffer, offset, size), this.pointer);
        this.pointer += size === undefined ? value.length - offset : size;
      }else{
        this.data.set(value, this.pointer);
        this.pointer += value.length;
      }
    }
  }

  rest(){
    return this.next(this.data.length - this.pointer);
  }

  soFar(){
    return new Uint8Array(this.data.buffer, 0, this.pointer);
  }

  get isDone(){
    return this.pointer >= this.data.length;
  }
}