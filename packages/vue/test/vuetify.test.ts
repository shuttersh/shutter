import test from 'ava'
import Vue from 'vue'
import Vuetify from 'vuetify'
import createVueShutter, { addFile } from '../src'

test('Vuetify components', async t => {
  Vue.use(Vuetify)
  const files = await Promise.all([
    addFile(require.resolve('vuetify/dist/vuetify.css'), '/vuetify.css')
  ])
  const head = `
    <link href="/vuetify.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet" />
  `
  const shutter = createVueShutter(__dirname, { files, head })

  await shutter.snapshot('Vuetify button', {
    template: `<v-app>
      <v-btn>I am a button</v-btn>
    </v-app>`
  })

  await shutter.snapshot('Vuetify toolbar with content', {
    template: `<v-app>
      <v-toolbar>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Title</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>Link One</v-btn>
          <v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-app>`
  })

  await shutter.finish()
  t.pass()
})
