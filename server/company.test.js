import test from 'ava';
import Company from './company';

// https://github.com/avajs/ava/blob/master/docs/03-assertions.md

test('can be constructed', (t)=>{
    let company = new Company()
    t.truthy(company)
})
