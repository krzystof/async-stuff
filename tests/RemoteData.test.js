/* eslint-env jest */

import RemoteData from '../index'

describe('RemoteData(Function)', () => {
  test('execute the given callback when requested', () => {
    const mockRequest = jest.fn(() => Promise.resolve())
    const things = new RemoteData(mockRequest)
    expect(mockRequest).not.toHaveBeenCalled()
    things.fetch()
    expect(mockRequest).toHaveBeenCalled()
  })

  test('cache the response by default', () => {
    const mockRequest = jest.fn(() => Promise.resolve())
    const things = new RemoteData(mockRequest)
    expect(mockRequest).not.toHaveBeenCalled()
    things.fetch()
    things.fetch()
    expect(mockRequest).toHaveBeenCalledTimes(1)
  })

  test('is not asked at first', () => {
    const remoteThings = createRemoteData()
    expect(remoteThings.isNotAsked()).toBe(true)
    expect(remoteThings.isPending()).toBe(false)
    expect(remoteThings.isOk()).toBe(false)
    expect(remoteThings.isFailed()).toBe(false)
    expect(() => remoteThings.content).toThrowError(/not Ok/)
  })

  test('is pending after starting fetching', () => {
    const remoteThings = createRemoteData()
    remoteThings.fetch()
    expect(remoteThings.isNotAsked()).toBe(false)
    expect(remoteThings.isPending()).toBe(true)
    expect(remoteThings.isOk()).toBe(false)
    expect(remoteThings.isFailed()).toBe(false)
    expect(() => remoteThings.content).toThrowError(/not Ok/)
  })

  test('ok - contains the payload', () => {
    const remoteThings = createRemoteData(() => Promise.resolve('success!'))

    return remoteThings.fetch().then(() => {
      expect(remoteThings.isNotAsked()).toBe(false)
      expect(remoteThings.isPending()).toBe(false)
      expect(remoteThings.isOk()).toBe(true)
      expect(remoteThings.isFailed()).toBe(false)
      expect(remoteThings.content).toBe('success!')
    })
  })

  test('failed - contains error', () => {
    const remoteThings = createRemoteData(() => Promise.reject('is broken'))

    return remoteThings.fetch().then(() => {
      expect(remoteThings.isNotAsked()).toBe(false)
      expect(remoteThings.isPending()).toBe(false)
      expect(remoteThings.isOk()).toBe(false)
      expect(remoteThings.isFailed()).toBe(true)
      expect(remoteThings.content).toBe('is broken')
    })
  })

  test('ok - can be reset')
  test('failed - can be reset')
  test('fetch() returns the data')

  test('RemoteData(String)', () => {
    const remoteThings = new RemoteData(
      'http://httpbin.org/get?items=a&items=b&items=c'
    )

    return remoteThings.fetch().then(response => {
      console.log(response)
      expect(response.data).toEqual(['a', 'b', 'c'])
    })
  })

  test('RemoteData.notCached()')
  test('pending - can be reset?')
})

describe('Vuejs <RemoteData/> component', () => {
  test('what???')
})

function createRemoteData(cb = () => Promise.resolve('done')) {
  const mockRequest = jest.fn(cb)
  return new RemoteData(mockRequest)
}
