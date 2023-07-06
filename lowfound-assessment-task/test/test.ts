import { beforeEach, describe, expect, it } from 'vitest';
import { Queueu, Value } from '../src/blocks/chat/queue';

describe('Queue tests', () => {
  let queue: Queueu;
  const val1: Value = {
    id: crypto.randomUUID(),
    question: '123',
    answer: '213',
    date: new Date(Date.now())
  };
  const val2: Value = {
    id: crypto.randomUUID(),
    question: '456',
    answer: '789',
    date: new Date(Date.now())
  };
  beforeEach(() => {
    queue = new Queueu();
  });
  it('test enqueue', () => {
    queue.enqueue(val1);
    expect(queue.getFirst()?.value?.question).toBe('123');
    expect(queue.getLast()?.value?.answer).toBe('213');
    queue.enqueue(val2);
    expect(queue.getFirst()?.value?.question).toBe('123');
    expect(queue.getLast()?.value?.answer).toBe('789');
    expect(queue.getLast()?.value?.question).toBe('456');
  });
  it('test dequeue', () => {
    queue.enqueue(val1);
    queue.enqueue(val2);
    queue.dequeue();
    expect(queue.getFirst()?.value?.answer).toBe('789');
    expect(queue.getLast()?.value?.answer).toBe('789');
    queue.dequeue();
    expect(queue.getFirst()).toBe(null);
    expect(queue.getLast()).toBe(null);
    queue.dequeue();
    expect(queue.getFirst()).toBe(null);
  });
  it('next chaining test', () => {
    queue.enqueue(val1);
    queue.enqueue(val2);
    queue.enqueue(val1);
    queue.enqueue(val2);
    expect(queue.getFirst()?.next?.next?.next?.value?.answer).toBe(queue.getLast()?.value?.answer);
    queue.dequeue();
    expect(queue.getFirst()?.next?.next?.value?.answer).toBe(queue.getLast()?.value?.answer);
  });
  it('length test', () => {
    expect(queue.length).toBe(0);
    queue.enqueue(val1);
    expect(queue.length).toBe(1);
    queue.enqueue(val2);
    expect(queue.length).toBe(2);
    queue.dequeue();
    expect(queue.length).toBe(1);
    queue.dequeue();
    expect(queue.length).toBe(0);
    queue.dequeue();
    expect(queue.length).toBe(0);
  });
  it('getArray test', () => {
    queue.enqueue(val1);
    queue.enqueue(val1);
    queue.enqueue(val1);
    queue.enqueue(val2);
    expect(queue.getArray()?.map((elem) => elem.answer)).toStrictEqual([
      '213',
      '213',
      '213',
      '789'
    ]);
  });
});
