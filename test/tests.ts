import test from 'tape';
import {flr} from '../src/index'
import { drawLine } from '../src/drawing'
test('test Maths', t => {
    t.plan(3);
    t.is(3,flr(3),'floor works')
    t.is(3,flr(3.9),'still works');
    t.isNot(3,flr(4),'damn, you\'re good')
} )
test('line', t => {
    t.comment(drawLine([[0,1],[1,1]]))
    t.end();
})