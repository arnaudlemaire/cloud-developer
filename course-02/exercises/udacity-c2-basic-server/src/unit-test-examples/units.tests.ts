import { add, divide, concat } from './units';

import { expect } from 'chai';
import 'mocha';

describe('add function', () => {

  it('should add two and two', () => {
    const result = add(2,2);
    expect(result).to.equal(4);
  });

  it('should add -2 and two', () => {
    const result = add(-2,2);
    expect(result).to.equal(0);
  });

});

describe('divide', () => {

  it('should divide 6 by 3', () => {
    const result = divide(6,3);
    expect(result).to.equal(2);
  });

  it('should divide 5 and 2', () => {
    const result = divide(5,2);
    expect(result).to.equal(2.5);
  });

  it('should throw an error if div by zero', () => {
    expect( () => { divide(5,0) }).to.throw('div by 0')
  });

});

describe('concat', () => {

  it('should concatenate ham and egg', () => {
    const result = concat('ham', 'egg');
    expect(result).to.equal('hamegg')
  });

  it('should concatenate 1 and 2', () => {
    const result = concat('1', '2');
    expect(result).to.equal('12')
  });

  it('should throw an error if string1 is empty', () => {
    expect( () => { concat('', 'str2') }).to.throw('string is empty')
  });

  it('should throw an error if string2 is empty', () => {
    expect( () => { concat('str1', '') }).to.throw('string is empty')
  });

});
