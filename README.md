# Remote Data

---

#### Work In Progress!
#### Just using this readme to tinker with the idea!!

---


- add jest
- add eslint
- add prettier

- Write the js lib
- add CI + badge
- Write the react component (with examples)
- Write the vue component (with examples)
- How does Vue reactivity works with that?

- add flow?


Write implementations for:
- [ ] React
- [ ] Vue
- [ ] Vanillajs
- [ ] Angular1
- [ ] Angular2
- [ ] Polymer
- [ ] Ember
- [ ] Aurelia
- [ ] Preact

- store the query params, cache result
- add a noCache version of it

---

Thanks to [krisajenkins](https://github.com/krisajenkins) and his [original implementation in Elm](https://github.com/krisajenkins/remotedata)

> A framework agnostic js utility to render remote data.

Often you want to render data fetched from your server in a page. But quickly the data structure starts to look like this:
```js
{
  loading: false,
  fetched: false,
  data: [],
  errors: null
}
```
...and that leaves you the tedious tasks of syncing this state and checking booleans in your interface to render a spinner, the data, and so on.

This library allows you to simplify all these decisions (do you name it loading? or pending? what the errors look like?) by abstracting all this process.

The more useful use case will be to use a RemoteData instance in the state of your application, and have a component that abstract the rendering.

Let's see how that would work with React.

## Usage

### With React

First, the state.

```js
class ThingsList extends React.Component {
  state = {
    things = new RemoteData('http://httpbin.org/get?data=a&data=b&data=c')
  }

  componentWillMount() {
    this.state.things.fetch()
  }

  // render() ?
}
```
Whether the state comes from redux, a component local state or anything else does not really matter.

Here we use a custom component to render our remote data. You don't have to, but it's a nice thing to do.
Our custom component will be composed of our common application spinner, error rendering, and so on.

```js
// example with a render props.

const CustomRemoteDataRendering = ({render, src}) => {
  render() {
    if (src.isNotAsked()) {
      return null
    }

    if (src.isPending()) {
      return <Spinner/>
    }

    if (src.isFailed()) {
      return <div>{src.error.toString()}</div>
    }

    return render(src.content)
  }
}

// or this? not sure yet...
const CustomRemoteDataRendering = ({render, src}) => {
  render() {
    switch (src.status()) {
      case NOT_ASKED:
        return null
      case PENDING:
        return <Spinner/>
      case FAILED:
      return <div>{src.error.toString()}</div>
      default:
        return render(src.content)
    }
  }
}
```

Or if you want to use our component:
```js
const CustomRemoteDataRendering = (props) => (
  <RemoteData
    notAsked={BlankComponent}
    pending={() => <p>loading...</p>}
    error={error => <Alert>{error.message}</Alert}
    ok={content => <ListOfThings {...content}/>}
    {...props}
  />
)
```
This component provide sane defaults for the notAsked, Pending and Error component, so you don't have to fill them all.

This component can be reused anywhere in your app, as It is used to manage the lifecycle of the request. But the rendering is given back to the parent component using a render prop.

Now let's render the remote data back in our first component:

```js
class ThingsList extends React.Component {

  // same as before

  render() {
    <CustomRemoteDataRendering
      src={this.state.things)
      render={(content) => (
        <ul>
          {content.map(thing => <li>{thing</li>})}
        </ul>
      )}
    />
  }

  // or

  render() {
    <CustomRemoteDataRendering src={this.state.things)>
      {(content) => (
        <ul>
          {content.map(thing => <li>{thing</li>})}
        </ul>
      )}
    </CustomRemoteDataRendering>
  }
}

```

### With Vue

I have to make sure this actually works ;). But it should.

Example to render just the success:
```js
<template>
  <div>
    <RemoteData>
      <ul slot-scope="props">
        <li v-for="thing in props.content">{{ thing }}</li>
      </ul>
    </RemoteData>
  </div>
</template>

<script>
export default {
  data() {
    return {
      things: new RemoteData('http://httpbin.org/get?data=a&data=b&data=c')
    }
  },

  mounted() {
    this.things.fetch()
  }
}
</script>
```

And to manage more things:
```js
<template>
  <div>
    <RemoteData>
      <ul slot="ok" slot-scope="props">
        <li v-for="thing in props.content">{{ thing }}</li>
      </ul>

      <p slot="not-asked">
        <button @click="things.fetch()">Click here to load data</button>
      </p>

      <p slot="pending">
        loading...
      </p>

      <Warning slot="failed" slot-scope="props">
        Something did not worked as expected: {{ props.error.toString }}
      </Warning>
    </RemoteData>
  </div>
</template>

<script>
export default {
  data() {
    return {
      things: new RemoteData('http://httpbin.org/get?data=a&data=b&data=c')
    }
  },

  computed: {
    loadedThings() {
      return this.things.content || []
    }
  }
}
</script>
```

Same as in React, each slot is optional. So you could even use a RemoteData to model an ajax call that returns nothing,
just to render on the loading and error state.

## API

You can either pass a string to the `RemoteData` constructor, and that will be the url to fetch from.
Or pass a callback.

```js
// These 2 examples are equivalent:
const itIs = new RemoteData('http://httpbin.org.get')
const theSame = new RemoteData(() => axios.get('http://httpbin.org.get'))
```

RemoteData even use axios under the hood. But you can use anything as long as it returns a Promise. It does not have to be an http request.
