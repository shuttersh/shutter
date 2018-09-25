import test from 'ava'
import path from 'path'
import Vue from 'vue'
import createVueShutter, { addFile } from '../src'

test('can submit and apply a local stylesheet', async t => {
  const GlassBox = Vue.extend({
    template: `
      <div class='glassbox'>
        <div class='glassbox-content'>
          <slot></slot>
        </div>
      </div>
    `
  })

  const files = await Promise.all([
    addFile(path.join(__dirname, 'fixtures/background.webp'), '/background.webp'),
    addFile(path.join(__dirname, 'fixtures/glassbox.css'), '/glassbox.css')
  ])
  const head = `<link href='/glassbox.css' rel='stylesheet' />`
  const shutter = createVueShutter(__dirname, { files, head })

  await shutter.snapshot('Vue Glassbox', {
    components: {
      GlassBox
    },
    template: `
      <GlassBox>
        Glassbox styled by custom local stylesheet.
      </GlassBox>
    `
  })

  await shutter.finish()
  t.pass()
})
