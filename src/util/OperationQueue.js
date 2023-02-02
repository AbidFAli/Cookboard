class OperationQueue {
  constructor(limit) {
    this._limit = limit;
    this._queue = [];
    this._first = undefined;
  }

  get limit() {
    return this._limit;
  }

  get size() {
    let count = this._first === undefined ? 0 : 1;
    return count + this._queue.length;
  }

  getFirst() {
    return this._first;
  }

  completeFirst() {
    let temp = this._first;
    this._first = this._queue.shift();
    return temp;
  }

  getSecond() {
    return this._queue[0];
  }

  //get and set last?

  enqueue(op) {
    if (op === undefined) {
      throw "OperationQueue: enqueue undefined is not allowed";
    }

    if (this._first === undefined) {
      this._first = op;
    } else if (this._queue.length + 1 !== this._limit) {
      this._queue.append(op);
    } else if (this._limit === 1) {
      this._first = op;
    } else {
      //queue can only have limit - 1 things in it
      this._queue[this._limit - 2] = op;
    }
  }
}

export { OperationQueue };
