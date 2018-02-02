import Vue from 'vue'
import RemoteData from '../../src/RemoteData'

const VueRemoteData = {
  template: `

  `,
}

const CustomRemoteData = {
  components: {VueRemoteData},
  props: ['src'],
  template: `
    <vue-remote-data :src="src">
      <ul slot="ok" slot-scope="props">
        <li v-for="thing in props.content">{{ thing }}</li>
      </ul>

      <p slot="not-asked">
        <button @click="$emit('fetch-things')">Click here to load data</button>
      </p>

      <p slot="pending">
        Loading some things
      </p>

      <p slot="failed" slot-scope="props">
        That just broke...
      </p>
    </vue-remote-data>
  `,
}

new Vue({
  el: '#demo',

  template: `
    <div>
      <h2>A Vanilla example</h2>
      <vue-remote-data :src="things" @fetch-things="fetchThings()"></vue-remote-data>

      <h2>A customized one</h2>
      <custom-remote-data :src="things"></custom-remote-data>
    </div>
  `,

  components: {
    'vue-remote-data': VueRemoteData,
    'custom-remote-data': CustomRemoteData,
  },

  data() {
    return {
      things: new RemoteData('http://httpbin.org/get?items=a&items=b&items=c'),
    }
  },

  methods: {
    fetchThings() {
      console.log('youhou')
    },
  },
})
