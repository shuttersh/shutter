import test from 'ava'
import Vue, { VNode } from 'vue'
import createVueShutter from '../src'

test('can render a vue component', async t => {
  const MyButton = Vue.extend({
    props: [ 'label' ],
    render (createElement: Function): VNode {
      return createElement(
        'button',
        [ this.label ]
      )
    }
  })
  const shutter = createVueShutter(__dirname)

  await shutter.snapshot('Sample button', {
    components: {
      MyButton
    },
    template: '<my-button label="I am a button"></my-button>'
  })
  await shutter.finish()
  t.pass()
})
