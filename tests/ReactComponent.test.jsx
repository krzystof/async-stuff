/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {RemoteData, ReactRemoteData} from '../index'

Enzyme.configure({adapter: new Adapter()})

describe('React <RemoteData/> composed component', () => {
  const Spinner = () => <div>Loading!</div>

  /**
   * That component is an example how you might compose
   * your own component in your app
   */
  const CustomRemoteData = props => (
    <ReactRemoteData
      src={props.src}
      notAsked={<span>I am not asked</span>}
      pending={<Spinner />}
      error={error => <p>{error}</p>}
      ok={things => <ul>{things.map(t => <li key={t.id}>{t.name}</li>)}</ul>}
    />
  )

  CustomRemoteData.propTypes = {
    src: PropTypes.shape({
      // content:
      isNotAsked: PropTypes.func.isRequired,
      isPending: PropTypes.func.isRequired,
      isOk: PropTypes.func.isRequired,
      isFailed: PropTypes.func.isRequired,
    }).isRequired,
  }

  test('render ok', () => {
    const remoteStuff = new RemoteData(() =>
      Promise.resolve([
        {id: 1, name: 'Burger'},
        {id: 2, name: 'Chips'},
        {id: 3, name: 'Coke'},
      ])
    )

    const wrapper = mount(<CustomRemoteData src={remoteStuff} />)

    expect(wrapper.html()).toEqual('<span>I am not asked</span>')

    const fetchRequest = remoteStuff.fetch()

    wrapper.setProps(remoteStuff)

    expect(wrapper.find(Spinner)).toHaveLength(1)

    return fetchRequest.then(() => {
      wrapper.setProps(remoteStuff)
      expect(wrapper.html()).toEqual(
        '<ul><li>Burger</li><li>Chips</li><li>Coke</li></ul>'
      )
    })
  })

  test('renders an error', () => {
    const remoteStuff = new RemoteData(() =>
      Promise.reject('No way I am doing that')
    )

    const wrapper = mount(<CustomRemoteData src={remoteStuff} />)

    expect(wrapper.html()).toEqual('<span>I am not asked</span>')

    const fetchRequest = remoteStuff.fetch()

    wrapper.setProps(remoteStuff)

    expect(wrapper.find(Spinner)).toHaveLength(1)

    return fetchRequest.then(() => {
      wrapper.setProps(remoteStuff)
      expect(wrapper.html()).toEqual('<p>No way I am doing that</p>')
    })
  })
})

describe('Basic React <RemoteData/>', () => {
  test('has placeholders by default', () => {
    const remoteStuff = new RemoteData(() => Promise.resolve({serialize: 'me'}))
    const wrapper = mount(<ReactRemoteData src={remoteStuff} />)

    expect(wrapper.html()).toEqual(null)

    const fetchRequest = remoteStuff.fetch()
    wrapper.setProps(remoteStuff)
    expect(wrapper.html()).toEqual('<p>loading...</p>')

    return fetchRequest.then(() => {
      wrapper.setProps(remoteStuff)
      /* eslint-disable */
      expect(wrapper.html()).toEqual(`<p>Data retrieved: {
  \"serialize\": \"me\"
}</p>`)
      /* eslint-enable */
    })
  })

  test('has placeholders for an error too', () => {
    const remoteStuff = new RemoteData(() =>
      Promise.reject({serialize: 'error'})
    )
    const wrapper = mount(<ReactRemoteData src={remoteStuff} />)

    remoteStuff.fetch().then(() => {
      wrapper.setProps(remoteStuff)
      /* eslint-disable */
      expect(wrapper.html()).toEqual(`<p>An error occured: {
  \"serialize\": \"error\"
}</p>`)
      /* eslint-enable */
    })
  })

  test('accepts render props or children as a function')
})
