import {evaluate} from '../src/interpreter/executor/interpret'
import * as code from './helpers/input/variables'
import * as result from './helpers/output/variables'

let ret

describe('evaluate()', () => {
  describe('good calls', ()=> {
    it('declare variable', () => { 
      ret = evaluate(code.var_declare)
      expect(ret).toEqual(result.var_declare)  
    })
    it('declare and assign', () =>{
      ret = evaluate(code.assign_num)
      expect(ret).toEqual(result.assign_num)
    })
    it('declare THEN assign', () => {
      ret = evaluate(code.dec_then_assign)
      expect(ret).toEqual(result.dec_then_assign)
    })
    it('assign string', () => {
      ret = evaluate(code.assign_str)
      expect(ret).toContainEqual(result.assign_str)
    })
    it('reassign to other var value', () => {
      ret = evaluate(code.assign_b_to_a)
      expect(ret).toContainEqual(result.assign_b_to_a)
    })
  })
})
