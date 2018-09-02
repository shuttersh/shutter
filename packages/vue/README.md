# @shutter/vue [WIP]

> Work in progress

## Simple usage example

``` ts
import createVueShutter from '@shutter/vue'
import MyComponent from '../src/components/MyComponent'
const shutter = createVueShutter(__dirname)

describe('My component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await shutter.finish()
  })
  it('matches visual snapshot', async function () {
    await shutter.snapshot('My component', {
      components: {
        MyComponent
      },
      data () {
        return {
          bar: 'baz'
        }
      },
      template: '<my-component :foo='bar'></my-component>'
    })
  })
})
```

## See also

Check out the documentation at <https://docs.shutter.sh>.
