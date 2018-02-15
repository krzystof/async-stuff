import Vue from 'vue'
import RemoteData from '../../src/RemoteData'

const VueRemoteData = {
  template: `
    <div>

      <slot v-if="src.isOk()" :content="src.content"></slot>

      <slot v-if="src.isNotAsked()" name="not-asked">not asked</slot>

      <slot v-if="src.isPending()" name="pending">loading...</slot>

      <slot v-if="src.isFailed()" name="failed">error!
        <pre>
          {{JSON.stringify(src.content, null, 2)}}
        </pre>
      </slot>

    </div>
  `,

  props: {
    src: {
      type: Object,
      required: true
    }
  }
}

const CustomRemoteData = {
  components: {VueRemoteData},

  props: {
    src: {
      type: Object,
      required: true
    }
  },

  template: `
    <vue-remote-data :src="src">
      <ul slot-scope="props">
        <li v-for="thing in props.content.args.items">{{thing}}</li>
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
      <p>
        The two following examples components are bound to the same piece of state.
        <button @click="fetchThings()">Fetch a success</button>
        <button @click="fetchWithError()">Fetch an error</button>
        <button @click="reset()">Reset</button>
      </p>

      <h2>A Vanilla example</h2>
      <p>This still requires you to define how to render a the success case</p>
      <vue-remote-data :src="things" @fetch-things="fetchThings()">
        <p slot-scope="props">
          <span v-for="thing in props.content.args.items" style="margin: 20px">{{thing}}</span>
        </p>
      </vue-remote-data>

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
      this.things.fetch()
    },

    reset() {
      this.things.reset()
    }
  },
})
