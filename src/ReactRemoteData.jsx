import React from 'react'
import PropTypes from 'prop-types'

const RemoteDataType = PropTypes.shape({
  // content:
  isNotAsked: PropTypes.func.isRequired,
  isPending: PropTypes.func.isRequired,
  isOk: PropTypes.func.isRequired,
  isFailed: PropTypes.func.isRequired,
})

const ReactRemoteData = ({src, notAsked, pending, error, ok}) => {
  if (src.isNotAsked()) {
    return notAsked
  }

  if (src.isPending()) {
    return pending || <p>loading...</p>
  }

  if (src.isFailed()) {
    return error ? (
      error(src.content)
    ) : (
      <p>An error occured: {JSON.stringify(src.content, null, 2)}</p>
    )
  }

  return ok ? (
    ok(src.content)
  ) : (
    <p>Data retrieved: {JSON.stringify(src.content, null, 2)}</p>
  )
}

ReactRemoteData.propTypes = {
  src: RemoteDataType.isRequired,
  notAsked: PropTypes.element,
  pending: PropTypes.element,
  error: PropTypes.element,
  ok: PropTypes.element,
}

ReactRemoteData.defaultProps = {
  notAsked: null,
  error: PropTypes.element,
  ok: PropTypes.element,
}

export default ReactRemoteData
