# Remote Data

---

# Work In Progress!
## Just using this readme to tinker with the idea!!

---

Thanks [krisajenkins](https://github.com/krisajenkins) to and his [original implementation in Elm](https://github.com/krisajenkins/remotedata)

> A framework agnostic js utility to render remote data.

Often you want to render data fetched from your server in a page. But quickly the data structure starts to look like this:
```js
{
  loading: bool,
  fetched: bool,
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

  render() {
    <CustomRemoteDataRendering src={this.state.things) />
  }
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
... todo
