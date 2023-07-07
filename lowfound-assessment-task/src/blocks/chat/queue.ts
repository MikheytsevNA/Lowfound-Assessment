export interface Value {
  id: string;
  question: string;
  answer: string;
  date: Date;
}

class QueueNode {
  value: Value | null;
  next: QueueNode | null;
  constructor(value: { question: string; answer: string; date: Date; id: string } | null) {
    this.value = value;
    this.next = null;
  }
}

export class Queueu {
  private first: QueueNode | null = new QueueNode(null);
  private last = this.first;
  private isNew = true;
  public length = 0;

  getArray(): Value[] | null {
    if (this.first === null) return null;
    if (this.first!.value === null) return null;
    const returnArray = [this.first!.value];
    let current = this.first;
    for (let i = 0; i < this.length - 1; i += 1) {
      if (!current.next) return null;
      current = current!.next;
      if (current === null || current.value === null) continue;
      returnArray.push(current.value);
    }
    return returnArray;
  }

  getLast() {
    return this.last;
  }

  getFirst() {
    return this.first;
  }

  enqueue(value: Value): void {
    if (this.isNew) {
      if (!this.first) return;
      this.first.value = value;
      this.isNew = false;
      this.length = 1;
    } else {
      let newNode = new QueueNode(value);
      if (!this.last) return;
      this.last.next = newNode;
      this.last = newNode;
      this.length += 1;
    }
  }

  dequeue(): Value | null {
    if (!this.first) return null;
    let returnValue = this.first.value;
    this.first = this.first.next;
    if (!this.first) this.last = this.first;
    this.length -= 1;
    return returnValue;
  }

  delete(index: number) {
    if (index === 0) {
      this.dequeue();
      return this;
    } else if (index > this.length - 1) return this;
    let current = this.first;
    for (let i = 0; i < index - 1; i += 1) {
      if (!current) return this;
      current = current.next;
    }
    if (!current || !current.next) return this;
    current.next = current.next.next;
    this.length -= 1;
  }
}
